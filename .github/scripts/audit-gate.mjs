#!/usr/bin/env node
// Scheduled full-tree dependency-audit gate for the JS SDK (.github/workflows/audit.yml).
//
// Reads `npm audit --json` against the package-lock.json that the workflow's resolve step
// just wrote (script-free, 7-day cooldown). When CUTOFF is set — the workflow exports it —
// the audit passes the same `--before`, so it sees exactly the resolved package set.
// Every advisory must either be absent or carry an explicit, dated, path-scoped entry in
// .github/scripts/audit-allowlist.json. Stale allowlist entries fail too: an exception
// nobody removed after the upstream fix landed is how an allowlist rots into a rubber stamp.
//
// The whole tree, devDependencies included, is audited on purpose: the dev toolchain is
// where a build-time supply-chain attack lands. ci.yml separately blocks high+ advisories
// in the published (prod) tree on every push.
//
// Exit codes:  0 = clean/allowlisted   1 = policy failure   2 = infra failure (audit
// could not be run or did not return usable JSON, after one retry).
import { execFile } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const projectDir = join(here, '..', '..')
const allowlistPath = join(here, 'audit-allowlist.json')
const today = new Date().toISOString().slice(0, 10)

const FAIL = 1
const INFRA = 2

if (process.argv.includes('--selftest-fail')) {
  console.error('[audit-gate] --selftest-fail: exiting 1 to prove the failure path is wired up')
  process.exit(FAIL)
}

// npm audit exits non-zero when it finds vulnerabilities, so the exit code alone can't
// tell "found problems" from "could not run". Valid JSON carrying a `vulnerabilities`
// map is the only thing we treat as a real answer; anything else is infrastructure.
function runAudit () {
  return new Promise((resolve) => {
    const before = process.env.CUTOFF ? [`--before=${process.env.CUTOFF}`] : []
    execFile('npm', ['audit', '--audit-level=low', '--json', ...before], {
      cwd: projectDir, maxBuffer: 64 * 1024 * 1024,
    }, (err, stdout, stderr) => {
      let report = null
      try { report = JSON.parse(stdout) } catch { /* handled below */ }
      if (!report || typeof report.vulnerabilities !== 'object' || report.error) {
        const detail = report?.error?.summary || String(stderr || err?.message || '').trim().split('\n')[0]
        resolve({ ok: false, detail: detail || 'npm audit produced no parseable JSON report' })
        return
      }
      resolve({ ok: true, report })
    })
  })
}

// One advisory against one package, with the exact install paths it was found at.
function findingsOf (report) {
  const seen = new Map()
  for (const vuln of Object.values(report.vulnerabilities)) {
    for (const via of vuln.via || []) {
      // String `via` entries are propagation ("grunt is affected because js-yaml is").
      // The advisory itself is always enumerated on the package that actually carries
      // it, so keying on advisory objects covers every real finding exactly once.
      if (typeof via === 'string' || !via.url) continue
      const advisory = via.url.split('/').pop()
      const key = `${via.name}\u0000${advisory}`
      const found = seen.get(key) || {
        package: via.name, advisory, url: via.url, severity: via.severity,
        title: via.title, range: via.range, paths: new Set(),
      }
      for (const node of vuln.nodes || []) found.paths.add(node)
      seen.set(key, found)
    }
  }
  return [...seen.values()].map((f) => ({ ...f, paths: [...f.paths].sort() }))
}

function loadAllowlist () {
  const raw = JSON.parse(readFileSync(allowlistPath, 'utf8'))
  if (!Array.isArray(raw.entries)) throw new Error('audit-allowlist.json must have an "entries" array')
  for (const e of raw.entries) {
    for (const field of ['advisory', 'package', 'reason', 'revisitBy']) {
      if (!e[field]) throw new Error(`allowlist entry missing "${field}": ${JSON.stringify(e)}`)
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.revisitBy)) {
      throw new Error(`allowlist entry ${e.advisory}: revisitBy must be YYYY-MM-DD`)
    }
    if (!Array.isArray(e.paths) || e.paths.length === 0) {
      throw new Error(`allowlist entry ${e.advisory}: "paths" must be a non-empty array`)
    }
  }
  return raw.entries
}

const main = async () => {
  let allowlist
  try {
    allowlist = loadAllowlist()
  } catch (err) {
    console.error(`[audit-gate] INFRA: ${err.message}`)
    process.exit(INFRA)
  }

  let result = await runAudit()
  if (!result.ok) {
    console.error(`[audit-gate] npm audit failed (${result.detail}) — retrying once`)
    result = await runAudit()
  }
  if (!result.ok) {
    console.error(`[audit-gate] INFRA: npm audit unusable after retry — ${result.detail}`)
    console.error('[audit-gate] this is NOT a clean result; treat it as unknown, not as a pass')
    process.exit(INFRA)
  }

  const findings = findingsOf(result.report)
  const used = new Set()
  const unallowlisted = []

  for (const f of findings) {
    const entry = allowlist.find((e) => e.advisory === f.advisory && e.package === f.package)
    if (!entry) { unallowlisted.push({ f, why: 'no allowlist entry' }); continue }
    used.add(entry)
    // Every entry is scoped with `paths` and covers only those install locations, so the
    // same advisory surfacing somewhere new (a direct dep rather than deep under grunt)
    // still fails instead of inheriting an exception written for a different context.
    const escaped = f.paths.filter((p) => !entry.paths.includes(p))
    if (escaped.length) {
      unallowlisted.push({ f, why: `found outside allowlisted paths: ${escaped.join(', ')}` })
      continue
    }
    if (entry.revisitBy < today) {
      unallowlisted.push({ f, why: `allowlist entry expired on ${entry.revisitBy} — re-evaluate or extend` })
    }
  }

  const unused = allowlist.filter((e) => !used.has(e))

  for (const { f, why } of unallowlisted) {
    console.error(`[audit-gate] FAIL ${f.package} ${f.advisory} [${f.severity}] — ${why}`)
    console.error(`             ${f.title}`)
    console.error(`             vulnerable: ${f.range}   at: ${f.paths.join(', ')}`)
    console.error(`             ${f.url}`)
  }
  for (const e of unused) {
    console.error(`[audit-gate] FAIL stale allowlist entry ${e.package} ${e.advisory} — no longer reported, delete it`)
  }

  const counts = findings.reduce((acc, f) => ({ ...acc, [f.severity]: (acc[f.severity] || 0) + 1 }), {})
  const summary = Object.entries(counts).map(([s, n]) => `${n} ${s}`).join(', ') || 'none'
  console.error(`[audit-gate] advisories: ${summary}; allowlisted: ${used.size}/${allowlist.length}`)

  if (unallowlisted.length || unused.length) {
    console.error(`[audit-gate] FAILED — ${unallowlisted.length} unallowlisted, ${unused.length} stale`)
    process.exit(FAIL)
  }
  console.error('[audit-gate] OK — no unallowlisted advisories, no stale allowlist entries')
}

main().catch((err) => {
  console.error(`[audit-gate] INFRA: ${err?.stack || err}`)
  process.exit(INFRA)
})

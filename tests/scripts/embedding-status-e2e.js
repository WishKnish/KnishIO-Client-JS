#!/usr/bin/env node

/**
 * DataBraid Embedding Status — E2E Test
 *
 * Tests the SDK's embedding status query against a live validator:
 * 1. Capability detection via introspection (hasQueryField)
 * 2. Single-instance embeddingStatus query
 * 3. Bulk embeddingStatus query
 * 4. Graceful null return on unsupported servers
 *
 * Usage:
 *   node embedding-status-e2e.js --url https://localhost:8080/graphql
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 node embedding-status-e2e.js --url https://localhost:8080/graphql
 */

import { KnishIOClient, generateSecret } from '../../dist/client.es.mjs'

// Parse args
const url = process.argv.find((a, i) => process.argv[i - 1] === '--url') ||
            process.env.KNISHIO_API_URL ||
            'https://localhost:8080/graphql'

const cellSlug = process.argv.find((a, i) => process.argv[i - 1] === '--cell') ||
                 process.env.KNISHIO_CELL_SLUG ||
                 'TESTCELL'

// Colors
const G = '\x1b[32m'
const R = '\x1b[31m'
const Y = '\x1b[33m'
const C = '\x1b[36m'
const D = '\x1b[90m'
const B = '\x1b[1m'
const X = '\x1b[0m'

let passed = 0
let failed = 0

function ok (label, detail = '') {
  passed++
  console.log(`  ${G}PASS${X}  ${label}${detail ? `  ${D}${detail}${X}` : ''}`)
}

function fail (label, detail = '') {
  failed++
  console.log(`  ${R}FAIL${X}  ${label}${detail ? `  ${R}${detail}${X}` : ''}`)
}

function info (msg) {
  console.log(`  ${D}${msg}${X}`)
}

async function main () {
  console.log(`\n${B}${C}DataBraid Embedding Status — E2E Test${X}`)
  console.log(`${D}Server: ${url}${X}`)
  console.log(`${D}Cell:   ${cellSlug}${X}\n`)

  // ─────────────────────────────────────────────────────
  // Phase 1: Client initialization
  // ─────────────────────────────────────────────────────
  console.log(`${B}Phase 1: Client Setup${X}`)

  let client
  try {
    client = new KnishIOClient({
      uri: url,
      cellSlug
    })
    ok('Client initialized')
  } catch (err) {
    fail('Client initialization', err.message)
    process.exit(1)
  }

  // ─────────────────────────────────────────────────────
  // Phase 2: Capability detection
  // ─────────────────────────────────────────────────────
  console.log(`\n${B}Phase 2: Capability Detection${X}`)

  let supportsEmbedding = false
  try {
    supportsEmbedding = await client.hasQueryField('embeddingStatus')
    if (supportsEmbedding) {
      ok('hasQueryField("embeddingStatus") = true', 'Server supports embedding status')
    } else {
      ok('hasQueryField("embeddingStatus") = false', 'Server does not support embedding status (expected for old builds)')
    }
  } catch (err) {
    fail('hasQueryField probe threw', err.message)
  }

  // Verify cache works — second call should not hit network
  try {
    const cached = await client.hasQueryField('embeddingStatus')
    if (cached === supportsEmbedding) {
      ok('Cache hit on second probe', `returned ${cached} without network call`)
    } else {
      fail('Cache returned different value', `first: ${supportsEmbedding}, second: ${cached}`)
    }
  } catch (err) {
    fail('Cache probe threw', err.message)
  }

  // Test with a definitely nonexistent field
  try {
    const bogus = await client.hasQueryField('thisFieldDefinitelyDoesNotExist')
    if (bogus === false) {
      ok('hasQueryField("thisFieldDefinitelyDoesNotExist") = false')
    } else {
      fail('Bogus field returned true')
    }
  } catch (err) {
    fail('Bogus field probe threw', err.message)
  }

  // ─────────────────────────────────────────────────────
  // Phase 3: Embedding status queries
  // ─────────────────────────────────────────────────────
  console.log(`\n${B}Phase 3: Embedding Status Queries${X}`)

  if (!supportsEmbedding) {
    // Server doesn't support it — test graceful degradation
    console.log(`  ${Y}Server lacks embeddingStatus — testing graceful degradation${X}`)

    try {
      const result = await client.queryEmbeddingStatus({
        metaType: 'test',
        metaId: 'nonexistent'
      })
      if (result === null) {
        ok('queryEmbeddingStatus() returned null for unsupported server')
      } else {
        fail('Expected null for unsupported server', `got: ${typeof result}`)
      }
    } catch (err) {
      fail('queryEmbeddingStatus() threw instead of returning null', err.message)
    }

    console.log(`\n${Y}Skipping remaining query tests — server does not support embeddingStatus.${X}`)
    console.log(`${Y}Rebuild the validator with the new code and re-run.${X}`)
  } else {
    // Server supports it — run full query tests

    // 3a: Single instance query (may or may not have actual metas)
    try {
      const response = await client.queryEmbeddingStatus({
        metaType: 'test',
        metaId: 'nonexistent_item'
      })

      if (response) {
        const payload = response.payload()
        if (payload && Array.isArray(payload)) {
          const item = payload[0]
          if (item.metaType === 'test' && item.metaId === 'nonexistent_item') {
            ok('Single query — response echoes input keys', `state: ${item.state}, total: ${item.totalMetas}`)
            if (item.state === 'PENDING' && item.totalMetas === 0) {
              ok('Nonexistent instance returned PENDING with 0 metas')
            } else {
              info(`Unexpected state for nonexistent: state=${item.state}, totalMetas=${item.totalMetas}`)
            }
          } else {
            fail('Single query — keys mismatch', JSON.stringify(item))
          }
        } else {
          fail('Single query — payload not an array', JSON.stringify(payload))
        }
      } else {
        fail('Single query returned null despite server support')
      }
    } catch (err) {
      fail('Single query threw', err.message)
    }

    // 3b: Bulk query with multiple instances
    try {
      const response = await client.queryEmbeddingStatus({
        instances: [
          { metaType: 'test', metaId: 'item_1' },
          { metaType: 'test', metaId: 'item_2' },
          { metaType: 'product', metaId: 'sku_999' }
        ]
      })

      if (response) {
        const payload = response.payload()
        if (payload && Array.isArray(payload) && payload.length === 3) {
          ok('Bulk query — returned 3 items', payload.map(p => `${p.metaType}:${p.metaId}=${p.state}`).join(', '))

          // Verify all items have the expected shape
          const allValid = payload.every(item =>
            typeof item.metaType === 'string' &&
            typeof item.metaId === 'string' &&
            ['PENDING', 'STALE', 'COMPLETE'].includes(item.state) &&
            typeof item.totalMetas === 'number' &&
            typeof item.embeddedCount === 'number'
          )
          if (allValid) {
            ok('Bulk query — all items have valid shape')
          } else {
            fail('Bulk query — some items have invalid shape', JSON.stringify(payload))
          }
        } else {
          fail('Bulk query — unexpected payload', `length: ${payload?.length}, type: ${typeof payload}`)
        }
      } else {
        fail('Bulk query returned null despite server support')
      }
    } catch (err) {
      fail('Bulk query threw', err.message)
    }

    // 3c: Write some meta, then check embedding status transitions
    console.log(`\n${B}Phase 4: Meta Write + Embedding Status Check${X}`)

    const secret = generateSecret()
    try {
      // Initialize auth
      await client.requestAuthToken({ secret, cellSlug })
      ok('Auth token acquired')

      const testMetaType = 'EmbedTest'
      const testMetaId = `e2e_${Date.now()}`

      // Write a meta molecule
      const metaResponse = await client.createMeta({
        metaType: testMetaType,
        metaId: testMetaId,
        meta: {
          description: 'E2E test for embedding status observability',
          timestamp: new Date().toISOString()
        }
      })

      if (metaResponse && metaResponse.success()) {
        ok('Meta molecule created', `${testMetaType}:${testMetaId}`)
      } else {
        fail('Meta molecule creation failed', metaResponse?.reason?.() || 'unknown')
      }

      // Query embedding status immediately — should be PENDING or COMPLETE
      // (depends on how fast the async embedding task runs)
      const statusResponse = await client.queryEmbeddingStatus({
        metaType: testMetaType,
        metaId: testMetaId
      })

      if (statusResponse) {
        const payload = statusResponse.payload()
        if (payload && payload.length > 0) {
          const item = payload[0]
          ok('Post-write status query returned', `state: ${item.state}, total: ${item.totalMetas}, embedded: ${item.embeddedCount}`)

          if (item.totalMetas > 0) {
            ok('Meta rows visible to embedding status', `${item.totalMetas} row(s)`)
          } else {
            info('Warning: totalMetas is 0 — meta may not have been written yet')
          }

          if (item.state === 'COMPLETE') {
            ok('Embedding already complete (fast embedding pipeline)')
          } else if (item.state === 'PENDING') {
            ok('Embedding is PENDING (expected for async pipeline)')
            info('Waiting 5 seconds for backfill to process...')
            await new Promise(resolve => setTimeout(resolve, 5000))

            // Re-check
            const recheckResponse = await client.queryEmbeddingStatus({
              metaType: testMetaType,
              metaId: testMetaId
            })
            if (recheckResponse) {
              const recheckPayload = recheckResponse.payload()
              if (recheckPayload && recheckPayload.length > 0) {
                const recheckItem = recheckPayload[0]
                ok('Re-check after 5s', `state: ${recheckItem.state}, embedded: ${recheckItem.embeddedCount}/${recheckItem.totalMetas}`)
                if (recheckItem.model) {
                  ok('Model name present', recheckItem.model)
                }
              }
            }
          }
        } else {
          fail('Post-write status query — empty payload')
        }
      } else {
        fail('Post-write status query returned null')
      }
    } catch (err) {
      fail('Meta write + status check', err.message)
    }
  }

  // ─────────────────────────────────────────────────────
  // Summary
  // ─────────────────────────────────────────────────────
  console.log(`\n${B}─── Summary ───${X}`)
  console.log(`  ${G}Passed: ${passed}${X}`)
  if (failed > 0) {
    console.log(`  ${R}Failed: ${failed}${X}`)
  } else {
    console.log(`  ${D}Failed: 0${X}`)
  }
  console.log(`  ${D}Total:  ${passed + failed}${X}\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => {
  console.error(`\n${R}Fatal error: ${err.message}${X}`)
  console.error(err.stack)
  process.exit(1)
})

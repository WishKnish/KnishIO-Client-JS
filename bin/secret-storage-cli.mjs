#!/usr/bin/env node
import { sealEnvelope, openEnvelope } from '../src/storage/secretEnvelope.js'

const args = process.argv.slice(2)
if (args.length < 1) {
  process.stderr.write('Usage: secret-storage-cli.mjs <seal|open> [args...]\n')
  process.exit(1)
}

const cmd = args[0]
if (cmd === 'seal' || cmd === 'seal-recovery') {
  if (args.length < 4) {
    process.stderr.write('Usage: secret-storage-cli.mjs seal <passphrase> <secret> <bundleHash> [label]\n')
    process.exit(1)
  }
  const passphrase = args[1]
  const secret = args[2]
  const bundleHash = args[3]
  const label = (args.length >= 5 && args[4]) ? args[4] : undefined

  const metadata = {
    bundleHash,
    createdAt: 1700000000000,
    hardwareBacked: false,
    providerType: 'webcrypto-aes-gcm'
  }
  if (label !== undefined) {
    metadata.label = label
  }

  const payload = await sealEnvelope(secret, passphrase, metadata)
  process.stdout.write(`${JSON.stringify(payload)}\n`)
  process.exit(0)
} else if (cmd === 'open') {
  if (args.length < 3) {
    process.stderr.write('Usage: secret-storage-cli.mjs open <passphrase> <payloadJson>\n')
    process.exit(1)
  }
  const passphrase = args[1]
  const payloadJson = args[2]
  const payload = JSON.parse(payloadJson)
  const bytes = await openEnvelope(payload, passphrase)
  const plain = new TextDecoder().decode(bytes)
  process.stdout.write(`${plain}\n`)
  process.exit(0)
}

process.stderr.write(`Unknown command: ${cmd}\n`)
process.exit(1)

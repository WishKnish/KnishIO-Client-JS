import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
import { generateSecret } from '../src'

/**
 * Production regression (knish-kits, 2026-07-21, via the TS sibling SDK): `serializeKey`
 * used `String.fromCharCode.apply(null, key)`, which passes every byte of the AES-GCM
 * ciphertext as a stack-allocated argument and throws `RangeError: Maximum call stack
 * size exceeded` past the engine's argument limit (~64–125K) — any payload over ~100KB.
 *
 * Serialization must stay byte-identical to the legacy output: blobs encrypted before
 * this fix (and by other-language SDKs) must still deserialize to the same bytes.
 */
describe('stack-safe key serialization', () => {
  const wallet = new Wallet({
    secret: generateSecret(),
    token: 'AUTH'
  })

  test('encrypts and round-trips a payload far beyond the V8 argument limit', async () => {
    const message = {
      content_b64: 'A'.repeat(1500000),
      mime_type: 'application/pdf',
      file_name: 'large-document.pdf'
    }

    const envelope = await wallet.encryptMessage(message, wallet.pubkey)
    const decrypted = await wallet.decryptMessage(envelope)
    expect(decrypted).toEqual(message)
  })

  test('keeps serializeKey byte-identical to the legacy implementation', () => {
    const bytes = new Uint8Array(4096)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = (i * 31 + 7) % 256
    }

    expect(wallet.serializeKey(bytes)).toBe(btoa(String.fromCharCode(...bytes)))
  })

  test('round-trips serializeKey → deserializeKey byte-for-byte', () => {
    const bytes = new Uint8Array(4096)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = (i * 131 + 17) % 256
    }

    const restored = wallet.deserializeKey(wallet.serializeKey(bytes))
    expect(Array.from(restored)).toEqual(Array.from(bytes))
  })
})

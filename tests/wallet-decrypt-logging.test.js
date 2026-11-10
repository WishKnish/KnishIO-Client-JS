/**
 * A failed ML-KEM decryption must not log secret material.
 *
 * `_mlkemDecryptToString` (behind `decryptMessage` and the CipherHash transport's
 * `decryptMyMessageML`) used to `console.info` the ML-KEM shared secret, the deserialized
 * ciphertext and the decrypted bytes whenever a later step failed. Anything collecting console
 * output then held the key that opens that message. The error itself and the wallet's public
 * key may still be logged; nothing derived from the decapsulation may.
 */
import { describe, test, expect, jest, afterEach } from '@jest/globals'
import Wallet from '../src/Wallet'

const SECRET = 'a1b2c3d4e5f6'.repeat(8)
const CHANNELS = ['info', 'warn', 'error', 'log']

afterEach(() => {
  jest.restoreAllMocks()
})

describe('Wallet decryption failure', () => {
  test('decrypt failure logs no secret material', async () => {
    const wallet = new Wallet({ secret: SECRET, token: 'AUTH' })
    const encrypted = await wallet.encryptMessage({ hello: 'world' }, wallet.pubkey)

    // Flip one base64 character past the IV so AES-GCM authentication fails.
    const at = Math.floor(encrypted.encryptedMessage.length / 2)
    const original = encrypted.encryptedMessage[at]
    const flipped = original === 'A' ? 'B' : 'A'
    const tampered = {
      ...encrypted,
      encryptedMessage: encrypted.encryptedMessage.slice(0, at) + flipped + encrypted.encryptedMessage.slice(at + 1)
    }

    const spies = CHANNELS.map(channel => jest.spyOn(console, channel).mockImplementation(() => {}))

    const result = await wallet.decryptMessage(tampered)

    expect(result).toBeNull()
    const logged = spies.flatMap(spy => spy.mock.calls.flat())
    // The failure was reported at all, so the assertions below inspect a real log.
    expect(logged.length).toBeGreaterThan(0)
    for (const arg of logged) {
      expect(ArrayBuffer.isView(arg)).toBe(false)
      if (typeof arg === 'string') {
        expect(arg.toLowerCase()).not.toContain('secret')
      }
    }
  })
})

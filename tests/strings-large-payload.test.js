import {
  describe,
  test,
  expect
} from '@jest/globals'
import {
  hexToBase64,
  base64ToHex,
  chunkArray,
  randomString
} from '../src'

/**
 * Companion to serialize-large-payload.test.js. The SAME stack-overflow class the Wallet
 * fix addressed also lived in the shared, publicly-exported `libraries/strings` +
 * `libraries/array` utils:
 *   - hexToBase64  spread every byte into String.fromCharCode.apply → RangeError past ~64K bytes
 *   - chunkArray   recursed once per chunk → RangeError on large arrays
 * These pin the fixes: large inputs must not throw, and base64 output must stay
 * byte-identical to the legacy encoding (hexToBase64 feeds Molecule compressed-OTS).
 *
 * randomString's spread was gated below the crash threshold by getRandomValues' 65536-byte
 * quota, so it was never actually reachable — its rewrite is a defensive parity change with
 * the TS SDK, verified here only for correctness at the quota ceiling.
 */
describe('stack-safe string/array utilities', () => {
  const largeHex = byteLen => {
    let hex = ''
    for (let i = 0; i < byteLen; i++) {
      hex += ((i * 31 + 7) % 256).toString(16).padStart(2, '0')
    }
    return hex
  }

  test('hexToBase64 stays byte-identical to the legacy btoa(spread) encoding', () => {
    const hex = largeHex(4096)
    const bytes = Uint8Array.from(Buffer.from(hex, 'hex'))
    expect(hexToBase64(hex)).toBe(btoa(String.fromCharCode.apply(null, bytes)))
  })

  test('hexToBase64 handles a payload far beyond the argument limit, byte-identical to Buffer', () => {
    const hex = largeHex(750000) // 1.5 MB of hex → 750 KB of bytes
    const bytes = Uint8Array.from(Buffer.from(hex, 'hex'))
    expect(() => hexToBase64(hex)).not.toThrow()
    expect(hexToBase64(hex)).toBe(Buffer.from(bytes).toString('base64'))
  })

  test('base64ToHex round-trips a large payload back to the original hex', () => {
    const hex = largeHex(500000)
    expect(base64ToHex(hexToBase64(hex))).toBe(hex)
  })

  test('chunked hexToBase64 matches the Buffer fast path when Buffer is absent (browser)', () => {
    const hex = largeHex(300000)
    const nodeB64 = hexToBase64(hex)

    const origBuffer = global.Buffer
    try {
      global.Buffer = undefined
      expect(hexToBase64(hex)).toBe(nodeB64)
    } finally {
      global.Buffer = origBuffer
    }
  })

  test('chunkArray splits a large array without overflowing the stack', () => {
    const arr = Array.from({ length: 500000 }, (_, i) => i)
    let chunks
    expect(() => {
      chunks = chunkArray(arr, 3)
    }).not.toThrow()
    expect(chunks.length).toBe(Math.ceil(arr.length / 3))
    expect(chunks[0]).toEqual([0, 1, 2])
    expect(chunks[chunks.length - 1]).toEqual([499998, 499999])
  })

  test('chunkArray returns [] for an empty array', () => {
    expect(chunkArray([], 4)).toEqual([])
  })

  test('randomString produces the right length and charset at the getRandomValues ceiling', () => {
    const alphabet = 'abcdef0123456789'
    const out = randomString(65536) // 65536 = getRandomValues max bytes per call
    expect(out).toHaveLength(65536)
    expect([...new Set(out)].every(ch => alphabet.includes(ch))).toBe(true)
  })
})

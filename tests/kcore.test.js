import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test
} from '@jest/globals'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { ml_kem768 as MlKEM768, ml_kem1024 as MlKEM1024 } from '@noble/post-quantum/ml-kem.js'
import * as kcore from '../src/libraries/kcore'
import Molecule from '../src/Molecule'
import Wallet from '../src/Wallet'
import CheckMolecule from '../src/libraries/CheckMolecule'
import { generateSecret } from '../src/libraries/crypto'

/**
 * The optional kcore backend (@wishknish/knishio-kcore). The parity tests need the package: run
 * them with KNISHIO_KCORE=require KNISHIO_KCORE_MODULE=<path to KnishIO-Kcore-JS>. Without it
 * (or with KNISHIO_KCORE=off) they skip and only the mode tests run.
 */
const ENV_KEYS = ['KNISHIO_KCORE', 'KNISHIO_KCORE_MODULE']
const NO_SUCH_MODULE = path.join(__dirname, 'no-such-kcore')
const KEM = {
  1024: { kem: MlKEM1024, pk: 1568, sk: 3168, ct: 1568 },
  768: { kem: MlKEM768, pk: 1184, sk: 2400, ct: 1088 }
}
const savedEnv = Object.fromEntries(ENV_KEYS.map(k => [k, process.env[k]]))
const mode = (savedEnv.KNISHIO_KCORE ?? 'auto').toLowerCase()

function restoreEnv () {
  for (const key of ENV_KEYS) {
    if (savedEnv[key] === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = savedEnv[key]
    }
  }
}

// Decided once from the caller's environment. In `require` mode a load failure throws here and
// fails the suite instead of quietly skipping the parity tests.
kcore._reset()
const kcoreOn = mode !== 'off' && (mode === 'require' ? kcore.available() : (() => { try { return kcore.available() } catch { return false } })())
kcore._reset()
const kcoreTest = kcoreOn ? test : test.skip

/** Runs `fn` with kcore forced off, then restores the caller's environment. */
function withKcoreOff (fn) {
  process.env.KNISHIO_KCORE = 'off'
  kcore._reset()
  try {
    return fn()
  } finally {
    restoreEnv()
    kcore._reset()
  }
}

function otsOutcome (molecule) {
  try {
    return { value: new CheckMolecule(molecule).ots() }
  } catch (e) {
    return { error: e.constructor.name }
  }
}

function metaMolecule (secret) {
  const molecule = new Molecule({
    secret,
    sourceWallet: new Wallet({ secret, token: 'USER' })
  })
  molecule.initMeta({ meta: { key: 'value' }, metaType: 'kcoreTest', metaId: 'parity' })
  return molecule
}

function signatureOf (molecule) {
  return molecule.atoms.map(atom => atom.otsFragment).join('')
}

beforeEach(() => {
  restoreEnv()
  kcore._reset()
})

afterEach(() => {
  restoreEnv()
  kcore._reset()
})

describe('kcore parity', () => {
  kcoreTest('Wallet.generateAddress matches the pure-JS address for 20 keys', () => {
    const keys = Array.from({ length: 20 }, (_, i) =>
      createHash('shake256', { outputLength: 1024 }).update(String(i)).digest('hex'))
    const viaKcore = keys.map(key => Wallet.generateAddress(key))
    const pure = withKcoreOff(() => keys.map(key => Wallet.generateAddress(key)))
    expect(viaKcore.every(a => /^[0-9a-f]{64}$/.test(a))).toBe(true)
    expect(viaKcore).toEqual(pure)
    // The package itself answered, not the fallback.
    expect(kcore.wotsAddress(keys[0])).toBe(pure[0])
  })

  kcoreTest('Molecule.sign gives the same OTS with kcore on and off, and each verifies under the other', () => {
    const secret = generateSecret('kcore-sign-parity')

    // kcore first, then pure-JS over the same atoms (same key, same molecular hash).
    const first = metaMolecule(secret)
    first.sign({ compressed: false })
    const kcoreSignature = signatureOf(first)
    const kcoreHash = first.molecularHash
    const pureSignature = withKcoreOff(() => {
      first.sign({ compressed: false })
      return signatureOf(first)
    })
    expect(first.molecularHash).toBe(kcoreHash)
    expect(kcoreSignature).toHaveLength(2048)
    expect(kcoreSignature).toBe(pureSignature)

    // pure-JS first, then kcore.
    const second = metaMolecule(secret)
    const pureFirst = withKcoreOff(() => {
      second.sign({ compressed: false })
      return signatureOf(second)
    })
    second.sign({ compressed: false })
    expect(signatureOf(second)).toBe(pureFirst)

    // A kcore signature verifies on the pure-JS path and vice versa.
    expect(withKcoreOff(() => new CheckMolecule(first).ots())).toBe(true)
    expect(new CheckMolecule(second).ots()).toBe(true)
  })

  kcoreTest('odd OTS text gives the same ots() outcome with kcore on and off', () => {
    const molecule = metaMolecule(generateSecret('kcore-odd-ots'))
    molecule.sign({ compressed: false })
    const original = molecule.atoms.map(atom => atom.otsFragment)
    const hexAt = original[0].search(/[a-f]/)
    expect(hexAt).toBeGreaterThanOrEqual(0)

    const variants = {
      valid: original,
      uppercase: [original[0].slice(0, hexAt) + original[0][hexAt].toUpperCase() + original[0].slice(hexAt + 1), ...original.slice(1)],
      nonHex: [`z${original[0].slice(1)}`, ...original.slice(1)],
      wrongLength: [...original.slice(0, -1), original[original.length - 1].slice(0, -1)]
    }
    const outcomes = {}
    for (const [name, fragments] of Object.entries(variants)) {
      fragments.forEach((fragment, i) => { molecule.atoms[i].otsFragment = fragment })
      const viaKcore = otsOutcome(molecule)
      const pure = withKcoreOff(() => otsOutcome(molecule))
      expect({ name, outcome: viaKcore }).toEqual({ name, outcome: pure })
      outcomes[name] = viaKcore
    }
    expect(outcomes.valid).toEqual({ value: true })
    expect(outcomes.uppercase).toEqual({ error: 'SignatureMismatchException' })
    expect(outcomes.nonHex).toEqual({ error: 'SignatureMismatchException' })
    expect(outcomes.wrongLength.error).toBeDefined()
  })

  for (const set of [1024, 768]) {
    kcoreTest(`ML-KEM-${set}: keypair matches noble, encapsulation is randomized and decapsulates`, () => {
      const { kem, pk, sk, ct } = KEM[set]
      const seed = Uint8Array.from({ length: 64 }, (_, i) => (i * 7 + set) & 0xff)
      const pair = kcore.mlkemKeypair(set, seed)
      const noble = kem.keygen(seed)
      expect(pair.publicKey).toHaveLength(pk)
      expect(pair.secretKey).toHaveLength(sk)
      expect(Buffer.from(pair.publicKey).equals(Buffer.from(noble.publicKey))).toBe(true)
      expect(Buffer.from(pair.secretKey).equals(Buffer.from(noble.secretKey))).toBe(true)

      const a = kcore.mlkemEncaps(set, pair.publicKey)
      const b = kcore.mlkemEncaps(set, pair.publicKey)
      expect(a.cipherText).toHaveLength(ct)
      expect(Buffer.from(a.cipherText).equals(Buffer.from(b.cipherText))).toBe(false)
      expect(Buffer.from(a.sharedSecret).equals(Buffer.from(b.sharedSecret))).toBe(false)
      for (const { cipherText, sharedSecret } of [a, b]) {
        const viaKcore = kcore.mlkemDecaps(set, cipherText, pair.secretKey)
        expect(Buffer.from(viaKcore).equals(Buffer.from(sharedSecret))).toBe(true)
        expect(Buffer.from(kem.decapsulate(cipherText, noble.secretKey)).equals(Buffer.from(sharedSecret))).toBe(true)
      }
    })
  }

  kcoreTest('ineligible inputs return null', () => {
    const key = createHash('shake256', { outputLength: 1024 }).update('ineligible').digest('hex')
    const chunk = key.slice(0, 128)
    expect(kcore.wotsAddress(key.slice(1))).toBeNull()
    expect(kcore.wotsAddress(key.toUpperCase())).toBeNull()
    expect(kcore.chainsHex(chunk, [65])).toBeNull()
    expect(kcore.chainsHex(chunk, [-1])).toBeNull()
    expect(kcore.chainsHex(chunk, [1.5])).toBeNull()
    expect(kcore.chainsHex(chunk.toUpperCase(), [3])).toBeNull()
    expect(kcore.chainsHex(chunk, [])).toBeNull()
    expect(kcore.chainsHex(chunk, [1, 1])).toBeNull()
    expect(kcore.mlkemKeypair(1024, new Uint8Array(63))).toBeNull()
    expect(kcore.mlkemKeypair(512, new Uint8Array(64))).toBeNull()
    expect(kcore.mlkemEncaps(768, new Uint8Array(1568))).toBeNull()
    expect(kcore.mlkemDecaps(1024, new Uint8Array(1568), new Uint8Array(2400))).toBeNull()
    expect(kcore.mlkemDecaps(768, new Uint8Array(1568), new Uint8Array(2400))).toBeNull()
    // The eligible counterparts do reach the package.
    expect(kcore.chainsHex(chunk, [0])).toBe(chunk)
    expect(kcore.backend()).toMatch(/^(napi|wasm)$/)
  })
})

describe('kcore modes', () => {
  test('off: unavailable and every helper returns null', () => {
    process.env.KNISHIO_KCORE = 'off'
    const key = createHash('shake256', { outputLength: 1024 }).update('off').digest('hex')
    expect(kcore.available()).toBe(false)
    expect(kcore.backend()).toBeNull()
    expect(kcore.wotsAddress(key)).toBeNull()
    expect(kcore.chainsHex(key.slice(0, 128), [1])).toBeNull()
  })

  test('require with a missing module throws KcoreUnavailable on every call', () => {
    process.env.KNISHIO_KCORE = 'require'
    process.env.KNISHIO_KCORE_MODULE = NO_SUCH_MODULE
    expect(() => kcore.available()).toThrow(kcore.KcoreUnavailable)
    expect(() => kcore.available()).toThrow(/kcore unavailable: /)
    expect(() => kcore.wotsAddress('0'.repeat(2048))).toThrow(kcore.KcoreUnavailable)
    expect(() => new Wallet({ secret: generateSecret('kcore-require'), token: 'USER' })).toThrow(kcore.KcoreUnavailable)
  })

  test('auto with a missing module falls back quietly', () => {
    process.env.KNISHIO_KCORE = 'auto'
    process.env.KNISHIO_KCORE_MODULE = NO_SUCH_MODULE
    expect(kcore.available()).toBe(false)
    const key = createHash('shake256', { outputLength: 1024 }).update('auto').digest('hex')
    expect(kcore.wotsAddress(key)).toBeNull()
    expect(Wallet.generateAddress(key)).toMatch(/^[0-9a-f]{64}$/)
  })

  test('an unknown KNISHIO_KCORE value throws', () => {
    process.env.KNISHIO_KCORE = 'bogus'
    expect(() => kcore.available()).toThrow('KNISHIO_KCORE must be auto, off or require, got \'bogus\'')
  })
})

import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import TokenUnit from '../src/TokenUnit'
import {
  generateSecret,
  generateBundleHash
} from '../src'

// Extract the token-unit ids carried by an atom's `tokenUnits` meta ([[id,name,metas],...]).
const atomTokenUnitIds = atom => {
  const meta = atom.meta.find(item => item.key === 'tokenUnits')
  if (!meta) {
    return []
  }
  return JSON.parse(meta.value).map(unit => unit[0])
}

describe('Multi-recipient transfer (WP-544)', () => {
  const secret = generateSecret()
  const bundleR1 = generateBundleHash(generateSecret())
  const bundleR2 = generateBundleHash(generateSecret())

  // A fresh stackable source wallet with balance 3 and 3 token units.
  const buildSource = () => {
    const source = Wallet.create({ secret, token: 'STK' })
    source.balance = '3'
    source.tokenUnits = [
      new TokenUnit('u1', 'Unit 1', {}),
      new TokenUnit('u2', 'Unit 2', {}),
      new TokenUnit('u3', 'Unit 3', {})
    ]
    return source
  }

  describe('Wallet.splitUnitsMulti', () => {
    test('partitions N-way: source = SENT union, each recipient = its subset, remainder = KEPT', () => {
      const source = buildSource()
      const r1 = Wallet.create({ bundle: bundleR1, token: 'STK' })
      const r2 = Wallet.create({ bundle: bundleR2, token: 'STK' })
      const remainder = source.createRemainder(secret)

      source.splitUnitsMulti([['u1'], ['u2']], [r1, r2], remainder)

      expect(source.tokenUnits.map(unit => unit.id)).toEqual(['u1', 'u2']) // SENT union
      expect(r1.tokenUnits.map(unit => unit.id)).toEqual(['u1'])
      expect(r2.tokenUnits.map(unit => unit.id)).toEqual(['u2'])
      expect(remainder.tokenUnits.map(unit => unit.id)).toEqual(['u3']) // KEPT
    })

    test('is a no-op when no units are sent (fungible transfer)', () => {
      const source = Wallet.create({ secret, token: 'FUN' })
      source.balance = '100'
      const r1 = Wallet.create({ bundle: bundleR1, token: 'FUN' })
      const r2 = Wallet.create({ bundle: bundleR2, token: 'FUN' })
      const remainder = source.createRemainder(secret)

      source.splitUnitsMulti([[], []], [r1, r2], remainder)

      expect(source.tokenUnits).toHaveLength(0)
      expect(remainder.tokenUnits).toHaveLength(0)
    })
  })

  describe('Molecule.initValues', () => {
    test('builds source + N recipients + remainder, conserving, with per-atom tokenUnits', () => {
      const source = buildSource()
      const r1 = Wallet.create({ bundle: bundleR1, token: 'STK' })
      r1.batchId = 'batchA'
      const r2 = Wallet.create({ bundle: bundleR2, token: 'STK' })
      r2.batchId = 'batchB'
      const remainder = source.createRemainder(secret)

      const molecule = new Molecule({
        secret,
        bundle: source.bundle,
        sourceWallet: source,
        remainderWallet: remainder,
        cellSlug: 'mrtest'
      })

      source.splitUnitsMulti([['u1'], ['u2']], [r1, r2], remainder)
      molecule.initValues({ recipientWallets: [r1, r2], amounts: [1, 1] })

      const vAtoms = molecule.atoms.filter(atom => atom.isotope === 'V')
      expect(vAtoms).toHaveLength(4) // source + 2 recipients + remainder

      // Conservation: all V values sum to zero
      const sum = vAtoms.reduce((total, atom) => total + Number(atom.value), 0)
      expect(sum).toBe(0)

      // Source atom: -balance (full drain), carries the SENT union, no metaId
      const sourceAtom = vAtoms.find(atom => Number(atom.value) < 0)
      expect(Number(sourceAtom.value)).toBe(-3)
      expect(atomTokenUnitIds(sourceAtom).sort()).toEqual(['u1', 'u2'])

      // Recipient atoms: bonded to their own bundle, each carrying its own unit
      const r1Atom = vAtoms.find(atom => atom.metaId === r1.bundle)
      const r2Atom = vAtoms.find(atom => atom.metaId === r2.bundle)
      expect(r1Atom.metaType).toBe('walletBundle')
      expect(Number(r1Atom.value)).toBe(1)
      expect(atomTokenUnitIds(r1Atom)).toEqual(['u1'])
      expect(r2Atom.metaType).toBe('walletBundle')
      expect(Number(r2Atom.value)).toBe(1)
      expect(atomTokenUnitIds(r2Atom)).toEqual(['u2'])

      // Remainder atom: bonded to the sender bundle, carries the KEPT unit
      const remainderAtom = vAtoms.find(atom => atom.metaId === remainder.bundle)
      expect(Number(remainderAtom.value)).toBe(1)
      expect(atomTokenUnitIds(remainderAtom)).toEqual(['u3'])
    })

    test('signed multi-recipient molecule passes the SDK client-side check()', () => {
      const source = buildSource()
      const r1 = Wallet.create({ bundle: bundleR1, token: 'STK' })
      r1.batchId = 'batchA'
      const r2 = Wallet.create({ bundle: bundleR2, token: 'STK' })
      r2.batchId = 'batchB'
      const remainder = source.createRemainder(secret)
      const molecule = new Molecule({
        secret,
        bundle: source.bundle,
        sourceWallet: source,
        remainderWallet: remainder,
        cellSlug: 'mrtest'
      })

      source.splitUnitsMulti([['u1'], ['u2']], [r1, r2], remainder)
      molecule.initValues({ recipientWallets: [r1, r2], amounts: [1, 1] })

      expect(() => {
        molecule.sign({})
        molecule.check(molecule.sourceWallet)
      }).not.toThrow()
    })
  })
})

import {
  describe,
  test,
  expect
} from '@jest/globals'
import Molecule from '../src/Molecule'
import Wallet from '../src/Wallet'
import Atom from '../src/Atom'
import CheckMolecule from '../src/libraries/CheckMolecule'
import {
  generateSecret,
  generateBundleHash
} from '../src'

describe('P-Isotope (Peering)', () => {
  const testSecret = generateSecret()
  const testBundle = generateBundleHash(testSecret)
  const sourceWallet = new Wallet({
    secret: testSecret,
    token: 'USER'
  })

  test('initPeering creates P-atom with correct structure', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initPeering({ host: 'https://peer.example.com' })

    // P-atom + I-atom (ContinuID)
    expect(molecule.atoms.length).toBeGreaterThanOrEqual(2)
    const pAtom = molecule.atoms[0]
    expect(pAtom.isotope).toBe('P')
    expect(pAtom.token).toBe('USER')
    expect(pAtom.metaType).toBe('walletBundle')
    expect(pAtom.metaId).toBe(testBundle)

    const metas = pAtom.aggregatedMeta()
    expect(metas.peerHost).toBe('https://peer.example.com')
  })

  test('initPeering adds ContinuID atom', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initPeering({ host: 'https://peer.example.com' })

    const iAtoms = molecule.atoms.filter(a => a.isotope === 'I')
    expect(iAtoms).toHaveLength(1)
    expect(iAtoms[0].token).toBe('USER')
  })

  test('P-isotope molecule signs and checks successfully', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initPeering({ host: 'https://peer.example.com' })
    molecule.sign({})

    expect(molecule.molecularHash).toHaveLength(64)
    expect(() => molecule.check()).not.toThrow()
  })
})

describe('A-Isotope (Append Request)', () => {
  const testSecret = generateSecret()
  const testBundle = generateBundleHash(testSecret)
  const sourceWallet = new Wallet({
    secret: testSecret,
    token: 'USER'
  })

  test('initAppendRequest creates A-atom with correct structure', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initAppendRequest({
      metaType: 'TestMeta',
      metaId: 'TEST123',
      action: 'update',
      meta: { description: 'Test append' }
    })

    // A-atom + I-atom (ContinuID)
    expect(molecule.atoms.length).toBeGreaterThanOrEqual(2)
    const aAtom = molecule.atoms[0]
    expect(aAtom.isotope).toBe('A')
    expect(aAtom.token).toBe('USER')
    expect(aAtom.metaType).toBe('TestMeta')
    expect(aAtom.metaId).toBe('TEST123')

    const metas = aAtom.aggregatedMeta()
    expect(metas.action).toBe('update')
    expect(metas.description).toBe('Test append')
  })

  test('initAppendRequest adds ContinuID atom', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initAppendRequest({
      metaType: 'TestMeta',
      metaId: 'TEST123',
      action: 'update'
    })

    const iAtoms = molecule.atoms.filter(a => a.isotope === 'I')
    expect(iAtoms).toHaveLength(1)
    expect(iAtoms[0].token).toBe('USER')
  })

  test('A-isotope molecule signs and checks successfully', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initAppendRequest({
      metaType: 'TestMeta',
      metaId: 'TEST123',
      action: 'update'
    })
    molecule.sign({})

    expect(molecule.molecularHash).toHaveLength(64)
    expect(() => molecule.check()).not.toThrow()
  })
})

describe('CheckMolecule Isotope Validators', () => {
  const testSecret = generateSecret()
  const testBundle = generateBundleHash(testSecret)
  const sourceWallet = new Wallet({
    secret: testSecret,
    token: 'USER'
  })

  test('isotopeP validates peerHost meta is present', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    // Create P-atom without peerHost meta
    molecule.addAtom(Atom.create({
      isotope: 'P',
      wallet: sourceWallet,
      metaType: 'walletBundle',
      metaId: testBundle
      // No meta — missing peerHost
    }))
    molecule.addContinuIdAtom()
    molecule.sign({})

    expect(() => molecule.check()).toThrow(/peerHost/)
  })

  test('isotopeA validates action meta is present', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    // Create A-atom without action meta
    molecule.addAtom(Atom.create({
      isotope: 'A',
      wallet: sourceWallet,
      metaType: 'TestMeta',
      metaId: 'TEST123'
      // No meta — missing action
    }))
    molecule.addContinuIdAtom()
    molecule.sign({})

    expect(() => molecule.check()).toThrow(/action/)
  })

  test('isotopeA validates metaType is present', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    // Create A-atom without metaType
    molecule.addAtom(new Atom({
      position: sourceWallet.position,
      walletAddress: sourceWallet.address,
      isotope: 'A',
      token: 'USER',
      metaType: null,
      metaId: 'TEST123',
      meta: [{ key: 'action', value: 'update' }]
    }))
    molecule.addContinuIdAtom()
    molecule.sign({})

    expect(() => molecule.check()).toThrow(/metaType/)
  })

  test('isotopeP rejects non-USER token via CheckMolecule directly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    // Create a valid molecule first, then modify the P-atom token
    molecule.initPeering({ host: 'https://peer.example.com' })
    molecule.sign({})

    // Tamper with token after signing to bypass OTS check
    // and test isotopeP validation directly
    const pAtom = molecule.atoms.find(a => a.isotope === 'P')
    pAtom.token = 'WRONG'

    const checker = new CheckMolecule(molecule)
    // Directly test isotopeP, not the full verify chain
    // (OTS would fail first on tampered molecule)
    expect(() => checker.isotopeP()).toThrow(/Token slug/)
  })

  test('verify chain includes all isotope validators', () => {
    // A valid P-isotope molecule should pass the full verify chain
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet
    })

    molecule.initPeering({ host: 'https://peer.example.com' })
    molecule.sign({})

    const checker = new CheckMolecule(molecule)
    expect(checker.verify()).toBe(true)
  })
})

describe('All Isotope Atoms', () => {
  test('all 11 isotope codes can be used in atoms', () => {
    const isotopes = ['V', 'B', 'M', 'C', 'R', 'I', 'P', 'U', 'T', 'A', 'F']

    for (const isotope of isotopes) {
      const atom = new Atom({
        position: 'test',
        walletAddress: 'test',
        isotope,
        token: 'USER'
      })
      expect(atom.isotope).toBe(isotope)
    }
  })
})

import {
  describe,
  test,
  expect
} from '@jest/globals'
import Molecule from '../src/Molecule.js'
import Wallet from '../src/Wallet.js'
import Atom from '../src/Atom.js'
import {
  generateSecret,
  generateBundleHash
} from '../src'

describe('Molecule', () => {
  const testSecret = generateSecret()
  const testBundle = generateBundleHash(testSecret)
  const sourceWallet = new Wallet({
    secret: testSecret,
    token: 'USER'
  })
  const tokenWallet = new Wallet({
    secret: testSecret,
    token: 'TEST'
  })
  tokenWallet.balance = 1000
  const remainderWallet = new Wallet({
    secret: testSecret,
    token: 'TEST'
  })

  test('creates a molecule with correct properties', () => {
    const molecule = new Molecule({
      bundle: testBundle,
      secret: testSecret,
      sourceWallet,
      remainderWallet,
      cellSlug: 'testCell'
    })
    expect(molecule.secret).toBe(testSecret)
    expect(molecule.bundle).toBe(testBundle)
    expect(molecule.sourceWallet).toBe(sourceWallet)
    expect(molecule.remainderWallet).toBe(remainderWallet)
    expect(molecule.cellSlug).toBe('testCell')
  })

  test('adds atoms to molecule correctly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      sourceWallet: tokenWallet
    })
    const atom = Atom.create({
      isotope: 'V',
      wallet: tokenWallet,
      value: '100'
    })

    molecule.addAtom(atom)
    expect(molecule.atoms).toHaveLength(1)
    expect(molecule.atoms[0]).toBe(atom)
    expect(atom.index).toBe(0)
  })

  test('initializes token transfer correctly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      sourceWallet: tokenWallet,
      remainderWallet
    })
    const recipientWallet = new Wallet({
      secret: generateSecret(),
      token: 'TEST'
    })

    // Forcing a fake balance
    sourceWallet.balance = '100'
    molecule.initValue({
      recipientWallet,
      amount: '100'
    })

    expect(molecule.atoms).toHaveLength(3)
    expect(molecule.atoms[0].isotope).toBe('V')
    expect(molecule.atoms[0].value).toBe('-100')
    expect(molecule.atoms[1].isotope).toBe('V')
    expect(molecule.atoms[1].value).toBe('100')
    expect(molecule.atoms[2].isotope).toBe('V')
  })

  test('signs molecule correctly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet: tokenWallet,
      remainderWallet
    })
    molecule.addAtom(Atom.create({
      isotope: 'V',
      wallet: sourceWallet,
      value: '100'
    }))

    molecule.sign({})

    expect(molecule.molecularHash).toHaveLength(64)
    expect(molecule.molecularHash).toMatch(/^[0-9a-g]+$/)
    expect(molecule.atoms[0].otsFragment).toBeTruthy()
  })

  test('checks molecule correctly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      bundle: testBundle,
      sourceWallet: tokenWallet,
      remainderWallet
    })
    const recipientWallet = new Wallet({
      secret: generateSecret(),
      token: 'TEST'
    })
    molecule.initValue({
      recipientWallet,
      amount: '100'
    })
    molecule.sign({})

    expect(() => molecule.check(tokenWallet)).not.toThrow()
  })

  test('initializes meta correctly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      sourceWallet
    })
    molecule.initMeta({
      meta: { key: 'value' },
      metaType: 'test',
      metaId: '123'
    })

    expect(molecule.atoms).toHaveLength(3)
    expect(molecule.atoms[0].isotope).toBe('M')
    expect(molecule.atoms[0].metaType).toBe('test')
    expect(molecule.atoms[0].metaId).toBe('123')
    expect(molecule.atoms[1].isotope).toBe('R')
    expect(molecule.atoms[2].isotope).toBe('I')
  })

  test('initializes token creation correctly', () => {
    const molecule = new Molecule({
      secret: testSecret,
      sourceWallet
    })
    const recipientWallet = new Wallet({
      secret: generateSecret(),
      token: 'TEST'
    })

    molecule.initTokenCreation({
      recipientWallet,
      amount: '1000',
      meta: {
        name: 'New Token',
        fungibility: 'fungible'
      }
    })

    expect(molecule.atoms).toHaveLength(2)
    expect(molecule.atoms[0].isotope).toBe('C')
    expect(molecule.atoms[0].token).toBe('USER')
    expect(molecule.atoms[0].metaType).toBe('token')
    expect(molecule.atoms[0].metaId).toBe('TEST')
    expect(molecule.atoms[1].isotope).toBe('I')
  })
})

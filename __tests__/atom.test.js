import { describe, test, expect } from '@jest/globals'
import Atom from '../src/Atom'
import Wallet from '../src/Wallet'
import { generateSecret } from '../src'

describe('Atom', () => {
  const testSecret = generateSecret()
  const testWallet = new Wallet({ secret: testSecret, token: 'TEST' })

  test('creates an atom with correct properties', () => {
    const atom = new Atom({
      position: testWallet.position,
      walletAddress: testWallet.address,
      isotope: 'V',
      token: 'TEST',
      value: '100',
      index: 0
    })

    expect(atom.position).toBe(testWallet.position)
    expect(atom.walletAddress).toBe(testWallet.address)
    expect(atom.isotope).toBe('V')
    expect(atom.token).toBe('TEST')
    expect(atom.value).toBe('100')
    expect(atom.index).toBe(0)
  })

  test('creates atom from wallet correctly', () => {
    const atom = Atom.create({
      isotope: 'V',
      wallet: testWallet,
      value: '100',
      metaType: 'test',
      metaId: '123'
    })

    expect(atom.position).toBe(testWallet.position)
    expect(atom.walletAddress).toBe(testWallet.address)
    expect(atom.isotope).toBe('V')
    expect(atom.token).toBe(testWallet.token)
    expect(atom.value).toBe('100')
    expect(atom.metaType).toBe('test')
    expect(atom.metaId).toBe('123')
  })

  test('gets hashable values correctly', () => {
    const atom = new Atom({
      position: testWallet.position,
      walletAddress: testWallet.address,
      isotope: 'V',
      token: 'TEST',
      value: '100',
      index: 0,
      meta: { key: 'value' }
    })

    const hashableValues = atom.getHashableValues()
    expect(hashableValues).toContain(testWallet.position)
    expect(hashableValues).toContain(testWallet.address)
    expect(hashableValues).toContain('V')
    expect(hashableValues).toContain('TEST')
    expect(hashableValues).toContain('100')
    expect(hashableValues).toContain('key')
    expect(hashableValues).toContain('value')
  })

  test('hashes atoms correctly', () => {
    const atom1 = Atom.create({
      isotope: 'V',
      wallet: testWallet,
      value: '100'
    })
    const atom2 = Atom.create({
      isotope: 'V',
      wallet: testWallet,
      value: '200'
    })

    const hash = Atom.hashAtoms({ atoms: [atom1, atom2] })
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-g]+$/)
  })

  test('sorts atoms correctly', () => {
    const atom1 = Atom.create({ isotope: 'V', wallet: testWallet, value: '100', index: 1 })
    const atom2 = Atom.create({ isotope: 'V', wallet: testWallet, value: '200', index: 0 })
    const atom3 = Atom.create({ isotope: 'V', wallet: testWallet, value: '300', index: 2 })

    const sortedAtoms = Atom.sortAtoms([atom1, atom2, atom3])
    expect(sortedAtoms[0].index).toBe(0)
    expect(sortedAtoms[1].index).toBe(1)
    expect(sortedAtoms[2].index).toBe(2)
  })
})

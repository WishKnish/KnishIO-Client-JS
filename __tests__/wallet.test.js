import {
  describe,
  test,
  expect
} from '@jest/globals'
import Wallet from '../src/Wallet'
import {
  generateSecret,
  generateBundleHash
} from '../src'

describe('Wallet', () => {
  const testSecret = generateSecret()
  const testBundle = generateBundleHash(testSecret)

  test('creates a wallet with correct properties', () => {
    const wallet = new Wallet({
      secret: testSecret,
      token: 'TEST',
      position: '1234567890abcdef',
      characters: 'BASE64'
    })

    expect(wallet.token).toBe('TEST')
    expect(wallet.bundle).toBe(testBundle)
    expect(wallet.position).toBe('1234567890abcdef')
    expect(wallet.characters).toBe('BASE64')
    expect(wallet.address).toBeTruthy()
    expect(wallet.pubkey).toBeTruthy()
  })

  test('generates correct key', () => {
    const wallet = new Wallet({
      secret: testSecret,
      token: 'TEST'
    })
    const key = Wallet.generateKey({
      secret: testSecret,
      token: 'TEST',
      position: wallet.position
    })
    expect(key).toHaveLength(2048)
    expect(key).toMatch(/^[0-9a-f]+$/)
  })

  test('generates correct address', () => {
    const wallet = new Wallet({
      secret: testSecret,
      token: 'TEST'
    })
    expect(wallet.address).toHaveLength(64)
    expect(wallet.address).toMatch(/^[0-9a-f]+$/)
  })

  test('creates shadow wallet correctly', () => {
    const shadowWallet = Wallet.create({
      bundle: testBundle,
      token: 'TEST'
    })
    expect(shadowWallet.isShadow()).toBe(true)
    expect(shadowWallet.bundle).toBe(testBundle)
    expect(shadowWallet.token).toBe('TEST')
    expect(shadowWallet.position).toBeNull()
    expect(shadowWallet.address).toBeNull()
  })

  test('encrypts and decrypts message correctly', async () => {
    const alice = new Wallet({
      secret: testSecret
    })

    const bob = new Wallet({
      secret: generateSecret()
    })

    const message = { foo: 'bar' }
    const encrypted = await alice.encryptMessage(message, bob.pubkey)
    const decrypted = await bob.decryptMessage(encrypted)
    expect(decrypted).toEqual(message)
  })

  test('splits token units correctly', () => {
    const wallet = new Wallet({
      secret: testSecret,
      token: 'TEST'
    })
    wallet.tokenUnits = [
      {
        id: 'unit1',
        name: 'Unit 1'
      },
      {
        id: 'unit2',
        name: 'Unit 2'
      },
      {
        id: 'unit3',
        name: 'Unit 3'
      }
    ]
    const remainderWallet = wallet.createRemainder(testSecret)

    wallet.splitUnits(['unit1', 'unit2'], remainderWallet)

    expect(wallet.tokenUnits).toHaveLength(2)
    expect(remainderWallet.tokenUnits).toHaveLength(1)
    expect(wallet.tokenUnits[0].id).toBe('unit1')
    expect(remainderWallet.tokenUnits[0].id).toBe('unit3')
  })
})

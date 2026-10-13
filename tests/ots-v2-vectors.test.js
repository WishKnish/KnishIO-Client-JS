import {
  describe,
  test,
  expect,
  jest
} from '@jest/globals'
import fs from 'fs'
import path from 'path'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import CheckMolecule from '../src/libraries/CheckMolecule'
import SignatureMismatchException from '../src/exception/SignatureMismatchException'
import SignatureMalformedException from '../src/exception/SignatureMalformedException'
import KnishIOClient from '../src/KnishIOClient'
import AuthToken from '../src/AuthToken'
import ResponseWalletList from '../src/response/ResponseWalletList'

/**
 * OTS v2 cross-SDK vectors (docs/OTS_V2_SPECIFICATION.md): key derivation, address, the
 * normalized hash, ML-KEM identities of v2 wallets, and molecule verdicts.
 *
 * Shared master (absent in a standalone checkout of this SDK, where the file registers one
 * visible skipped test and nothing else). Produced by scripts/gen-ots-v2-vectors.mjs.
 */
const VECTORS_PATH = path.resolve(__dirname, '../../shared-test-results/ots-v2-vectors.json')
const vectors = fs.existsSync(VECTORS_PATH) ? JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf8')).vectors : null
const describeWithVectors = vectors ? describe : () => {}

if (!vectors) {
  test.skip('ots-v2-vectors.test.js: skipped — ../shared-test-results/ots-v2-vectors.json not found (standalone checkout)', () => {})
}

const EXCEPTIONS = {
  SignatureMismatch: SignatureMismatchException,
  SignatureMalformed: SignatureMalformedException
}

describeWithVectors('OTS v2 key derivation and address', () => {
  test.each(vectors ? vectors.key_derivation.tests : [])('$name', (vector) => {
    const { secret, token, position } = vector
    expect(Wallet.generateKey({ secret, token, position })).toBe(vector.expectedKeyV1)
    expect(Wallet.generateKey({ secret, token, position, otsVersion: 2 })).toBe(vector.expectedKeyV2)
    expect(Wallet.generateAddress(vector.expectedKeyV1)).toBe(vector.expectedAddressV1)
    expect(Wallet.generateAddress(vector.expectedKeyV2)).toBe(vector.expectedAddressV2)
    expect(new Wallet({ secret, token, position, otsVersion: 2 }).address).toBe(vector.expectedAddressV2)
  })

  test('an unsupported OTS version is refused', () => {
    expect(() => new Wallet({ secret: 'x', otsVersion: 3 })).toThrow(/unsupported OTS version 3/)
  })
})

describeWithVectors('OTS v2 normalized hash', () => {
  test.each(vectors ? vectors.signature.tests : [])('$name', (vector) => {
    expect(Molecule.normalize(Molecule.enumerate(vector.molecularHash))).toEqual(vector.expectedNormalized)
  })
})

describeWithVectors('OTS v2 wallet ML-KEM identities', () => {
  test.each(vectors ? vectors.mlkem_identity.tests : [])('$name', (vector) => {
    const { secret, token, position } = vectors.key_derivation.tests.find(k => k.name === vector.keyFrom)
    const pubkey = mlKemParameterSet => new Wallet({ secret, token, position, otsVersion: 2, mlKemParameterSet }).pubkey
    expect(pubkey(1024)).toBe(vector.expectedMlKem1024Pubkey)
    expect(pubkey(768)).toBe(vector.expectedMlKem768Pubkey)
  })
})

describeWithVectors('OTS v2 molecule verdicts', () => {
  test.each(vectors ? vectors.molecules.tests : [])('$name → $expected', (vector) => {
    const molecule = Molecule.fromJSON(vector.molecule)
    if (vector.expected === 'verified') {
      expect(molecule.check()).toBe(true)
    } else {
      expect(() => molecule.check()).toThrow(EXCEPTIONS[vector.expected])
    }
  })

  test.each(['genuine_v2', 'genuine_v1_control'])('re-signing %s reproduces every otsFragment', (name) => {
    const vector = vectors.molecules.tests.find(t => t.name === name)
    const { secret, position } = vectors.key_derivation.tests.find(k => k.name === 'hex_secret_user')
    const molecule = Molecule.fromJSON(vector.molecule)
    molecule.secret = secret
    molecule.sourceWallet = new Wallet({ secret, token: 'USER', position, otsVersion: vector.otsVersion })
    molecule.sign()
    expect(molecule.atoms.map(atom => atom.otsFragment)).toEqual(vector.molecule.atoms.map(atom => atom.otsFragment))
  })
})

describeWithVectors('OTS malformed declared hash', () => {
  // CheckMolecule.ots() on its own, without a prior molecular-hash check: refused before any chain work
  test.each(vectors ? vectors.malformed_hash.tests : [])('$name → $expected', (vector) => {
    const check = new CheckMolecule(Molecule.fromJSON(vector.molecule))
    expect(() => check.ots()).toThrow(EXCEPTIONS[vector.expected])
  })
})

describe('createMolecule with an OTS v2 source wallet', () => {
  test('the default remainder wallet keeps the source wallet OTS version', async () => {
    const secret = 'a'.repeat(2048)
    const client = new KnishIOClient({ uri: 'http://127.0.0.1:9/graphql', cellSlug: 'ots-v2', logging: false })
    const sourceWallet = Wallet.create({ secret, token: 'USER', otsVersion: 2 })
    const getSourceWallet = jest.spyOn(client, 'getSourceWallet')
    const molecule = await client.createMolecule({ secret, bundle: sourceWallet.bundle, sourceWallet })
    expect(getSourceWallet).not.toHaveBeenCalled()
    expect(molecule.remainderWallet.otsVersion).toBe(2)
    expect(client.getRemainderWallet().otsVersion).toBe(2)
  })
})

describe('client-level OTS version', () => {
  const secret = 'a'.repeat(2048)
  const position = 'b'.repeat(64)
  const keyV1 = Wallet.generateKey({ secret, token: 'USER', position, otsVersion: 1 })
  const keyV2 = Wallet.generateKey({ secret, token: 'USER', position, otsVersion: 2 })
  const addressV1 = Wallet.generateAddress(keyV1)
  const addressV2 = Wallet.generateAddress(keyV2)
  const unrelated = 'c'.repeat(64)
  const ledgerWallet = address => new Wallet({ secret: null, token: 'USER', position, address })
  const clientAt = (otsVersion) => {
    const client = new KnishIOClient({ uri: 'http://127.0.0.1:9/graphql', cellSlug: 'ots-v2', logging: false, otsVersion })
    client.setSecret(secret)
    return client
  }
  const continuIdReturns = (client, wallet) => jest.spyOn(client, 'queryContinuId').mockResolvedValue({ payload: () => wallet })
  const addressAt = (token, atPosition, otsVersion) => Wallet.generateAddress(Wallet.generateKey({ secret, token, position: atPosition, otsVersion }))
  const continuIdAtom = molecule => molecule.atoms.find(atom => atom.isotope === 'I')
  const accepted = () => ({ success: () => true, reason: () => null, payload: () => null, token: () => 't', expiresAt: () => 0, pubKey: () => null, encrypt: () => false })
  // The signed molecules the client proposes: through executeQuery (createMeta, transferToken) and
  // the login's own query.execute
  const proposals = (client) => {
    const molecules = []
    jest.spyOn(client, 'executeQuery').mockImplementation(async (query) => {
      molecules.push(query.molecule())
      return accepted()
    })
    const createMoleculeMutation = client.createMoleculeMutation.bind(client)
    jest.spyOn(client, 'createMoleculeMutation').mockImplementation(async (args) => {
      const query = await createMoleculeMutation(args)
      jest.spyOn(query, 'execute').mockImplementation(async () => {
        molecules.push(query.molecule())
        return accepted()
      })
      return query
    })
    return molecules
  }

  test('detectOtsVersion finds the version an address was derived at, either preferred order', () => {
    for (const preferred of [1, 2]) {
      expect(Wallet.detectOtsVersion({ secret, token: 'USER', position, address: addressV1, preferred })).toBe(1)
      expect(Wallet.detectOtsVersion({ secret, token: 'USER', position, address: addressV2, preferred })).toBe(2)
      expect(Wallet.detectOtsVersion({ secret, token: 'USER', position, address: unrelated, preferred })).toBeNull()
    }
  })

  test('setOtsVersion sets a keyless wallet and refuses to change a keyed one', () => {
    expect(ledgerWallet(addressV2).setOtsVersion(2).otsVersion).toBe(2)
    const keyed = new Wallet({ secret, token: 'USER', position })
    expect(() => keyed.setOtsVersion(2)).toThrow('KnishIO: cannot change the OTS version of a keyed wallet.')
    expect(keyed.setOtsVersion(1).otsVersion).toBe(1)
  })

  test('the client option is validated', () => {
    expect(clientAt(2).getOtsVersion()).toBe(2)
    expect(() => clientAt(3)).toThrow('KnishIO: unsupported OTS version 3; expected 1 or 2.')
  })

  test('without a ContinuID, getSourceWallet creates a key at the client version', async () => {
    const client = clientAt(2)
    continuIdReturns(client, null)
    const sourceWallet = await client.getSourceWallet()
    expect(sourceWallet.otsVersion).toBe(2)
    expect(sourceWallet.key).toHaveLength(8192)
  })

  test('getSourceWallet derives a ContinuID wallet at the version its address was derived at', async () => {
    const client = clientAt(1)
    continuIdReturns(client, ledgerWallet(addressV2))
    const sourceWallet = await client.getSourceWallet()
    expect(sourceWallet.otsVersion).toBe(2)
    expect(sourceWallet.key).toBe(keyV2)
  })

  test('getSourceWallet refuses a ContinuID wallet this secret does not derive', async () => {
    const client = clientAt(1)
    continuIdReturns(client, ledgerWallet(unrelated))
    await expect(client.getSourceWallet()).rejects.toThrow(`KnishIO: wallet ${ unrelated } is not derived from this secret at position ${ position } under OTS version 1 or 2.`)
  })

  test('an AuthToken snapshot keeps the session wallet OTS version', () => {
    const wallet = new Wallet({ secret, token: 'USER', position, otsVersion: 2 })
    const snapshot = AuthToken.create({ token: 't', expiresAt: 0, pubkey: null, encrypt: false }, wallet).getSnapshot()
    expect(snapshot.wallet.otsVersion).toBe(2)
    const restored = AuthToken.restore(snapshot, secret).getWallet()
    expect(restored.otsVersion).toBe(2)
    expect(restored.address).toBe(wallet.address)

    delete snapshot.wallet.otsVersion
    expect(AuthToken.restore(snapshot, secret).getWallet().otsVersion).toBe(1)
  })

  test('a v2 client signing in from a v1 ContinuID pointer registers a v2 head', async () => {
    const client = clientAt(2)
    continuIdReturns(client, ledgerWallet(addressV1))
    const molecules = proposals(client)
    await client.requestProfileAuthToken({ secret, encrypt: false })
    expect(molecules).toHaveLength(1)
    expect(molecules[0].atoms[0].walletAddress).toBe(addressV1)
    const head = continuIdAtom(molecules[0])
    expect(head.walletAddress).toBe(addressAt('USER', head.position, 2))
    expect(client.getAuthToken().getWallet().otsVersion).toBe(1)
  })

  test('a v2 client signing from a v1 ContinuID head registers a v2 head', async () => {
    const client = clientAt(2)
    continuIdReturns(client, ledgerWallet(addressV1))
    const molecules = proposals(client)
    await client.createMeta({ metaType: 'ots', metaId: 'migrate', meta: { k: 'v' } })
    expect(molecules[0].atoms[0].walletAddress).toBe(addressV1)
    const head = continuIdAtom(molecules[0])
    expect(head.walletAddress).toBe(addressAt('USER', head.position, 2))
  })

  test('a v1 client signing from a v2 ContinuID head keeps a v2 head', async () => {
    const client = clientAt(1)
    continuIdReturns(client, ledgerWallet(addressV2))
    const molecules = proposals(client)
    await client.createMeta({ metaType: 'ots', metaId: 'keep', meta: { k: 'v' } })
    expect(molecules[0].atoms[0].walletAddress).toBe(addressV2)
    const head = continuIdAtom(molecules[0])
    expect(head.walletAddress).toBe(addressAt('USER', head.position, 2))
  })

  test('createRemainder takes the higher of the wallet OTS version and minOtsVersion', () => {
    const v1 = new Wallet({ secret, token: 'TKN', position })
    const v2 = new Wallet({ secret, token: 'TKN', position, otsVersion: 2 })
    expect(v1.createRemainder(secret).otsVersion).toBe(1)
    expect(v1.createRemainder(secret, 2).otsVersion).toBe(2)
    expect(v2.createRemainder(secret, 1).otsVersion).toBe(2)
    expect(() => v1.createRemainder(secret, 3)).toThrow('KnishIO: unsupported OTS version 3; expected 1 or 2.')
  })

  test('a molecule creates its signer wallets at the higher of the signing version and minOtsVersion', () => {
    const sourceWallet = new Wallet({ secret, token: 'TKN', position })
    sourceWallet.balance = '10'
    const molecule = new Molecule({ secret, sourceWallet, minOtsVersion: 2 })
    expect(molecule.signingOtsVersion()).toBe(1)
    expect(molecule.successorOtsVersion()).toBe(2)
    expect(molecule.remainderWallet.otsVersion).toBe(2)

    molecule.initDepositBuffer({ amount: 4, tradeRates: {} })
    const buffer = molecule.atoms.find(atom => atom.isotope === 'B')
    expect(buffer.walletAddress).toBe(addressAt('TKN', buffer.position, 2))

    molecule.addContinuIdAtom()
    expect(molecule.remainderWallet.token).toBe('USER')
    expect(molecule.remainderWallet.otsVersion).toBe(2)
    expect(new Molecule({ secret, sourceWallet }).successorOtsVersion()).toBe(1)
  })

  test('a v2 client transferring from a v1 token wallet creates a v2 remainder', async () => {
    const tokenPosition = 'd'.repeat(64)
    const tokenWallet = new Wallet({ secret: null, token: 'TKN', position: tokenPosition, address: addressAt('TKN', tokenPosition, 1) })
    tokenWallet.balance = '100'
    const client = clientAt(2)
    continuIdReturns(client, ledgerWallet(addressV1))
    jest.spyOn(client, 'queryBalance').mockResolvedValue({ payload: () => tokenWallet })
    const molecules = proposals(client)
    await client.transferToken({ bundleHash: Wallet.create({ secret: 'e'.repeat(2048) }).bundle, token: 'TKN', amount: 10 })
    const [molecule] = molecules
    expect(molecule.atoms[0].walletAddress).toBe(tokenWallet.address)
    const remainder = molecule.atoms.find((atom, index) => index > 0 && atom.isotope === 'V' && atom.token === 'TKN' && atom.position)
    expect(remainder.walletAddress).toBe(addressAt('TKN', remainder.position, 2))
  })

  test('a ledger wallet rebuilt with the secret is keyed at the version its address was derived at', () => {
    const tokenPosition = 'd'.repeat(64)
    const data = address => ({
      position: tokenPosition,
      tokenSlug: 'TKN',
      batchId: null,
      characters: null,
      address,
      bundleHash: Wallet.create({ secret }).bundle,
      tokenUnits: [],
      tradeRates: [],
      amount: '5',
      pubkey: null,
      createdAt: '0'
    })
    const rebuilt = ResponseWalletList.toClientWallet({ data: data(addressAt('TKN', tokenPosition, 2)), secret })
    expect(rebuilt.otsVersion).toBe(2)
    expect(rebuilt.key).toBe(Wallet.generateKey({ secret, token: 'TKN', position: tokenPosition, otsVersion: 2 }))
    expect(rebuilt.address).toBe(addressAt('TKN', tokenPosition, 2))

    const unrelatedWallet = ResponseWalletList.toClientWallet({ data: data(unrelated), secret })
    expect(unrelatedWallet.key).toBeFalsy()
    expect(unrelatedWallet.address).toBe(unrelated)
  })
})

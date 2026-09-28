import {
  describe,
  test,
  expect,
  afterEach,
  jest
} from '@jest/globals'
import Wallet from '../src/Wallet'
import Molecule from '../src/Molecule'
import TokenUnit from '../src/TokenUnit'
import MutationProposeMolecule from '../src/mutation/MutationProposeMolecule'
import AtomsMissingException from '../src/exception/AtomsMissingException'
import StackableUnitAmountException from '../src/exception/StackableUnitAmountException'
import TransferBalanceException from '../src/exception/TransferBalanceException'
import {
  TOKEN_REPLENISH_TESTS,
  STACKABLE_FUSION_TESTS,
  BUFFER_WITHDRAW_FRESH_REMAINDER_TESTS
} from './fixtures/phaseBVectors.js'
import {
  stubClient,
  atomUnits,
  assertReplenishVector,
  assertFusionVector,
  assertWithdrawVector
} from './fixtures/phaseBHarness.js'

afterEach(() => {
  jest.restoreAllMocks()
})

// The frozen copies of the cross-SDK vectors; tests/patent-vectors.test.js runs the same
// assertions on the monorepo master and checks these copies against it.
describe('token_replenish vectors (frozen)', () => {
  test.each(TOKEN_REPLENISH_TESTS)('$name', assertReplenishVector)
})

describe('stackable_fusion_conservation vectors (frozen)', () => {
  test.each(STACKABLE_FUSION_TESTS)('$name', assertFusionVector)
})

describe('buffer_withdraw_fresh_remainder vectors (frozen)', () => {
  test.each(BUFFER_WITHDRAW_FRESH_REMAINDER_TESTS)('$name', assertWithdrawVector)
})

describe('replenishToken', () => {
  test('credits a new wallet of the identity when it holds none of the token', async () => {
    const { client, proposed } = stubClient()

    await client.replenishToken({ token: 'REPLTOK', amount: 500 })

    const metas = proposed[0].atoms[0].aggregatedMeta()
    expect(metas.address).toMatch(/^[0-9a-f]{64}$/)
    expect(metas.position).toMatch(/^[0-9a-f]{64}$/)
    expect(metas.pubkey).toBeTruthy()
  })

  test('carries the credited wallet batch id on the C atom and in its metas', async () => {
    const { client, proposed, secret } = stubClient({ fungibility: 'stackable' })
    const credited = new Wallet({ secret, token: 'REPLSTK', batchId: 'batch-credited' })
    client.queryBalance.mockResolvedValue({ payload: () => credited })

    await client.replenishToken({ token: 'REPLSTK', units: [['R1', 'R1', {}]] })

    const cAtom = proposed[0].atoms[0]
    expect(cAtom.batchId).toBe('batch-credited')
    expect(cAtom.meta.map(meta => meta.key)).toEqual(['action', 'address', 'position', 'pubkey', 'batchId', 'tokenUnits'])
    expect(cAtom.aggregatedMeta().batchId).toBe('batch-credited')
  })

  test('refuses a stackable token without units and sends nothing', async () => {
    const { client, proposed } = stubClient({ fungibility: 'stackable' })

    await expect(client.replenishToken({ token: 'REPLSTK', amount: 5 })).rejects.toThrow(StackableUnitAmountException)
    expect(proposed).toHaveLength(0)
  })

  test('refuses units together with a different amount', async () => {
    const { client, proposed } = stubClient({ fungibility: 'stackable' })

    await expect(client.replenishToken({ token: 'REPLSTK', amount: 3, units: [['R1', 'R1', {}]] }))
      .rejects.toThrow(StackableUnitAmountException)
    expect(proposed).toHaveLength(0)
  })

  test.each([0, -5, null])('refuses amount %p', async (amount) => {
    const { client, proposed } = stubClient()

    await expect(client.replenishToken({ token: 'REPLTOK', amount })).rejects.toThrow('must be positive')
    expect(proposed).toHaveLength(0)
  })
})

describe('fuseToken', () => {
  const sourceWallet = (secret, batchId = null) => {
    const wallet = new Wallet({ secret, token: 'FUSETOK', batchId })
    wallet.tokenUnits = ['U1', 'U2', 'U3'].map(id => new TokenUnit(id, id, { tag: id }))
    wallet.balance = '3'
    return wallet
  }

  test('batch ids: remainder keeps the source batch, burn and F atoms get fresh ones', async () => {
    const { client, proposed, secret } = stubClient()
    client.queryBalance.mockResolvedValue({ payload: () => sourceWallet(secret, 'batch-source') })

    await client.fuseToken({ bundleHash: client.getBundle(), tokenSlug: 'FUSETOK', newTokenUnit: 'N', fusedTokenUnitIds: ['U1', 'U3'] })

    const [source, burn, fusion, remainder] = proposed[0].atoms
    expect(source.batchId).toBe('batch-source')
    expect(remainder.batchId).toBe('batch-source')
    expect(burn.batchId).toBeTruthy()
    expect(fusion.batchId).toBeTruthy()
    expect(new Set([source.batchId, burn.batchId, fusion.batchId]).size).toBe(3)
  })

  test('without a source batch id no atom carries one', async () => {
    const { client, proposed, secret } = stubClient()
    client.queryBalance.mockResolvedValue({ payload: () => sourceWallet(secret) })

    await client.fuseToken({ bundleHash: client.getBundle(), tokenSlug: 'FUSETOK', newTokenUnit: 'N', fusedTokenUnitIds: ['U1', 'U3'] })

    expect(proposed[0].atoms.map(atom => atom.batchId)).toEqual([null, null, null, null])
  })

  test('the new unit keeps its own metas and lists the fused units with theirs, caller order', async () => {
    const { client, proposed, secret } = stubClient()
    client.queryBalance.mockResolvedValue({ payload: () => sourceWallet(secret) })

    await client.fuseToken({
      bundleHash: client.getBundle(),
      tokenSlug: 'FUSETOK',
      newTokenUnit: new TokenUnit('N', 'New unit', { rarity: 'rare' }),
      fusedTokenUnitIds: ['U3', 'U1']
    })

    expect(atomUnits(proposed[0].atoms[2])).toEqual([
      ['N', 'New unit', { rarity: 'rare', fusedTokenUnits: [['U3', 'U3', { tag: 'U3' }], ['U1', 'U1', { tag: 'U1' }]] }]
    ])
  })

  test('a foreign recipient bundle receives the F atom', async () => {
    const { client, proposed, secret } = stubClient()
    client.queryBalance.mockResolvedValue({ payload: () => sourceWallet(secret) })
    const recipient = 'a'.repeat(64)

    await client.fuseToken({ bundleHash: recipient, tokenSlug: 'FUSETOK', newTokenUnit: 'N', fusedTokenUnitIds: ['U1', 'U2'] })

    expect(proposed[0].atoms[2].metaId).toBe(recipient)
    expect(proposed[0].atoms[3].metaId).toBe(client.getBundle())
  })

  test.each([
    [['U1', 'U9'], 'U9 does not found in the source wallet'],
    [['U1', 'U2'], 'Token fusion unit id already exists in the source wallet', 'U3']
  ])('refuses %p (%s) and sends nothing', async (fused, message, newUnit = 'N') => {
    const { client, proposed, secret } = stubClient()
    client.queryBalance.mockResolvedValue({ payload: () => sourceWallet(secret) })

    const fusion = client.fuseToken({ bundleHash: client.getBundle(), tokenSlug: 'FUSETOK', newTokenUnit: newUnit, fusedTokenUnitIds: fused })

    await expect(fusion).rejects.toThrow(TransferBalanceException)
    await expect(fusion).rejects.toThrow(message)
    expect(proposed).toHaveLength(0)
  })
})

describe('withdrawBufferToken', () => {
  test('a supplied buffer wallet is used without a balance query and never receives the remainder', async () => {
    const { client, proposed, secret } = stubClient()
    const buffer = new Wallet({ secret, token: 'BUFTOK', batchId: 'batch-buffer' })
    buffer.balance = '50'

    await client.withdrawBufferToken({ tokenSlug: 'BUFTOK', amount: 20, sourceWallet: buffer })

    expect(client.queryBalance).not.toHaveBeenCalled()
    const [source, recipient, remainder] = proposed[0].atoms
    expect(remainder.position).not.toBe(source.position)
    expect(remainder.batchId).toBe('batch-buffer')
    expect(recipient.batchId).toBeTruthy()
    expect(recipient.batchId).not.toBe('batch-buffer')
  })

  test('refuses when the identity has no buffer wallet', async () => {
    const { client, proposed } = stubClient({ balanceWallet: null })

    await expect(client.withdrawBufferToken({ tokenSlug: 'BUFTOK', amount: 20 })).rejects.toThrow(TransferBalanceException)
    expect(proposed).toHaveLength(0)
  })
})

// Contract 9.7: a high-level operation checks the molecule it built before sending it; the raw
// propose path sends a caller-built molecule untouched (the validator's Tier 1 guards it).
describe('pre-submit molecule check', () => {
  test('a USER-signed meta mutation that lost its ContinuID atom is refused before any request', async () => {
    const { client } = stubClient()
    client.executeQuery.mockRestore()
    const mutate = jest.spyOn(client.client(), 'mutate')
    jest.spyOn(Molecule.prototype, 'addContinuIdAtom').mockImplementation(function () { return this })

    await expect(client.createMeta({ metaType: 'AppAsset', metaId: 'asset-1', meta: { name: 'x' } }))
      .rejects.toThrow(AtomsMissingException)
    expect(mutate).not.toHaveBeenCalled()
  })

  test('the raw propose mutation sends a USER-signed M-only molecule unchanged', async () => {
    const { client, secret } = stubClient()
    client.executeQuery.mockRestore()
    const mutate = jest.spyOn(client.client(), 'mutate').mockResolvedValue({ data: { ProposeMolecule: { status: 'rejected' } } })

    const molecule = new Molecule({ secret, bundle: client.getBundle(), sourceWallet: new Wallet({ secret }), cellSlug: 'vectors' })
    molecule.initMeta({ meta: { name: 'x' }, metaType: 'AppAsset', metaId: 'asset-1' })
    molecule.atoms = molecule.atoms.filter(atom => atom.isotope !== 'I')
    molecule.sign({})
    const sent = JSON.stringify(molecule.toJSON())

    const query = await client.createMoleculeMutation({ mutationClass: MutationProposeMolecule, molecule })
    await client.executeQuery(query)

    expect(mutate).toHaveBeenCalledTimes(1)
    expect(mutate.mock.calls[0][0].variables.molecule).toBe(molecule)
    expect(JSON.stringify(molecule.toJSON())).toBe(sent)
    expect(molecule.atoms.map(atom => atom.isotope)).toEqual(['M'])
  })
})

// Builds the Phase B vector molecules through the public client operations, with the
// network stubbed, and asserts them against a vector. Shared by the always-on unit suite
// (tests/phaseb-vectors.test.js, frozen fixtures) and the gated master suite
// (tests/patent-vectors.test.js).
import {
  expect,
  jest
} from '@jest/globals'
import KnishIOClient from '../../src/KnishIOClient'
import Wallet from '../../src/Wallet'
import TokenUnit from '../../src/TokenUnit'
import QueryToken from '../../src/query/QueryToken'
import { generateSecret } from '../../src'

export const BURN_BUNDLE = '0'.repeat(64)

/**
 * A client whose reads are stubbed: the USER wallet, the balance wallet and the token's
 * fungibility. Every proposed molecule is recorded in `proposed` instead of being sent.
 */
export function stubClient ({
  balanceWallet = null,
  fungibility = 'fungible',
  secret = generateSecret()
} = {}) {
  const client = new KnishIOClient({
    uri: 'http://127.0.0.1:9/graphql',
    cellSlug: 'vectors',
    logging: false
  })
  client.setSecret(secret)
  jest.spyOn(client, 'getSourceWallet').mockImplementation(async () => new Wallet({ secret }))
  jest.spyOn(client, 'queryBalance').mockResolvedValue({ payload: () => balanceWallet })
  const proposed = []
  jest.spyOn(client, 'executeQuery').mockImplementation(async (query) => {
    if (query instanceof QueryToken) {
      return { data: () => [{ fungibility }] }
    }
    proposed.push(query.molecule())
    return 'response'
  })
  return {
    client,
    secret,
    proposed
  }
}

/** Unit triples of an atom's tokenUnits meta; an absent meta is an empty list. */
export function atomUnits (atom) {
  const json = atom.aggregatedMeta().tokenUnits
  return json ? JSON.parse(json) : []
}

function valueSum (atoms) {
  return atoms.reduce((sum, atom) => sum + BigInt(atom.value), 0n).toString()
}

const triples = ids => ids.map(id => [id, id, {}])

/** token_replenish: replenishToken on the identity's existing wallet for the token. */
export async function assertReplenishVector (vector) {
  const secret = generateSecret()
  const credited = new Wallet({ secret, token: vector.token })
  const { client, proposed } = stubClient({
    secret,
    balanceWallet: credited,
    fungibility: vector.units.length ? 'stackable' : 'fungible'
  })

  await client.replenishToken({ token: vector.token, amount: vector.amount, units: vector.units })

  expect(proposed).toHaveLength(1)
  const molecule = proposed[0]
  expect(molecule.atoms.map(atom => atom.isotope)).toEqual(vector.expectedIsotopes)

  const [cAtom, iAtom] = molecule.atoms
  expect(cAtom.token).toBe('USER')
  expect(cAtom.value).toBe(vector.expectedCValue)
  expect(cAtom.metaType).toBe(vector.expectedMetaType)
  expect(cAtom.metaId).toBe(vector.expectedMetaId)
  expect(cAtom.batchId).toBeNull()
  expect(cAtom.meta.map(meta => meta.key)).toEqual([
    'action', 'address', 'position', 'pubkey',
    ...(vector.expectedTokenUnitIds ? ['tokenUnits'] : [])
  ])
  const metas = cAtom.aggregatedMeta()
  expect(metas.action).toBe(vector.expectedAction)
  expect(metas.address).toBe(credited.address)
  expect(metas.position).toBe(credited.position)
  expect(metas.pubkey).toBe(credited.pubkey)
  if (vector.expectedTokenUnitIds) {
    expect(atomUnits(cAtom)).toEqual(vector.units)
    expect(atomUnits(cAtom).map(unit => unit[0])).toEqual(vector.expectedTokenUnitIds)
  } else {
    expect(metas.tokenUnits).toBeUndefined()
  }
  expect(iAtom.token).toBe('USER')
  expect(iAtom.metaId).toBe(client.getBundle())
  expect(molecule.check()).toBe(true)
}

/** stackable_fusion_conservation: fuseToken into the identity's own bundle. */
export async function assertFusionVector (vector) {
  const secret = generateSecret()
  const source = new Wallet({ secret, token: 'FUSETOK' })
  source.tokenUnits = vector.sourceUnits.map(id => new TokenUnit(id, id, {}))
  source.balance = String(vector.sourceUnits.length)
  const { client, proposed } = stubClient({ secret, balanceWallet: source })

  const fusion = client.fuseToken({
    bundleHash: client.getBundle(),
    tokenSlug: 'FUSETOK',
    newTokenUnit: vector.newUnitId,
    fusedTokenUnitIds: vector.fuse
  })

  if (vector.mustReject) {
    await expect(fusion).rejects.toThrow(vector.expectedErrorContains)
    expect(proposed).toHaveLength(0)
    return
  }
  await fusion

  expect(proposed).toHaveLength(1)
  const molecule = proposed[0]
  expect(molecule.atoms.map(atom => atom.isotope)).toEqual(vector.expectedIsotopes)

  const [sourceAtom, burnAtom, fusionAtom, remainderAtom] = molecule.atoms
  const bundle = client.getBundle()

  expect(sourceAtom.walletAddress).toBe(source.address)
  expect(sourceAtom.position).toBe(source.position)
  expect(sourceAtom.value).toBe(vector.expectedSourceValue)
  expect(atomUnits(sourceAtom)).toEqual(triples(vector.expectedSourceUnitIds))

  expect(burnAtom.value).toBe(vector.expectedBurnValue)
  expect(burnAtom.metaType).toBe('walletBundle')
  expect(burnAtom.metaId).toBe(BURN_BUNDLE)
  expect(atomUnits(burnAtom)).toEqual(triples(vector.expectedBurnUnitIds))

  expect(fusionAtom.value).toBe(vector.expectedFusionValue)
  expect(fusionAtom.metaType).toBe('walletBundle')
  expect(fusionAtom.metaId).toBe(bundle)
  const newUnits = atomUnits(fusionAtom)
  expect(newUnits).toHaveLength(1)
  expect(newUnits[0][0]).toBe(vector.newUnitId)
  expect(newUnits[0][2].fusedTokenUnits).toEqual(triples(vector.expectedFusedTokenUnitIds))

  expect(remainderAtom.value).toBe(vector.expectedRemainderValue)
  expect(remainderAtom.metaType).toBe('walletBundle')
  expect(remainderAtom.metaId).toBe(bundle)
  expect(remainderAtom.position).not.toBe(source.position)
  expect(atomUnits(remainderAtom)).toEqual(triples(vector.expectedRemainderUnitIds))

  expect(valueSum(molecule.atoms)).toBe(vector.expectedSum)
  expect(molecule.check(source)).toBe(true)
}

/** buffer_withdraw_fresh_remainder: withdrawBufferToken from the identity's buffer wallet. */
export async function assertWithdrawVector (vector) {
  const secret = generateSecret()
  const buffer = new Wallet({ secret, token: 'BUFTOK' })
  buffer.balance = String(vector.sourceBalance)
  const { client, proposed } = stubClient({ secret, balanceWallet: buffer })

  await client.withdrawBufferToken({ tokenSlug: 'BUFTOK', amount: vector.amount })

  expect(client.queryBalance).toHaveBeenCalledWith({ token: 'BUFTOK', type: 'buffer' })
  expect(proposed).toHaveLength(1)
  const molecule = proposed[0]
  expect(molecule.atoms.map(atom => atom.isotope)).toEqual(vector.expectedIsotopes)

  const [sourceAtom, recipientAtom, remainderAtom] = molecule.atoms
  const bundle = client.getBundle()

  expect(sourceAtom.walletAddress).toBe(buffer.address)
  expect(sourceAtom.position).toBe(buffer.position)
  expect(sourceAtom.value).toBe(vector.expectedSourceValue)
  expect(sourceAtom.metaId).toBe(bundle)

  expect(recipientAtom.walletAddress).toBeNull()
  expect(recipientAtom.value).toBe(vector.expectedRecipientValue)
  expect(recipientAtom.metaType).toBe('walletBundle')
  expect(recipientAtom.metaId).toBe(bundle)

  expect(remainderAtom.value).toBe(vector.expectedRemainderValue)
  expect(remainderAtom.metaType).toBe('walletBundle')
  expect(remainderAtom.metaId).toBe(bundle)
  expect(remainderAtom.position !== sourceAtom.position).toBe(vector.expectedRemainderPositionDistinctFromSource)
  expect(remainderAtom.walletAddress).not.toBe(sourceAtom.walletAddress)

  expect(valueSum(molecule.atoms)).toBe(vector.expectedSum)
  expect(molecule.check(buffer)).toBe(true)
}

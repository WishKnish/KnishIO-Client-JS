import {
  describe,
  test,
  expect
} from '@jest/globals'
import fs from 'fs'
import path from 'path'
import Molecule from '../src/Molecule'
import SignatureMismatchException from '../src/exception/SignatureMismatchException'

/**
 * Cross-SDK regression fixture for the signingWallet forgery (WOTS+ mitigation plan §8 Phase 0.2).
 *
 * `forged` claims the victim's address in atoms[0].walletAddress, carries the attacker's OTS
 * signature, and names the attacker in an atoms[0] `signingWallet` meta. The verifier must check
 * the recovered address against atoms[0].walletAddress only, so `forged` must be rejected.
 * The fixture is shared byte-for-byte by all SDKs; never edit it.
 */
const FIXTURE_PATH = path.resolve(__dirname, 'fixtures/signing-wallet-forgery.json')
const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'))

describe('signingWallet forgery fixture', () => {
  test('genuine molecule loads and passes check()', () => {
    const molecule = Molecule.fromJSON(fixture.genuine)
    expect(molecule.check()).toBe(true)
  })

  test('forged molecule claims the victim address', () => {
    expect(fixture.forged.atoms[0].walletAddress).toBe(fixture.victimAddress)
    expect(fixture.victimAddress).not.toBe(fixture.attackerAddress)
  })

  test('forged molecule fails check() with SignatureMismatchException', () => {
    const molecule = Molecule.fromJSON(fixture.forged)
    expect(molecule.atoms[0].walletAddress).toBe(fixture.victimAddress)
    expect(() => molecule.check()).toThrow(SignatureMismatchException)
  })
})

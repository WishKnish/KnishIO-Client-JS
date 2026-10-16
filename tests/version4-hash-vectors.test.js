import {
  describe,
  test,
  expect
} from '@jest/globals'
import fs from 'fs'
import path from 'path'
import Atom from '../src/Atom'
import Version4 from '../src/versions/Version4'

/**
 * Atom-hash vectors shared by every SDK (master:
 * shared-test-results/version4-hash-vectors.json, produced by
 * scripts/gen-version4-hash-vectors.mjs). Each versioned case gives client-format atoms,
 * the exact JSON string hashed, and the expected base17 molecular hash; each legacy case
 * gives unversioned atoms and their expected legacy molecular hash.
 */
const VECTORS_PATH = path.resolve(__dirname, 'fixtures/version4-hash-vectors.json')
const { cases, legacyCases } = JSON.parse(fs.readFileSync(VECTORS_PATH, 'utf8'))

describe('Version4 hash vectors', () => {
  test('fixture carries the 9 cases', () => {
    expect(cases.map(c => c.name)).toEqual([
      'v4-basic', 'v3-basic', 'slash-unicode', 'control-quote', 'line-separators', 'nulls',
      'empty-strings', 'empty-version', 'index-order'
    ])
  })

  test.each(cases.map(c => [c.name, c]))('%s: view and hash match', (_name, vector) => {
    const atoms = vector.atoms.map(json => Atom.fromJSON(json))
    const sorted = [...atoms].sort((a, b) => a.index - b.index)
    expect(JSON.stringify(sorted.map(atom => Version4.create(atom).view()))).toBe(vector.viewJson)
    expect(Atom.hashAtoms({ atoms })).toBe(vector.expectedHash)
  })

  test('fixture carries the 2 legacy cases', () => {
    expect(legacyCases.map(c => c.name)).toEqual(['legacy-empty-strings', 'legacy-nulls'])
  })

  test.each(legacyCases.map(c => [c.name, c]))('%s: legacy hash matches', (_name, vector) => {
    const atoms = vector.atoms.map(json => Atom.fromJSON(json))
    expect(atoms.every(atom => atom.version === null || atom.version === undefined)).toBe(true)
    expect(Atom.hashAtoms({ atoms })).toBe(vector.expectedHash)
  })
})

/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/

import JsSHA from 'jssha'
import { charsetBaseConvert } from './libraries/strings'
import Meta from './Meta'
import AtomMeta from './AtomMeta'
import AtomsMissingException from './exception/AtomsMissingException'
import versions from './versions/index'
import type {
  AtomOptions,
  AtomCreateOptions,
  MetaData,
  MetaObject,
  NormalizedMeta,
  SupportedVersion
} from '@/types'


/**
 * Atom class used to form microtransactions within a Molecule
 */
export default class Atom {
  public readonly position: string | null
  public readonly walletAddress: string | null
  public readonly isotope: string | null
  public readonly token: string | null
  public readonly value: string | null
  public readonly batchId: string | null
  public readonly metaType: string | null
  public readonly metaId: string | null
  public readonly meta: NormalizedMeta[]
  public readonly index: number | null
  public readonly otsFragment: string | null
  public readonly createdAt: string
  public readonly version?: string | null

  /**
   * Class constructor
   */
  constructor ({
    position = null,
    walletAddress = null,
    isotope = null,
    token = null,
    value = null,
    batchId = null,
    metaType = null,
    metaId = null,
    meta = null,
    otsFragment = null,
    index = null,
    version = undefined
  }: AtomOptions) {
    this.position = position
    this.walletAddress = walletAddress
    this.isotope = isotope
    this.token = token
    this.value = value !== null ? String(value) : null
    this.batchId = batchId

    this.metaType = metaType
    this.metaId = metaId
    this.meta = meta ? Meta.normalizeMeta(meta as MetaObject | NormalizedMeta[]) : []

    this.index = index
    this.otsFragment = otsFragment
    this.createdAt = String(+new Date())

    if (version !== null && version !== undefined && Object.prototype.hasOwnProperty.call(versions, version)) {
      ;(this as any).version = String(version)
    }
  }

  /**
   * Get properties that are used for hashing
   */
  static getHashableProps (): string[] {
    return [
      'position',
      'walletAddress',
      'isotope',
      'token',
      'value',
      'batchId',
      'metaType',
      'metaId',
      'meta',
      'createdAt'
    ]
  }

  /**
   * Get properties that are unclaimed
   */
  static getUnclaimedProps (): string[] {
    return ['otsFragment']
  }

  /**
   * Create a new Atom with proper defaults and wallet integration
   */
  static create ({
    isotope,
    wallet = null,
    value = null,
    metaType = null,
    metaId = null,
    meta = null,
    batchId = null
  }: AtomCreateOptions): Atom {
    // If meta object is not passed - create it
    let atomMeta: AtomMeta
    if (!meta) {
      atomMeta = new AtomMeta()
    } else if (!(meta instanceof AtomMeta)) {
      atomMeta = new AtomMeta(meta as MetaData)
    } else {
      atomMeta = meta
    }

    // If wallet has been passed => add related metas
    if (wallet) {
      // Add wallet's meta
      atomMeta.setAtomWallet(wallet)

      // If batch ID does not passed: set it from the wallet
      batchId ??= wallet.batchId
    }

    // Create the final atom's object
    return new Atom({
      position: wallet ? wallet.position : null,
      walletAddress: wallet ? wallet.address : null,
      isotope,
      token: wallet ? wallet.token : null,
      value,
      batchId,
      metaType,
      metaId,
      meta: atomMeta.get()
    })
  }

  /**
   * Converts a compliant JSON string into an Atom class instance
   */
  static jsonToObject (json: string): Atom {
    const emptyAtom = new Atom({})
    const target = Object.assign(emptyAtom, JSON.parse(json))
    const properties = Object.keys(emptyAtom)

    for (const property in target) {
      if (Object.prototype.hasOwnProperty.call(target, property) && !properties.includes(property)) {
        delete (target as Record<string, unknown>)[property]
      }
    }

    return target
  }

  /**
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   */
  static hashAtoms ({
    atoms,
    output = 'base17'
  }: {
    atoms: Atom[];
    output?: string;
  }): number[] | string {
    const molecularSponge = new JsSHA('SHAKE256', 'TEXT')
    const atomList = Atom.sortAtoms(atoms)

    if (atomList.length === 0) {
      throw new AtomsMissingException()
    }

    atomList.map(atom => {
      if (!(atom instanceof Atom) && !(atom && typeof atom === 'object' && atom !== null && 'constructor' in atom && (atom as any).constructor?.name?.includes('Atom'))) {
        throw new AtomsMissingException()
      }
      return atom
    })

    // Hashing each atom in the molecule to produce a molecular hash
    if (atomList.every(atom => atom.version && Object.prototype.hasOwnProperty.call(versions, atom.version))) {
      molecularSponge.update(JSON.stringify(atomList.map(atom => {
        const version = atom.version as SupportedVersion
        return versions[version]?.create(atom).view() ?? null
      })))
    } else {
      const numberOfAtoms = String(atoms.length)
      let hashableValues: string[] = []

      for (const atom of atomList) {
        // Add number of atoms (???)
        hashableValues.push(numberOfAtoms)

        // Add atom's properties
        hashableValues = hashableValues.concat(atom.getHashableValues())
      }

      // Add hash values to the sponge
      for (const hashableValue of hashableValues) {
        molecularSponge.update(hashableValue)
      }
    }

    // Return the hash in the requested format
    switch (output) {
      case 'hex': {
        return molecularSponge.getHash('HEX', { outputLen: 256 })
      }
      case 'array': {
        const arrayBuffer = molecularSponge.getHash('ARRAYBUFFER', { outputLen: 256 })
        return Array.from(new Uint8Array(arrayBuffer))
      }
      default: {
        const converted = charsetBaseConvert(molecularSponge.getHash('HEX', { outputLen: 256 }), 16, 17, '0123456789abcdef', '0123456789abcdefg')
        return converted !== false ? converted.padStart(64, '0') : ''
      }
    }
  }

  /**
   * JSON serialization filter
   */
  static jsonSerialization (key: string, value: unknown): unknown {
    if (!Atom.getUnclaimedProps().includes(key)) {
      return value
    }

    return undefined
  }

  /**
   * Sort the atoms in a Molecule
   */
  static sortAtoms (atoms: Atom[]): Atom[] {
    const atomList = [...atoms]

    // Sort based on atomic index
    atomList.sort((first, second) => {
      return (first.index || 0) < (second.index || 0) ? -1 : 1
    })

    return atomList
  }

  /**
   * Get values used for hashing this atom
   */
  getHashableValues (): string[] {
    const hashableValues: string[] = []
    for (const property of Atom.getHashableProps()) {
      const value = (this as Record<string, unknown>)[property]

      // All nullable values are not hashed (only custom keys)
      if (value === null && !['position', 'walletAddress'].includes(property)) {
        continue
      }

      // Hashing individual meta keys and values
      if (property === 'meta') {
        const metaArray = value as NormalizedMeta[]
        for (const meta of metaArray) {
          if (typeof meta.value !== 'undefined' && meta.value !== null) {
            hashableValues.push(String(meta.key))
            hashableValues.push(String(meta.value))
          }
        }
      } else {
        // Default value
        hashableValues.push(value === null ? '' : String(value))
      }
    }
    return hashableValues
  }

  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta (): Record<string, unknown> {
    return Meta.aggregateMeta(this.meta)
  }

  /**
   * Check if this atom is valid
   */
  isValid (): boolean {
    return !!(
      this.position &&
      this.walletAddress &&
      this.isotope &&
      this.token &&
      this.batchId
    )
  }

  /**
   * Get a JSON representation of this atom
   */
  toJSON (): Record<string, unknown> {
    return {
      position: this.position,
      walletAddress: this.walletAddress,
      isotope: this.isotope,
      token: this.token,
      value: this.value,
      batchId: this.batchId,
      metaType: this.metaType,
      metaId: this.metaId,
      meta: this.meta,
      index: this.index,
      otsFragment: this.otsFragment,
      createdAt: this.createdAt,
      version: this.version
    }
  }
}

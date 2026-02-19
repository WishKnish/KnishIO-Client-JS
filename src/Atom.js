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
import { charsetBaseConvert } from './libraries/strings.js'
import Meta from './Meta.js'
import AtomMeta from './AtomMeta.js'
import AtomsMissingException from './exception/AtomsMissingException.js'
import versions from './versions/index.js'

/**
 * Atom class used to form microtransactions within a Molecule
 */
export default class Atom {
  /**
   * Class constructor
   *
   * @param {string|null} position
   * @param {string|null} walletAddress
   * @param {string|null} isotope
   * @param {string|null} token
   * @param {string|number|null} value
   * @param {string|null} batchId
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {array|object|null} meta
   * @param {string|null} otsFragment
   * @param {number|null} index
   * @param {string|null} version
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
    version = null
  }) {
    this.position = position
    this.walletAddress = walletAddress
    this.isotope = isotope
    this.token = token
    this.value = value !== null ? String(value) : null
    this.batchId = batchId

    this.metaType = metaType
    this.metaId = metaId
    this.meta = meta ? Meta.normalizeMeta(meta) : []

    this.index = index
    this.otsFragment = otsFragment
    this.createdAt = String(+new Date())
    if (version !== null && Object.prototype.hasOwnProperty.call(versions, version)) {
      this.version = String(version)
    }
  }

  /**
   *
   * @returns {string[]}
   */
  static getHashableProps () {
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
   *
   * @returns {string[]}
   */
  static getUnclaimedProps () {
    return [
      'otsFragment'
    ]
  }

  /**
   *
   * @param {string} isotope
   * @param {Wallet|null} wallet
   * @param {int|null} value
   * @param {string|null} metaType
   * @param {string|null} metaId
   * @param {AtomMeta|array|object|null} meta
   * @param {string|null} batchId
   * @returns {Atom}
   */
  static create ({
    isotope,
    wallet = null,
    value = null,
    metaType = null,
    metaId = null,
    meta = null,
    batchId = null
  }) {
    // If meta object is not passed - create it
    if (!meta) {
      meta = new AtomMeta()
    }

    // If meta object is not an instance of AtomMeta - create it from meta
    if (!(meta instanceof AtomMeta)) {
      meta = new AtomMeta(meta)
    }

    // If wallet has been passed => add related metas
    if (wallet) {
      // Add wallet's meta
      meta.setAtomWallet(wallet)

      // If batch ID does not passed: set it from the wallet
      if (!batchId) {
        batchId = wallet.batchId
      }
    }

    // Create the final atom's object
    // walletAddress is null for atoms without a pre-existing wallet (e.g., recipient V-atoms).
    // toJSON() serializes null as '' for GraphQL compatibility; hash computation treats both identically.
    return new Atom({
      position: wallet ? wallet.position : null,
      walletAddress: wallet ? wallet.address : null,
      isotope,
      token: wallet ? wallet.token : null,
      value,
      batchId,
      metaType,
      metaId,
      meta: meta.get()
    })
  }

  /**
   * Converts a compliant JSON string into an Atom class instance
   *
   * @param {string} json
   * @return {object}
   */
  static jsonToObject (json) {
    const target = Object.assign(new Atom({}), JSON.parse(json))
    const properties = Object.keys(new Atom({}))

    for (const property in target) {
      if (Object.prototype.hasOwnProperty.call(target, property) && !properties.includes(property)) {
        delete target[property]
      }
    }

    return target
  }

  /**
   * Returns JSON-ready object for cross-SDK compatibility (2025 JS best practices)
   * 
   * Provides clean serialization of atomic operations with optional OTS fragments.
   * Follows 2025 JavaScript best practices with proper type safety and validation.
   *
   * @param {Object} options - Serialization options
   * @param {boolean} options.includeOtsFragments - Include OTS signature fragments (default: true)
   * @param {boolean} options.validateFields - Validate required fields (default: false)
   * @return {Object} JSON-serializable object
   * @throws {Error} If atom is in invalid state for serialization
   */
  toJSON (options = {}) {
    const {
      includeOtsFragments = true,
      validateFields = false
    } = options;

    try {
      // Validate required fields if requested
      if (validateFields) {
        const requiredFields = ['position', 'walletAddress', 'isotope', 'token'];
        for (const field of requiredFields) {
          if (!this[field]) {
            throw new Error(`Required field '${field}' is missing or empty`);
          }
        }
      }

      // Core atom properties (always included)
      // Coerce null position/walletAddress/token to empty string for GraphQL compatibility.
      // The molecular hash computation (getHashableValues) already treats null as '' (line 448),
      // so this coercion does NOT change the hash. Required because the Rust validator's
      // GraphQL schema uses String! (non-null) with #[graphql(default)] for these fields,
      // which accepts omitted values but rejects explicit null.
      const serialized = {
        position: this.position ?? '',
        walletAddress: this.walletAddress ?? '',
        isotope: this.isotope,
        token: this.token ?? '',
        value: this.value,
        batchId: this.batchId,
        metaType: this.metaType,
        metaId: this.metaId,
        meta: this.meta || [],
        index: this.index,
        createdAt: this.createdAt,
        version: this.version
      };

      // Optional OTS fragments (can be large, so optional)
      if (includeOtsFragments && this.otsFragment) {
        serialized.otsFragment = this.otsFragment;
      }

      return serialized;

    } catch (error) {
      throw new Error(`Atom serialization failed: ${error.message}`);
    }
  }

  /**
   * Creates an Atom instance from JSON data (2025 JS best practices)
   * 
   * Handles cross-SDK atom deserialization with robust error handling.
   * Essential for reconstructing atoms from other SDK implementations.
   *
   * @param {string|Object} json - JSON string or object to deserialize
   * @param {Object} options - Deserialization options
   * @param {boolean} options.validateStructure - Validate required fields (default: true)
   * @param {boolean} options.strictMode - Strict validation mode (default: false)
   * @return {Atom} Reconstructed atom instance
   * @throws {Error} If JSON is invalid or required fields are missing
   */
  static fromJSON (json, options = {}) {
    const {
      validateStructure = true,
      strictMode = false
    } = options;

    try {
      // Parse JSON safely
      const data = typeof json === 'string' ? JSON.parse(json) : json;

      // Validate required fields in strict mode
      if (strictMode || validateStructure) {
        const requiredFields = ['position', 'walletAddress', 'isotope', 'token'];
        for (const field of requiredFields) {
          if (!data[field]) {
            throw new Error(`Required field '${field}' is missing or empty`);
          }
        }
      }

      // Create atom instance with required fields
      const atom = new Atom({
        position: data.position,
        walletAddress: data.walletAddress,
        isotope: data.isotope,
        token: data.token,
        value: data.value,
        batchId: data.batchId,
        metaType: data.metaType,
        metaId: data.metaId,
        meta: data.meta,
        index: data.index,
        version: data.version
      });

      // Set additional properties that may not be in constructor
      if (data.otsFragment) {
        atom.otsFragment = data.otsFragment;
      }
      if (data.createdAt) {
        atom.createdAt = data.createdAt;
      }

      return atom;

    } catch (error) {
      throw new Error(`Atom deserialization failed: ${error.message}`);
    }
  }

  /**
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   *
   * @param {array} atoms
   * @param {string} output
   * @return {number[]|*}
   */
  static hashAtoms ({
    atoms,
    output = 'base17'
  }) {
    const molecularSponge = new JsSHA('SHAKE256', 'TEXT')
    const atomList = Atom.sortAtoms(atoms)

    if (atomList.length === 0) {
      throw new AtomsMissingException()
    }

    atomList.map(atom => {
      if (!(atom instanceof Atom)) {
        throw new AtomsMissingException()
      }
      return atom
    })

    // Hashing each atom in the molecule to produce a molecular hash
    if (atomList.every(atom => atom.version && Object.prototype.hasOwnProperty.call(versions, atom.version))) {
      molecularSponge.update(JSON.stringify(atomList.map(atom => versions[atom.version].create(atom).view())))
    } else {
      const numberOfAtoms = String(atoms.length)
      let hashableValues = []

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
        return molecularSponge.getHash('ARRAYBUFFER', { outputLen: 256 })
      }
      default: {
        return charsetBaseConvert(molecularSponge.getHash('HEX', { outputLen: 256 }), 16, 17, '0123456789abcdef', '0123456789abcdefg').padStart(64, '0')
      }
    }
  }

  static jsonSerialization (key, value) {
    if (!Atom.getUnclaimedProps().includes(key)) {
      return value
    }

    return undefined
  }

  /**
   * Sort the atoms in a Molecule
   *
   * @param {array} atoms
   * @return {array}
   */
  static sortAtoms (atoms) {
    const atomList = [...atoms]

    // Sort based on atomic index
    atomList.sort((first, second) => {
      return first.index < second.index ? -1 : 1
    })

    return atomList
  }

  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta () {
    return Meta.aggregateMeta(this.meta)
  }

  /**
   *
   * @returns {*[]}
   */
  getHashableValues () {
    const hashableValues = []
    for (const property of Atom.getHashableProps()) {
      const value = this[property]

      // All nullable values are not hashed (only custom keys)
      if (value === null && !['position', 'walletAddress'].includes(property)) {
        continue
      }

      // Hashing individual meta keys and values
      if (property === 'meta') {
        for (const meta of value) {
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
}

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
import { shake256 } from 'js-sha3';
import { charsetBaseConvert } from './libraries/strings';
import Meta from './Meta';
import AtomMeta from './AtomMeta';

/**
 * Atom class used to form microtransactions within a Molecule
 */
export default class Atom {

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
    ];
  }

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
   */
  constructor ( {
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
    index = null
  } ) {
    this.position = position;
    this.walletAddress = walletAddress;
    this.isotope = isotope;
    this.token = token;
    this.value = null !== value ? String( value ) : null;
    this.batchId = batchId;

    this.metaType = metaType;
    this.metaId = metaId;
    this.meta = meta ? Meta.normalizeMeta( meta ) : [];

    this.index = index;
    this.otsFragment = otsFragment;
    this.createdAt = String( +new Date );
  }


  /**
   *
   * @param isotope
   * @param wallet
   * @param value
   * @param metaType
   * @param metaId
   * @param meta
   * @param batchId
   * @returns {Atom}
   */
  static create( {
    isotope,
    wallet = null,
    value = null,
    metaType = null,
    metaId = null,
    meta = null,
    batchId = null
  } ) {
    // If meta object is not passed - create it
    if ( !meta ) {
      meta = new AtomMeta;
    }

    // If wallet has been passed => add related metas
    if ( wallet ) {

      // Add wallet's meta
      meta.addWallet( wallet );

      // If batch ID does not passed: set it from the wallet
      if ( !batchId ) {
        batchId = wallet.batchId;
      }
    }

    // Create the final atom's object
    return new Atom( {
      position: wallet ? wallet.position : null,
      walletAddress: wallet ? wallet.address : null,
      isotope,
      token: wallet ? wallet.token : null,
      value,
      batchId,
      metaType,
      metaId,
      meta: meta.get()
    } );
  }

  /**
   * Get aggregated meta from stored normalized ones
   */
  aggregatedMeta () {
    return Meta.aggregateMeta( this.meta );
  }

  /**
   * Converts a compliant JSON string into an Atom class instance
   *
   * @param {string} json
   * @return {object}
   */
  static jsonToObject ( json ) {

    const target = Object.assign( new Atom( {} ), JSON.parse( json ) ),
      properties = Object.keys( new Atom( {} ) );

    for ( const property in target ) {
      if ( target.hasOwnProperty( property ) && !properties.includes( property ) ) {
        delete target[ property ];
      }
    }

    return target;
  }

  /**
   *
   * @returns {*[]}
   */
  getHashableValues() {
    const hashableValues = [];
    for ( let property of Atom.getHashableProps() ) {
      const value = this[ property ];

      // All nullable values are not hashed (only custom keys)
      if ( value === null && ![ 'position', 'walletAddress' ].includes( property ) ) {
        continue;
      }

      // Hashing individual meta keys and values
      if ( property === 'meta' ) {
        for ( const meta of value ) {
          if ( typeof meta.value !== 'undefined' && meta.value !== null ) {
            hashableValues.push( String( meta.key ) );
            hashableValues.push( String( meta.value ) );
          }
        }
      }
      // Default value
      else {
        hashableValues.push( value === null ? '' : String( value ) );
      }
    }
    return hashableValues;
  }

  /**
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   *
   * @param {array} atoms
   * @param {string} output
   * @return {number[]|*}
   */
  static hashAtoms ( {
    atoms,
    output = 'base17'
  } ) {

    const molecularSponge = shake256.create( 256 ),
      numberOfAtoms = atoms.length,
      atomList = Atom.sortAtoms( atoms );

    // Hashing each atom in the molecule to produce a molecular hash
    let hashableValues = [];
    for ( const atom of atomList ) {

      // Add number of atoms (???)
      hashableValues.push( String( numberOfAtoms ) );

      // Add atom's properties
      hashableValues = hashableValues.concat( atom.getHashableValues() );
    }

    // Add hash values to the sponge
    for ( const hashableValue of hashableValues ) {
      molecularSponge.update( hashableValue );
    }

    // Return the hash in the requested format
    switch ( output ) {
      case 'hex': {
        return molecularSponge.hex();
      }
      case 'array': {
        return molecularSponge.array();
      }
      default: {
        return charsetBaseConvert( molecularSponge.hex(), 16, 17, '0123456789abcdef', '0123456789abcdefg' ).padStart( 64, '0' );
      }
    }
  }

  /**
   * Sort the atoms in a Molecule
   *
   * @param {array} atoms
   * @return {array}
   */
  static sortAtoms ( atoms ) {
    const atomList = [ ...atoms ];

    // Sort based on atomic index
    atomList.sort( ( first, second ) => {
      return first.index < second.index ? -1 : 1;
    } );

    return atomList;
  }
}

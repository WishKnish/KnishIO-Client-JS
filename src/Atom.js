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

/**
 * Atom class used to form micro-transactions within a Molecule
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
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   *
   * @param {array} atoms
   * @param {string} output
   * @returns {number[]|*}
   */
  static hashAtoms ( {
    atoms,
    output = 'base17',
    excludeFields = [],
  } ) {

    const molecularSponge = shake256.create( 256 ),
      numberOfAtoms = atoms.length,
      atomList = Atom.sortAtoms( atoms );

    // Hashing each atom in the molecule to produce a molecular hash
    for ( const atom of atomList ) {
      molecularSponge.update( String( numberOfAtoms ) );

      for ( const property in atom ) {
        if ( atom.hasOwnProperty( property ) ) {

          // Old atoms support (without batch_id field)
          if ( [ 'pubkey', 'characters' ].includes( property ) && atom[ property ] === null ) {
            continue;
          }


          // Exclude fields
          excludeFields.push( 'otsFragment' );
          excludeFields.push( 'index' );
          

          // Not hashing OTS fragment or index
          if ( excludeFields.includes( property ) ) {
            continue;
          }

          // Hashing individual meta keys and values
          if ( property === 'meta' ) {
            atom[ property ] = Meta.normalizeMeta( atom[ property ] );
            for ( const meta of atom[ property ] ) {
              if ( typeof meta.value !== 'undefined' && meta.value !== null ) {
                molecularSponge.update( String( meta.key ) );
                molecularSponge.update( String( meta.value ) );
              }
            }
            continue;
          }

          // Hash position, wallet address, or isotope
          if ( [ 'position', 'walletAddress', 'isotope' ].includes( property ) ) {
            molecularSponge.update( atom[ property ] === null ? '' : String( atom[ property ] ) );
            continue;
          }

          // Some other property that we haven't anticipated
          if ( atom[ property ] !== null ) {
            molecularSponge.update( atom[ property ] === null ? '' : String( atom[ property ] ) );
          }
        }
      }
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
      if ( first.index === second.index ) {
        return 0;
      }
      return first.index < second.index ? -1 : 1;
    } );

    return atomList;
  }
}

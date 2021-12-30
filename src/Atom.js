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

  static get create () {
    return {
      C ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'C';

        return new Atom( arguments[ 0 ] );
      },
      I ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'I';

        return new Atom( arguments[ 0 ] );
      },
      M ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'M';

        return new Atom( arguments[ 0 ] );
      },
      T ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'T';

        return new Atom( arguments[ 0 ] );
      },
      U ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'U';

        return new Atom( arguments[ 0 ] );
      },
      V ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'V';

        return new Atom( arguments[ 0 ] );
      },
      R ( {
        position = null,
        walletAddress = null,
        token = null,
        value = null,
        batchId = null,
        metaType = null,
        metaId = null,
        meta = null,
        otsFragment = null,
        index = null
      } ) {
        arguments[ 0 ][ 'isotope' ] = 'R';

        return new Atom( arguments[ 0 ] );
      }
    };
  }

  static get hashSchema () {
    return new Map( [
      [ 'position', null ],
      [ 'walletAddress', null ],
      [ 'isotope', null ],
      [ 'token', null ],
      [ 'value', null ],
      [ 'batchId', null ],
      [ 'metaType', null ],
      [ 'metaId', null ],
      [ 'meta', null ],
      [ 'createdAt', null ]
    ] );
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
   * Populates and returns a schema object according to hash priority list
   * to ensure consistent hashing results across multiple platforms
   *
   * @param {Atom} atom
   *
   * @return {object}
   */
  static molecularHashSchema ( atom ) {
    const schema = Atom.hashSchema;

    for ( const property in atom ) {
      if ( atom.hasOwnProperty( property ) ) {
        if ( schema.has( property ) ) {
          schema.set( property, atom[ property ] );
        }
      }
    }

    return schema;
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
    for ( const atom of atomList ) {

      const molecularHashSchema = Atom.molecularHashSchema( atom );

      molecularSponge.update( String( numberOfAtoms ) );

      for ( const property of molecularHashSchema.keys() ) {

        const value = molecularHashSchema.get( property );

        // Old atoms support (without batch_id field)
        if ( [ 'batchId', 'pubkey', 'characters' ].includes( property ) && value === null ) {
          continue;
        }

        // Hashing individual meta keys and values
        if ( property === 'meta' ) {
          for ( const meta of value ) {
            if ( typeof meta.value !== 'undefined' && meta.value !== null ) {
              molecularSponge.update( String( meta.key ) );
              molecularSponge.update( String( meta.value ) );
            }
          }
          continue;
        }

        // Hash position, wallet address, or isotope
        if ( [ 'position', 'walletAddress', 'isotope' ].includes( property ) ) {
          molecularSponge.update( value === null ? '' : String( value ) );
          continue;
        }

        // Some other property that we haven't anticipated
        if ( value !== null ) {
          molecularSponge.update( String( value ) );
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

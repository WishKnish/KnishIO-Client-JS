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
import CheckMolecule from "./libraries/check";
import AtomsMissingException from "./exception/AtomsMissingException";
import Atom from "./Atom";

const cloneDeep = require( 'lodash.clonedeep' );
const merge = require( 'lodash.merge' );

/**
 * MoleculeStructure class to formalize the creation of Molecules
 */
export default class MoleculeStructure {

  /**
   * Class constructor
   *
   * @property {string | null} cellSlug
   */
  constructor ( cellSlug = null ) {
    this.cellSlugOrigin = this.cellSlug = cellSlug;
  }

  /**
   * Returns the cell slug delimiter
   *
   * @returns {string}
   */
  get cellSlugDelimiter () {
    return '.';
  }

  /**
   * Returns the base cell slug portion
   *
   * @returns {string}
   */
  cellSlugBase () {
    return ( this.cellSlug || '' ).split( this.cellSlugDelimiter )[ 0 ];
  }

  /**
   * @returns {Object}
   */
  toJSON () {
    let clone = cloneDeep( this );
    for ( let key of [ 'remainderWallet', 'secret', 'sourceWallet', 'cellSlugOrigin' ] ) {
      if ( clone.hasOwnProperty( key ) ) {
        delete clone[ key ]
      }
    }
    return clone;
  }

  /**
   * Validates the current molecular structure
   *
   * @param {Wallet} senderWallet
   * @returns {boolean}
   */
  check ( senderWallet = null ) {
    return MoleculeStructure.verify( this, senderWallet )
  }

  /**
   *
   * Verifies a specified molecule
   *
   * @param {Molecule} molecule
   * @param {Wallet} senderWallet
   * @return {boolean}
   */
  static verify ( molecule, senderWallet = null ) {

    return CheckMolecule.molecularHash( molecule )
      && CheckMolecule.ots( molecule )
      && CheckMolecule.index( molecule )
      && CheckMolecule.continuId( molecule )
      && CheckMolecule.isotopeM( molecule )
      && CheckMolecule.isotopeT( molecule )
      && CheckMolecule.isotopeC( molecule )
      && CheckMolecule.isotopeU( molecule )
      && CheckMolecule.isotopeI( molecule )
      && CheckMolecule.isotopeV( molecule, senderWallet );
  }

  /**
   * Converts a JSON object into a Molecule Structure instance
   *
   * @param {string} json
   * @return {Object}
   * @throws {AtomsMissingException}
   */
  static jsonToObject ( json ) {

    const target = merge( new this(), JSON.parse( json ) ),
      properties = Object.keys( new this() );

    if ( !Array.isArray( target.atoms ) ) {
      throw new AtomsMissingException();
    }

    for ( const index in Object.keys( target.atoms ) ) {

      target.atoms[ index ] = Atom.jsonToObject( JSON.stringify( target.atoms[ index ] ) );

      for ( const property of [ 'position', 'walletAddress', 'isotope' ] ) {

        if ( typeof target.atoms[ index ][ property ] === 'undefined'
          || null === target.atoms[ index ][ property ]
        ) {
          throw new AtomsMissingException( 'The required properties of the atom are not filled.' );
        }
      }
    }

    for ( const property in target ) {

      if ( target.hasOwnProperty( property )
        && !properties.includes( property )
      ) {
        delete target[ property ];
      }
    }

    target.atoms = Atom.sortAtoms( target.atoms );

    return target;
  }
}

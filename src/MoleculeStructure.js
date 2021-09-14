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
import CheckMolecule from './libraries/check';
import { deepCloning } from './libraries/array';

/**
 * MoleculeStructure class to formalize the creation of Molecules
 */
export default class MoleculeStructure {

  /**
   * Class constructor
   *
   * @property {string|null} cellSlug
   */
  constructor ( cellSlug = null ) {
    this.cellSlugOrigin = this.cellSlug = cellSlug;
  }

  /**
   * Returns the cell slug delimiter
   *
   * @return {string}
   */
  get cellSlugDelimiter () {
    return '.';
  }

  /**
   * Returns the base cell slug portion
   *
   * @return {string}
   */
  cellSlugBase () {
    return ( this.cellSlug || '' ).split( this.cellSlugDelimiter )[ 0 ];
  }

  /**
   * Returns JSON-ready clone minus protected properties
   *
   * @return {object}
   */
  toJSON () {
    let clone = deepCloning( this );
    for ( let key of [ 'remainderWallet', 'secret', 'sourceWallet', 'cellSlugOrigin' ] ) {
      if ( clone.hasOwnProperty( key ) ) {
        delete clone[ key ];
      }
    }
    return clone;
  }

  /**
   * Validates the current molecular structure
   *
   * @param {Wallet|null} sourceWallet
   * @return {boolean}
   */
  check ( sourceWallet = null ) {
    return MoleculeStructure.verify( {
      molecule: this,
      sourceWallet
    } );
  }

  /**
   *
   * Verifies a specified molecule
   *
   * @param {MoleculeStructure} molecule
   * @param {Wallet|null} sourceWallet
   * @return {boolean}
   */
  static verify ( {
    molecule,
    sourceWallet = null
  } ) {

    return CheckMolecule.molecularHash( molecule )
      && CheckMolecule.ots( molecule )
      && CheckMolecule.index( molecule )
      && CheckMolecule.batchId( molecule )
      && CheckMolecule.continuId( molecule )
      && CheckMolecule.isotopeM( molecule )
      && CheckMolecule.isotopeT( molecule )
      && CheckMolecule.isotopeC( molecule )
      && CheckMolecule.isotopeU( molecule )
      && CheckMolecule.isotopeI( molecule )
      && CheckMolecule.isotopeR( molecule )
      && CheckMolecule.isotopeV( molecule, sourceWallet );
  }
}

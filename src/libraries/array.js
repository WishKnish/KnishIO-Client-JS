/**
 * Split an array into chunks
 *
 * @param {Array} arr
 * @param {number} size
 * @returns {Array}
 */
import Dot from "./Dot";

export function chunkArray ( arr, size ) {

  if ( ! arr.length ) {
    return [];
  }

  return [ arr.slice( 0, size ) ].concat( chunkArray( arr.slice( size ), size ) );
}

/**
 *
 * @param {Molecule} molecule
 */
export function getSignedAtom ( molecule ) {
  return  Dot.get( molecule.atoms, '0' );
}

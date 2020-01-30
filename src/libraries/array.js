/**
 * Split an array into chunks
 *
 * @param {Array} arr
 * @param {number} size
 * @returns {Array}
 */
export function chunkArray ( arr, size ) {

  if ( ! arr.length ) {

    return [];

  }

  return [ arr.slice( 0, size ) ].concat( chunkArray( arr.slice( size ), size ) );

}
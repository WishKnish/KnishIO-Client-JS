/**
 * Split an array into chunks
 *
 * @param {array} arr
 * @param {number} size
 * @returns {array}
 */
export function chunkArray ( arr, size ) {

  if ( !arr.length ) {
    return [];
  }

  return [ arr.slice( 0, size ) ].concat( chunkArray( arr.slice( size ), size ) );
}

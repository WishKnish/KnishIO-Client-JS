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

export function clone (
  o // The only argument passed by user: object to clone
  , h // Cache (organized as array: [key,value,key,value,...])
) {
  let i,
    r,
    x // Property indexer, result, temporary variable
    ,
    t = [ Array, Date, Number, String, Boolean ] // Types to treat in a special way
    ,
    s = Object.prototype.toString; // Shortcut to Object.prototype.toString
  h = h || []; // If cache is not created yet, create it!
  for ( i = 0; i < h.length; i += 2 ) // Search cache for our object
    if ( o === h[ i ] )
      r = h[ i + 1 ];
  if ( !r && o && typeof o == 'object' ) { // Clone o if it is uncached object and not null
    r = {}; // Default result template: plain hash
    for ( i = 0; i < t.length; i++ ) // To handle multiframe environment, search for type by
      if ( s.call( o ) === s.call( //   comparing Object.prototype.toString's of our object
        x = new t[ i ]( o ) ) ) //   and new object x created with the constructor t[i]
                                             // Notice that it will create new Date(o), new String(o)
                                             //   which is good and new Array(o) which is bad
        r = i ? x : []; // If i==0, t==Array. We need to recreate it. Else use x
    h.push( o, r ); // Add object to cache before (!) making recursive call
    for ( i in o ) // Just copy properties recursively
      if ( h.hasOwnProperty.call( o, i ) ) // As o might have key 'hasOwnProperty', use something
        r[ i ] = clone( o[ i ], h ); //   we defined right instead
  }
  return r || o; // Return r if it was found in cache or built in if(){}
}

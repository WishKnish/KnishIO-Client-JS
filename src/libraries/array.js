/**
 * Split an array into chunks
 *
 * @param {array} arr
 * @param {number} size
 * @return {array}
 */
export function chunkArray (arr, size) {
  if (!arr.length) {
    return []
  }

  return [arr.slice(0, size)].concat(chunkArray(arr.slice(size), size))
}

export function deepCloning (
  o // The only argument passed by user: object to clone
  , h // Cache (organized as array: [key,value,key,value,...])
) {
  let i
  let r
  let x // Property indexer, result, temporary variable

  const t = [Array, Date, Number, String, Boolean] // Types to treat in a special way

  const s = Object.prototype.toString // Shortcut to Object.prototype.toString
  h = h || [] // If cache is not created yet, create it!
  // Search cache for our object
  for (i = 0; i < h.length; i += 2) {
    if (o === h[i]) {
      r = h[i + 1]
    }
  }
  // Clone o if it is uncached object and not null
  if (!r && o && typeof o === 'object') {
    r = {} // Default result template: plain hash
    // To handle multiframe environment, search for type by
    for (i = 0; i < t.length; i++) {
      //   comparing Object.prototype.toString's of our object
      //   and new object x created with the constructor t[i]
      // Notice that it will create new Date(o), new String(o)
      //   which is good and new Array(o) which is bad
      if (s.call(o) === s.call(x = new t[i](o))) {
        r = i ? x : []
      }
    } // If i==0, t==Array. We need to recreate it. Else use x
    h.push(o, r) // Add object to cache before (!) making recursive call
    // Just copy properties recursively
    for (i in o) {
      // As o might have key 'hasOwnProperty', use something
      if (h.hasOwnProperty.call(o, i)) {
        r[i] = deepCloning(o[i], h)
      }
    } //   we defined right instead
  }
  return r || o // Return r if it was found in cache or built in if(){}
}

/**
 * @param arrays
 * @returns {*[]}
 */
export function diff (...arrays) {
  return [].concat(...arrays.map((arr, i) => {
    const others = arrays.slice(0)

    others.splice(i, 1)

    const unique = [...new Set([].concat(...others))]

    return arr.filter(item => !unique.includes(item))
  }))
}

/**
 *
 * @param arrays
 * @return {*[]}
 */
export function intersect (...arrays) {
  return arrays.reduce((first, second) => first.filter(item => second.includes(item)))
}

/**
 * Array utility functions
 */

/**
 * Split an array into chunks
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  if (!arr.length) {
    return []
  }

  return [arr.slice(0, size)].concat(chunkArray(arr.slice(size), size))
}

/**
 * Deep clone an object
 */
export function deepCloning<T>(
  o: T, // The object to clone
  h: unknown[] = [] // Cache (organized as array: [key,value,key,value,...])
): T {
  let i: number
  let r: unknown
  let x: unknown // Property indexer, result, temporary variable

  const t = [Array, Date, Number, String, Boolean] // Types to treat in a special way

  const s = Object.prototype.toString // Shortcut to Object.prototype.toString
  
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
      if (s.call(o) === s.call(x = new (t[i] as any)(o))) {
        r = i ? x : []
      }
    } // If i==0, t==Array. We need to recreate it. Else use x
    
    h.push(o, r) // Add object to cache before (!) making recursive call
    
    // Just copy properties recursively
    for (const key in o) {
      // As o might have key 'hasOwnProperty', use something
      if (Object.prototype.hasOwnProperty.call(o, key)) {
        (r as any)[key] = deepCloning((o as any)[key], h)
      }
    } //   we defined right instead
  }
  
  return (r || o) as T // Return r if it was found in cache or built in if(){}
}

/**
 * Get difference between arrays
 */
export function diff<T>(...arrays: T[][]): T[] {
  return ([] as T[]).concat(...arrays.map((arr, i) => {
    const others = arrays.slice(0)

    others.splice(i, 1)

    const unique = [...new Set(([] as T[]).concat(...others))]

    return arr.filter(item => !unique.includes(item))
  }))
}

/**
 * Get intersection of arrays
 */
export function intersect<T>(...arrays: T[][]): T[] {
  return arrays.reduce((first, second) => first.filter(item => second.includes(item)))
}
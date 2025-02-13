/**
 * Split an array into chunks
 * @template T The type of array elements
 * @param {T[]} arr - The array to chunk
 * @param {number} size - The size of each chunk
 * @return {T[][]} Array of chunks
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  if (!arr.length) {
    return []
  }

  return [arr.slice(0, size)].concat(chunkArray(arr.slice(size), size))
}

/**
 * Find elements that are unique to each array
 * @template T The type of array elements
 * @param {Array<T[]>} arrays - Arrays to compare
 * @return {T[]} Array of unique elements
 */
export function diff<T>(...arrays: T[][]): T[] {
  return [].concat(...arrays.map((arr, i) => {
    const others = arrays.slice(0)
    others.splice(i, 1)

    const unique = [...new Set([].concat(...others))]
    return arr.filter(item => !unique.includes(item))
  }))
}

/**
 * Find elements that exist in all arrays
 * @template T The type of array elements
 * @param {Array<T[]>} arrays - Arrays to intersect
 * @return {T[]} Array of common elements
 */
export function intersect<T>(...arrays: T[][]): T[] {
  return arrays.reduce((first, second) =>
    first.filter(item => second.includes(item))
  )
}

/**
 * Utility class for accessing nested object properties using dot notation
 */
export default class Dot {

  static arr: string[]
  static key: string|number
  static __nextKey: number
  static __next: boolean

  /**
   * Initialize the Dot utility with the given object and key path
   * @param {object|array} obj - The object or array to traverse
   * @param {string} keys - The dot-notated string of keys
   * @private
   */
  static __init (obj: object|any[], keys: string) {
    this.arr = String(keys).split('.')
    this.key = this.arr.shift()

    // Convert to number if the key is a valid integer
    const numberKey = Number(this.key)
    if (Number.isInteger(numberKey)) {
      this.key = numberKey
    }

    this.__nextKey = this.arr.length
    this.__next = this.__tic(obj)
  }

  /**
   * Check if the current key exists in the object
   * @param {object|array} obj - The object or array to check
   * @return {boolean} - Whether the key exists
   * @private
   */
  static __tic (obj: object|any[]): boolean {
    if (!Array.isArray(obj) && !(obj instanceof Object)) {
      return false
    }

    return typeof obj[this.key] !== 'undefined'
  }

  /**
   * Check if a nested property exists in an object using dot notation
   * @param {object|array} obj - The object or array to search
   * @param {string} keys - The path to the property, using dot notation
   * @return {boolean} - True if the property exists, false otherwise
   */
  static has (obj: object|any[], keys: string): boolean {
    this.__init(obj, keys)

    if (!this.__next) {
      return false
    }
    if (this.__nextKey === 0) {
      return true
    }

    return this.has(obj[this.key], this.arr.join('.'))
  }

  /**
   * Get a nested property from an object using dot notation
   * @param {object|array} obj - The object or array to search
   * @param {string} keys - The path to the property, using dot notation
   * @param {*} [def=null] - The default value to return if the property is not found
   * @return {*} - The value of the property, or the default value if not found
   */
  static get (obj: object|any[], keys: string, def: any = null): any {
    this.__init(obj, keys)

    if (!this.__next) {
      return def
    }
    if (this.__nextKey === 0) {
      return obj[this.key]
    }

    return this.get(obj[this.key], this.arr.join('.'), def)
  }

  /**
   * Set a nested property in an object using dot notation
   * @param {object|array} obj - The object or array to modify
   * @param {string} keys - The path to the property, using dot notation
   * @param {*} value - The value to set
   * @return {object|array} - The modified object or array
   */
  static set (obj: object|any[], keys: string, value: any): object|any[] {
    const parts = keys.split('.')
    let current = obj
    const lastIndex = parts.length - 1

    for (let i = 0; i < lastIndex; i++) {
      const key = parts[i]
      const numberKey = Number(key)
      const useNumberKey = Number.isInteger(numberKey)

      if (!(useNumberKey ? numberKey : key in current)) {
        current[useNumberKey ? numberKey : key] = parts[i + 1].match(/^\d+$/) ? [] : {}
      }
      current = current[useNumberKey ? numberKey : key]
    }

    const lastKey = parts[lastIndex]
    const lastNumberKey = Number(lastKey)
    current[Number.isInteger(lastNumberKey) ? lastNumberKey : lastKey] = value

    return obj
  }
}

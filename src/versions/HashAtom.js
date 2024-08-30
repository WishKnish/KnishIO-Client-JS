export default class HashAtom {
  /**
   *
   * @param {Atom} atom
   */
  static create (atom) {
    const parameters = {}

    for (const key of Object.keys(atom)) {
      if (Object.prototype.hasOwnProperty.call(atom, key)) {
        parameters[key] = atom[key]
      }
    }

    return new this(parameters)
  }

  /**
   *
   * @param {Object|Array} object
   * @returns {Object|Array[]}
   */
  static structure (object) {
    switch (Object.prototype.toString.call(object)) {
      case '[object Array]': {
        const result = []
        for (const key in object) {
          result.push(HashAtom.isStructure(object[key]) ? HashAtom.structure(object[key]) : object[key])
        }

        return result
      }

      case '[object Object]': {
        const result = []
        const keys = Object.keys(object).sort((first, second) => {
          if (first === second) {
            return 0
          }
          return (first < second) ? -1 : 1
        })

        for (const key of keys) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            const item = {}
            item[key] = HashAtom.isStructure(object[key]) ? HashAtom.structure(object[key]) : object[key]
            result.push(item)
          }
        }

        if (result.length > 0) {
          return result
        }

        break
      }
    }

    return object
  }

  /**
   *
   * @param {*} structure
   * @returns {boolean}
   */
  static isStructure (structure) {
    return ['[object Object]', '[object Array]'].includes(Object.prototype.toString.call(structure))
  }

  /**
   *
   * @returns {Object[]}
   */
  view () {
    return HashAtom.structure(this)
  }
}

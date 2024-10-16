import Base64 from './Base64'
import Base58 from './Base58'
import base from 'base-x'

export default class BaseX {
  /**
   * @param {object} options
   */
  constructor (options = {}) {
    const basex = ['BASE2', 'BASE8', 'BASE11', 'BASE36', 'BASE62', 'BASE67']
    const characters = ['BITCOIN', 'FLICKR', 'RIPPLE', 'IPFS']
    const base64 = ['BASE64']

    this.$options = Object.assign({ characters: 'BASE64' }, options)
    this.$encoder = new Base58()

    if (base64.includes(this.$options.characters)) {
      this.$encoder = new Base64()
    } else if (basex.includes(this.$options.characters)) {
      this.$encoder = base(this[this.$options.characters])
    } else if (characters.includes(this.$options.characters)) {
      this.$encoder = new Base58(this.$options)
    }
  }

  /**
   * @return {string}
   * @constructor
   */
  get BASE2 () {
    return '01'
  }

  /**
   * @return {string}
   * @constructor
   */
  get BASE8 () {
    return '01234567'
  }

  /**
   * @return {string}
   * @constructor
   */
  get BASE11 () {
    return '0123456789a'
  }

  /**
   * @return {string}
   * @constructor
   */
  get BASE36 () {
    return '0123456789abcdefghijklmnopqrstuvwxyz'
  }

  /**
   * @return {string}
   * @constructor
   */
  get BASE62 () {
    return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  }

  /**
   * @return {string}
   * @constructor
   */
  get BASE67 () {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~'
  }

  /**
   * @param {Buffer|ArrayBuffer|Uint8Array} data
   * @return {string}
   */
  encode (data) {
    // If data is already a Uint8Array, proceed as-is; otherwise, convert it
    const uint8Array = data instanceof Uint8Array ? data : new Uint8Array(data)

    // Convert the Uint8Array to a binary string
    const binaryString = String.fromCharCode(...uint8Array)

    // Encode using your existing encoder
    return this.$encoder.encode(binaryString)
  }

  /**
   * @param {string} data
   * @return {Buffer|ArrayBuffer|Uint8Array}
   */
  decode (data) {
    return this.$encoder.decode(data)
  }
}

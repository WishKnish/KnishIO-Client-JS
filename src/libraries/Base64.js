export default class Base64 {
  /**
   * @param {Buffer|ArrayBuffer|Uint8Array} data
   * @return {string}
   */
  static encode (data) {
    // Convert the Uint8Array to a binary string
    const binaryString = String.fromCharCode(...data)

    // Encode the binary string as base64
    return btoa(binaryString)
  }

  /**
   * @param {string} data
   * @return {Buffer|ArrayBuffer|Uint8Array}
   */
  static decode (data) {
    // Decode the base64 input
    const binaryString = atob(data)

    // Convert the binary string to a Uint8Array
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes
  }

  /**
   * @param {Buffer|ArrayBuffer|Uint8Array} data
   * @return {string}
   */
  encode (data) {
    return Base64.encode(data)
  }

  /**
   * @param {string} data
   * @return {Buffer|ArrayBuffer|Uint8Array}
   */
  decode (data) {
    return Base64.decode(data)
  }
}

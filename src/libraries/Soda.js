/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
 */
import BaseX from './BaseX'
import { box } from 'tweetnacl'
import {
  open,
  seal
} from 'tweetnacl-sealedbox-js'
import JsSHA from 'jssha'

export default class Soda {
  /**
   * @param {string|null} characters
   */
  constructor (characters = null) {
    this.base = new BaseX({ characters: characters || 'BASE64' })
  }

  /**
   * @param {array|object} message
   * @param {string} key
   * @return {string}
   */
  encrypt (message, key) {
    // Convert the message to a JSON string
    const jsonString = JSON.stringify(message)

    // Encode the JSON string as UTF-8
    const encoder = new TextEncoder()
    const utf8Data = encoder.encode(jsonString)

    // Assuming that the seal function expects a Uint8Array or similar typed array
    const encryptedData = seal(utf8Data, this.decode(key))

    return this.encode(encryptedData)
  }

  /**
   * @param {string} decrypted
   * @param {string} privateKey
   * @param {string} publicKey
   * @return {null|any}
   */
  decrypt (decrypted, privateKey, publicKey) {
    try {
      // Assuming that the open function returns an ArrayBuffer or typed array
      const binaryData = open(this.decode(decrypted), this.decode(publicKey), this.decode(privateKey))

      // Convert the binary data to a UTF-8 string
      const decoder = new TextDecoder()
      const decodedString = decoder.decode(binaryData)

      return JSON.parse(decodedString)
    } catch (e) {
      return null
    }
  }

  /**
   *
   * @param {string} key
   * @return {string}
   */
  generatePrivateKey (key) {
    const sponge = new JsSHA('SHAKE256', 'TEXT')
    sponge.update(key)
    const digest = sponge.getHash('HEX', { outputLen: box.secretKeyLength * 8 })

    // Convert the hex digest to a Uint8Array
    const bytes = new Uint8Array(digest.length / 2)
    for (let i = 0; i < digest.length; i += 2) {
      bytes[i / 2] = parseInt(digest.substr(i, 2), 16)
    }

    // Assuming this.base.encode can handle a Uint8Array
    return this.base.encode(bytes)
  }

  /**
   * @param {string} key
   * @return {string}
   */
  generatePublicKey (key) {
    const boxKey = box.keyPair.fromSecretKey(this.decode(key))
    return this.encode(boxKey.publicKey)
  }

  /**
   * @param {string} key
   * @return {string}
   */
  shortHash (key) {
    const sponge = new JsSHA('SHAKE256', 'TEXT')
    sponge.update(key)
    const digest = sponge.getHash('HEX', { outputLen: 64 })

    // Convert the hex digest to a Uint8Array
    const bytes = new Uint8Array(digest.length / 2)
    for (let i = 0; i < digest.length; i += 2) {
      bytes[i / 2] = parseInt(digest.substr(i, 2), 16)
    }

    // Assuming this.base.encode can handle a Uint8Array
    return this.base.encode(bytes)
  }

  /**
   * @param {string} data
   * @return {string|Buffer}
   */
  decode (data) {
    return this.base.decode(data)
  }

  /**
   * @param {string|Buffer|Uint8Array} data
   * @return {string}
   */
  encode (data) {
    return this.base.encode(data)
  }
}

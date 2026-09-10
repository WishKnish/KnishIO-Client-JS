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

import Wallet from './Wallet.js'

/**
 *
 */
export default class AuthToken {
  /**
   *
   * @param {string} token
   * @param {number} expiresAt
   * @param {boolean} encrypt
   * @param {string} pubkey
   */
  constructor ({
    token,
    expiresAt,
    encrypt,
    pubkey
  }) {
    this.$__token = token
    this.$__expiresAt = expiresAt
    this.$__pubkey = pubkey
    this.$__encrypt = encrypt
  }

  /**
   *
   * @param data
   * @param wallet
   * @returns {AuthToken}
   */
  static create (data, wallet) {
    const authToken = new AuthToken(data)
    authToken.setWallet(wallet)
    return authToken
  }

  /**
   * ML-KEM parameter set a restored session must use, resolved in three tiers:
   * an explicit snapshot field, then the stored validator key's length, then ML-KEM-768.
   *
   * The final tier is deliberately NOT the constructor default. A snapshot with neither an
   * explicit field nor a recognisable key can only have come from a pre-bump build, and every
   * pre-bump build was 768-only — defaulting to 1024 would make the restored wallet advertise
   * a public key the validator never recorded for that token.
   *
   * @param {object} snapshot
   * @return {number}
   */
  static resolveMlKemParameterSet (snapshot) {
    const explicit = snapshot.wallet && snapshot.wallet.mlKemParameterSet
    if (explicit) {
      return Number(explicit)
    }
    return Wallet.mlKemParameterSetFromPubkey(snapshot.pubkey) || 768
  }

  /**
   *
   * @param {object} snapshot
   * @param {string} secret
   * @return {AuthToken}
   */
  static restore (snapshot, secret) {
    const wallet = new Wallet({
      secret,
      token: 'AUTH',
      position: snapshot.wallet.position,
      characters: snapshot.wallet.characters,
      mlKemParameterSet: AuthToken.resolveMlKemParameterSet(snapshot)
    })
    return AuthToken.create({
      token: snapshot.token,
      expiresAt: snapshot.expiresAt,
      pubkey: snapshot.pubkey,
      encrypt: snapshot.encrypt
    }, wallet)
  }

  /**
   *
   * @param {Wallet} wallet
   */
  setWallet (wallet) {
    this.$__wallet = wallet
  }

  /**
   * Get a wallet
   * @return {Wallet}
   */
  getWallet () {
    return this.$__wallet
  }

  /**
   *
   * @return {{wallet: {characters, position, mlKemParameterSet}, encrypt, expiresAt, token, pubkey}}
   */
  getSnapshot () {
    return {
      token: this.$__token,
      expiresAt: this.$__expiresAt,
      pubkey: this.$__pubkey,
      encrypt: this.$__encrypt,
      wallet: {
        position: this.$__wallet.position,
        characters: this.$__wallet.characters,
        mlKemParameterSet: this.$__wallet.mlKemParameterSet
      }
    }
  }

  /**
   *
   * @return {string}
   */
  getToken () {
    return this.$__token
  }

  /**
   *
   * @return {string}
   */
  getPubkey () {
    return this.$__pubkey
  }

  /**
   *
   * @return {number}
   */
  getExpireInterval () {
    return (this.$__expiresAt * 1000) - Date.now()
  }

  /**
   *
   * @return {boolean}
   */
  isExpired () {
    return !this.$__expiresAt || this.getExpireInterval() < 0
  }

  /**
   * Get auth data for the final GraphQL client
   * @return {{wallet: Wallet, token: string, pubkey: string}}
   */
  getAuthData () {
    return {
      token: this.getToken(),
      pubkey: this.getPubkey(),
      wallet: this.getWallet()
    }
  }
}

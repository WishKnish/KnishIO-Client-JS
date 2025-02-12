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

import Wallet from './Wallet'

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
      characters: snapshot.wallet.characters
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
   * @return {{wallet: {characters, position}, encrypt, expiresAt, token, pubkey}}
   */
  getSnapshot () {
    return {
      token: this.$__token,
      expiresAt: this.$__expiresAt,
      pubkey: this.$__pubkey,
      encrypt: this.$__encrypt,
      wallet: {
        position: this.$__wallet.position,
        characters: this.$__wallet.characters
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

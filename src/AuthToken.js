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

import Wallet from "@wishknish/knishio-client-js/src/Wallet";


/**
 *
 */
export default class AuthToken {


  /**
   *
   * @param data
   * @param wallet
   * @returns {AuthToken}
   */
  static create( data, wallet ) {
    let authToken = new AuthToken( data );
    authToken.setWallet( wallet );
    return authToken;
  }


  /**
   *
   * @param snapshot
   * @returns {AuthToken}
   */
  static restore( snapshot ) {
    console.error( snapshot );
    let wallet = new Wallet( {
      secret: snapshot.wallet.secret,
      token: 'AUTH',
      position: snapshot.wallet.position,
      characters: snapshot.wallet.characters,
    } );
    return AuthToken.create( {
      token: snapshot.token,
      expiresAt: snapshot.expiresAt,
      time: snapshot.time,
      pubkey: snapshot.pubkey,
      encrypt: snapshot.encrypt,
    }, wallet );
  }


  /**
   *
   * @param token
   * @param expiresAt
   * @param time
   * @param pubkey
   * @param encrypt
   * @param wallet
   */
  constructor ( {
    token,
    expiresAt,
    time,
    pubkey,
    encrypt,
  } ) {
    this.$__token = token;
    this.$__expiresAt = expiresAt;
    this.$__time = time;
    this.$__pubkey = pubkey;
    this.$__encrypt = encrypt;
  }


  /**
   *
   * @param wallet
   */
  setWallet( wallet ) {
    this.$__wallet = wallet;
  }

  /**
   *
   * @returns {{wallet: {characters, secret, position}, encrypt, time, expiresAt, token, pubkey}}
   */
  getSnapshot() {
    return {
      token: this.$__token,
      expiresAt: this.$__expiresAt,
      time: this.$__time,
      pubkey: this.$__pubkey,
      encrypt: this.$__encrypt,
      wallet: {
        secret: this.$__wallet.secret,
        position: this.$__wallet.position,
        characters: this.$__wallet.characters,
      },
    };
  }


  /**
   *
   * @returns {*}
   */
  getToken() {
    return this.$__token;
  }

  /**
   *
   * @returns {number}
   */
  getExpireInterval() {
    return ( this.$__expiresAt * 1000 ) - Date.now();
  }

  /**
   *
   * @returns {boolean}
   */
  isExpired() {
    return !this.$__expiresAt || this.getExpireInterval() < 0;
  }

}

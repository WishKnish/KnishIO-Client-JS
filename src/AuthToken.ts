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
import type { AuthTokenData, AuthTokenSnapshot } from './types'

/**
 * Authentication token class for managing API authorization
 */
export default class AuthToken {
  private $__token: string
  private $__expiresAt: number | undefined
  private $__pubkey: string
  private $__encrypt: boolean | undefined
  private $__wallet?: Wallet

  /**
   * Creates an AuthToken instance
   */
  constructor (data: AuthTokenData) {
    this.$__token = data.token
    this.$__expiresAt = data.expiresAt ? 
      (typeof data.expiresAt === 'string' ? parseInt(data.expiresAt, 10) : data.expiresAt) : 
      undefined
    this.$__pubkey = data.pubkey
    this.$__encrypt = data.encrypt ?? false
  }

  /**
   * Creates an AuthToken with associated wallet
   */
  static create (data: AuthTokenData, wallet: Wallet): AuthToken {
    const authToken = new AuthToken(data)
    authToken.setWallet(wallet)
    return authToken
  }

  /**
   * Restores an AuthToken from a snapshot with secret
   */
  static restore(snapshot: AuthTokenSnapshot, secret: string): AuthToken {
    const wallet = new Wallet({
      secret,
      token: 'AUTH',
      position: snapshot.wallet?.position ?? null,
      characters: snapshot.wallet?.characters ?? null
    })
    return AuthToken.create({
      token: snapshot.token || '',
      expiresAt: snapshot.expiresAt,
      pubkey: snapshot.pubkey || '',
      encrypt: snapshot.encrypt
    }, wallet)
  }

  /**
   * Sets the associated wallet
   */
  setWallet(wallet: Wallet): void {
    this.$__wallet = wallet
  }

  /**
   * Gets the associated wallet
   */
  getWallet(): Wallet | undefined {
    return this.$__wallet
  }

  /**
   * Gets a snapshot of the token for serialization
   */
  getSnapshot(): AuthTokenSnapshot {
    if (!this.$__wallet) {
      throw new Error('Wallet not set on AuthToken')
    }
    return {
      getToken: () => this.$__token,
      getAuthData: () => ({
        token: this.$__token,
        pubkey: this.$__pubkey,
        expiresAt: this.$__expiresAt ? String(this.$__expiresAt) : undefined,
        encrypt: this.$__encrypt
      }),
      token: this.$__token,
      expiresAt: this.$__expiresAt,
      pubkey: this.$__pubkey,
      encrypt: this.$__encrypt ?? false,
      wallet: {
        position: this.$__wallet.position || '',
        characters: this.$__wallet.characters || ''
      }
    }
  }

  /**
   * Gets the token string
   */
  getToken(): string {
    return this.$__token
  }

  /**
   * Gets the public key
   */
  getPubkey(): string {
    return this.$__pubkey
  }

  /**
   * Gets the time remaining until expiration in milliseconds
   */
  getExpireInterval(): number {
    return ((this.$__expiresAt ?? 0) * 1000) - Date.now()
  }

  /**
   * Checks if the token is expired
   */
  isExpired(): boolean {
    return !this.$__expiresAt || this.getExpireInterval() < 0
  }

  /**
   * Gets auth data for the GraphQL client
   */
  getAuthData(): { token: string; pubkey: string; wallet?: Wallet } {
    const wallet = this.getWallet()
    const result: { token: string; pubkey: string; wallet?: Wallet } = {
      token: this.getToken(),
      pubkey: this.getPubkey()
    }
    if (wallet) {
      result.wallet = wallet
    }
    return result
  }
}
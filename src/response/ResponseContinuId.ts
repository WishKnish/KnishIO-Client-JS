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
                      (((((((((((((((((((              ((((((((((((((
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

import Response from './Response'
import Wallet from '../Wallet'
import type { ResponseOptions } from '../types/response/interfaces'

/**
 * ContinuID data interface as returned from the GraphQL API
 */
interface ContinuIdData {
  tokenSlug: string;
  address: string;
  position: string;
  bundleHash: string;
  batchId: string;
  characters: string;
  pubkey: string;
  amount: number;
}

/**
 * Response handler for ContinuID queries
 * 
 * This class processes responses from ContinuID queries, which retrieve
 * identity wallet information from the Knish.IO network. ContinuID wallets
 * are special identity tokens that represent user identities on the network.
 */
export default class ResponseContinuId extends Response {
  /**
   * Creates a new ResponseContinuId instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.ContinuId'
    })
  }

  /**
   * Returns a wallet instance populated with ContinuID data
   * 
   * Creates a new Wallet instance from the ContinuID response data,
   * populating it with identity information including address, balance,
   * and cryptographic keys.
   * 
   * @returns A Wallet instance with ContinuID data, or null if no data available
   */
  payload(): Wallet | null {
    let wallet: Wallet | null = null

    const continuId = this.data() as ContinuIdData | null

    if (continuId) {
      wallet = new Wallet({
        secret: null,
        token: continuId.tokenSlug
      })
      
      // Populate wallet with ContinuID-specific properties
      wallet.address = continuId.address
      wallet.position = continuId.position
      wallet.bundle = continuId.bundleHash
      wallet.batchId = continuId.batchId
      wallet.characters = continuId.characters
      wallet.pubkey = continuId.pubkey
      wallet.balance = continuId.amount * 1.0
    }

    return wallet
  }
}

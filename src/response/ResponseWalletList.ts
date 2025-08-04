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
import TokenUnit from '../TokenUnit'
import type { ResponseOptions } from '../types/response/interfaces'

/**
 * Token information interface
 */
interface TokenInfo {
  name: string;
  amount: number;
  supply: number;
  fungibility: string;
}

/**
 * Token unit data interface
 */
interface TokenUnitData {
  [key: string]: unknown;
}

/**
 * Trade rate data interface
 */
interface TradeRateData {
  tokenSlug: string;
  amount: number;
}

/**
 * Raw wallet data interface from GraphQL
 */
interface RawWalletData {
  position: string | null;
  bundleHash: string;
  tokenSlug: string;
  batchId: string;
  characters: string;
  address: string;
  token?: TokenInfo;
  tokenUnits: TokenUnitData[];
  tradeRates: TradeRateData[];
  amount: number | string;
  pubkey: string;
  createdAt: string;
  [key: string]: unknown;
}

/**
 * Parameters for converting raw data to client wallet
 */
interface ToClientWalletParams {
  data: RawWalletData;
  secret?: string | null;
}

/**
 * Response handler for WalletList queries
 * 
 * This class processes responses from WalletList queries, which retrieve
 * lists of wallet information from the Knish.IO network. It handles conversion
 * of raw GraphQL data into structured Wallet instances with full token and
 * trade rate information.
 */
export default class ResponseWalletList extends Response {
  /**
   * Creates a new ResponseWalletList instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.Wallet'
    })
  }

  /**
   * Converts raw wallet data from GraphQL into a Knish.IO client Wallet instance
   * 
   * This static method handles the complex transformation of GraphQL wallet data
   * into a properly configured Wallet instance, including:
   * - Token information and metadata
   * - Token units and trade rates
   * - Balance and cryptographic keys
   * - Creation timestamps
   * 
   * @param params - Conversion parameters
   * @param params.data - Raw wallet data from GraphQL
   * @param params.secret - Optional wallet secret for key derivation
   * @returns A configured Wallet instance
   */
  static toClientWallet({ data, secret = null }: ToClientWalletParams): Wallet {
    let wallet: Wallet

    // Create wallet based on whether position is available
    if (data.position === null || typeof data.position === 'undefined') {
      // Create from bundle data when position is not available
      wallet = Wallet.create({
        bundle: data.bundleHash,
        token: data.tokenSlug,
        batchId: data.batchId,
        characters: data.characters
      })
    } else {
      // Create from position when available
      wallet = new Wallet({
        secret,
        token: data.tokenSlug,
        position: data.position,
        batchId: data.batchId,
        characters: data.characters
      })
      wallet.address = data.address
      wallet.bundle = data.bundleHash
    }

    // Token information is stored in wallet metadata, not as direct properties
    // The Wallet class doesn't have tokenName, tokenAmount, tokenSupply, tokenFungibility properties

    // Add token units
    if (data.tokenUnits.length) {
      for (const tokenUnitData of data.tokenUnits) {
        // Ensure TokenUnitData has required properties for GraphQL format
        const graphQLData = {
          id: (tokenUnitData as any).id || '',
          name: (tokenUnitData as any).name || '',
          ...tokenUnitData
        }
        wallet.tokenUnits.push(TokenUnit.createFromGraphQL(graphQLData))
      }
    }

    // Add trade rates
    if (data.tradeRates.length) {
      for (const tradeRate of data.tradeRates) {
        wallet.tradeRates[tradeRate.tokenSlug] = tradeRate.amount
      }
    }

    // Set additional wallet properties
    wallet.balance = Number(data.amount)
    wallet.pubkey = data.pubkey
    // The Wallet class doesn't have a createdAt property

    return wallet
  }

  /**
   * Returns a list of Wallet class instances from the response data
   * 
   * @param secret - Optional secret for wallet key derivation
   * @returns Array of Wallet instances or null if no data available
   */
  getWallets(secret: string | null = null): Wallet[] | null {
    const list = this.data() as RawWalletData[] | null

    if (!list) {
      return null
    }

    const wallets: Wallet[] = []

    for (const data of list) {
      wallets.push(ResponseWalletList.toClientWallet({
        data,
        secret
      }))
    }

    return wallets
  }

  /**
   * Returns the response payload as a list of Wallet instances
   * 
   * @returns Array of Wallet instances or null if no data available
   */
  payload(): Wallet[] | null {
    return this.getWallets()
  }
}

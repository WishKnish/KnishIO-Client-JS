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
                 ################# ####
                ################# ######
               ################# #######
              ################# #########
             ################# ###########
            ################# #############
           ################# ###############
          ################# #################
         ################# ###################
        ################# #####################
       ################# #######################
      ################# #########################
     ################# ###########################
    ################# #############################
   ################# ###############################
  ################# #################################
 ################# ###################################
################# #####################################

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import Response from './Response'
import type Query from '../query/Query'
import type { GraphQLResponse } from '../types/graphql'
import ResponseWalletList from './ResponseWalletList'

/**
 * Constructor parameters for ResponseBalance
 */
export interface ResponseBalanceParams {
  query: Query;
  json: GraphQLResponse;
}

/**
 * Response for balance query
 */
export default class ResponseBalance extends Response {
  /**
   * Class constructor
   * @param query - The originating query
   * @param json - The GraphQL response data
   */
  constructor ({
    query,
    json
  }: ResponseBalanceParams) {
    super({
      query,
      json: json as any,
      dataKey: 'data.Balance'
    })
  }

  /**
   * Returns a wallet with balance
   * @returns Wallet instance or null if no valid data
   */
  payload (): any | null {
    const walletData = this.data()

    if (!walletData || !(walletData as any).bundleHash || !(walletData as any).tokenSlug) {
      return null
    }

    // Ensure all required RawWalletData properties are present
    const enrichedWalletData = {
      position: null,
      bundleHash: (walletData as any).bundleHash || '',
      tokenSlug: (walletData as any).tokenSlug || '',
      batchId: (walletData as any).batchId || '',
      characters: (walletData as any).characters || '',
      address: (walletData as any).address || '',
      tokenUnits: (walletData as any).tokenUnits || [],
      tradeRates: (walletData as any).tradeRates || [],
      amount: (walletData as any).amount || 0,
      pubkey: (walletData as any).pubkey || '',
      createdAt: (walletData as any).createdAt || new Date().toISOString(),
      ...walletData
    }

    return ResponseWalletList.toClientWallet({
      data: enrichedWalletData
    })
  }
}
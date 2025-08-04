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
import Meta from '../Meta'
import type { ResponseOptions } from '../types/response/interfaces'
import type { NormalizedMeta } from '../types/meta'

/**
 * Wallet bundle data interface
 */
interface WalletBundleData {
  bundleHash: string;
  metas: unknown[];
  [key: string]: unknown;
}

/**
 * Processed wallet bundle data interface
 */
interface ProcessedWalletBundleData {
  bundleHash: string;
  metas: unknown;
  [key: string]: unknown;
}

/**
 * Aggregated wallet bundles interface
 */
type WalletBundleAggregate = Record<string, ProcessedWalletBundleData>

/**
 * Response handler for WalletBundle queries
 * 
 * This class processes responses from WalletBundle queries, which retrieve
 * wallet bundle information including associated metadata from the Knish.IO network.
 * It handles metadata aggregation and normalization for easier consumption.
 */
export default class ResponseWalletBundle extends Response {
  /**
   * Creates a new ResponseWalletBundle instance
   * 
   * @param options - Response configuration options
   * @param options.query - The originating query instance
   * @param options.json - The raw JSON response from the GraphQL endpoint
   */
  constructor({ query, json }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.WalletBundle'
    })
  }

  /**
   * Returns wallet bundles with normalized metadata, keyed by bundle hash
   * 
   * Processes the bundle data by:
   * - Aggregating metadata using Meta.aggregateMeta()
   * - Organizing bundles by their bundle hash for easy lookup
   * - Returning a structured object with bundle hashes as keys
   * 
   * @returns Aggregated wallet bundle data or null if no data available
   */
  payload(): WalletBundleAggregate | null {
    const bundleData = this.data() as WalletBundleData[] | null

    if (!bundleData || bundleData.length === 0) {
      return null
    }

    const aggregate: WalletBundleAggregate = {}

    bundleData.forEach(bundle => {
      // Aggregate metadata using the Meta utility
      const processedBundle: ProcessedWalletBundleData = {
        ...bundle,
        metas: Meta.aggregateMeta(bundle.metas as NormalizedMeta[])
      }
      
      // Key by bundle hash for easy lookup
      aggregate[bundle.bundleHash] = processedBundle
    })

    return aggregate
  }
}

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
import Query from './Query'
import { gql } from '@apollo/client/core'
import ResponseAtom from '../response/ResponseAtom'

/**
 * Query for getting the balance of a given wallet or token slug
 */
export default class QueryAtom extends Query {
  /**
   * Class constructor
   *
   * @param apolloClient
   */
  constructor (apolloClient) {
    super(apolloClient)

    this.$__query = gql`query(
      $molecularHashes: [String!],
      $bundleHashes: [String!],
      $positions:[String!],
      $walletAddresses: [String!],
      $isotopes: [String!],
      $tokenSlugs: [String!],
      $cellSlugs: [String!],
      $batchIds: [String!],
      $values: [String!],
      $metaTypes: [String!],
      $metaIds: [String!],
      $indexes: [String!],
      $filter: [ MetaFilter! ],
      $latest: Boolean,
      $queryArgs: QueryArgs,
    ) {
      Atom(
        molecularHashes: $molecularHashes,
        bundleHashes: $bundleHashes,
        positions: $positions,
        walletAddresses: $walletAddresses,
        isotopes: $isotopes,
        tokenSlugs: $tokenSlugs,
        cellSlugs: $cellSlugs,
        batchIds: $batchIds,
        values: $values,
        metaTypes: $metaTypes,
        metaIds: $metaIds,
        indexes: $indexes,
        filter: $filter,
        latest: $latest,
        queryArgs: $queryArgs,
      ) {
        instances {
          position,
          walletAddress,
          tokenSlug,
          isotope,
          index,
          molecularHash,
          metaId,
          metaType,
          metasJson,
          batchId,
          value,
          bundleHashes,
          cellSlugs,
          createdAt,
          otsFragment
        },
        paginatorInfo {
          currentPage,
          total
        }
      }
    }`
  }

  /**
   * Queries Knish.IO Atoms
   *
   * @param {string[]} molecularHashes
   * @param {string} molecularHash
   * @param {string[]} bundleHashes
   * @param {string} bundleHash
   * @param {string[]} positions
   * @param {string} position
   * @param {string[]} walletAddresses
   * @param {string} walletAddress
   * @param {string[]} isotopes
   * @param {string} isotope
   * @param {string[]} tokenSlugs
   * @param {string} tokenSlug
   * @param {string[]} cellSlugs
   * @param {string} cellSlug
   * @param {string[]} batchIds
   * @param {string} batchId
   * @param {string[]} values
   * @param {string|number} value
   * @param {string[]} metaTypes
   * @param {string} metaType
   * @param {string[]} metaIds
   * @param {string} metaId
   * @param {number[]} indexes
   * @param {number} index
   * @param {object[]} filter,
   * @param {boolean} latest
   * @param {object} queryArgs
   * @return {object}
   */
  static createVariables ({
    molecularHashes,
    molecularHash,
    bundleHashes,
    bundleHash,
    positions,
    position,
    walletAddresses,
    walletAddress,
    isotopes,
    isotope,
    tokenSlugs,
    tokenSlug,
    cellSlugs,
    cellSlug,
    batchIds,
    batchId,
    values,
    value,
    metaTypes,
    metaType,
    metaIds,
    metaId,
    indexes,
    index,
    filter,
    latest,
    queryArgs
  }) {
    if (molecularHash) {
      molecularHashes = molecularHashes || []
      molecularHashes.push(molecularHash)
    }

    if (bundleHash) {
      bundleHashes = bundleHashes || []
      bundleHashes.push(bundleHash)
    }

    if (position) {
      positions = positions || []
      positions.push(position)
    }

    if (walletAddress) {
      walletAddresses = walletAddresses || []
      walletAddresses.push(walletAddress)
    }

    if (isotope) {
      isotopes = isotopes || []
      isotopes.push(isotope)
    }

    if (tokenSlug) {
      tokenSlugs = tokenSlugs || []
      tokenSlugs.push(tokenSlug)
    }

    if (cellSlug) {
      cellSlugs = cellSlugs || []
      cellSlugs.push(cellSlug)
    }

    if (batchId) {
      batchIds = batchIds || []
      batchIds.push(batchId)
    }

    if (value) {
      values = values || []
      values.push(value)
    }

    if (metaType) {
      metaTypes = metaTypes || []
      metaTypes.push(metaType)
    }

    if (metaId) {
      metaIds = metaIds || []
      metaIds.push(metaId)
    }

    if (index) {
      indexes = indexes || []
      indexes.push(index)
    }

    return {
      molecularHashes,
      bundleHashes,
      positions,
      walletAddresses,
      isotopes,
      tokenSlugs,
      cellSlugs,
      batchIds,
      values,
      metaTypes,
      metaIds,
      indexes,
      filter,
      latest,
      queryArgs
    }
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseAtom}
   */
  createResponse (json) {
    return new ResponseAtom({
      query: this,
      json
    })
  }
}

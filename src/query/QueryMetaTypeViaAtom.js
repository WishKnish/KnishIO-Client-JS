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
import Query from './Query';
import { gql } from '@apollo/client/core';
import ResponseMetaTypeViaAtom from '../response/ResponseMetaTypeViaAtom';


export default class QueryMetaTypeViaAtom extends Query {
  /**
   * Class constructor
   *
   * @param apolloClient
   */
  constructor ( apolloClient ) {
    super( apolloClient );

    this.$__query = gql`query ($metaTypes: [String!], $metaIds: [String!], $values: [String!], $latest: Boolean, $filter: [MetaFilter!], $queryArgs: QueryArgs, $countBy: String) {
      MetaTypeViaAtom(
        metaTypes: $metaTypes
        metaIds: $metaIds
        values: $values
        filter: $filter,
        latest: $latest,
        queryArgs: $queryArgs
        countBy: $countBy
      ) {
        metaType,
        instanceCount {
          key,
          value
        },
        instances {
          metaType,
          metaId,
          createdAt,
          metas(latest:$latest) {
            molecularHash,
            position,
            key,
            value,
            createdAt
          }
        },
        paginatorInfo {
          currentPage,
          total
        }
      }
    }`;
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseMetaTypeViaAtom}
   */
  createResponse ( json ) {
    return new ResponseMetaTypeViaAtom( {
      query: this,
      json
    } );
  }

  /**
   * Builds a GraphQL-friendly variables object based on input fields
   *
   * @param {string|array|null} metaType
   * @param {string|array|null} metaId
   * @param {string|null} key
   * @param {string|null} value
   * @param {boolean|null} latest
   * @param {boolean|null} latestMetas
   * @param {array|null} filter
   * @param {object|null} queryArgs
   * @param {string|null} countBy
   * @return {{}}
   */
  static createVariables ( {
    metaType = null,
    metaId = null,
    key = null,
    value = null,
    latest = null,
    latestMetas = true,
    filter = null,
    queryArgs = null,
    countBy = null
  } ) {
    const variables = {};

    if ( metaType ) {
      variables[ 'metaTypes' ] = [ metaType ];
    }

    if ( metaId ) {
      variables[ 'metaIds' ] = [ metaId ];
    }

    if ( countBy ) {
      variables[ 'countBy' ] = countBy;
    }

    if ( filter ) {
      variables[ 'filter' ] = filter;
    }

    if ( key && value ) {
      variables[ 'filter' ] = variables[ 'filter' ] || [];
      variables[ 'filter' ].push( {
        key,
        value,
        'comparison': '='
      } );
    }

    if ( latest ) {
      variables[ 'latest' ] = !!latest;
      variables[ 'latest' ] = !!latestMetas;
    }

    if ( queryArgs ) {

      if ( typeof queryArgs.limit === 'undefined' || queryArgs.limit === 0 ) {
        queryArgs.limit = '*';
      }

      variables[ 'queryArgs' ] = queryArgs;
    }

    return variables;
  }
}

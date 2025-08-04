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

/**
 * Constructor parameters for ResponseAtom
 */
export interface ResponseAtomParams {
  query: Query;
  json: GraphQLResponse;
}

/**
 * Atom response payload structure
 */
export interface AtomResponsePayload {
  instances: any[];
  instanceCount: Record<string, unknown>;
  paginatorInfo: Record<string, unknown>;
}

/**
 * Response for Atom queries
 */
export default class ResponseAtom extends Response {
  /**
   * Class constructor
   * @param query - The originating query
   * @param json - The GraphQL response data
   */
  constructor ({
    query,
    json
  }: ResponseAtomParams) {
    super({
      query,
      json: json as any,
      dataKey: 'data.Atom'
    })
  }

  /**
   * Returns atom query results
   * @returns Structured atom data or null
   */
  payload (): AtomResponsePayload | null {
    const metaTypeData = this.data()

    if (!metaTypeData) {
      return null
    }

    const response: AtomResponsePayload = {
      instances: [],
      instanceCount: {},
      paginatorInfo: {}
    }

    // Copy properties from metaTypeData with type safety
    if ((metaTypeData as any).instances) {
      response.instances = (metaTypeData as any).instances
    }
    if ((metaTypeData as any).instanceCount) {
      response.instanceCount = (metaTypeData as any).instanceCount
    }
    if ((metaTypeData as any).paginatorInfo) {
      response.paginatorInfo = (metaTypeData as any).paginatorInfo
    }

    return response
  }
}
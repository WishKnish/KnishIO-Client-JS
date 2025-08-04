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

import Response from './Response'
import type Query from '../query/Query'

interface MetaTypeViaAtomResponseData {
  instances?: any[];
  instanceCount?: Record<string, any>;
  paginatorInfo?: Record<string, any>;
}

export default class ResponseMetaTypeViaAtom extends Response {
  /**
   * Class constructor
   *
   * @param query - The query instance
   * @param json - The JSON response data
   */
  constructor ({
    query,
    json
  }: {
    query: Query;
    json: any;
  }) {
    super({
      query,
      json,
      dataKey: 'data.MetaTypeViaAtom'
    })
  }

  /**
   * Process and return the payload data
   */
  payload (): MetaTypeViaAtomResponseData | null {
    const metaTypeData = this.data()

    if (!metaTypeData || (Array.isArray(metaTypeData) && metaTypeData.length === 0)) {
      return null
    }

    const response: MetaTypeViaAtomResponseData = {
      instances: [],
      instanceCount: {},
      paginatorInfo: {}
    }

    const metaDataArray = Array.isArray(metaTypeData) ? metaTypeData : [metaTypeData]
    const metaData = metaDataArray.pop()

    if (metaData?.instances) {
      response.instances = metaData.instances
    }

    if (metaData?.instanceCount) {
      response.instanceCount = metaData.instanceCount
    }

    if (metaData?.paginatorInfo) {
      response.paginatorInfo = metaData.paginatorInfo
    }

    return response
  }
}
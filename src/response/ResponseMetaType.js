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

import Query from '../query/Query'
import Response from './Response'

/**
 * Response for MetaType Query
 */
export default class ResponseMetaType extends Response {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ({
    query,
    json
  }) {
    super({
      query,
      json,
      dataKey: 'data.MetaType'
    })
  }

  /**
   * Returns meta type instance results
   *
   * @return {null|*}
   */
  payload () {
    const metaTypeData = this.data()

    if (!metaTypeData || metaTypeData.length === 0) {
      return null
    }

    const response = {
      instances: {},
      instanceCount: {},
      paginatorInfo: {}
    }

    const metaData = metaTypeData.pop()

    if (metaData.instances) {
      response.instances = metaData.instances
    }

    if (metaData.instanceCount) {
      response.instanceCount = metaData.instanceCount
    }

    if (metaData.paginatorInfo) {
      response.paginatorInfo = metaData.paginatorInfo
    }

    return response
  }
}

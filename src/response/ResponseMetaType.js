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
import Response from "./Response";

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
  constructor ( {
    query,
    json,
  } ) {
    super( {
      query,
      json,
    } );
    this.dataKey = 'data.MetaType';
    this.init();
  }

  /**
   * Returns meta type instance results
   *
   * @returns {null|*}
   */
  payload () {
    const metaTypeData = this.data();

    if ( !metaTypeData || metaTypeData.length === 0 ) {
      return null;
    }

    let response = {
      instances: {},
      instanceCount: {},
      paginatorInfo: {},
    };

    let metaData = metaTypeData.pop();

    if ( metaData.instances ) {
      response.instances = metaData.instances;
    }

    if (metaData.instanceCount) {
      response.instanceCount = metaData.instanceCount;
    }

    if (metaData.paginatorInfo) {
      response.paginatorInfo = metaData.paginatorInfo;
    }

    return response;
  }
}

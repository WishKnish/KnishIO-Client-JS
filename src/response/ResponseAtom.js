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

import Response from './Response';
import Query from '../query/Query';

/**
 * Response for MetaType Query
 */
export default class ResponseAtom extends Response {

  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ( {
    query,
    json
  } ) {
    super( {
      query,
      json,
      dataKey: 'data.Atom'
    } );
  }

  /**
   * Returns meta type instance results
   *
   * @return {null|*}
   */
  payload () {
    const metaTypeData = this.data();

    if ( !metaTypeData ) {
      return null;
    }

    let response = {
      instances: [],
      instanceCount: {},
      paginatorInfo: {}
    };

    if ( metaTypeData.instances ) {
      response.instances = metaTypeData.instances;

      for ( let instanceKey in response.instances ) {
        let instance = response.instances[ instanceKey ];
        if ( instance.metasJson ) {
          response.instances[ instanceKey ].metas = JSON.parse( instance.metasJson );
        }
      }
    }

    if ( metaTypeData.instanceCount ) {
      response.instanceCount = metaTypeData.instanceCount;
    }

    if ( metaTypeData.paginatorInfo ) {
      response.paginatorInfo = metaTypeData.paginatorInfo;
    }

    return response;
  }

  metas () {
    const response = this.payload();
    const metas = [];

    if ( response && response.instances ) {
      for ( const instance of response.instances ) {
        if ( instance.metasJson ) {
          metas.push( JSON.parse( instance.metasJson ) );
        }
      }
    }

    return metas;
  }
}

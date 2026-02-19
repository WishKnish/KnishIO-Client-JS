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
import Query from '../query/Query.js'
import Response from './Response.js'
import Dot from '../libraries/Dot.js'

/**
 * Response for mutation to create / link an Identifier to a Wallet Bundle
 */
export default class ResponseLinkIdentifier extends Response {
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
      dataKey: 'data.LinkIdentifier'
    })
  }

  /**
   * Returns success status
   *
   * @return {*}
   */
  success () {
    return Dot.get(this.data(), 'set')
  }

  /**
   * Returns message
   *
   * @return {*}
   */
  message () {
    return Dot.get(this.data(), 'message')
  }
}

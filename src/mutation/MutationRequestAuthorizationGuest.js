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
import Query from "../query/Query";
import ResponseRequestAuthorizationGuest from "../response/ResponseRequestAuthorizationGuest";

/**
 * Query for requesting a guest authorization token from the node
 */
export default class MutationRequestAuthorizationGuest extends Query {
  /**
   * Class constructor
   *
   * @param knishIO
   */
  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `mutation( $cellSlug: String ) { AccessToken( cellSlug: $cellSlug ) @fields }`;
    this.$__fields = {
      'token': null,
      'time': null,
    };
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseRequestAuthorizationGuest}
   */
  createResponse ( json ) {
    return new ResponseRequestAuthorizationGuest( {
      query: this,
      json
    } );
  }
}

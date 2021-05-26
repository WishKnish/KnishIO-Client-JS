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
import gql from "graphql-tag";
import Mutation from "../mutation/Mutation";
import ResponseRequestAuthorizationGuest from "../response/ResponseRequestAuthorizationGuest";


export default class MutationRequestAuthorizationGuest extends Mutation {
  /**
   * Class constructor
   *
   * @param apolloClient
   */
  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`mutation( $cellSlug: String ) {
        AccessToken( cellSlug: $cellSlug ) {
            token,
            time
        }
    }`;
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

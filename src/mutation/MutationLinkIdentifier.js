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
import Mutation from '../mutation/Mutation';
import ResponseLinkIdentifier from '../response/ResponseLinkIdentifier';
import gql from 'graphql-tag';

/**
 * Query for linking an Identifier to a Wallet Bundle
 */
export default class MutationLinkIdentifier extends Mutation {

  /**
   * Class constructor
   *
   * @param apolloClient
   */
  constructor ( apolloClient ) {
    super( apolloClient );
    this.$__query = gql`mutation( $bundle: String!, $type: String!, $content: String! ) {
      LinkIdentifier( bundle: $bundle, type: $type, content: $content ) {
        type,
        bundle,
        content,
        set,
        message
      }
    }`;
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {ResponseLinkIdentifier}
   */
  createResponse ( json ) {
    return new ResponseLinkIdentifier( {
      query: this,
      json
    } );
  }

}

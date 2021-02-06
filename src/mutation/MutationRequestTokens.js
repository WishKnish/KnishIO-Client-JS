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
import MutationProposeMolecule from "./MutationProposeMolecule";
import ResponseRequestTokens from "../response/ResponseRequestTokens";

/**
 * Query for requesting tokens from a node
 */
export default class MutationRequestTokens extends MutationProposeMolecule {

  /**
   * Fills a Molecule with the appropriate atoms and prepares for broadcast
   *
   * @param {string} token
   * @param {Number} requestedAmount
   * @param {string} metaType
   * @param {string} metaId
   * @param {Object} meta
   */
  fillMolecule ( {
    token,
    requestedAmount,
    metaType,
    metaId,
    meta = null,
  } ) {

    this.$__molecule.initTokenRequest( {
      token,
      requestedAmount,
      metaType,
      metaId,
      meta: meta || {},
    } );
    this.$__molecule.sign( {} );
    this.$__molecule.check();
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param response
   * @return {ResponseRequestTokens}
   */
  createResponse ( response ) {
    return new ResponseRequestTokens( {
      query: this,
      response,
    } );
  }
}

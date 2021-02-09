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
   * @param {object} meta
   */
  fillMolecule ( {
    token,
    requestedAmount,
    metaType,
    metaId,
    meta = null,
    batchId = null
  } ) {

    this.$__molecule.initTokenRequest( {
      token,
      requestedAmount,
      metaType,
      metaId,
      meta: meta || {},
      batchId,
    } );
    this.$__molecule.sign( {} );
    this.$__molecule.check();
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseRequestTokens}
   */
  createResponse ( json ) {
    return new ResponseRequestTokens( {
      query: this,
      json,
    } );
  }
}

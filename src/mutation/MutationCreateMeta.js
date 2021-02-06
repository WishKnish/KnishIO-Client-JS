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
import ResponseMetaCreate from "../response/ResponseMetaCreate";

/**
 * Query for creating new Meta attached to some MetaType
 */
export default class MutationCreateMeta extends MutationProposeMolecule {


  /**
   * Fills a molecule with an appropriate metadata atom
   *
   * @param {string} meta
   * @param {string} metaId
   * @param {array|object} metadata
   */
  fillMolecule ( {
    metaType,
    metaId,
    meta
  } ) {
    this.$__molecule.initMeta( {
      meta,
      metaType,
      metaId,
    } );
    this.$__molecule.sign( {} );
    this.$__molecule.check();
  }

  /**
   * Builds a new Response object from a JSON string
   *
   * @param response
   * @return {ResponseMetaCreate}
   */
  createResponse ( response ) {
    return new ResponseMetaCreate( {
      query: this,
      response,
    } );
  }
}

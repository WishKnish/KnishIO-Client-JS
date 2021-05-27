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
import MutationProposeMolecule from './MutationProposeMolecule';
import ResponseCreateMeta from '../response/ResponseCreateMeta';

/**
 * Query for creating new Meta attached to some MetaType
 */
export default class MutationCreateMeta extends MutationProposeMolecule {
  /**
   * Fills a molecule with an appropriate metadata atom
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} meta
   */
  fillMolecule ( { metaType, metaId, meta, } ) {
    this.$__molecule.initMeta( {
      meta,
      metaType,
      metaId
    } );
    this.$__molecule.sign( {} );
    this.$__molecule.check();
  }

  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseCreateMeta}
   */
  createResponse ( json ) {
    return new ResponseCreateMeta( {
      query: this,
      json
    } );
  }

}

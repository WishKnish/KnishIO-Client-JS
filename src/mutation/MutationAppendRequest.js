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
import MutationProposeMolecule from './MutationProposeMolecule.js'
import ResponseAppendRequest from '../response/ResponseAppendRequest.js'

/**
 * Mutation for submitting an append request via the A-isotope
 */
export default class MutationAppendRequest extends MutationProposeMolecule {
  /**
   * Fills a molecule with an A-isotope append request atom
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {string} action
   * @param {object} meta
   */
  fillMolecule ({
    metaType,
    metaId,
    action,
    meta = {}
  }) {
    this.$__molecule.initAppendRequest({
      metaType,
      metaId,
      action,
      meta
    })
    this.$__molecule.sign({})
    this.$__molecule.check()
  }

  /**
   * Builds a new Response object from a JSON string
   *
   * @param {object} json
   * @return {ResponseAppendRequest}
   */
  createResponse (json) {
    return new ResponseAppendRequest({
      query: this,
      json
    })
  }
}

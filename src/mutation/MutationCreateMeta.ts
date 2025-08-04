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
import type { GraphQLResponse } from '../types/graphql';
import ResponseCreateMeta from '../response/ResponseCreateMeta';
import type { CreateMetaParams } from '../types/mutation';
import type { MetaData } from '../types/meta';

/**
 * Variables for create meta mutation
 */
export interface MutationCreateMetaVariables extends CreateMetaParams {
  metaType: string;
  metaId: string;
  meta: MetaData;
  policy?: MetaData;
}

/**
 * Mutation for creating new Meta attached to some MetaType
 */
export default class MutationCreateMeta extends MutationProposeMolecule {
  /**
   * Fills a molecule with an appropriate metadata atom
   *
   * @param metaType - The type of metadata
   * @param metaId - The ID of the metadata
   * @param meta - The metadata content (array or object)
   * @param policy - Optional policy configuration
   */
  fillMolecule ({
    metaType,
    metaId,
    meta,
    policy
  }: MutationCreateMetaVariables): void {
    this.$__molecule.initMeta?.({
      meta,
      metaType,
      metaId,
      ...(policy && { policy })
    })
    this.$__molecule.sign?.({})
    this.$__molecule.check?.()
  }

  /**
   * Builds a new Response object from a JSON string
   *
   * @param json - The GraphQL response data
   * @return Response for create meta operation
   */
  createResponse (json: GraphQLResponse): ResponseCreateMeta {
    return new ResponseCreateMeta({
      query: this,
      json
    })
  }
}
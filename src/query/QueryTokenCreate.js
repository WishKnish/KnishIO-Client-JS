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
import QueryMoleculePropose from "./QueryMoleculePropose";
import ResponseTokenCreate from "../response/ResponseTokenCreate";

/**
 * Query for creating new Tokens
 */
export default class QueryTokenCreate extends QueryMoleculePropose {

  fillMolecule ( recipientWallet, amount, metas = null ) {
    this.$__molecule.initTokenCreation( recipientWallet, amount, metas || {} );
    this.$__molecule.sign();
    this.$__molecule.check();
  }

  /**
   * Builds a new Response object from a JSON string
   *
   * @param response
   * @return {ResponseTokenCreate}
   */
  createResponse ( response ) {
    return new ResponseTokenCreate( this, response );
  }
}

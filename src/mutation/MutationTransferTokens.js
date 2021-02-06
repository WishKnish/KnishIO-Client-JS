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
import ResponseTokenTransfer from "../response/ResponseTokenTransfer";

/**
 * Query for moving tokens between wallets
 */
export default class MutationTransferTokens extends MutationProposeMolecule {

  /**
   * Fills the Molecule with provided wallet and amount data
   *
   * @param toWallet
   * @param value
   */
  fillMolecule ( {
    toWallet,
    value
  } ) {

    this.$__molecule.initValue( {
      recipientWallet: toWallet,
      value,
    } );
    this.$__molecule.sign( {} );
    this.$__molecule.check( this.$__molecule.sourceWallet );
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param response
   * @return {ResponseTokenTransfer}
   */
  createResponse ( response ) {
    return new ResponseTokenTransfer( {
      query: this,
      response,
    } );
  }
}

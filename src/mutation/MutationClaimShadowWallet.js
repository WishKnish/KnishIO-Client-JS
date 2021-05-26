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
import Wallet from "../Wallet";
import ResponseClaimShadowWallet from "../response/ResponseClaimShadowWallet";

/**
 * Query for claiming a Shadow Wallet
 */
export default class MutationClaimShadowWallet extends MutationProposeMolecule {

  fillMolecule ( { token, batchId, } ) {
    let wallet = Wallet.create( {
      secretOrBundle: this.$__molecule.secret,
      token,
      batchId,
    } );

    this.$__molecule.initShadowWalletClaim( {
      token,
      wallet,
    } );
    this.$__molecule.sign( {} );
    this.$__molecule.check();
  }

  /**
   * Builds a Response object out of a JSON string
   *
   * @param {object} json
   * @return {ResponseClaimShadowWallet}
   */
  createResponse ( json ) {
    return new ResponseClaimShadowWallet( {
      query: this,
      json,
    } );
  }
}
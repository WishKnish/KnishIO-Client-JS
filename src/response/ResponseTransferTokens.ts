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
                 ################# ####
                ################# ######
               ################# #######
              ################# #########
             ################# ###########
            ################# #############
           ################# ###############
          ################# #################
         ################# ###################
        ################# #####################
       ################# #######################
      ################# #########################
     ################# ###########################
    ################# #############################
   ################# ###############################
  ################# #################################
 ################# ###################################
################# #####################################

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import ResponseProposeMolecule from './ResponseProposeMolecule';

/**
 * Transfer result payload
 */
export interface TransferTokensPayload {
  reason: string | null;
  status: string | null;
}

/**
 * Response for token transfer queries
 */
export default class ResponseTransferTokens extends ResponseProposeMolecule {
  /**
   * Returns result of the transfer
   * @returns Transfer result with status and reason
   */
  payload (): TransferTokensPayload {
    const result: TransferTokensPayload = {
      reason: null,
      status: null
    }
    const data = this.data()

    result.reason = typeof (data as any).reason === 'undefined' ? 'Invalid response from server' : (data as any).reason
    result.status = typeof (data as any).status === 'undefined' ? 'rejected' : (data as any).status

    return result
  }
}
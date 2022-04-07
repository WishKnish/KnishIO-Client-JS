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

export default class Meta {

  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {string} isotope
   * @param {string} token
   * @param {number} amount
   */
  constructor ( {
    metaType,
    // keyword that will be automatically replaced on server with sender's wallet bundle,
    metaId,
    isotope,
    token,
    amount
  } ) {
    this._metaType = metaType;
    this._metaId = metaId;
    this._isotope = isotope;
    this._token = token;
    this._amount = amount;
  }


  toJSON () {
    return {
      metaType: this._metaType,
      metaId: this._metaId,
      isotope: this._isotope,
      token: this._token,
      amount: this._amount
    };
  }
}

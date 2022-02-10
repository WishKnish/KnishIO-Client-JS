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

  #metaType
  #metaId
  #isotope
  #token
  #amount

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
    this.#metaType = metaType;
    this.#metaId = metaId;
    this.#isotope = isotope;
    this.#token = token;
    this.#amount = amount;
  }


  toJSON () {
    return {
      metaType: this.#metaType,
      metaId: this.#metaId,
      isotope: this.#isotope,
      token: this.#token,
      amount: this.#amount
    };
  }
}

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

/**
 * AuthToken class
 */
export default class TokenUnit {

  /**
   *
   * @param data
   * @returns {*}
   */
  static createFromGraphQL ( data ) {
    let metas = data[ 'metas' ] || {};
    if ( metas.length ) {
      metas = JSON.parse( metas );
      if ( !metas ) { // set an empty object instead of an array
        metas = {};
      }
    }
    return new TokenUnit(
      data[ 'id' ],
      data[ 'name' ],
      metas
    );
  }

  /**
   *
   * @param data
   * @returns {TokenUnit}
   */
  static createFromDB ( data ) {
    return new TokenUnit(
      data[ 0 ],
      data[ 1 ],
      data.length > 2 ? data[ 2 ] : {}
    );
  }

  /**
   *
   * @param id
   * @param name
   * @param metas
   */
  constructor ( id, name, metas ) {
    this.id = id;
    this.name = name;
    this.metas = metas || {};
  }

  /**
   *
   * @returns {*|null}
   */
  getFragmentZone () {
    return this.metas[ 'fragmentZone' ] || null;
  }

  /**
   *
   * @returns {*|null}
   */
  getFusedTokenUnits () {
    return this.metas[ 'fusedTokenUnits' ] || null;
  }

  /**
   * @return array
   */
  toData () {
    return [ this.id, this.name, this.metas ];
  }

  /**
   *
   * @returns {{metas: string, name: *, id: *}}
   */
  toGraphQLResponse () {
    return {
      id: this.id,
      name: this.name,
      metas: JSON.stringify( this.metas )
    };
  }

}

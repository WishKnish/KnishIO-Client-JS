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

import { ITokenUnit } from "./types";

/**
 * AuthToken class
 */
export default class TokenUnit implements ITokenUnit {

  id: string;
  name: string;
  metas: object;

  constructor( id: string, name: string, metas: {} ) {
    this.id = id
    this.name = name
    this.metas = metas
  }

  static createFromGraphQL( data: { id: string, name: string, metas: string | {} } ) {
    let metas = data.metas || {}
    if ( typeof metas === 'string' && metas.length ) {
      metas = JSON.parse( metas )
      if ( !metas ) { // set an empty object instead of an array
        metas = {}
      }
    }
    return new TokenUnit(
      data.id,
      data.name,
      metas
    )
  }

  /**
   *
   * @param data
   * @returns {TokenUnit}
   */
  static createFromDB( data: [string, string, {}] ): TokenUnit {
    return new TokenUnit(
      data[ 0 ],
      data[ 1 ],
      data.length > 2 ? data[ 2 ] : {}
    )
  }

  getFragmentZone(): string | null {
    return this.metas.fragmentZone || null
  }

  getFusedTokenUnits() {
    return this.metas.fusedTokenUnits || null
  }

  toData(): [ string, string, {} ] {
    return [ this.id, this.name, this.metas ]
  }

  toGraphQLResponse(): { id: string, name: string, metas: string } {
    return {
      id: this.id,
      name: this.name,
      metas: JSON.stringify( this.metas )
    }
  }
}

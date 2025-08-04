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
 * TokenUnit class representing a token unit with metadata
 */
export interface TokenUnitMetas {
  fragmentZone?: string;
  fusedTokenUnits?: unknown;
  [key: string]: unknown;
}

export interface TokenUnitGraphQLData {
  id: string;
  name: string;
  metas?: string | TokenUnitMetas;
}

export interface TokenUnitDBData extends Array<unknown> {
  0: string; // id
  1: string; // name
  2?: TokenUnitMetas; // metas (optional)
  length: number;
}

export interface TokenUnitGraphQLResponse {
  id: string;
  name: string;
  metas: string;
}

export interface TokenUnitArrayData extends Array<unknown> {
  0: string; // id
  1: string; // name
  2: TokenUnitMetas; // metas
}

/**
 * TokenUnit class for handling token unit operations
 */
export default class TokenUnit {
  public readonly id: string;
  public readonly name: string;
  public readonly metas: TokenUnitMetas;

  /**
   * Constructor for TokenUnit
   * @param id - Token unit identifier
   * @param name - Token unit name
   * @param metas - Token unit metadata
   */
  constructor(id: string, name: string, metas?: TokenUnitMetas) {
    this.id = id;
    this.name = name;
    this.metas = metas || {};
  }

  /**
   * Create TokenUnit instance from GraphQL response data
   * @param data - GraphQL response data
   * @returns TokenUnit instance
   */
  static createFromGraphQL(data: TokenUnitGraphQLData): TokenUnit {
    let metas: TokenUnitMetas = data.metas as TokenUnitMetas || {};
    
    if (typeof data.metas === 'string' && data.metas.length) {
      try {
        const parsed = JSON.parse(data.metas);
        metas = parsed || {};
      } catch {
        metas = {};
      }
    }
    
    return new TokenUnit(
      data.id,
      data.name,
      metas
    );
  }

  /**
   * Create TokenUnit instance from database array data
   * @param data - Database array data
   * @returns TokenUnit instance
   */
  static createFromDB(data: TokenUnitDBData): TokenUnit {
    return new TokenUnit(
      data[0],
      data[1],
      data.length > 2 ? data[2] : {}
    );
  }

  /**
   * Get fragment zone from metadata
   * @returns Fragment zone or null
   */
  getFragmentZone(): string | null {
    return this.metas.fragmentZone || null;
  }

  /**
   * Get fused token units from metadata
   * @returns Fused token units or null
   */
  getFusedTokenUnits(): unknown | null {
    return this.metas.fusedTokenUnits || null;
  }

  /**
   * Convert TokenUnit to array data format
   * @returns Array containing id, name, and metas
   */
  toData(): TokenUnitArrayData {
    return [this.id, this.name, this.metas] as TokenUnitArrayData;
  }

  /**
   * Convert TokenUnit to GraphQL response format
   * @returns GraphQL response object
   */
  toGraphQLResponse(): TokenUnitGraphQLResponse {
    return {
      id: this.id,
      name: this.name,
      metas: JSON.stringify(this.metas)
    };
  }
}
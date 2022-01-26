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
import {
  deepCloning,
  diff
} from './libraries/array';

/**
 * Meta class to represent metadata conveyed by Atoms
 */
export default class Meta {

  /**
   * Class constructor
   *
   * @param {array} meta
   */
  constructor ( {
    meta
  } ) {

    this.meta = meta;
    this.createdAt = +new Date;

  }

  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {array|object} meta
   * @return {array}
   */
  static normalizeMeta ( meta ) {
    const target = [];

    for ( const property in meta ) {
      if ( meta.hasOwnProperty( property ) && meta[ property ] !== null ) {
        target.push( {
          key: property,
          value: ( meta[ property ] ).toString()
        } );
      }
    }

    return target;
  }

  /**
   * Condenses metadata array into object-based key: value notation
   *
   * @param {array|object} meta
   * @return {object}
   */
  static aggregateMeta ( meta ) {
    let aggregate = {};

    // Ensuring that only array-based meta gets aggregated
    if ( Array.isArray( meta ) ) {
      for ( let metaEntry of meta ) {
        aggregate[ metaEntry.key ] = metaEntry.value;
      }
    } else {
      aggregate = meta;
    }

    return aggregate;
  }

  /**
   *
   * @param {object|null} meta
   * @param {object|null} policy
   * @returns {object}
   */
  static policy ( meta, policy ) {
    const metas = {
      policy: {}
    };

    if ( policy ) {
      for ( const [ policyKey, value ] of Object.entries( policy || {} ) ) {

        if ( value !== null && [ 'read', 'write' ].includes( policyKey ) ) {
          metas.policy[ policyKey ] = {};

          for ( const [ key, content ] of Object.entries( value ) ) {
            metas.policy[ policyKey ][ key ] = content;
          }
        }
      }
    }

    metas.policy = JSON.stringify( Meta.__defaultPolicy( metas.policy, meta ) );

    return metas;
  }

  /**
   *
   * @param {{}} policy
   * @param {object} meta
   * @returns {object}
   */
  static __defaultPolicy ( policy, meta ) {
    const _policy = deepCloning( policy );
    const readPolicy = Array.from( _policy ).filter( item => item.action === 'read' );
    const writePolicy = Array.from( _policy ).filter( item => item.action === 'write' );
    const metaKey = Object.keys( meta || {} );

    for ( const [ type, value ] of Object.entries( {
      read: readPolicy,
      write: writePolicy
    } ) ) {

      const policyKey = value.map( item => item.key );

      if ( !_policy[ type ] ) {
        _policy[ type ] = {};
      }

      for ( const key of diff( metaKey, policyKey ) ) {
        if ( !_policy[ type ][ key ] ) {
          _policy[ type ][ key ] = ( type === 'write' && ![ 'characters', 'pubkey' ].includes( key ) ) ? [ 'self' ] : [ 'all' ];
        }
      }
    }

    return _policy;
  }
}

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
 * Meta class to represent metadata conveyed by Atoms
 */
export default class Meta {

  /**
   * Class constructor
   *
   * @param {string} modelType
   * @param {string} modelId
   * @param {Array} meta
   * @param {null|} snapshotMolecule
   */
  constructor ( modelType, modelId, meta, snapshotMolecule = null ) {

    this.modelType = modelType;
    this.modelId = modelId;
    this.meta = meta;
    this.snapshotMolecule = snapshotMolecule;
    this.createdAt = +new Date;

  }

  /**
   * Normalizes the meta array into the standard {key: ..., value: ...} format
   *
   * @param {Array | Object} meta
   * @return {Array}
   */
  static normalizeMeta ( meta ) {

    if ( Object.prototype.toString.call( meta ) === '[object Object]' ) {

      const target = [];

      for ( const property in meta ) {
        if ( meta.hasOwnProperty( property ) ) {
          target.push( { key: property, value: meta[ property ] } );
        }
      }

      return target;
    }

    return meta;
  }

  /**
   * Condenses metadata array into object-based key: value notation
   *
   * @param {Array | Object} meta
   * @return {Array | Object}
   */
  static aggregateMeta ( meta ) {
    const aggregate = {};

    if ( Object.prototype.toString.call( meta ) === '[object Array]' ) {
      for ( let metaEntry of meta ) {
        aggregate[ metaEntry.key ] = metaEntry.value;
      }
    }

    // Making sure we actually have anything to return
    if ( Object.keys( aggregate ).length > 0 ) {
      return aggregate;
    }

    return meta;
  }
}

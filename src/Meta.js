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
   * @param {array} meta
   * @param {null|} snapshotMolecule
   */
  constructor ( {
    modelType,
    modelId,
    meta,
    snapshotMolecule = null
  } ) {

    this.modelType = modelType;
    this.modelId = modelId;
    this.meta = meta;
    this.snapshotMolecule = snapshotMolecule;
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
}

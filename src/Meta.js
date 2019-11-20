// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

/**
 * class Meta
 *
 * @property {string} modelType
 * @property {string} modelId
 * @property {Array} meta
 * @property {null|} snapshotMolecule
 * @property {number} createdAt
 *
 *
 */
export default class Meta {

  /**
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
   * @param {Array | Object} meta
   * @return {Array}
   */
  static normalizeMeta ( meta ) {

    if ( toString.call( meta ) === '[object Object]' ) {

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
   * @param {Array | Object} meta
   * @return {Array}
   */
  static aggregateMeta ( meta ) {
    const aggregate = {};

    if ( meta.length > 0 ) {

      meta.forEach(function(metaEntry) {
        if ( metaEntry.key ) {
          aggregate[ metaEntry.key ] = metaEntry.value;
        }
      });

    }

    // Making sure we actually have anything to return
    if ( Object.keys( aggregate ).length > 0 )
      return aggregate;

    return meta;
  }

}

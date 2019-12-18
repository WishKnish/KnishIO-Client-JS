// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import { shake256, } from 'js-sha3';
import { charsetBaseConvert } from './libraries/strings';
import Meta from "./Meta";

/**
 * class Atom
 *
 * @property {string} position
 * @property {string} walletAddress
 * @property {string} isotope
 * @property {string | null} token
 * @property {string | number | null} value
 * @property {string | null} metaType
 * @property {string | null} metaId
 * @property {Array | Object | null} meta
 * @property {number | null } index
 * @property {string | null} otsFragment
 * @property {string} createdAt
 */
export default class Atom {

  /**
   * @param {string} position
   * @param {string} walletAddress
   * @param {string} isotope
   * @param {string | null} token
   * @param {string | number | null} value
   * @param {string} batchId
   * @param {string | null} metaType
   * @param {string | null} metaId
   * @param {Array | Object | null} meta
   * @param {number | null} index
   * @param {string | null} otsFragment
   */
  constructor ( position, walletAddress, isotope, token = null, value = null, batchId = null, metaType = null, metaId = null, meta = null, otsFragment = null, index = null ) {

    this.position = position;
    this.walletAddress = walletAddress;
    this.isotope = isotope;
    this.token = token;
    this.value = null !== value ? String( value ) : null;
    this.batchId = batchId;

    this.metaType = metaType;
    this.metaId = metaId;
    this.meta = meta ? Meta.normalizeMeta( meta ) : [];

    this.index = index;
    this.otsFragment = otsFragment;
    this.createdAt = String( +new Date );

  }

  /**
   * @param {string} json
   * @return {Object}
   */
  static jsonToObject ( json ) {

    const target = Object.assign( new Atom( null, null, null ), JSON.parse( json ) ),
      properties = Object.keys( new Atom( null, null, null ) );

    for ( const property in target ) {

      if ( target.hasOwnProperty( property ) && !properties.includes( property ) ) {

        delete target[ property ];

      }

    }

    return target;

  }

  /**
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   *
   * @param {Array} atoms
   * @param {string} output
   * @returns {number[] | *}
   */
  static hashAtoms ( atoms, output = 'base17' ) {

    const molecularSponge = shake256.create( 256 ),
      numberOfAtoms = atoms.length,
      atomList = Atom.sortAtoms( atoms );

    // Hashing each atom in the molecule to produce a molecular hash
    for ( const atom of atomList ) {

      molecularSponge.update( String( numberOfAtoms ) );

      for ( const property in atom ) {

        if ( atom.hasOwnProperty( property ) ) {

          // Old atoms support (without batch_id field)
          if ( property === 'batchId' && atom[ property ] === null ) {

            continue;

          }

          if ( [ 'otsFragment', 'index', ].includes( property ) ) {

            continue;

          }

          if ( 'meta' === property ) {

            atom[ property ] = Meta.normalizeMeta( atom[ property ] );

            for ( const meta of atom[ property ] ) {

              molecularSponge.update( String( meta.key ) );
              molecularSponge.update( String( meta.value ) );

            }

            continue;

          }

          if ( [ 'position', 'walletAddress', 'isotope' ].includes( property ) ) {

            molecularSponge.update( String( atom[ property ] ) );

            continue;

          }

          if ( atom[ property ] !== null ) {

            molecularSponge.update( String( atom[ property ] ) );

          }

        }

      }

    }

    switch ( output ) {

      case 'hex': {

        return molecularSponge.hex();

      }
      case 'array': {

        return molecularSponge.array();

      }
      case 'base17': {

        return charsetBaseConvert( molecularSponge.hex(), 16, 17, '0123456789abcdef', '0123456789abcdefg' ).padStart( 64, '0' );

      }
      default: {

        return null;

      }

    }

  }

  /**
   *
   * @param {Array} atoms
   * @return {Array}
   */
  static sortAtoms ( atoms ) {

    const atomList = [ ...atoms ];

    atomList.sort( ( first, second ) => {

      if ( first.index === second.index ) {

        return 0;

      }

      return first.index < second.index ? -1 : 1;

    } );

    return atomList;

  }

}

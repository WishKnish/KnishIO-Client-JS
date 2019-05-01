// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import {shake256,} from 'js-sha3';
import {charsetBaseConvert,} from './util/strings';

export default class Atom {

  /**
   *
   * @param position
   * @param walletAddress
   * @param isotope
   * @param token
   * @param value
   * @param metaType
   * @param metaId
   * @param meta
   * @param otsFragment
   */
  constructor(position, walletAddress, isotope, token = null, value = null, metaType = null, metaId = null, meta = null, otsFragment = null) {
    this.position = position;
    this.walletAddress = walletAddress;
    this.isotope = isotope;
    this.token = token;
    this.value = value;

    this.metaType = metaType;
    this.metaId = metaId;
    this.meta = meta;

    this.otsFragment = otsFragment;
    this.createdAt = +new Date;
  }

  /**
   * Produces a hash of the atoms inside a molecule.
   * Used to generate the molecularHash field for Molecules.
   *
   * @param atoms
   * @param output
   * @returns {number[] | *}
   */
  static hashAtoms(atoms, output = 'base17') {
    const molecularSponge = shake256.create(256);
    const numberOfAtoms = Object.keys(atoms).length;

    // Hashing each atom in the molecule to produce a molecular hash
    Object.values(atoms).forEach(function (atom) {
      molecularSponge.update(String(atom.position));
      molecularSponge.update(String(numberOfAtoms));
      molecularSponge.update(String(atom.walletAddress));
      molecularSponge.update(String(atom.isotope));

      if (atom.token)
        molecularSponge.update(String(atom.token));
      if (atom.value)
        molecularSponge.update(String(atom.value));
      if (atom.metaType)
        molecularSponge.update(String(atom.metaType));
      if (atom.metaId)
        molecularSponge.update(String(atom.metaId));

      // Adding meta keys and values, if any
      if (atom.meta.length)
      {
        atom.meta.forEach(function(meta){
          molecularSponge.update(String(meta.key));
          molecularSponge.update(String(meta.value));
        })
      }

      molecularSponge.update(String(atom.createdAt));
    });

    let result = null;
    switch (output) {
      case 'hex':
        result = molecularSponge.hex();
        break;
      case 'array':
        result = molecularSponge.array();
        break;
      case 'base17':
        const hexOutput = molecularSponge.hex();
        // console.log(`hashAtoms(): hex output - ${ hexOutput }`);
        result = charsetBaseConvert(hexOutput, 16, 17, '0123456789abcdef', '0123456789abcdefg').padStart(64, '0');
        // let result2 = parseInt(`${ hexOutput }`, 16).toString(17).padStart(64, '0');

        // const bigIntHex = bigInt(hexOutput, 16);
        // result = bigIntHex.toString(17, '0123456789abcdefg').padStart(64, '0');
        break;
    }

    // console.log(`hashAtoms(): ${ result }`);

    return result;
  }
}

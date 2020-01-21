// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import { Atom, Wallet, Meta } from './index';
import { shake256, } from 'js-sha3';
import { chunkSubstr, hexToBase64, base64ToHex, } from './libraries/strings';
import CheckMolecule from './libraries/check';
import { generateBundleHash } from "./libraries/crypto";
import {
  AtomsMissingException,
  BalanceInsufficientException,
} from './exception/index';

/**
 * class Molecule
 *
 * @property {string | null} molecularHash
 * @property {string | null} cellSlug
 * @property {string | null} bundle
 * @property {string | null} status
 * @property {string} createdAt
 * @property {Array} atoms
 */
export default class Molecule {

  /**
   * Molecule constructor.
   * @param cellSlug
   */
  constructor ( cellSlug = null ) {

    this.molecularHash = null;
    this.cellSlug = cellSlug;
    this.bundle = null;
    this.status = null;
    this.createdAt = String(
      +new Date
    );
    this.atoms = [];

  }

  /**
   *
   * @param {Wallet} sourceWallet
   * @param {Wallet} newWallet
   * @returns {Molecule}
   */
  initWalletCreation ( sourceWallet, newWallet ) {

    this.molecularHash = null;

    this.atoms.push(
      new Atom(
        sourceWallet.position,
        sourceWallet.address,
        'C',
        sourceWallet.token,
        null,
        sourceWallet.batchId,
        'wallet',
        newWallet.address,
        [
          {
            key: 'address',
            value: newWallet.address,
          },
          {
            key: 'token',
            value: newWallet.token,
          },
          {
            key: 'bundle',
            value: newWallet.bundle,
          },
          {
            key: 'position',
            value: newWallet.position,
          },
          {
            key: 'amount',
            value: "0",
          },
          {
            key: 'batch_id',
            value: newWallet.batchId,
          },
        ],
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   *
   * @param {string} secret
   * @param {string} token
   * @param {number} amount
   * @param {string} metaType
   * @param {string} metaId
   * @param {Array} meta
   *
   * @returns {Molecule}
   */
  initTokenTransfer ( secret, token, amount, metaType, metaId, meta = [] ) {

    this.molecularHash = null;

    const wallet = new Wallet( secret, token );

    this.atoms.push(
      new Atom(
        wallet.position,
        wallet.address,
        'T',
        wallet.token,
        amount,
        wallet.batchId,
        metaType,
        metaId,
        meta,
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   * Initialize a V-type molecule to transfer value from one wallet to another, with a third,
   * regenerated wallet receiving the remainder
   *
   * @param {Wallet} sourceWallet
   * @param {Wallet} recipientWallet
   * @param {Wallet} remainderWallet
   * @param {*} value
   * @returns {Molecule}
   */
  initValue ( sourceWallet, recipientWallet, remainderWallet, value ) {

    if ( sourceWallet.balance - value < 0 ) {

      throw new BalanceInsufficientException();

    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      new Atom(
        sourceWallet.position,
        sourceWallet.address,
        'V',
        sourceWallet.token,
        -value,
        sourceWallet.batchId,
        null,
        null,
        null,
        null,
        this.generateIndex()
      )
    );

    // Initializing a new Atom to add tokens to recipient
    this.atoms.push(
      new Atom(
        recipientWallet.position,
        recipientWallet.address,
        'V',
        sourceWallet.token,
        value,
        recipientWallet.batchId,
        'walletBundle',
        recipientWallet.bundle,
        null,
        null,
        this.generateIndex()
      )
    );

    this.atoms.push(
      new Atom(
        remainderWallet.position,
        remainderWallet.address,
        'V',
        sourceWallet.token,
        sourceWallet.balance - value,
        remainderWallet.batchId,
        'walletBundle',
        sourceWallet.bundle,
        null,
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   *
   * @param {Wallet} sourceWallet - wallet signing the transaction. This should ideally be the USER wallet.
   * @param {string} source - phone number or email string
   * @param {string} type - phone or email
   * @param {string} code -
   *
   * @returns {Molecule}
   */
  initIdentifierCreation ( sourceWallet, source, type, code ) {

    this.molecularHash = null;

    this.atoms.push(
      new Atom(
        sourceWallet.position,
        sourceWallet.address,
        'C',
        sourceWallet.token,
        null,
        null,
        'identifier',
        type,
        [
          {
            key: 'code',
            value: code,
          },
          {
            key: 'hash',
            value: generateBundleHash( source.trim() ),
          },
        ],
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   * Initialize a C-type molecule to issue a new type of token
   *
   * @param {Wallet} sourceWallet - wallet signing the transaction. This should ideally be the USER wallet.
   * @param {Wallet} recipientWallet - wallet receiving the tokens. Needs to be initialized for the new token beforehand.
   * @param {number} amount - how many of the token we are initially issuing (for fungible tokens only)
   * @param {Array | Object} tokenMeta - additional fields to configure the token
   * @returns {Molecule}
   */
  initTokenCreation ( sourceWallet, recipientWallet, amount, tokenMeta ) {

    this.molecularHash = null;

    const metas = Meta.normalizeMeta( tokenMeta );

    for ( const walletKey of [ 'walletAddress', 'walletPosition' ] ) {

      if ( 0 === metas.filter(
        meta => toString.call( meta ) === '[object Object]'
          && typeof meta.key !== 'undefined'
          && meta.key === walletKey ).length
      ) {

        metas.push( {
          key: walletKey,
          value: recipientWallet[ walletKey.toLowerCase().substr( 6 ) ]
        } );

      }

    }

    // The primary atom tells the ledger that a certain amount of the new token is being issued.
    this.atoms.push(
      new Atom(
        sourceWallet.position,
        sourceWallet.address,
        'C',
        sourceWallet.token,
        amount,
        recipientWallet.batchId,
        'token',
        recipientWallet.token,
        metas,
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   * Initialize an M-type molecule with the given data
   *
   * @param {Wallet} wallet
   * @param {Array | Object} meta
   * @param {string} metaType
   * @param {string} metaId
   * @returns {Molecule}
   */
  initMeta ( wallet, meta, metaType, metaId ) {

    this.molecularHash = null;

    // Initializing a new Atom to hold our metadata
    this.atoms.push(
      new Atom(
        wallet.position,
        wallet.address,
        'M',
        wallet.token,
        null,
        wallet.batchId,
        metaType,
        metaId,
        meta,
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   * Clears the instance of the data, leads the instance to a state equivalent to that after new Molecule()
   *
   * @return {Molecule}
   */
  clear () {

    this.constructor( this.cellSlug );

    return this;

  }

  /**
   * Creates a one-time signature for a molecule and breaks it up across multiple atoms within that
   * molecule. Resulting 4096 byte (2048 character) string is the one-time signature, which is then compressed.
   *
   * @param {string} secret
   * @param {boolean} anonymous
   * @param {boolean} compressed
   * @returns {*}
   * @throws {AtomsMissingException}
   */
  sign ( secret, anonymous = false, compressed = true ) {

    // Do we have atoms?
    if ( 0 === this.atoms.length ||
      0 !== this.atoms.filter(
        atom => !( atom instanceof Atom )
      ).length
    ) {

      throw new AtomsMissingException();

    }

    // Derive the user's bundle
    if ( !anonymous ) {

      this.bundle = generateBundleHash( secret );

    }

    // Hash atoms to get molecular hash
    this.molecularHash = Atom.hashAtoms( this.atoms );

    // Determine first atom
    const firstAtom = this.atoms[ 0 ],
      // Generate the private signing key for this molecule
      key = Wallet.generateWalletKey( secret, firstAtom.token, firstAtom.position ),
      // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
      keyChunks = chunkSubstr( key, 128 ),
      // Convert Hm to numeric notation, and then normalize
      normalizedHash = CheckMolecule.normalizedHash( this.molecularHash );

    // Building a one-time-signature
    let signatureFragments = '';

    for ( const index in keyChunks ) {

      let workingChunk = keyChunks[ index ];

      for ( let iterationCount = 0, condition = 8 - normalizedHash[ index ]; iterationCount < condition; iterationCount++ ) {

        workingChunk = shake256.create( 512 ).update( workingChunk ).hex();

      }

      signatureFragments += workingChunk;

    }

    // Compressing the OTS
    if ( compressed ) {

      signatureFragments = hexToBase64( signatureFragments );

    }

    // Chunking the signature across multiple atoms
    const chunkedSignature = chunkSubstr( signatureFragments, Math.ceil( signatureFragments.length / this.atoms.length ) );

    let lastPosition = null;

    for ( let chunkCount = 0, condition = chunkedSignature.length; chunkCount < condition; chunkCount++ ) {

      this.atoms[ chunkCount ].otsFragment = chunkedSignature[ chunkCount ];
      lastPosition = this.atoms[ chunkCount ].position;

    }

    return lastPosition;

  }

  /**
   * @param {string} json
   * @return {Object}
   * @throws {AtomsMissingException}
   */
  static jsonToObject ( json ) {

    const target = Object.assign( new Molecule(), JSON.parse( json ) ),
      properties = Object.keys( new Molecule() );

    if ( !Array.isArray( target.atoms ) ) {

      throw new AtomsMissingException();

    }

    for ( const index in Object.keys( target.atoms ) ) {

      target.atoms[ index ] = Atom.jsonToObject( JSON.stringify( target.atoms[ index ] ) );

      for ( const property of [ 'position', 'walletAddress', 'isotope' ] ) {

        if ( typeof target.atoms[ index ][ property ] === 'undefined'
          || null === target.atoms[ index ][ property ]
        ) {

          throw new AtomsMissingException( 'The required properties of the atom are not filled.' );

        }

      }

    }

    for ( const property in target ) {

      if ( target.hasOwnProperty( property )
        && !properties.includes( property )
      ) {

        delete target[ property ];

      }

    }

    target.atoms = Atom.sortAtoms( target.atoms );

    return target;

  }

  /**
   *
   * @param {Wallet} senderWallet
   * @returns {boolean}
   */
  check ( senderWallet = null ) {

    return Molecule.verify( this, senderWallet )

  }

  /**
   * @param {Molecule} molecule
   * @param {Wallet} senderWallet
   * @return {boolean}
   */
  static verify ( molecule, senderWallet = null ) {

    return CheckMolecule.molecularHash( molecule )
      && CheckMolecule.ots( molecule )
      && CheckMolecule.index( molecule )
      && CheckMolecule.isotopeM( molecule )
      && CheckMolecule.isotopeT( molecule )
      && CheckMolecule.isotopeV( molecule, senderWallet );

  }

  /**
   *
   * @returns {number}
   */
  generateIndex () {

    return Molecule.generateNextAtomIndex( this.atoms );

  }

  /**
   *
   * @param {Array} atoms
   * @returns {number}
   */
  static generateNextAtomIndex ( atoms ) {

    const length = atoms.length - 1;

    return ( length > -1 ) ? atoms[length].index + 1 : 0;

  }

}

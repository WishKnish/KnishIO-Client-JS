// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import Atom from './Atom';
import { shake256, } from 'js-sha3';
import { chunkSubstr, compress, decompress, } from './libraries/strings';
import bigInt from 'big-integer';
import Wallet from './Wallet';
import AtomsNotFoundException from './exception/AtomsNotFoundException';
import { generateBundleHash } from "./libraries/crypto";

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
   * Initialize a V-type molecule to transfer value from one wallet to another, with a third,
   * regenerated wallet receiving the remainder
   *
   * @param {Wallet} sourceWallet
   * @param {Wallet} recipientWallet
   * @param {Wallet} remainderWallet
   * @param {*} value
   * @returns {Array}
   */
  initValue ( sourceWallet, recipientWallet, remainderWallet, value ) {
    this.molecularHash = null;
    const position = bigInt(
      sourceWallet.position,
      16
    );

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      new Atom(
        position.toString( 16 ),
        sourceWallet.address,
        'V',
        sourceWallet.token,
        -value,
        'remainderWallet',
        remainderWallet.address,
        { 'remainderPosition': remainderWallet.position },
        null
      )
    );

    // Initializing a new Atom to add tokens to recipient
    this.atoms.push(
      new Atom(
        position.add( 1 ).toString( 16 ),
        recipientWallet.address,
        'V',
        sourceWallet.token,
        value,
        'walletBundle',
        recipientWallet.bundle,
        null,
        null
      )
    );

    return this.atoms;
  }

  /**
   * Initialize a C-type molecule to issue a new type of token
   *
   * @param {Wallet} sourceWallet - wallet signing the transaction. This should ideally be the USER wallet.
   * @param {Wallet} recipientWallet - wallet receiving the tokens. Needs to be initialized for the new token beforehand.
   * @param {number} amount - how many of the token we are initially issuing (for fungible tokens only)
   * @param {Array | Object} tokenMeta - additional fields to configure the token
   * @returns {Array}
   */
  initTokenCreation ( sourceWallet, recipientWallet, amount, tokenMeta ) {
    this.molecularHash = null;
    const metas = Atom.normalizeMeta( tokenMeta );

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
        'token',
        recipientWallet.token,
        metas,
        null
      )
    );

    return this.atoms;
  }

  /**
   * Initialize an M-type molecule with the given data
   *
   * @param {Wallet} wallet
   * @param {Array | Object} meta
   * @param {string} metaType
   * @param {string} metaId
   * @returns {Array}
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
        metaType,
        metaId,
        meta,
        null
      )
    );

    return this.atoms;
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
   * @throws {AtomsNotFoundException}
   */
  sign ( secret, anonymous = false, compressed = true ) {
    // Do we have atoms?
    if ( 0 === this.atoms.length ||
      0 !== this.atoms.filter(
        atom => !( atom instanceof Atom )
      ).length
    ) {
      throw new AtomsNotFoundException();
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
      normalizedHash = Molecule.normalize( Molecule.enumerate( this.molecularHash ) );

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
      signatureFragments = compress( signatureFragments );
    }

    // Chunking the signature across multiple atoms
    const chunkedSignature = chunkSubstr( signatureFragments, Math.round( signatureFragments.length / this.atoms.length ) );
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
   * @throws {AtomsNotFoundException}
   */
  static jsonToObject ( json ) {
    const target = Object.assign( new Molecule(), JSON.parse( json ) ),
      properties = Object.keys( new Molecule() );

    if ( !Array.isArray( target.atoms ) ) {
      throw new AtomsNotFoundException();
    }

    for ( const index in Object.keys( target.atoms ) ) {
      target.atoms[ index ] = Atom.jsonToObject( JSON.stringify( target.atoms[ index ] ) );

      for ( const property of [ 'position', 'walletAddress', 'isotope' ] ) {
        if ( typeof target.atoms[ index ][ property ] === 'undefined'
          || null === target.atoms[ index ][ property ]
        ) {
          throw new AtomsNotFoundException( 'The required properties of the atom are not filled.' );
        }
      }
    }

    for ( const property in target ) {
      if ( target.hasOwnProperty( property )
        && !properties.includes( property )
      ) {
        delete target[ property ]
      }
    }

    return target;
  }

  /**
   * @param {Molecule} molecule
   * @return {boolean}
   */
  static verify ( molecule ) {
    return this.verifyMolecularHash( molecule )
      && this.verifyOts( molecule )
      && this.verifyTokenIsotopeV( molecule )
  }

  /**
   * @param {Molecule} molecule
   * @return {boolean}
   * @throws {TypeError}
   */
  static verifyTokenIsotopeV ( molecule ) {
    if ( 0 < molecule.atoms.length
      && null !== molecule.molecularHash
    ) {
      const vAtoms = molecule.atoms.filter(
        atom => ( 'V' === atom.isotope ) ? atom : false
      );

      for ( const token of [ ...new Set( vAtoms.map( atom => atom.token ) ) ] ) {
        const total = vAtoms.filter(
          atom => token === atom.token
        )
          .map( atom => {
            const target = atom.value * 1;
            if ( Number.isNaN( target ) ) {
              throw new TypeError( 'Invalid isotope "V" values' );
            }
            return target;
          } )
          .reduce(
            ( accumulator, value ) => accumulator + value
          );

        if ( 0 !== total ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @param {Molecule} molecule
   * @return {boolean}
   */
  static verifyMolecularHash ( molecule ) {
    if ( 0 < molecule.atoms.length
      && null !== molecule.molecularHash
    ) {
      const atomicHash = Atom.hashAtoms( molecule.atoms ),
        result = ( atomicHash === molecule.molecularHash );

      if ( !result ) {
        console.error( `verifyMolecularHash(): ${ atomicHash } ${ result ? '=' : '!' }== ${ molecule.molecularHash }` );
      }
      return result;
    }
    return false;
  }

  /**
   * Checks if the provided molecule was signed properly by transforming a collection of signature
   * fragments from its atoms and its molecular hash into a single-use wallet address to be matched
   * against the sender’s address. If it matches, the molecule was correctly signed.
   *
   * @param {Molecule} molecule
   * @returns {boolean}
   */
  static verifyOts ( molecule ) {
    if ( 0 < molecule.atoms.length && null !== molecule.molecularHash ) {

      const atoms = [ ...molecule.atoms ],

        // First atom's wallet is what the molecule must be signed with
        firstAtom = atoms.sort( Atom.comparePositions )[ 0 ],

        // Convert Hm to numeric notation via EnumerateMolecule(Hm)
        enumeratedHash = Molecule.enumerate( molecule.molecularHash ),
        normalizedHash = Molecule.normalize( enumeratedHash );

      let ots = atoms.map(
        atom => atom.otsFragment
      ).reduce(
        ( accumulator, otsFragment ) => accumulator + otsFragment
      );

      // Wrong size? Maybe it's compressed
      if ( ots.length !== 2048 ) {
        // Attempting decompression
        ots = decompress( ots );

        // Still wrong? That's a failure
        if ( ots.length !== 2048 ) {
          return false;
        }
      }

      // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
      const otsChunks = chunkSubstr( ots, 128 );

      let keyFragments = '';
      for ( const index in otsChunks ) {
        let workingChunk = otsChunks[ index ];

        for ( let iterationCount = 0, condition = 8 + normalizedHash[ index ]; iterationCount < condition; iterationCount++ ) {
          workingChunk = shake256.create( 512 ).update( workingChunk ).hex();
        }
        keyFragments += workingChunk;
      }

      // Absorb the hashed Kk into the sponge to receive the digest Dk
      const digest = shake256.create( 8192 ).update( keyFragments ).hex(),
        // Squeeze the sponge to retrieve a 128 byte (64 character) string that should match the sender’s wallet address
        address = shake256.create( 256 ).update( digest ).hex(),
        result = ( address === firstAtom.walletAddress );

      if ( !result ) {
        console.error( `verifyOts(): ${ address } ${ result ? '=' : '!' }== ${ firstAtom.walletAddress }` );
      }
      return result;
    }
    return false;
  }

  /**
   * Accept a string of letters and numbers, and outputs a collection of decimals representing each
   * character according to a pre-defined dictionary. Input string would typically be 64-character
   * hexadecimal string featuring numbers from 0 to 9 and characters from a to f - a total of 15
   * unique symbols. To ensure that string has an even number of symbols, convert it to Base 17
   * (adding G as a possible symbol). Map each symbol to integer values as follows:
   *  0   1   2   3   4   5   6   7  8  9  a   b   c   d   e   f   g
   * -8  -7  -6  -5  -4  -3  -2  -1  0  1  2   3   4   5   6   7   8
   *
   * @param {string} hash
   * @returns {Array}
   */
  static enumerate ( hash ) {
    const mapped = {
        '0': -8,
        '1': -7,
        '2': -6,
        '3': -5,
        '4': -4,
        '5': -3,
        '6': -2,
        '7': -1,
        '8': 0,
        '9': 1,
        'a': 2,
        'b': 3,
        'c': 4,
        'd': 5,
        'e': 6,
        'f': 7,
        'g': 8,
      },
      target = [],
      hashList = hash.toLowerCase().split( '' );

    for ( let index = 0, len = hashList.length; index < len; ++index ) {
      const symbol = hashList[ index ];

      if ( typeof mapped[ symbol ] !== 'undefined' ) {
        target[ index ] = mapped[ symbol ];
      }
    }
    return target;
  }

  /**
   * Normalize enumerated string to ensure that the total sum of all symbols is exactly zero. This
   * ensures that exactly 50% of the WOTS+ key is leaked with each usage, ensuring predictable key
   * safety:
   * The sum of each symbol within Hm shall be presented by m
   *  While m0 iterate across that set’s integers as Im:
   *    If m0 and Im>-8 , let Im=Im-1
   *    If m<0 and Im<8 , let Im=Im+1
   *    If m=0, stop the iteration
   *
   * @param {Array} mappedHashArray
   * @returns {*}
   */
  static normalize ( mappedHashArray ) {
    let total = mappedHashArray.reduce( ( total, num ) => total + num );
    const total_condition = total < 0;

    while ( total < 0 || total > 0 ) {
      for ( const index of Object.keys( mappedHashArray ) ) {
        const condition = total_condition ? mappedHashArray[ index ] < 8 : mappedHashArray[ index ] > -8;

        if ( condition ) {
          const process = total_condition ? [ ++mappedHashArray[ index ], ++total ] : [ --mappedHashArray[ index ], --total ];

          if ( 0 === total ) {
            break;
          }
        }
      }
    }
    return mappedHashArray;
  }
}

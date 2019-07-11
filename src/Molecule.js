// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import Atom from './Atom';
import { shake256, } from 'js-sha3';
import { chunkSubstr, } from './util/strings';
import bigInt from 'big-integer';
import Wallet from './Wallet';

export default class Molecule {

  /**
   * Molecule constructor.
   * @param cellSlug
   * @param bundle
   */
  constructor(cellSlug = null, bundle = null) {
    this.molecularHash = null;
    this.cellSlug = cellSlug;
    this.bundle = bundle;
    this.status = null;
    this.createdAt = +new Date;
    this.atoms = [];
  }

  /**
   * Initialize a V-type molecule to transfer value from one wallet to another, with a third,
   * regenerated wallet receiving the remainder
   *
   * @param sourceWallet
   * @param recipientWallet
   * @param remainderWallet
   * @param value
   * @returns String
   */
  initValue(sourceWallet, recipientWallet, remainderWallet, value)
  {
    let position = bigInt(sourceWallet.position, 16);

    this.atoms = [
      // Initializing a new Atom to remove tokens from source
      new Atom(
        position.toString(16),
        sourceWallet.address,
        'V',
        sourceWallet.token,
        -value,
        'remainderWallet',
        remainderWallet.address,
        null,
        null),

      // Initializing a new Atom to add tokens to recipient
      new Atom(
        position.add(1).toString(16),
        recipientWallet.address,
        'V',
        sourceWallet.token,
        value,
        'walletBundle',
        recipientWallet.bundle,
        null,
        null),
    ];

    this.molecularHash = Atom.hashAtoms(this.atoms);
    // console.log(`initMeta(): molecular hash - ${ this.molecularHash }`);

    return this.molecularHash;
  }

  /**
   * Initialize a C-type molecule to issue a new type of token
   *
   * @param sourceWallet - wallet signing the transaction. This should ideally be the USER wallet.
   * @param recipientWallet - wallet receiving the tokens. Needs to be initialized for the new token beforehand.
   * @param amount - how many of the token we are initially issuing (for fungible tokens only)
   * @param tokenMeta - additional fields to configure the token
   * @returns String
   */
  initTokenCreation(sourceWallet, recipientWallet, amount, tokenMeta)
  {
    // The primary atom tells the ledger that a certain amount of the new token is being issued.
    this.atoms[0] = new Atom(
      sourceWallet.position,
      sourceWallet.address,
      'C',
      sourceWallet.token,
      amount,
      'token',
      recipientWallet.token,
      tokenMeta,
      null);


    // Secondary atom delivers token supply to the destination wallet
    if(amount)
    {
      this.atoms[1] = new Atom(
        recipientWallet.position,
        recipientWallet.address,
        'V',
        recipientWallet.token,
        amount,
        null,
        null,
        null,
        null);
    }

    this.molecularHash = Atom.hashAtoms(this.atoms);
    // console.log(`initMeta(): molecular hash - ${ this.molecularHash }`);

    return this.molecularHash;
  }


  /**
   * Initialize an M-type molecule with the given data
   *
   * @param wallet
   * @param meta
   * @param metaType
   * @param metaId
   * @returns String
   */
  initMeta(wallet, meta, metaType, metaId)
  {
    // Initializing a new Atom to hold our metadata
    this.atoms = [
      new Atom(
        wallet.position,
        wallet.address,
        'M',
        wallet.token,
        null,
        metaType,
        metaId,
        meta,
        null),
    ];
    this.molecularHash = Atom.hashAtoms(this.atoms);
    // console.log(`initMeta(): molecular hash - ${ this.molecularHash }`);

    return this.molecularHash;
  }

  /**
   * Creates a one-time signature for a molecule and breaks it up across multiple atoms within that
   * molecule. Resulting 4096 byte (2048 character) string is the one-time signature.
   *
   * @param secret
   * @returns {*}
   */
  sign(secret) {
    // console.log('sign(): START');
    // console.log(`sign(): molecular hash: ${ this.molecularHash }`);

    // Determine first atom
    let firstAtom = null;
    this.atoms.forEach(function(atom) {
      if(!firstAtom)
        firstAtom = atom;
      return atom;
    });

    // Generate the private signing key for this molecule
    const key = Wallet.generateWalletKey(secret, firstAtom.token, firstAtom.position);
    // console.log(`sign(): wallet key for token ${ firstAtom.token }, pos ${ firstAtom.position }: ${ key }`);

    // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
    const keyChunks = chunkSubstr(key, 128);
    // console.log(`sign(): number of key chunks - ${ Object.keys(keyChunks).length }`);

    // Convert Hm to numeric notation via EnumerateMolecule(Hm)
    const enumeratedHash = Molecule.enumerate(this.molecularHash);
    // console.log(`sign(): enumerated hash - ${ enumeratedHash }`);

    const normalizedHash = Molecule.normalize(enumeratedHash);
    // console.log(`sign(): normalized hash - ${ normalizedHash }`);

    // Building a one-time-signature
    let signatureFragments = '';
    keyChunks.forEach(function(keyChunk, index){
      // Iterate a number of times equal to 8-Hm[i]
      let workingChunk = keyChunk;
      for(let iterationCount = 0; iterationCount < (8 - normalizedHash[index]); iterationCount++)
      {
        // console.log(`sign(): atom ${ atom.position } fragment ${ index }, hashing ${ iterationCount } times`);
        let workingChunkSponge = shake256.create(512);
        workingChunkSponge.update(workingChunk);
        workingChunk = workingChunkSponge.hex(); // bigInt.fromArray(workingChunkSponge.array(), 256, false).toString(16).padStart(64, '0');
      }
      // console.log(`sign(): atom ${ atom.position } fragment ${ index }, hashed ${ String(8 - normalizedHash[index]).padStart(2, '0') } times:`);
      // console.log(workingChunk);
      signatureFragments += workingChunk;
    });

    // Chunking the signature across multiple atoms
    const chunkedSignature = chunkSubstr(signatureFragments, Math.round(2048 / this.atoms.length));
    let lastPosition = null;
    for(let chunkCount = 0; chunkCount < chunkedSignature.length; chunkCount++)
    {
      this.atoms[chunkCount].otsFragment = chunkedSignature[chunkCount];
      lastPosition = this.atoms[chunkCount].position;
      // console.log(`sign(): atom ${ this.atoms[chunkCount].position } signature fragment length - ${ this.atoms[chunkCount].otsFragment.length }`);
      // console.log(`sign(): atom ${ this.atoms[chunkCount].position } signature fragment - ${ this.atoms[chunkCount].otsFragment }`);
    }
    // console.log('sign(): FINISH');
    return lastPosition;
  }

  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @param molecule
   * @return {boolean}
   */
  static verifyMolecularHash(molecule) {
    const atomicHash = Atom.hashAtoms(molecule.atoms);
    const result = (atomicHash === molecule.molecularHash);

    if(!result)
      console.log(`verifyMolecularHash(): ${ atomicHash } ${ result ? '=' : '!' }== ${ molecule.molecularHash }`);

    return result;
  }

  /**
   * Checks if the provided molecule was signed properly by transforming a collection of signature
   * fragments from its atoms and its molecular hash into a single-use wallet address to be matched
   * against the sender’s address. If it matches, the molecule was correctly signed.
   *
   * @param molecule
   * @returns {boolean}
   */
  static verifyOts(molecule)
  {
    // console.log('verifyOts(): START');
    // console.log(molecule);

    let atoms = molecule.atoms;
    //console.log(atoms);
    atoms.sort(Atom.comparePositions);
    //console.log(atoms);

    // Determine first atom
    let firstAtom = null;
    atoms.forEach(function(atom) {
      if(!firstAtom)
        firstAtom = atom;
      return atom;
    });

    // Convert Hm to numeric notation via EnumerateMolecule(Hm)
    const enumeratedHash = Molecule.enumerate(molecule.molecularHash);
    // console.log(`sign(): enumerated hash - ${ enumeratedHash }`);

    const normalizedHash = Molecule.normalize(enumeratedHash);
    // console.log(`sign(): normalized hash - ${ normalizedHash }`);

    // Rebuilding OTS out of all the atoms
    let ots = '';
    atoms.forEach(function(atom) {
      ots += atom.otsFragment;
      // console.log(`verifyOts(): atom ${ atom.position } ots fragment length - ${ atom.otsFragment.length }`);
      // console.log(`verifyOts(): atom ${ atom.position } ots fragment - ${ atom.otsFragment }`);
    });

    // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
    const otsChunks = chunkSubstr(ots, 128);
    // console.log(`verifyOts(): number of ots chunks - ${ Object.keys(otsChunks).length }`);

    let keyFragments = '';
    otsChunks.forEach(function(otsChunk, index){
      // Iterate a number of times equal to 8+Hm[i]
      let workingChunk = otsChunk;
      for(let iterationCount = 0; iterationCount < (8 + normalizedHash[index]); iterationCount++)
      {
        // console.log(`verifyOts(): chunk ${ index }, hashing ${ iterationCount } times - ${ workingChunk }`);
        let workingChunkSponge = shake256.create(512);
        workingChunkSponge.update(workingChunk);
        workingChunk = workingChunkSponge.hex(); // bigInt.fromArray(workingChunkSponge.array(), 256, false).toString(16).padStart(64, '0');
      }
      keyFragments += workingChunk; // otsHashFragment;
      // console.log(`verifyOts(): #${ String(index).padStart(2, '0') }, ${ String(8 + normalizedHash[index]).padStart(2, '0') } times vs  ${ String(8 - normalizedHash[index]).padStart(2, '0') } times:`);
      // console.log(`${ workingChunk } vs ${ otsChunk } - ${ otsChunk === workingChunk ? 'MATCH' : 'NO' }`);
    });

    // console.log(`verifyOts(): ots hash length: ${ keyFragments.length }`);
    // console.log(`verifyOts(): ots hash: ${ keyFragments }`);

    // Absorb the hashed Kk into the sponge to receive the digest Dk
    const digestSponge = shake256.create(8192);
    digestSponge.update(keyFragments);
    const digest = digestSponge.hex(); // bigInt.fromArray(digestSponge.array(), 256, false).toString(16).padStart(2048, '0');

    // console.log(`verifyOts(): digest length: ${ digest.length }`);
    // console.log(`verifyOts(): digest: ${ digest }`);

    // Squeeze the sponge to retrieve a 128 byte (64 character) string that should match the sender’s wallet address
    const addressSponge = shake256.create(256);
    addressSponge.update(digest);
    const address = addressSponge.hex(); // bigInt.fromArray(addressSponge.array(), 256, false).toString(16).padStart(64, '0');
    // console.log(`verifyOts(): ${ address } vs *${ firstAtom.walletAddress }`);
    // console.log('verifyOts(): FINISH');

    const result = (address === firstAtom.walletAddress);

    if(!result)
      console.log(`verifyOts(): ${ address } ${ result ? '=' : '!' }== ${ firstAtom.walletAddress }`);

    return result;
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
   * @param hash
   * @returns {Array}
   */
  static enumerate(hash) {
    // console.log(`enumerate(): hash - ${ hash }`);

    let mappedHashArray = [];
    hash.toLowerCase().split('').forEach(function(symbol, index){
      switch(String(symbol))
      {
        case '0':
          mappedHashArray[index] = -8;
          break;
        case '1':
          mappedHashArray[index] = -7;
          break;
        case '2':
          mappedHashArray[index] = -6;
          break;
        case '3':
          mappedHashArray[index] = -5;
          break;
        case '4':
          mappedHashArray[index] = -4;
          break;
        case '5':
          mappedHashArray[index] = -3;
          break;
        case '6':
          mappedHashArray[index] = -2;
          break;
        case '7':
          mappedHashArray[index] = -1;
          break;
        case '8':
          mappedHashArray[index] = 0;
          break;
        case '9':
          mappedHashArray[index] = 1;
          break;
        case 'a':
          mappedHashArray[index] = 2;
          break;
        case 'b':
          mappedHashArray[index] = 3;
          break;
        case 'c':
          mappedHashArray[index] = 4;
          break;
        case 'd':
          mappedHashArray[index] = 5;
          break;
        case 'e':
          mappedHashArray[index] = 6;
          break;
        case 'f':
          mappedHashArray[index] = 7;
          break;
        case 'g':
          mappedHashArray[index] = 8;
          break;
        default:
        // console.log(`This should not happen: ${ symbol }`);
      }
    });

    return mappedHashArray;
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
   * @param mappedHashArray
   * @returns {*}
   */
  static normalize(mappedHashArray)
  {
    let total = mappedHashArray.reduce(function(total, num){
      return total + num;
    });

    if(total > 0)
    {
      while(total > 0){
        for(let index = 0; index < Object.keys(mappedHashArray).length; index++){
          if(mappedHashArray[index] > -8) {
            mappedHashArray[index] -= 1;
            total -= 1;
            if(total === 0)
              break;
          }
        }
      }
    }
    else{
      while(total < 0){
        for(let index = 0; index < Object.keys(mappedHashArray).length; index++){
          if(mappedHashArray[index] < 8) {
            mappedHashArray[index] += 1;
            total += 1;
            if(total === 0)
              break;
          }
        }
      }
    }

    return mappedHashArray;
  }
}

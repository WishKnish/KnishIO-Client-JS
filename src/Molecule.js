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
import Atom from './Atom';
import Wallet from './Wallet';
import Meta from './Meta';
import { shake256, } from 'js-sha3';
import { chunkSubstr, hexToBase64, } from './libraries/strings';
import CheckMolecule from './libraries/check';
import { generateBundleHash } from "./libraries/crypto";
import AtomsMissingException from "./exception/AtomsMissingException";
import BalanceInsufficientException from "./exception/BalanceInsufficientException";
import MetaMissingException from "./exception/MetaMissingException";
import NegativeAmountException from "./exception/NegativeAmountException";
import MoleculeStructure from "./MoleculeStructure";

const merge = require( 'lodash.merge' );

/**
 * Molecule class used for committing changes to the ledger
 */
export default class Molecule extends MoleculeStructure {

  /**
   * Class constructor
   *
   * @param {string} secret
   * @param {Wallet} sourceWallet
   * @param {Wallet} remainderWallet
   * @param {string|null} cellSlug
   */
  constructor ( secret, sourceWallet = null, remainderWallet = null, cellSlug = null ) {

    super( cellSlug );
    this.secret = secret;
    this.sourceWallet = sourceWallet;
    this.atoms = [];

    // Set the remainder wallet for this transaction
    if ( remainderWallet || sourceWallet ) {
      this.remainderWallet = remainderWallet || Wallet.create( secret, sourceWallet.batchId, sourceWallet.characters );
    }

    this.clear();
  }

  /**
   * Merge two metadata arrays or objects
   *
   * @param {Array|Object} first
   * @param {Array|Object} second
   * @returns {Object}
   */
  static mergeMetas ( first, second = {} ) {
    return merge( first || {}, second );
  }

  /**
   * Verifies the validity of a Molecule
   *
   * @param {Molecule} molecule
   * @param {Wallet} senderWallet
   * @return {boolean}
   */
  static verify ( molecule, senderWallet = null ) {

    return CheckMolecule.molecularHash( molecule )
      && CheckMolecule.ots( molecule )
      && CheckMolecule.index( molecule )
      && CheckMolecule.continuId( molecule )
      && CheckMolecule.isotopeM( molecule )
      && CheckMolecule.isotopeT( molecule )
      && CheckMolecule.isotopeC( molecule )
      && CheckMolecule.isotopeU( molecule )
      && CheckMolecule.isotopeI( molecule )
      && CheckMolecule.isotopeV( molecule, senderWallet );
  }

  /**
   * Generates the next atomic index
   *
   * @param {Array} atoms
   * @returns {number}
   */
  static generateNextAtomIndex ( atoms ) {

    const length = atoms.length - 1;

    return ( length > -1 ) ? atoms[ length ].index + 1 : 0;
  }

  /**
   * Returns the Meta Type for ContinuID
   *
   * @returns {string}
   */
  continuIdMetaType () {
    return 'walletBundle';
  }

  /**
   * Fills a Molecule's properties with the provided object
   *
   * @param {MoleculeStructure} moleculeStructure
   */
  fill ( moleculeStructure ) {
    for ( let key in Object.keys( moleculeStructure ) ) {
      this[ key ] = moleculeStructure[ key ];
    }
  }

  /**
   * Encrypts data for yourself or for sharing with an
   * arbitrary number of third parties
   *
   * @param {Array} data
   * @param {Array} shared_wallets
   */
  encryptMessage ( data, shared_wallets = [] ) {
    const target = [ data, this.sourceWallet.pubkey, ];

    // If we have a list of third-party wallets, add their keys to the list
    for ( let wallet of shared_wallets ) {
      target.push( wallet.pubkey );
    }

    return this.sourceWallet.encryptMessage( ...target );
  }

  /**
   * Adds an atom to an existing Molecule
   *
   * @param {Atom} atom
   * @returns {Molecule}
   */
  addAtom ( atom ) {
    this.molecularHash = null;
    this.atoms.push( atom );
    this.atoms = Atom.sortAtoms( this.atoms );
    return this;
  }

  /**
   * Replenishes non-finite token supplies
   *
   * @param {number} value
   * @param {string} token
   * @param {Array|Object} metas
   * @returns {Molecule}
   */
  replenishTokens ( value, token, metas ) {
    const aggregateMeta = Meta.aggregateMeta( Meta.normalizeMeta( metas ) );
    aggregateMeta.action = 'add';

    for ( let key of [ 'address', 'position', 'batchId', ] ) {
      if ( typeof aggregateMeta[ key ] === 'undefined' ) {
        throw new MetaMissingException( `Missing ${ key } in meta` );
      }
    }

    this.molecularHash = null;

    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'C',
        this.sourceWallet.token,
        value,
        this.sourceWallet.batchId,
        'token',
        token,
        Molecule.mergeMetas(
          {
            'pubkey': this.sourceWallet.pubkey,
            'characters': this.sourceWallet.characters
          },
          aggregateMeta
        ),
        null,
        this.generateIndex()
      )
    );

    this.addUserRemainderAtom( this.remainderWallet );
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Add user remainder atom for ContinuID
   *
   * @param {Wallet} userRemainderWallet
   * @returns {Molecule}
   */
  addUserRemainderAtom ( userRemainderWallet ) {

    this.molecularHash = null;

    // Remainder atom
    this.atoms.push(
      new Atom(
        userRemainderWallet.position,   // {string} position
        userRemainderWallet.address,    // {string} walletAddress
        'I',                     // {string} isotope
        userRemainderWallet.token,      // {string | null} token
        null,                     // {string | number | null} value
        null,                   // {string} batchId
        'walletBundle',       // {string | null} metaType
        userRemainderWallet.bundle,    // {string | null} metaId
        {
          'pubkey': userRemainderWallet.pubkey,
          'characters': userRemainderWallet.characters,
        },                             // {Array | Object | null} meta
        null,                // {string | null} otsFragment
        this.generateIndex()            // {number | null} index
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Burns some amount of tokens from a wallet
   *
   * @param {number} value
   * @param {string} walletBundle
   * @returns {Molecule}
   */
  burnTokens ( value, walletBundle = null ) {

    if ( value < 0.0 ) {
      throw new NegativeAmountException( 'Amount to burn must be positive!' );
    }

    if ( ( this.sourceWallet.balance - value ) < 0 ) {
      throw new BalanceInsufficientException();
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'V',
        this.sourceWallet.token,
        -value,
        this.sourceWallet.batchId,
        null,
        null,
        {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
        },
        null,
        this.generateIndex()
      )
    );

    this.atoms.push(
      new Atom(
        this.remainderWallet.position,
        this.remainderWallet.address,
        'V',
        this.sourceWallet.token,
        this.sourceWallet.balance - value,
        this.remainderWallet.batchId,
        walletBundle ? 'walletBundle' : null,
        walletBundle,
        {
          'pubkey': this.remainderWallet.pubkey,
          'characters': this.remainderWallet.characters,
        },
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
   * @param {Wallet} recipientWallet
   * @param {*} value
   * @returns {Molecule}
   */
  initValue ( recipientWallet, value ) {

    if ( this.sourceWallet.balance - value < 0 ) {
      throw new BalanceInsufficientException();
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'V',
        this.sourceWallet.token,
        -value,
        this.sourceWallet.batchId,
        null,
        null,
        {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
        },
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
        this.sourceWallet.token,
        value,
        recipientWallet.batchId,
        'walletBundle',
        recipientWallet.bundle,
        {
          'pubkey': recipientWallet.pubkey,
          'characters': recipientWallet.characters,
        },
        null,
        this.generateIndex()
      )
    );

    this.atoms.push(
      new Atom(
        this.remainderWallet.position,
        this.remainderWallet.address,
        'V',
        this.sourceWallet.token,
        this.sourceWallet.balance - value,
        this.remainderWallet.batchId,
        'walletBundle',
        this.sourceWallet.bundle,
        {
          'pubkey': this.remainderWallet.pubkey,
          'characters': this.remainderWallet.characters,
        },
        null,
        this.generateIndex()
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Builds Atoms to define a new wallet on the ledger
   *
   * @param {Wallet} newWallet
   * @returns {Molecule}
   */
  initWalletCreation ( newWallet ) {

    this.molecularHash = null;

    const metas = {
      'address': newWallet.address,
      'token': newWallet.token,
      'bundle': newWallet.bundle,
      'position': newWallet.position,
      'amount': 0,
      'batch_id': newWallet.batchId,
      'pubkey': newWallet.pubkey,
      'characters': newWallet.characters,
    };

    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'C',
        this.sourceWallet.token,
        null,
        this.sourceWallet.batchId,
        'wallet',
        newWallet.address,
        metas,
        null,
        this.generateIndex()
      )
    );

    this.addUserRemainderAtom( this.remainderWallet );
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Builds Atoms to define a new identifier on the ledger
   *
   * @param {string} type - phone or email
   * @param {string} contact - phone number or email string
   * @param {string} code -
   *
   * @returns {Molecule}
   */
  initIdentifierCreation ( type, contact, code ) {

    this.molecularHash = null;

    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'C',
        this.sourceWallet.token,
        null,
        null,
        'identifier',
        type,
        {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
          'code': code,
          'hash': generateBundleHash( source.trim() ),
        },
        null,
        this.generateIndex()
      )
    );

    this.addUserRemainderAtom( this.remainderWallet );
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Initialize a C-type molecule to issue a new type of token
   *
   * @param {Wallet} recipientWallet - wallet receiving the tokens. Needs to be initialized for the new token beforehand.
   * @param {number} amount - how many of the token we are initially issuing (for fungible tokens only)
   * @param {Array | Object} tokenMeta - additional fields to configure the token
   * @returns {Molecule}
   */
  initTokenCreation ( recipientWallet, amount, tokenMeta ) {

    this.molecularHash = null;

    const metas = Meta.normalizeMeta( tokenMeta );

    for ( const walletKey of [ 'walletAddress', 'walletPosition', 'walletPubkey', 'walletCharacters' ] ) {

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
        this.sourceWallet.position,
        this.sourceWallet.address,
        'C',
        this.sourceWallet.token,
        amount,
        recipientWallet.batchId,
        'token',
        recipientWallet.token,
        Molecule.mergeMetas( {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
        }, metas ),
        null,
        this.generateIndex()
      )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Arranges Atoms to claim a shadow wallet
   *
   * @param {Wallet} shadowWallet
   * @param {Array|Object} tokenMeta
   * @returns {Molecule}
   */
  initShadowWalletClaim ( shadowWallet, tokenMeta = {} ) {

    this.molecularHash = null;

    // Create an 'C' atom
    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'C',
        this.sourceWallet.token,
        null,
        shadowWallet.batchId,
        'shadowWallet',
        shadowWallet.token,
        Molecule.mergeMetas( {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
        }, tokenMeta ),
        null,
        this.generateIndex()
      )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Initialize an M-type molecule with the given data
   *
   * @param {Array | Object} meta
   * @param {string} metaType
   * @param {string} metaId
   * @returns {Molecule}
   */
  initMeta ( meta, metaType, metaId ) {

    this.molecularHash = null;

    // Initializing a new Atom to hold our metadata
    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'M',
        this.sourceWallet.token,
        null,
        this.sourceWallet.batchId,
        metaType,
        metaId,
        Molecule.mergeMetas( {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
        }, meta ),
        null,
        this.generateIndex()
      )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Arranges atoms to request tokens from the node itself
   *
   * @param {string} token
   * @param {number} amount
   * @param {string} metaType
   * @param {string} metaId
   * @param {Array|Object} meta
   *
   * @returns {Molecule}
   */
  initTokenRequest ( token, amount, metaType, metaId, meta = {} ) {

    this.molecularHash = null;

    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'T',
        this.sourceWallet.token,
        amount,
        null,
        metaType,
        metaId,
        Molecule.mergeMetas( {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
          'token': token,
        }, meta ),
        null,
        this.generateIndex()
      )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Arranges atoms to request an authorization token from the node
   *
   * @returns {Molecule}
   */
  initAuthorization () {
    this.molecularHash = null;

    // Initializing a new Atom to hold our metadata
    this.atoms.push(
      new Atom(
        this.sourceWallet.position,
        this.sourceWallet.address,
        'U',
        this.sourceWallet.token,
        null,
        this.sourceWallet.batchId,
        null,
        null,
        {
          'pubkey': this.sourceWallet.pubkey,
          'characters': this.sourceWallet.characters,
        },
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

    this.molecularHash = null;
    this.bundle = null;
    this.status = null;
    this.createdAt = String(
      +new Date
    );
    this.atoms = [];

    return this;
  }

  /**
   * Creates a one-time signature for a molecule and breaks it up across multiple atoms within that
   * molecule. Resulting 4096 byte (2048 character) string is the one-time signature, which is then compressed.
   *
   * @param {boolean} anonymous
   * @param {boolean} compressed
   * @returns {*}
   * @throws {AtomsMissingException}
   */
  sign ( anonymous = false, compressed = true ) {

    // Do we have atoms?
    if ( this.atoms.length === 0 ||
      this.atoms.filter(
        atom => !( atom instanceof Atom )
      ).length !== 0
    ) {
      throw new AtomsMissingException();
    }

    // Derive the user's bundle
    if ( !anonymous ) {
      this.bundle = generateBundleHash( this.secret );
    }

    // Hash atoms to get molecular hash
    this.molecularHash = Atom.hashAtoms( this.atoms );

    // Determine first atom
    const firstAtom = this.atoms[ 0 ],
      // Generate the private signing key for this molecule
      key = Wallet.generatePrivateKey( this.secret, firstAtom.token, firstAtom.position ),
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
   * Verifies the current Molecule
   *
   * @param {Wallet} senderWallet
   * @returns {boolean}
   */
  check ( senderWallet = null ) {
    return Molecule.verify( this, senderWallet )
  }

  /**
   * Generates the next atomic index
   *
   * @returns {number}
   */
  generateIndex () {
    return Molecule.generateNextAtomIndex( this.atoms );
  }
}

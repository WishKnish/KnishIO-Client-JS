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
import {
  chunkSubstr,
  hexToBase64,
} from './libraries/strings';
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
  constructor ( {
    secret,
    sourceWallet = null,
    remainderWallet = null,
    cellSlug = null,
  } ) {

    super( cellSlug );
    this.secret = secret;
    this.sourceWallet = sourceWallet;
    this.atoms = [];

    // Set the remainder wallet for this transaction
    if ( remainderWallet || sourceWallet ) {
      this.remainderWallet = remainderWallet || Wallet.create( {
        secretOrBundle: secret,
        token: sourceWallet.token,
        batchId: sourceWallet.batchId,
        characters: sourceWallet.characters,
      } );
    }

    this.clear();
  }

  /**
   * Merge two metadata arrays or objects
   *
   * @param {array|object} first
   * @param {array|object} second
   * @returns {object}
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
  static verify ( {
    molecule,
    senderWallet = null,
  } ) {

    return CheckMolecule.molecularHash( molecule )
      && CheckMolecule.ots( molecule )
      && CheckMolecule.index( molecule )
      && CheckMolecule.continuId( molecule )
      && CheckMolecule.isotopeM( molecule )
      && CheckMolecule.isotopeT( molecule )
      && CheckMolecule.isotopeC( molecule )
      && CheckMolecule.isotopeU( molecule )
      && CheckMolecule.isotopeI( molecule )
      && CheckMolecule.isotopeR( molecule )
      && CheckMolecule.isotopeV( molecule, senderWallet );
  }

  /**
   * Generates the next atomic index
   *
   * @param {array} atoms
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
   * @param {array|object} metas
   * @returns {Molecule}
   */
  replenishTokens ( {
    value,
    token,
    metas,
  } ) {
    const aggregateMeta = Meta.aggregateMeta( Meta.normalizeMeta( metas ) );
    aggregateMeta.action = 'add';

    for ( let key of [ 'address', 'position', 'batchId', ] ) {
      if ( typeof aggregateMeta[ key ] === 'undefined' ) {
        throw new MetaMissingException( `Missing ${ key } in meta` );
      }
    }

    this.molecularHash = null;

    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'C',
          token: this.sourceWallet.token,
          value,
          batchId: this.sourceWallet.batchId,
          metaType: 'token',
          metaId: token,
          meta: Molecule.mergeMetas(
            {
              pubkey: this.sourceWallet.pubkey,
              characters: this.sourceWallet.characters
            },
            aggregateMeta
          ),
          index: this.generateIndex(),
        }
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
      new Atom( {
          position: userRemainderWallet.position,
          walletAddress: userRemainderWallet.address,
          isotope: 'I',
          token: userRemainderWallet.token,
          metaType: 'walletBundle',
          metaId: userRemainderWallet.bundle,
          meta: {
            pubkey: userRemainderWallet.pubkey,
            characters: userRemainderWallet.characters,
          },
          index: this.generateIndex(),
        }
      )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Burns some amount of tokens from a wallet
   *
   * @param {number} value
   * @param {string|null} walletBundle
   * @returns {Molecule}
   */
  burnTokens ( {
    value,
    walletBundle = null,
  } ) {

    if ( value < 0.0 ) {
      throw new NegativeAmountException( 'Amount to burn must be positive!' );
    }

    if ( ( this.sourceWallet.balance - value ) < 0 ) {
      throw new BalanceInsufficientException();
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'V',
          token: this.sourceWallet.token,
          value: -value,
          batchId: this.sourceWallet.batchId,
          meta: {
            pubkey: this.sourceWallet.pubkey,
            characters: this.sourceWallet.characters,
          },
          index: this.generateIndex(),
        }
      )
    );

    this.atoms.push(
      new Atom( {
          position: this.remainderWallet.position,
          walletAddress: this.remainderWallet.address,
          isotope: 'V',
          token: this.sourceWallet.token,
          value: this.sourceWallet.balance - value,
          batchId: this.remainderWallet.batchId,
          metaType: walletBundle ? 'walletBundle' : null,
          metaId: walletBundle,
          meta: {
            pubkey: this.remainderWallet.pubkey,
            characters: this.remainderWallet.characters,
          },
          index: this.generateIndex(),
        }
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
  initValue ( {
    recipientWallet,
    value,
  } ) {

    if ( this.sourceWallet.balance - value < 0 ) {
      throw new BalanceInsufficientException();
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'V',
          token: this.sourceWallet.token,
          value: -value,
          batchId: this.sourceWallet.batchId,
          meta: {
            pubkey: this.sourceWallet.pubkey,
            characters: this.sourceWallet.characters,
          },
          index: this.generateIndex(),
        }
      )
    );

    // Initializing a new Atom to add tokens to recipient
    this.atoms.push(
      new Atom( {
          position: recipientWallet.position,
          walletAddress: recipientWallet.address,
          isotope: 'V',
          token: this.sourceWallet.token,
          value,
          batchId: recipientWallet.batchId,
          metaType: 'walletBundle',
          metaId: recipientWallet.bundle,
          meta: {
            pubkey: recipientWallet.pubkey,
            characters: recipientWallet.characters,
          },
          index: this.generateIndex(),
        }
      )
    );

    this.atoms.push(
      new Atom( {
          position: this.remainderWallet.position,
          walletAddress: this.remainderWallet.address,
          isotope: 'V',
          token: this.sourceWallet.token,
          value: this.sourceWallet.balance - value,
          batchId: this.remainderWallet.batchId,
          metaType: 'walletBundle',
          metaId: this.sourceWallet.bundle,
          meta: {
            pubkey: this.remainderWallet.pubkey,
            characters: this.remainderWallet.characters,
          },
          index: this.generateIndex(),
        }
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
      address: newWallet.address,
      token: newWallet.token,
      bundle: newWallet.bundle,
      position: newWallet.position,
      amount: 0,
      batch_id: newWallet.batchId,
      pubkey: newWallet.pubkey,
      characters: newWallet.characters,
    };

    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'C',
          token: this.sourceWallet.token,
          batchId: this.sourceWallet.batchId,
          metaType: 'wallet',
          metaId: newWallet.address,
          metas,
          index: this.generateIndex(),
        }
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
  initIdentifierCreation ( {
    type,
    contact,
    code,
  } ) {

    this.molecularHash = null;

    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'C',
          token: this.sourceWallet.token,
          metaType: 'identifier',
          metaId: type,
          meta: {
            pubkey: this.sourceWallet.pubkey,
            characters: this.sourceWallet.characters,
            code: code,
            hash: generateBundleHash( contact.trim() ),
          },
          index: this.generateIndex(),
        }
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
   * @param {array|object} meta - additional fields to configure the token
   * @returns {Molecule}
   */
  initTokenCreation ( {
    recipientWallet,
    amount,
    meta,
  } ) {

    this.molecularHash = null;

    for ( const walletKey of [ 'walletAddress', 'walletPosition', 'walletPubkey', 'walletCharacters' ] ) {
      // Importing wallet fields into meta object
      if ( !meta[ walletKey ] ) {
        meta[ walletKey ] = recipientWallet[ walletKey.toLowerCase().substr( 6 ) ]
      }
    }

    // Adding our latest public key
    meta.pubkey = this.sourceWallet.pubkey;
    meta.characters = this.sourceWallet.characters;

    // The primary atom tells the ledger that a certain amount of the new token is being issued.
    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'C',
          token: this.sourceWallet.token,
          value: amount,
          batchId: recipientWallet.batchId,
          metaType: 'token',
          metaId: recipientWallet.token,
          meta,
          index: this.generateIndex(),
        }
      )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {object|array} meta
   * @returns {Molecule}
   */
  createRule ( {
    metaType,
    metaId,
    meta,
  } ) {
    const aggregateMeta = Meta.aggregateMeta( Meta.normalizeMeta( meta ) );

    for ( let key of [ 'conditions', 'callback', 'rule' ] ) {

      if ( typeof aggregateMeta[ key ] === 'undefined' ) {
        throw new MetaMissingException( `No or not defined ${ key } in meta` );
      }

      for ( let item of [ '[object Object]', '[object Array]', ] ) {
        if ( Object.prototype.toString.call( aggregateMeta[ key ] ) === item ) {
          aggregateMeta[ key ] = JSON.stringify( aggregateMeta[ key ] );
        }
      }
    }

    // Adding our latest public key
    aggregateMeta.pubkey = this.sourceWallet.pubkey;
    aggregateMeta.characters = this.sourceWallet.characters;

    this.addAtom(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'R',
          token: this.sourceWallet.token,
          metaType,
          metaId,
          meta: aggregateMeta,
          index: this.generateIndex(),
        }
      )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }


  /**
   * Init shadow wallet claim
   *
   * @param tokenSlug
   * @param wallet
   */
  initShadowWalletClaim ( {
    token,
    wallet,
  } ) {

    this.molecularHash = null;

    // Generate a wallet metas
    let metas = {
      tokenSlug: token,
      walletAddress: wallet.address,
      walletPosition: wallet.position,
      batchId: wallet.batchId
    };

    // Create an 'C' atom
    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'C',
          token: this.sourceWallet.token,
          metaType: 'wallet',
          metaId: wallet.address,
          meta: Molecule.mergeMetas( {
            pubkey: this.sourceWallet.pubkey,
            characters: this.sourceWallet.characters,
          }, metas ),
          index: this.generateIndex(),
        }
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
   * @param {array|object} meta
   * @param {string} metaType
   * @param {string} metaId
   * @returns {Molecule}
   */
  initMeta ( {
    meta,
    metaType,
    metaId,
  } ) {

    this.molecularHash = null;

    const walletMeta = {};
    if ( this.sourceWallet.pubkey ) {
      walletMeta.pubkey = this.sourceWallet.pubkey;
    }
    if ( this.sourceWallet.characters ) {
      walletMeta.characters = this.sourceWallet.characters;
    }

    // Initializing a new Atom to hold our metadata
    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'M',
          token: this.sourceWallet.token,
          batchId: this.sourceWallet.batchId,
          metaType,
          metaId,
          meta: Molecule.mergeMetas( walletMeta, meta ),
          index: this.generateIndex(),
        }
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
   * @param {Number} requestedAmount
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} meta
   *
   * @returns {Molecule}
   */
  initTokenRequest ( {
    token,
    requestedAmount,
    metaType,
    metaId,
    meta = {},
  } ) {

    this.molecularHash = null;

    this.atoms.push(
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'T',
          token: this.sourceWallet.token,
          value: requestedAmount,
          metaType,
          metaId,
          meta: Molecule.mergeMetas( {
            pubkey: this.sourceWallet.pubkey,
            characters: this.sourceWallet.characters,
            token,
          }, meta ),
          index: this.generateIndex(),
        }
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
      new Atom( {
          position: this.sourceWallet.position,
          walletAddress: this.sourceWallet.address,
          isotope: 'U',
          token: this.sourceWallet.token,
          batchId: this.sourceWallet.batchId,
          meta: {
            pubkey: this.sourceWallet.pubkey,
            characters: this.sourceWallet.characters,
          },
          index: this.generateIndex(),
        }
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
  sign ( {
    anonymous = false,
    compressed = true,
  } ) {

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
    this.molecularHash = Atom.hashAtoms( {
      atoms: this.atoms,
    } );

    // Determine first atom
    const firstAtom = this.atoms[ 0 ],
      // Generate the private signing key for this molecule
      key = Wallet.generatePrivateKey( {
        secret: this.secret,
        token: firstAtom.token,
        position: firstAtom.position,
      } ),
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
    return Molecule.verify( {
      molecule: this,
      senderWallet,
    } )
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

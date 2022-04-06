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
import { shake256 } from 'js-sha3';
import {
  chunkSubstr,
  hexToBase64
} from './libraries/strings';
import CheckMolecule from './libraries/check';
import { generateBundleHash } from './libraries/crypto';
import AtomsMissingException from './exception/AtomsMissingException';
import BalanceInsufficientException from './exception/BalanceInsufficientException';
import MetaMissingException from './exception/MetaMissingException';
import NegativeAmountException from './exception/NegativeAmountException';
import { deepCloning } from './libraries/array';
import Meta from './Meta';
import Rule from './instance/Rules/Rule';

const USE_META_CONTEXT = false;
const DEFAULT_META_CONTEXT = 'https://www.schema.org';

/**
 * Molecule class used for committing changes to the ledger
 */
export default class Molecule {

  /**
   * Class constructor
   *
   * @param {string|null} secret
   * @param {Wallet|null} sourceWallet
   * @param {Wallet|null} remainderWallet
   * @param {string|null} cellSlug
   */
  constructor ( {
    secret = null,
    sourceWallet = null,
    remainderWallet = null,
    cellSlug = null
  } ) {

    this.cellSlugOrigin = this.cellSlug = cellSlug;
    this.secret = secret;
    this.sourceWallet = sourceWallet;
    this.atoms = [];

    // Set the remainder wallet for this transaction
    if ( remainderWallet || sourceWallet ) {
      this.remainderWallet = remainderWallet || Wallet.create( {
        secretOrBundle: secret,
        token: sourceWallet.token,
        batchId: sourceWallet.batchId,
        characters: sourceWallet.characters
      } );
    }

    this.clear();
  }

  /**
   * Generates the next atomic index
   *
   * @param {array} atoms
   * @return {number}
   */
  static generateNextAtomIndex ( atoms ) {

    const length = atoms.length - 1;

    return ( length > -1 ) ? atoms[ length ].index + 1 : 0;
  }

  /**
   * Returns the Meta Type for ContinuID
   *
   * @return {string}
   */
  continuIdMetaType () {
    return 'walletBundle';
  }

  /**
   * Fills a Molecule's properties with the provided object
   *
   * @param {Molecule} molecule
   */
  fill ( molecule ) {
    for ( let key in Object.keys( molecule ) ) {
      this[ key ] = molecule[ key ];
    }
  }

  /**
   * Adds an atom to an existing Molecule
   *
   * @param {Atom} atom
   * @return {Molecule}
   */
  addAtom ( atom ) {
    this.molecularHash = null;
    this.atoms.push( atom );
    this.atoms = Atom.sortAtoms( this.atoms );
    return this;
  }

  /**
   * Final meta array
   * @param meta
   * @param wallet
   * @return {{}}
   */
  finalMetas ( meta = null, wallet = null ) {
    meta = meta || {};
    wallet = wallet || this.sourceWallet;

    if ( wallet.hasTokenUnits() ) {
      meta[ 'tokenUnits' ] = wallet.tokenUnitsJson();
    }

    meta[ 'pubkey' ] = wallet.pubkey;
    meta[ 'characters' ] = wallet.characters;

    return meta;
  }


  /**
   * @param {object|array|null} metas
   * @param {string|null} context
   *
   * @return array
   */
  contextMetas ( metas = null, context = null ) {
    metas = metas || {};

    // Add context key if it is enabled
    if ( USE_META_CONTEXT ) {
      metas[ 'context' ] = context || DEFAULT_META_CONTEXT;
    }

    return metas;
  }


  /*
   * Replenishes non-finite token supplies
   *
   * @param {number} amount
   * @param {string} token
   * @param {array|object} metas
   * @return {Molecule}
   */
  replenishTokens ( {
    amount,
    token,
    metas
  } ) {
    metas.action = 'add';

    for ( let key of [ 'address', 'position', 'batchId' ] ) {
      if ( typeof metas[ key ] === 'undefined' ) {
        throw new MetaMissingException( `Molecule::replenishTokens() - Missing ${ key } in meta!` );
      }
    }

    this.molecularHash = null;

    this.atoms.push(
      Atom.create.C( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        amount,
        batchId: this.sourceWallet.batchId,
        metaType: 'token',
        metaId: token,
        meta: this.finalMetas( metas ),
        index: this.generateIndex()
      } )
    );

    this.addUserRemainderAtom( this.remainderWallet );
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Add user remainder atom for ContinuID
   *
   * @param {Wallet} userRemainderWallet
   * @return {Molecule}
   */
  addUserRemainderAtom ( userRemainderWallet ) {

    this.molecularHash = null;

    // Remainder atom
    this.atoms.push(
      Atom.create.I( {
        position: userRemainderWallet.position,
        walletAddress: userRemainderWallet.address,
        token: userRemainderWallet.token,
        metaType: 'walletBundle',
        metaId: userRemainderWallet.bundle,
        meta: this.finalMetas( {}, userRemainderWallet ),
        index: this.generateIndex()
      } )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   *
   * @param {string} metaType
   * @param {string} metaId
   * @param {object} meta
   * @param {object} policy
   *
   * @return {Molecule}
   */
  addPolicyAtom ( {
    metaType,
    metaId,
    meta = {},
    policy = {}
  } ) {

    this.molecularHash = null;

    this.addAtom(
      Atom.create.R( {
        token: 'USER',
        metaType,
        metaId,
        meta: Meta.policy( this.finalMetas( meta ), policy ),
        index: this.generateIndex()
      } )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Burns some amount of tokens from a wallet
   *
   * @param {number} amount
   * @param {string|null} walletBundle
   * @return {Molecule}
   */
  burnToken ( {
    amount,
    walletBundle = null
  } ) {

    if ( amount < 0.0 ) {
      throw new NegativeAmountException( 'Molecule::burnToken() - Amount to burn must be positive!' );
    }

    if ( ( this.sourceWallet.balance - amount ) < 0 ) {
      throw new BalanceInsufficientException();
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      Atom.create.V( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        value: -amount,
        batchId: this.sourceWallet.batchId,
        meta: this.finalMetas( {} ),
        index: this.generateIndex()
      } )
    );

    this.atoms.push(
      Atom.create.V( {
        position: this.remainderWallet.position,
        walletAddress: this.remainderWallet.address,
        token: this.sourceWallet.token,
        value: this.sourceWallet.balance - amount,
        batchId: this.remainderWallet.batchId,
        metaType: walletBundle ? 'walletBundle' : null,
        metaId: walletBundle,
        meta: this.finalMetas( {}, this.remainderWallet ),
        index: this.generateIndex()
      } )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;

  }

  /**
   * Initialize a V-type molecule to transfer value from one wallet to another, with a third,
   * regenerated wallet receiving the remainder
   *
   * @param {Wallet} recipientWallet
   * @param {number} amount
   * @return {Molecule}
   */
  initValue ( {
    recipientWallet,
    amount
  } ) {

    if ( this.sourceWallet.balance - amount < 0 ) {
      throw new BalanceInsufficientException();
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.atoms.push(
      Atom.create.V( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        value: -amount,
        batchId: this.sourceWallet.batchId,
        meta: this.finalMetas( {} ),
        index: this.generateIndex()
      } )
    );

    // Initializing a new Atom to add tokens to recipient
    this.atoms.push(
      Atom.create.V( {
        position: recipientWallet.position,
        walletAddress: recipientWallet.address,
        token: this.sourceWallet.token,
        value: amount,
        batchId: recipientWallet.batchId,
        metaType: 'walletBundle',
        metaId: recipientWallet.bundle,
        meta: this.finalMetas( {}, recipientWallet ),
        index: this.generateIndex()
      } )
    );

    this.atoms.push(
      Atom.create.V( {
        position: this.remainderWallet.position,
        walletAddress: this.remainderWallet.address,
        token: this.sourceWallet.token,
        value: this.sourceWallet.balance - amount,
        batchId: this.remainderWallet.batchId,
        metaType: 'walletBundle',
        metaId: this.sourceWallet.bundle,
        meta: this.finalMetas( {}, this.remainderWallet ),
        index: this.generateIndex()
      } )
    );

    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Builds Atoms to define a new wallet on the ledger
   *
   * @param {Wallet} newWallet
   * @return {Molecule}
   */
  initWalletCreation ( newWallet ) {

    this.molecularHash = null;

    const metas = {
      address: newWallet.address,
      token: newWallet.token,
      bundle: newWallet.bundle,
      position: newWallet.position,
      amount: 0,
      batchId: newWallet.batchId,
      pubkey: newWallet.pubkey,
      characters: newWallet.characters
    };

    this.atoms.push(
      Atom.create.C( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        batchId: this.sourceWallet.batchId,
        metaType: 'wallet',
        metaId: newWallet.address,
        meta: this.finalMetas( this.contextMetas( metas ), newWallet ),
        index: this.generateIndex()
      } )
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
   * @return {Molecule}
   */
  initTokenCreation ( {
    recipientWallet,
    amount,
    meta
  } ) {

    this.molecularHash = null;

    for ( const walletKey of [ 'walletAddress', 'walletPosition', 'walletPubkey', 'walletCharacters' ] ) {
      // Importing wallet fields into meta object
      if ( !meta[ walletKey ] ) {
        meta[ walletKey ] = recipientWallet[ walletKey.toLowerCase().substr( 6 ) ];
      }
    }

    // The primary atom tells the ledger that a certain amount of the new token is being issued.
    this.atoms.push(
      Atom.create.C( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        value: amount,
        batchId: recipientWallet.batchId,
        metaType: 'token',
        metaId: recipientWallet.token,
        meta: this.finalMetas( this.contextMetas( meta ), this.sourceWallet ),
        index: this.generateIndex()
      } )
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
   * @param {object[]} rule,
   * @param {object} policy
   * @return {Molecule}
   */
  createRule ( {
    metaType,
    metaId,
    rule,
    policy = {}
  } ) {
    const $rules = [];

    for ( const $rule of rule ) {
      $rules.push( $rule instanceof Rule ? $rule : Rule.toObject( $rule ) );
    }

    const rules = {
      rule: JSON.stringify( $rules )
    };

    const policies = Meta.policy( rules, policy );

    this.addAtom(
      Atom.create.R( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        metaType,
        metaId,
        meta: { ...rules, ...policies },
        index: this.generateIndex()
      } )
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
    wallet
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
      Atom.create.C( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        metaType: 'wallet',
        metaId: wallet.address,
        meta: this.finalMetas( this.contextMetas( metas ) ),
        index: this.generateIndex()
      } )
    );

    // User remainder atom
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
   * @return {Molecule}
   */
  initIdentifierCreation ( {
    type,
    contact,
    code
  } ) {

    this.molecularHash = null;

    const meta = {
      code: code,
      hash: generateBundleHash( contact.trim() )
    };

    this.atoms.push(
      Atom.create.C( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        metaType: 'identifier',
        metaId: type,
        meta: this.finalMetas( meta, this.sourceWallet ),
        index: this.generateIndex()
      } )
    );

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
   * @param {object} policy
   * @return {Molecule}
   */
  initMeta ( {
    meta,
    metaType,
    metaId,
    policy
  } ) {

    this.molecularHash = null;


    // Initializing a new Atom to hold our metadata
    this.atoms.push(
      Atom.create.M( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        batchId: this.sourceWallet.batchId,
        metaType,
        metaId,
        meta: this.finalMetas( meta, this.sourceWallet ),
        index: this.generateIndex()
      } )
    );

    this.addPolicyAtom( {
      metaType,
      metaId,
      meta,
      policy
    } );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Arranges atoms to request tokens from the node itself
   *
   * @param {string} token
   * @param {Number} amount
   * @param {string} metaType
   * @param {string} metaId
   * @param {array|object} meta
   * @param {string|null} batchId
   *
   * @return {Molecule}
   */
  initTokenRequest ( {
    token,
    amount,
    metaType,
    metaId,
    meta = {},
    batchId = null
  } ) {

    this.molecularHash = null;

    meta.token = token;

    this.atoms.push(
      Atom.create.T( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        value: amount,
        batchId,
        metaType,
        metaId,
        meta: this.finalMetas( meta ),
        index: this.generateIndex()
      } )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }

  /**
   * Arranges atoms to request an authorization token from the node
   *
   * @param {object} meta
   *
   * @return {Molecule}
   */
  initAuthorization ( { meta } ) {
    this.molecularHash = null;

    // Initializing a new Atom to hold our metadata
    this.atoms.push(
      Atom.create.U( {
        position: this.sourceWallet.position,
        walletAddress: this.sourceWallet.address,
        token: this.sourceWallet.token,
        batchId: this.sourceWallet.batchId,
        meta: this.finalMetas( meta ),
        index: this.generateIndex()
      } )
    );

    // User remainder atom
    this.addUserRemainderAtom( this.remainderWallet );
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
   * @return {string|null}
   * @throws {AtomsMissingException}
   */
  sign ( {
    anonymous = false,
    compressed = true
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
      atoms: this.atoms
    } );

    // Determine signing atom
    const signingAtom = this.atoms[ 0 ],
      // Generate the private signing key for this molecule
      key = Wallet.generatePrivateKey( {
        secret: this.secret,
        token: signingAtom.token,
        position: signingAtom.position
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
   * Generates the next atomic index
   *
   * @return {number}
   */
  generateIndex () {
    return Molecule.generateNextAtomIndex( this.atoms );
  }

  /**
   * Converts a JSON object into a Molecule Structure instance
   *
   * @param {string} json
   * @return {object}
   * @throws {AtomsMissingException}
   */
  static jsonToObject ( json ) {
    const target = Object.assign( new Molecule( {} ), JSON.parse( json ) ),
      properties = Object.keys( new Molecule( {} ) );

    if ( !Array.isArray( target.atoms ) ) {
      throw new AtomsMissingException();
    }

    for ( const index in Object.keys( target.atoms ) ) {

      target.atoms[ index ] = Atom.jsonToObject( JSON.stringify( target.atoms[ index ] ) );

      for ( const property of [ 'position', 'walletAddress', 'isotope' ] ) {

        if ( typeof target.atoms[ index ][ property ] === 'undefined'
          || null === target.atoms[ index ][ property ]
        ) {
          throw new AtomsMissingException( 'MolecularStructure::jsonToObject() - Required Atom properties are missing!' );
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
   * Returns the cell slug delimiter
   *
   * @return {string}
   */
  get cellSlugDelimiter () {
    return '.';
  }

  /**
   * Returns the base cell slug portion
   *
   * @return {string}
   */
  cellSlugBase () {
    return ( this.cellSlug || '' ).split( this.cellSlugDelimiter )[ 0 ];
  }

  /**
   * Returns JSON-ready clone minus protected properties
   *
   * @return {object}
   */
  toJSON () {
    let clone = deepCloning( this );
    for ( let key of [ 'remainderWallet', 'secret', 'sourceWallet', 'cellSlugOrigin' ] ) {
      if ( clone.hasOwnProperty( key ) ) {
        delete clone[ key ];
      }
    }
    return clone;
  }

  /**
   * Validates the current molecular structure
   *
   * @param {Wallet|null} sourceWallet
   * @return {boolean}
   */
  check ( sourceWallet = null ) {
    return Molecule.verify( {
      molecule: this,
      sourceWallet
    } );
  }

  /**
   *
   * Verifies a specified molecule
   *
   * @param {Molecule} molecule
   * @param {Wallet|null} sourceWallet
   * @return {boolean}
   */
  static verify ( {
    molecule,
    sourceWallet = null
  } ) {

    return CheckMolecule.molecularHash( molecule )
      && CheckMolecule.ots( molecule )
      && CheckMolecule.index( molecule )
      && CheckMolecule.batchId( molecule )
      && CheckMolecule.continuId( molecule )
      && CheckMolecule.isotopeM( molecule )
      && CheckMolecule.isotopeT( molecule )
      && CheckMolecule.isotopeC( molecule )
      && CheckMolecule.isotopeU( molecule )
      && CheckMolecule.isotopeI( molecule )
      && CheckMolecule.isotopeR( molecule )
      && CheckMolecule.isotopeV( molecule, sourceWallet );
  }
}

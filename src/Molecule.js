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
import AtomMeta from './AtomMeta';
import Wallet from './Wallet';
import { shake256 } from 'js-sha3';
import {
  chunkSubstr,
  hexToBase64
} from './libraries/strings';
import CheckMolecule from './libraries/CheckMolecule';
import {
  generateBatchId,
  generateBundleHash
} from './libraries/crypto';
import AtomsMissingException from './exception/AtomsMissingException';
import BalanceInsufficientException from './exception/BalanceInsufficientException';
import NegativeAmountException from './exception/NegativeAmountException';
import { deepCloning } from './libraries/array';
import Dot from './libraries/Dot';
import Meta from './Meta';
import Rule from './instance/Rules/Rule';


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
   *
   * @param {string|array} isotope
   * @param atoms
   * @returns {*[]}
   */
  static isotopeFilter ( isotopes, atoms ) {
    if ( !Array.isArray( isotopes ) ) {
      isotopes = [ isotopes ];
    }
    return atoms.filter( atom => isotopes.includes( atom.isotope ) );
  }

  /**
   *
   * @param isotopes
   * @returns {*[]}
   */
  getIsotopes( isotopes ) {
    return Molecule.isotopeFilter( isotopes, this.atoms );
  }

  /**
   * Generates the next atomic index
   *
   * @param {array} atoms
   * @return {number}
   */
  static generateNextAtomIndex ( atoms ) {
    return atoms.length;
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
   *
   * @param {Atom} atom
   * @returns {Molecule}
   */
  addAtom ( atom ) {

    // Reset the molecular hash
    this.molecularHash = null;

    // Set atom's index
    atom.index = this.generateIndex();

    // Add atom
    this.atoms.push( atom );

    // Sort atoms
    this.atoms = Atom.sortAtoms( this.atoms );

    return this;
  }


  /**
   * Add user remainder atom for ContinuID
   *
   * @param {Wallet} userRemainderWallet
   * @return {Molecule}
   */
  addContinuIdAtom () {
    this.addAtom( Atom.create( {
      isotope: 'I',
      wallet: this.remainderWallet,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle,
    } ) );
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

    // AtomMeta object initialization
    let atomMeta = new AtomMeta( meta );
    atomMeta.addPolicy( policy )

    this.addAtom( Atom.create( {
      isotope: 'R',
      metaType,
      metaId,
      meta: atomMeta,
    } ) );
    return this;
  }


  /**
   *
   * @param tokenUnits
   * @param recipientWallet
   * @returns {Molecule}
   */
  fuseToken ( tokenUnits, recipientWallet ) {

    // Calculate amount
    let amount = tokenUnits.length;

    if ( ( this.sourceWallet.balance - amount ) < 0 ) {
      throw new BalanceInsufficientException();
    }

    // Initializing a new Atom to remove tokens from source
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount,
    } ) );

    // Add F isotope for fused tokens creation
    this.addAtom( Atom.create( {
      isotope: 'F',
      wallet: recipientWallet,
      value: 1,
      metaType: 'walletBundle',
      metaId: recipientWallet.bundle,
    } ) );

    // Initializing a new Atom to remove tokens from source
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle,
    } ) );

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

    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount,
    } ) );
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle,
    } ) );

    return this;
  }


  /*
   * Replenishes non-finite token supplies
   *
   * @param {number} amount
   * @param {string} token
   * @param {array|object} metas
   * @return {Molecule}
   */
  replenishToken ( {
    amount,
    units = []
  } ) {

    if ( amount < 0 ) {
      throw new NegativeAmountException( 'Molecule::replenishToken() - Amount to replenish must be positive!' );
    }

    // Special code for the token unit logic
    if ( units.length ) {

      // Prepare token units to formatted style
      units = Wallet.getTokenUnits( units );

      // Merge token units with source wallet & new items
      this.remainderWallet.tokenUnits = this.sourceWallet.tokenUnits;
      for ( const unit of units ) {
        this.remainderWallet.tokenUnits.push( unit );
      }
      this.remainderWallet.balance = this.remainderWallet.tokenUnits.length;

      // Override first atom's token units to replenish values
      this.sourceWallet.tokenUnits = units;
      this.sourceWallet.balance = this.sourceWallet.tokenUnits.length;
    }

    // Update wallet's balances
    else {
      this.remainderWallet.balance = this.sourceWallet.balance + amount;
      this.sourceWallet.balance = amount;
    }

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.sourceWallet,
      value: this.sourceWallet.balance,
    } ) );

    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.remainderWallet.balance,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle,
    } ) );

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
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount,
    } ) );
    // Initializing a new Atom to add tokens to recipient
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: recipientWallet,
      value: amount,
      metaType: 'walletBundle',
      metaId: recipientWallet.bundle,
    } ) );
    // Ininitlizing a remainder atom
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle,
    } ) );

    return this;
  }


  /**
   *
   * @param amount
   * @param tradeRates
   */
  initDepositBuffer ( {
    amount,
    tradeRates
  } ) {
    if ( this.sourceWallet.balance - amount < 0 ) {
      throw new BalanceInsufficientException();
    }

    // Create a buffer wallet
    let bufferWallet = Wallet.create( {
      secretOrBundle: this.secret,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    } );
    bufferWallet.tradeRates = tradeRates;

    this.molecularHash = null;

    // Initializing a new Atom to remove tokens from source
    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount,
    } ) );

    // Initializing a new Atom to add tokens to recipient
    this.addAtom( Atom.create( {
      isotope: 'B',
      wallet: bufferWallet,
      value: amount,
      metaType: 'walletBundle',
      metaId: this.sourceWallet.bundle,
    } ) );

    this.addAtom( Atom.create( {
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.sourceWallet.bundle,
    } ) );

    return this;
  }

  /**
   *
   * @param {{}} recipients
   * @param {Wallet|{}} signingWallet
   * @returns {Molecule}
   */
  initWithdrawBuffer ( {
    recipients,
    signingWallet = null
  } ) {

    // Calculate final amount from all recipients
    let amount = 0;
    for ( const [ recipientBundle, recipientAmount ] of Object.entries( recipients || {} ) ) {
      amount += recipientAmount;
    }
    if ( this.sourceWallet.balance - amount < 0 ) {
      throw new BalanceInsufficientException();
    }

    // Set a metas signing position for molecule correct reconciliation
    let firstAtomMeta = new AtomMeta;
    if ( signingWallet ) {
      firstAtomMeta.addSigningWallet( signingWallet );
    }

    // Initializing a new Atom to remove tokens from source
    this.addAtom( Atom.create( {
      isotope: 'B',
      wallet: this.sourceWallet,
      value: -amount,
      meta: firstAtomMeta,
      metaType: 'walletBundle',
      metaId: this.sourceWallet.bundle,
    } ) );

    // Initializing a new Atom to add tokens to recipient
    for ( const [ recipientBundle, recipientAmount ] of Object.entries( recipients || {} ) ) {
      this.addAtom( new Atom( {
        isotope: 'V',
        token: this.sourceWallet.token,
        value: recipientAmount,
        batchId: this.sourceWallet.batchId ? generateBatchId( {} ) : null,
        metaType: 'walletBundle',
        metaId: recipientBundle,
      } ) );
    }

    this.addAtom( Atom.create( {
      isotope: 'B',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle,
    } ) );

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

    let meta = new AtomMeta( {
      address: newWallet.address,
      token: newWallet.token,
      bundle: newWallet.bundle,
      position: newWallet.position,
      amount: 0,
      batchId: newWallet.batchId
    } );

    this.addAtom( Atom.create( {
      isotope: 'C',
      wallet: this.sourceWallet,
      metaType: 'wallet',
      metaId: newWallet.address,
      meta,
    } ) );

    this.addContinuIdAtom();

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

    // Importing wallet fields into meta object
    for ( const walletKey of [ 'walletAddress', 'walletPosition', 'walletPubkey', 'walletCharacters' ] ) {
      if ( !meta[ walletKey ] ) {
        meta[ walletKey ] = recipientWallet[ walletKey.toLowerCase().substring( 6 ) ];
      }
    }

    // The primary atom tells the ledger that a certain amount of the new token is being issued.
    this.addAtom( Atom.create( {
      isotope: 'C',
      wallet: this.sourceWallet,
      value: amount,
      metaType: 'token',
      metaId: recipientWallet.token,
      meta: new AtomMeta( meta ),
      batchId: recipientWallet.batchId,
    } ) );

    // User remainder atom
    this.addContinuIdAtom();

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

    // Create atom meta with rules
    let atomMeta = new AtomMeta( {
      rule: JSON.stringify( $rules )
    } );

    // Add policies to meta object
    atomMeta.addPolicy( policy )

    this.addAtom( Atom.create( {
      isotope: 'R',
      wallet: this.sourceWallet,
      metaType,
      metaId,
      meta: atomMeta,
    } ) );

    // User continuID atom
    this.addContinuIdAtom();

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

    // Generate a wallet metas
    let metas = {
      tokenSlug: token,
      walletAddress: wallet.address,
      walletPosition: wallet.position,
      pubkey: wallet.pubkey,
      characters: wallet.characters,
      batchId: wallet.batchId
    };

    this.addAtom( Atom.create( {
      isotope: 'C',
      wallet: this.sourceWallet,
      metaType: 'wallet',
      metaId: wallet.address,
      meta: new AtomMeta( metas ),
    } ) );

    // User remainder atom
    this.addContinuIdAtom();

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

    const meta = {
      code: code,
      hash: generateBundleHash( contact.trim() )
    };

    this.addAtom( Atom.create( {
      isotope: 'C',
      wallet: this.sourceWallet,
      metaType: 'identifier',
      metaId: type,
      meta: new AtomMeta( meta ),
    } ) );

    this.addContinuIdAtom();

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

    // Initializing a new Atom to hold our metadata
    this.addAtom( Atom.create( {
      isotope: 'M',
      wallet: this.sourceWallet,
      metaType,
      metaId,
      meta: new AtomMeta( meta ),
    } ) );

    this.addPolicyAtom( {
      metaType,
      metaId,
      meta,
      policy
    } );

    // User remainder atom
    this.addContinuIdAtom();

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

    meta.token = token;

    this.addAtom( Atom.create( {
      isotope: 'T',
      wallet: this.sourceWallet,
      value: amount,
      metaType,
      metaId,
      meta: new AtomMeta( meta ),
      batchId,
    } ) );

    // User remainder atom
    this.addContinuIdAtom();

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

    this.addAtom( Atom.create( {
      isotope: 'U',
      wallet: this.sourceWallet,
      meta: new AtomMeta( meta ),
    } ) );

    // User remainder atom
    this.addContinuIdAtom();

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

    // Signing atom
    const signingAtom = this.atoms[ 0 ];

    // Set signing position from the first atom
    let signingPosition = signingAtom.position;

    // Get signing wallet from first atom's metas
    let signingWallet = Dot.get( signingAtom.aggregatedMeta(), 'signingWallet' );

    // Try to get custom signing position from the metas (local molecule with server secret)
    if ( signingWallet ) {
      signingPosition = Dot.get( JSON.parse( signingWallet ), 'position' );
    }

    // Signing position is required
    if ( !signingPosition ) {
      throw new SigningWalletException();
    }

    // Generate the private signing key for this molecule
    const key = Wallet.generateKey( {
        secret: this.secret,
        token: signingAtom.token,
        position: signingAtom.position
      } ),
      // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
      keyChunks = chunkSubstr( key, 128 ),
      // Convert Hm to numeric notation, and then normalize
      normalizedHash = this.normalizedHash();

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
   * @param senderWallet
   */
  check ( senderWallet = null ) {
    ( new CheckMolecule( this ) ).verify( senderWallet );
  }

  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @returns {Array}
   */
  normalizedHash () {
    return Molecule.normalize( Molecule.enumerate( this.molecularHash ) );
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
   * @return {array}
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
        'g': 8
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
   * @param {array} mappedHashArray
   * @return {array}
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

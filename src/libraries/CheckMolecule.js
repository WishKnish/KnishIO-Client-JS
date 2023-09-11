import AtomIndexException from './../exception/AtomIndexException';
import AtomsMissingException from './../exception/AtomsMissingException';
import MolecularHashMismatchException from './../exception/MolecularHashMismatchException';
import MolecularHashMissingException from './../exception/MolecularHashMissingException';
import PolicyInvalidException from './../exception/PolicyInvalidException';
import SignatureMalformedException from './../exception/SignatureMalformedException';
import SignatureMismatchException from './../exception/SignatureMismatchException';
import TransferBalanceException from './../exception/TransferBalanceException';
import TransferMalformedException from './../exception/TransferMalformedException';
import TransferMismatchedException from './../exception/TransferMismatchedException';
import TransferRemainderException from './../exception/TransferRemainderException';
import TransferToSelfException from './../exception/TransferToSelfException';
import TransferUnbalancedException from './../exception/TransferUnbalancedException';
import MetaMissingException from './../exception/MetaMissingException';
import WrongTokenTypeException from './../exception/WrongTokenTypeException';
import BatchIdException from './../exception/BatchIdException';
import Atom from './../Atom';
import Meta from './../Meta';
import Wallet from './../Wallet';
import Rule from '../instance/Rules/Rule';
import {
  base64ToHex,
  chunkSubstr
} from './strings';
import jsSHA from 'jssha';
import Dot from './../libraries/Dot';

/**
 *
 */
export default class CheckMolecule {


  /**
   *
   * @param molecule
   */
  constructor ( molecule ) {

    // No molecular hash?
    if ( molecule.molecularHash === null ) {
      throw new MolecularHashMissingException();
    }

    // No atoms?
    if ( !molecule.atoms.length ) {
      throw new AtomsMissingException();
    }

    // Check atom indexes
    for ( let atom of molecule.atoms ) {
      if ( atom.index === null ) {
        throw new AtomIndexException();
      }
    }

    this.molecule = molecule;
  }

  /**
   *
   * @param senderWallet
   * @returns {false|*|boolean}
   */
  verify ( senderWallet ) {
    return this.molecularHash()
      && this.ots()
      && this.batchId()
      && this.continuId()
      && this.isotopeM()
      && this.isotopeT()
      && this.isotopeC()
      && this.isotopeU()
      && this.isotopeI()
      && this.isotopeR()
      && this.isotopeV( senderWallet );
  }

  /**
   *
   * @returns {boolean}
   */
  continuId () {

    const firstAtom = this.molecule.atoms[ 0 ];

    if ( firstAtom.token === 'USER' && this.molecule.getIsotopes( 'I' ).length < 1 ) {
      throw new AtomsMissingException( 'Check::continuId() - Molecule is missing required ContinuID Atom!' );
    }

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  batchId () {

    if ( this.molecule.atoms.length > 0 ) {
      const signingAtom = this.molecule.atoms[ 0 ];

      if ( signingAtom.isotope === 'V' && signingAtom.batchId !== null ) {
        const atoms = this.molecule.getIsotopes( 'V' );
        const remainderAtom = atoms[ atoms.length - 1 ];

        if ( signingAtom.batchId !== remainderAtom.batchId ) {
          throw new BatchIdException();
        }

        for ( const atom of atoms ) {
          if ( atom.batchId === null ) {
            throw new BatchIdException();
          }
        }
      }

      return true;
    }

    throw new BatchIdException();
  }

  /**
   *
   * @returns {boolean}
   */
  isotopeI () {

    for ( let atom of this.molecule.getIsotopes( 'I' ) ) {
      if ( atom.token !== 'USER' ) {
        throw new WrongTokenTypeException( `Check::isotopeI() - "${ atom.token }" is not a valid Token slug for "${ atom.isotope }" isotope Atoms!` );
      }

      if ( atom.index === 0 ) {
        throw new AtomIndexException( `Check::isotopeI() - Isotope "${ atom.isotope }" Atoms must have a non-zero index!` );
      }
    }

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  isotopeU () {

    for ( let atom of this.molecule.getIsotopes( 'U' ) ) {
      if ( atom.token !== 'AUTH' ) {
        throw new WrongTokenTypeException( `Check::isotopeU() - "${ atom.token }" is not a valid Token slug for "${ atom.isotope }" isotope Atoms!` );
      }

      if ( atom.index !== 0 ) {
        throw new AtomIndexException( `Check::isotopeU() - Isotope "${ atom.isotope }" Atoms must have an index equal to 0!` );
      }
    }

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  isotopeM () {

    const policyArray = [ 'readPolicy', 'writePolicy' ];

    for ( /** @type {Atom} */ let atom of this.molecule.getIsotopes( 'M' ) ) {

      if ( atom.meta.length < 1 ) {
        throw new MetaMissingException();
      }

      if ( atom.token !== 'USER' ) {
        throw new WrongTokenTypeException( `Check::isotopeM() - "${ atom.token }" is not a valid Token slug for "${ atom.isotope }" isotope Atoms!` );
      }

      const metas = Meta.aggregateMeta( atom.meta );

      for ( const key of policyArray ) {
        let policy = metas[ key ];

        if ( policy ) {
          policy = JSON.parse( policy );

          for ( const [ policyName, policyValue ] of Object.entries( policy ) ) {

            if ( !policyArray.includes( policyName ) ) {

              if ( !Object.keys( metas ).includes( policyName ) ) {
                throw new PolicyInvalidException( `${ policyName } is missing from the meta.` );
              }

              for ( const value of policyValue ) {

                if ( !Wallet.isBundleHash( value ) && ![ 'all', 'self' ].includes( value ) ) {
                  throw new PolicyInvalidException( `${ value } does not correspond to the format of the policy.` );
                }
              }
            }
          }
        }
      }
    }

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  isotopeC () {

    for ( let atom of this.molecule.getIsotopes( 'C' ) ) {
      if ( atom.token !== 'USER' ) {
        throw new WrongTokenTypeException( `Check::isotopeC() - "${ atom.token }" is not a valid Token slug for "${ atom.isotope }" isotope Atoms!` );
      }

      if ( atom.index !== 0 ) {
        throw new AtomIndexException( `Check::isotopeC() - Isotope "${ atom.isotope }" Atoms must have an index equal to 0!` );
      }
    }

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  isotopeT () {

    for ( let atom of this.molecule.getIsotopes( 'T' ) ) {
      const meta = atom.aggregatedMeta(),
        metaType = String( atom.metaType ).toLowerCase();

      if ( metaType === 'wallet' ) {
        for ( let key of [ 'position', 'bundle' ] ) {
          if ( !meta.hasOwnProperty( key ) || !Boolean( meta[ key ] ) ) {
            throw new MetaMissingException( `Check::isotopeT() - Required meta field "${ key }" is missing!` );
          }
        }
      }

      for ( let key of [ 'token' ] ) {
        if ( !meta.hasOwnProperty( key ) || !Boolean( meta[ key ] ) ) {
          throw new MetaMissingException( `Check::isotopeT() - Required meta field "${ key }" is missing!` );
        }
      }

      if ( atom.token !== 'USER' ) {
        throw new WrongTokenTypeException( `Check::isotopeT() - "${ atom.token }" is not a valid Token slug for "${ atom.isotope }" isotope Atoms!` );
      }

      if ( atom.index !== 0 ) {
        throw new AtomIndexException( `Check::isotopeT() - Isotope "${ atom.isotope }" Atoms must have an index equal to 0!` );
      }
    }

    return true;
  }

  /**
   *
   * @returns {boolean}
   */
  isotopeR () {

    for ( let atom of this.molecule.getIsotopes( 'R' ) ) {
      const metas = atom.aggregatedMeta();

      if ( metas.policy ) {
        const policy = JSON.parse( metas.policy );

        if ( !Object.keys( policy ).every( i => [ 'read', 'write' ].includes( i ) ) ) {
          throw new MetaMissingException( 'Check::isotopeR() - Mixing rules with politics!' );
        }
      }

      if ( metas.rule ) {
        const rules = JSON.parse( metas.rule );

        if ( !Array.isArray( rules ) ) {
          throw new MetaMissingException( 'Check::isotopeR() - Incorrect rule format!' );
        }

        for ( const item of rules ) {
          Rule.toObject( item );
        }

        if ( rules.length < 1 ) {
          throw new MetaMissingException( 'Check::isotopeR() - No rules!' );
        }
      }
    }

    return true;
  }

  /**
   *
   * @param senderWallet
   * @returns {boolean}
   */
  isotopeV ( senderWallet = null ) {

    const isotopeV = this.molecule.getIsotopes( 'V' );

    if ( isotopeV.length === 0 ) {
      return true;
    }

    const firstAtom = this.molecule.atoms[ 0 ];

    if ( firstAtom.isotope === 'V' && isotopeV.length === 2 ) {

      const endAtom = isotopeV[ isotopeV.length - 1 ];

      if ( firstAtom.token !== endAtom.token ) {
        throw new TransferMismatchedException();
      }

      if ( endAtom.value < 0 ) {
        throw new TransferMalformedException();
      }

      return true;
    }


    let sum = 0,
      value = 0;

    for ( let index in this.molecule.atoms ) {

      if ( this.molecule.atoms.hasOwnProperty( index ) ) {

        const vAtom = this.molecule.atoms[ index ];

        // Not V? Next...
        if ( vAtom.isotope !== 'V' ) {
          continue;
        }

        // Making sure we're in integer land
        value = vAtom.value * 1;

        if ( Number.isNaN( value ) ) {
          throw new TypeError( 'Invalid isotope "V" values' );
        }

        // Making sure all V atoms of the same token
        if ( vAtom.token !== firstAtom.token ) {
          throw new TransferMismatchedException();
        }

        // Checking non-primary atoms
        if ( index > 0 ) {

          // Negative V atom in a non-primary position?
          if ( value < 0 ) {
            throw new TransferMalformedException();
          }

          // Cannot be sending and receiving from the same address
          if ( vAtom.walletAddress === firstAtom.walletAddress ) {
            throw new TransferToSelfException();
          }

        }

        // Adding this Atom's value to the total sum
        sum += value;
      }
    }

    // Does the total sum of all atoms equal the remainder atom's value? (all other atoms must add up to zero)
    if ( sum !== value ) {
      throw new TransferUnbalancedException();
    }

    // If we're provided with a senderWallet argument, we can perform additional checks
    if ( senderWallet ) {

      value = firstAtom.value * 1;

      if ( Number.isNaN( value ) ) {
        throw new TypeError( 'Invalid isotope "V" values' );
      }

      const remainder = senderWallet.balance + value;

      // Is there enough balance to send?
      if ( remainder < 0 ) {
        throw new TransferBalanceException();
      }

      // Does the remainder match what should be there in the source wallet, if provided?
      if ( remainder !== sum ) {
        throw new TransferRemainderException();
      }

    } // No senderWallet, but have a remainder?
    else if ( value !== 0 ) {
      throw new TransferRemainderException();
    }

    // Looks like we passed all the tests!
    return true;
  }

  /**
   * Verifies if the hash of all the atoms matches the molecular hash to ensure content has not been messed with
   *
   * @returns {boolean}
   */
  molecularHash () {

    if ( this.molecule.molecularHash !== Atom.hashAtoms( {
      atoms: this.molecule.atoms
    } ) ) {
      throw new MolecularHashMismatchException();
    }

    // Looks like we passed all the tests!
    return true;
  }

  /**
   * Checks if the provided molecule was signed properly by transforming a collection of signature
   * fragments from its atoms and its molecular hash into a single-use wallet address to be matched
   * against the sender’s address. If it matches, the molecule was correctly signed.
   *
   * @returns {boolean}
   */
  ots () {

    // Convert Hm to numeric notation via EnumerateMolecule(Hm)
    const normalizedHash = this.molecule.normalizedHash();

    // Rebuilding OTS out of all the atoms
    let ots = this.molecule.atoms.map(
      atom => atom.otsFragment
    ).reduce(
      ( accumulator, otsFragment ) => accumulator + otsFragment
    );

    // Wrong size? Maybe it's compressed
    if ( ots.length !== 2048 ) {

      // Attempting decompression
      ots = base64ToHex( ots );

      // Still wrong? That's a failure
      if ( ots.length !== 2048 ) {
        throw new SignatureMalformedException();
      }
    }

    // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
    const otsChunks = chunkSubstr( ots, 128 );

    let keyFragments = '';

    for ( const index in otsChunks ) {

      let workingChunk = otsChunks[ index ];

      for ( let iterationCount = 0, condition = 8 + normalizedHash[ index ]; iterationCount < condition; iterationCount++ ) {
        workingChunk = (new jsSHA('SHAKE256', 'TEXT')).update(workingChunk).getHash('HEX', {outputLen: 512 });
      }

      keyFragments += workingChunk;
    }

    // Absorb the hashed Kk into the sponge to receive the digest Dk
    const digestSponge = new jsSHA('SHAKE256', 'TEXT');
    digestSponge.update( keyFragments );
    const digest = digestSponge.getHash('HEX', {outputLen: 8192 });

    // Squeeze the sponge to retrieve a 128 byte (64 character) string that should match the sender’s wallet address
    const addressSponge = new jsSHA('SHAKE256', 'TEXT');
    addressSponge.update( digest );
    const address = addressSponge.getHash('HEX', {outputLen: 256 });

    // Signing atom
    let signingAtom = this.molecule.atoms[ 0 ];

    // Get a signing address
    let signingAddress = signingAtom.walletAddress;

    // Get signing wallet from first atom's metas
    let signingWallet = Dot.get( signingAtom.aggregatedMeta(), 'signingWallet' );

    // Try to get custom signing address from the metas (local molecule with server secret)
    if ( signingWallet ) {
      signingAddress = Dot.get( JSON.parse( signingWallet ), 'address' );
    }

    if ( address !== signingAddress ) {
      throw new SignatureMismatchException();
    }

    // Looks like we passed all the tests!
    return true;
  }


}

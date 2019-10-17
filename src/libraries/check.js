import {
  AtomIndexException,
  AtomsMissingException,
  MolecularHashMismatchException,
  MolecularHashMissingException,
  SignatureMalformedException,
  SignatureMismatchException,
  TransferBalanceException,
  TransferMalformedException,
  TransferMismatchedException,
  TransferRemainderException,
  TransferToSelfException,
  TransferUnbalancedException,
  MetaMissingException,
} from "../exception";
import { Atom } from "../index";
import { base64ToHex, chunkSubstr } from "./strings";
import { shake256 } from "js-sha3";

/**
 *
 */
export default class CheckMolecule {

  /**
   *
   * @param {Molecule} molecule
   * @returns {boolean}
   */
  static isotopeM ( molecule ) {

    CheckMolecule.missing( molecule );

    for ( let atom of CheckMolecule.isotopeFilter( 'M', molecule.atoms ) ) {

      if ( atom.meta.length < 1 ) {

        throw new MetaMissingException();

      }

    }

    return true;

  }

  /**
   * @param {Molecule} molecule
   * @param {Wallet} senderWallet
   * @return {boolean}
   * @throws {TypeError}
   */
  static isotopeV ( molecule, senderWallet = null ) {

    CheckMolecule.missing( molecule );

    if ( CheckMolecule.isotopeFilter( 'V', molecule.atoms ).length === 0 ) {

      return true;

    }

    const firstAtom = molecule.atoms[ 0 ];

    let sum = 0,
      value = 0;

    for ( let index in molecule.atoms ) {

      if ( molecule.atoms.hasOwnProperty( index ) ) {

        const vAtom = molecule.atoms[ index ];

        // Not V? Next...
        if ( vAtom.isotope !== 'V' ) {

          continue;

        }

        // Making sure we're in integer land
        value = 1 * vAtom.value;

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
   * @param {Molecule} molecule
   * @return {boolean}
   */
  static molecularHash ( molecule ) {

    CheckMolecule.missing( molecule );

    if ( molecule.molecularHash !== Atom.hashAtoms( molecule.atoms ) ) {

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
   * @param {Molecule} molecule
   * @returns {boolean}
   */
  static ots ( molecule ) {

    CheckMolecule.missing( molecule );

    // Determine first atom
    const firstAtom = molecule.atoms[ 0 ],
      walletAddress = firstAtom.walletAddress,
      // Convert Hm to numeric notation via EnumerateMolecule(Hm)
      normalizedHash = CheckMolecule.normalizedHash( molecule.molecularHash );

    // Rebuilding OTS out of all the atoms
    let ots = molecule.atoms.map(
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

        workingChunk = shake256.create( 512 ).update( workingChunk ).hex();

      }

      keyFragments += workingChunk;

    }

    // Absorb the hashed Kk into the sponge to receive the digest Dk
    const digest = shake256.create( 8192 ).update( keyFragments ).hex(),
      // Squeeze the sponge to retrieve a 128 byte (64 character) string that should match the sender’s wallet address
      address = shake256.create( 256 ).update( digest ).hex();

    if ( address !== walletAddress ) {

      throw new SignatureMismatchException();

    }

    // Looks like we passed all the tests!
    return true;

  }

  /**
   *
   * @param {Molecule} molecule
   * @return {boolean}
   * @throws {MolecularHashMissingException | AtomsMissingException | AtomIndexException}
   */
  static index ( molecule ) {

    CheckMolecule.missing( molecule );

    for ( let atom of molecule.atoms ) {

      if ( atom.index === null ) {

        throw new AtomIndexException();

      }

    }

    return true;

  }

  /**
   *
   * @param {string} isotope
   * @param {Int32Array | Uint32Array | Array | Int8Array | Float64Array | BigUint64Array | Uint8Array | Int16Array | BigInt64Array | Float32Array | Uint8ClampedArray | Uint16Array} atoms
   * @returns {Int32Array | Uint32Array | Array | Int8Array | Float64Array | BigUint64Array | Uint8Array | Int16Array | BigInt64Array | Float32Array | Uint8ClampedArray | Uint16Array}
   */
  static isotopeFilter ( isotope, atoms ) {

    atoms = atoms || [];

    return atoms.filter( atom => isotope === atom.isotope );

  }

  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   *
   * @param {string} hash
   * @returns {Array}
   */
  static normalizedHash ( hash ) {

    // Convert Hm to numeric notation via EnumerateMolecule(Hm)
    return CheckMolecule.normalize( CheckMolecule.enumerate( hash ) )

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

  /**
   *
   * @param {Molecule} molecule
   */
  static missing ( molecule ) {

    // No molecular hash?
    if ( molecule.molecularHash === null ) {

      throw new MolecularHashMissingException();

    }

    // No atoms?
    if ( 1 > molecule.atoms.length ) {

      throw new AtomsMissingException();

    }

  }

}

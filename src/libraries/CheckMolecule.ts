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

import AtomIndexException from '../exception/AtomIndexException';
import AtomsMissingException from '../exception/AtomsMissingException';
import MolecularHashMismatchException from '../exception/MolecularHashMismatchException';
import MolecularHashMissingException from '../exception/MolecularHashMissingException';
import PolicyInvalidException from '../exception/PolicyInvalidException';
import SignatureMalformedException from '../exception/SignatureMalformedException';
import SignatureMismatchException from '../exception/SignatureMismatchException';
import TransferBalanceException from '../exception/TransferBalanceException';
import TransferMalformedException from '../exception/TransferMalformedException';
import TransferMismatchedException from '../exception/TransferMismatchedException';
import TransferRemainderException from '../exception/TransferRemainderException';
import TransferToSelfException from '../exception/TransferToSelfException';
import TransferUnbalancedException from '../exception/TransferUnbalancedException';
import MetaMissingException from '../exception/MetaMissingException';
import WrongTokenTypeException from '../exception/WrongTokenTypeException';
import BatchIdException from '../exception/BatchIdException';
import Atom from '../Atom';
import type { MoleculeStructure } from '@/types';
import Meta from '../Meta';
import type { MetaData } from '../types';
import Wallet from '../Wallet';
import Rule from '../instance/Rules/Rule';
import { base64ToHex, chunkSubstr } from './strings';
import JsSHA from 'jssha';
import Dot from './Dot';
// import { createScopedLogger } from './Logger';



interface SenderWallet {
  balance: number;
  [key: string]: unknown;
}

/**
 * Molecule validation and verification utility
 * Performs comprehensive checks on blockchain molecule structure and integrity
 */
export default class CheckMolecule {
  private molecule: MoleculeStructure;
  // private logger = createScopedLogger('CheckMolecule');

  /**
   * Initialize molecule validator
   * @param molecule - The molecule to validate
   * @throws {MolecularHashMissingException} When molecular hash is missing
   * @throws {AtomsMissingException} When molecule has no atoms
   * @throws {AtomIndexException} When atoms lack proper indexes
   */
  constructor(molecule: MoleculeStructure) {
    // No molecular hash?
    if (molecule.molecularHash === null) {
      throw new MolecularHashMissingException();
    }

    // No atoms?
    if (!molecule.atoms.length) {
      throw new AtomsMissingException();
    }

    // Check atom indexes
    for (const atom of molecule.atoms) {
      if (atom.index === null) {
        throw new AtomIndexException();
      }
    }

    this.molecule = molecule;
  }

  /**
   * Perform comprehensive molecule verification
   * @param senderWallet - Optional sender wallet for additional validation
   * @returns True if all validations pass
   */
  verify(senderWallet?: SenderWallet | null): boolean {
    return (
      this.molecularHash() &&
      this.ots() &&
      this.batchId() &&
      this.continuId() &&
      this.isotopeM() &&
      this.isotopeT() &&
      this.isotopeC() &&
      this.isotopeU() &&
      this.isotopeI() &&
      this.isotopeR() &&
      this.isotopeV(senderWallet)
    );
  }

  /**
   * Validate ContinuID requirements
   * @returns True if ContinuID validation passes
   * @throws {AtomsMissingException} When required ContinuID atom is missing
   */
  continuId(): boolean {
    const firstAtom = this.molecule.atoms[0];
    if (!firstAtom) {
      throw new AtomsMissingException('Check::continuId() - No atoms in molecule!');
    }

    if (firstAtom.token === 'USER' && this.molecule.getIsotopes('I').length < 1) {
      throw new AtomsMissingException('Check::continuId() - Molecule is missing required ContinuID Atom!');
    }

    return true;
  }

  /**
   * Validate batch ID consistency across atoms
   * @returns True if batch ID validation passes
   * @throws {BatchIdException} When batch IDs are inconsistent or missing
   */
  batchId(): boolean {
    if (this.molecule.atoms.length > 0) {
      const signingAtom = this.molecule.atoms[0];

      if (signingAtom && signingAtom.isotope === 'V' && signingAtom.batchId !== null) {
        const atoms = this.molecule.getIsotopes('V');
        const remainderAtom = atoms[atoms.length - 1];

        if (remainderAtom && signingAtom.batchId !== remainderAtom.batchId) {
          throw new BatchIdException();
        }

        for (const atom of atoms) {
          if (atom.batchId === null) {
            throw new BatchIdException();
          }
        }
      }

      return true;
    }

    throw new BatchIdException();
  }

  /**
   * Validate isotope I (Identity) atoms
   * @returns True if isotope I validation passes
   * @throws {WrongTokenTypeException} When token type is invalid
   * @throws {AtomIndexException} When atom index is invalid
   */
  isotopeI(): boolean {
    for (const atom of this.molecule.getIsotopes('I')) {
      if (atom.token !== 'USER') {
        throw new WrongTokenTypeException(`Check::isotopeI() - "${atom.token}" is not a valid Token slug for "${atom.isotope}" isotope Atoms!`);
      }

      if (atom.index === 0) {
        throw new AtomIndexException(`Check::isotopeI() - Isotope "${atom.isotope}" Atoms must have a non-zero index!`);
      }
    }

    return true;
  }

  /**
   * Validate isotope U (User) atoms
   * @returns True if isotope U validation passes
   * @throws {WrongTokenTypeException} When token type is invalid
   * @throws {AtomIndexException} When atom index is invalid
   */
  isotopeU(): boolean {
    for (const atom of this.molecule.getIsotopes('U')) {
      if (atom.token !== 'AUTH') {
        throw new WrongTokenTypeException(`Check::isotopeU() - "${atom.token}" is not a valid Token slug for "${atom.isotope}" isotope Atoms!`);
      }

      if (atom.index !== 0) {
        throw new AtomIndexException(`Check::isotopeU() - Isotope "${atom.isotope}" Atoms must have an index equal to 0!`);
      }
    }

    return true;
  }

  /**
   * Validate isotope M (Meta) atoms and policy structures
   * @returns True if isotope M validation passes
   * @throws {MetaMissingException} When required metadata is missing
   * @throws {WrongTokenTypeException} When token type is invalid
   * @throws {PolicyInvalidException} When policy structure is invalid
   */
  isotopeM(): boolean {
    const policyArray = ['readPolicy', 'writePolicy'];

    for (const atom of this.molecule.getIsotopes('M')) {
      if (atom.meta.length < 1) {
        throw new MetaMissingException();
      }

      if (atom.token !== 'USER') {
        throw new WrongTokenTypeException(`Check::isotopeM() - "${atom.token}" is not a valid Token slug for "${atom.isotope}" isotope Atoms!`);
      }

      const metas = Meta.aggregateMeta(atom.meta as MetaData);

      for (const key of policyArray) {
        let policy = metas[key];

        if (policy) {
          policy = JSON.parse(policy as string);

          if (policy && typeof policy === 'object') {
            for (const [policyName, policyValue] of Object.entries(policy)) {
            if (!policyArray.includes(policyName)) {
              if (!Object.keys(metas).includes(policyName)) {
                throw new PolicyInvalidException(`${policyName} is missing from the meta.`);
              }

              for (const value of (policyValue as unknown) as string[]) {
                if (!Wallet.isBundleHash(value) && !['all', 'self'].includes(value)) {
                  throw new PolicyInvalidException(`${value} does not correspond to the format of the policy.`);
                }
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
   * Validate isotope C (Create) atoms
   * @returns True if isotope C validation passes
   * @throws {WrongTokenTypeException} When token type is invalid
   * @throws {AtomIndexException} When atom index is invalid
   */
  isotopeC(): boolean {
    for (const atom of this.molecule.getIsotopes('C')) {
      if (atom.token !== 'USER') {
        throw new WrongTokenTypeException(`Check::isotopeC() - "${atom.token}" is not a valid Token slug for "${atom.isotope}" isotope Atoms!`);
      }

      if (atom.index !== 0) {
        throw new AtomIndexException(`Check::isotopeC() - Isotope "${atom.isotope}" Atoms must have an index equal to 0!`);
      }
    }

    return true;
  }

  /**
   * Validate isotope T (Token) atoms
   * @returns True if isotope T validation passes
   * @throws {MetaMissingException} When required metadata is missing
   * @throws {WrongTokenTypeException} When token type is invalid
   * @throws {AtomIndexException} When atom index is invalid
   */
  isotopeT(): boolean {
    for (const atom of this.molecule.getIsotopes('T')) {
      const meta = atom.aggregatedMeta();
      const metaType = String(atom.metaType).toLowerCase();

      if (metaType === 'wallet') {
        for (const key of ['position', 'bundle']) {
          if (!Object.prototype.hasOwnProperty.call(meta, key) || !meta[key]) {
            throw new MetaMissingException(`Check::isotopeT() - Required meta field "${key}" is missing!`);
          }
        }
      }

      for (const key of ['token']) {
        if (!Object.prototype.hasOwnProperty.call(meta, key) || !meta[key]) {
          throw new MetaMissingException(`Check::isotopeT() - Required meta field "${key}" is missing!`);
        }
      }

      if (atom.token !== 'USER') {
        throw new WrongTokenTypeException(`Check::isotopeT() - "${atom.token}" is not a valid Token slug for "${atom.isotope}" isotope Atoms!`);
      }

      if (atom.index !== 0) {
        throw new AtomIndexException(`Check::isotopeT() - Isotope "${atom.isotope}" Atoms must have an index equal to 0!`);
      }
    }

    return true;
  }

  /**
   * Validate isotope R (Rule) atoms
   * @returns True if isotope R validation passes
   * @throws {MetaMissingException} When rule structure is invalid
   */
  isotopeR(): boolean {
    for (const atom of this.molecule.getIsotopes('R')) {
      const metas = atom.aggregatedMeta();

      if (metas.policy) {
        const policy = JSON.parse(metas.policy as string);

        if (!Object.keys(policy).every(i => ['read', 'write'].includes(i))) {
          throw new MetaMissingException('Check::isotopeR() - Mixing rules with politics!');
        }
      }

      if (metas.rule) {
        const rules = JSON.parse(metas.rule as string);

        if (!Array.isArray(rules)) {
          throw new MetaMissingException('Check::isotopeR() - Incorrect rule format!');
        }

        for (const item of rules) {
          Rule.toObject(item);
        }

        if (rules.length < 1) {
          throw new MetaMissingException('Check::isotopeR() - No rules!');
        }
      }
    }

    return true;
  }

  /**
   * Validate isotope V (Value/Transfer) atoms and transaction balancing
   * @param senderWallet - Optional sender wallet for balance validation
   * @returns True if isotope V validation passes
   * @throws {TransferMismatchedException} When transfer tokens don't match
   * @throws {TransferMalformedException} When transfer structure is malformed
   * @throws {TransferToSelfException} When attempting to transfer to self
   * @throws {TransferUnbalancedException} When transfers don't balance
   * @throws {TransferBalanceException} When insufficient balance
   * @throws {TransferRemainderException} When remainder calculation is incorrect
   */
  isotopeV(senderWallet: SenderWallet | null = null): boolean {
    const isotopeV = this.molecule.getIsotopes('V');

    if (isotopeV.length === 0) {
      return true;
    }

    const firstAtom = this.molecule.atoms[0];

    if (firstAtom && firstAtom.isotope === 'V' && isotopeV.length === 2) {
      const endAtom = isotopeV[isotopeV.length - 1];

      if (endAtom && firstAtom.token !== endAtom.token) {
        throw new TransferMismatchedException();
      }

      if (endAtom && endAtom.value < 0) {
        throw new TransferMalformedException();
      }

      return true;
    }

    let sum = 0;
    let value = 0;

    for (const index in this.molecule.atoms) {
      if (Object.prototype.hasOwnProperty.call(this.molecule.atoms, index)) {
        const vAtom = this.molecule.atoms[index];

        // Not V? Next...
        if (!vAtom || vAtom.isotope !== 'V') {
          continue;
        }

        // Making sure we're in integer land
        value = vAtom.value * 1;

        if (Number.isNaN(value)) {
          throw new TypeError('Invalid isotope "V" values');
        }

        // Making sure all V atoms of the same token
        if (firstAtom && vAtom.token !== firstAtom.token) {
          throw new TransferMismatchedException();
        }

        // Checking non-primary atoms
        if (Number(index) > 0) {
          // Negative V atom in a non-primary position?
          if (value < 0) {
            throw new TransferMalformedException();
          }

          // Cannot be sending and receiving from the same address
          if (firstAtom && vAtom.walletAddress === firstAtom.walletAddress) {
            throw new TransferToSelfException();
          }
        }

        // Adding this Atom's value to the total sum
        sum += value;
      }
    }

    // Does the total sum of all atoms equal the remainder atom's value?
    if (sum !== value) {
      throw new TransferUnbalancedException();
    }

    // If we're provided with a senderWallet argument, we can perform additional checks
    if (senderWallet && firstAtom) {
      value = firstAtom.value * 1;

      if (Number.isNaN(value)) {
        throw new TypeError('Invalid isotope "V" values');
      }

      const remainder = senderWallet.balance + value;

      // Is there enough balance to send?
      if (remainder < 0) {
        throw new TransferBalanceException();
      }

      // Does the remainder match what should be there in the source wallet?
      if (remainder !== sum) {
        throw new TransferRemainderException();
      }
    } else if (value !== 0) {
      // No senderWallet, but have a remainder?
      throw new TransferRemainderException();
    }

    // Looks like we passed all the tests!
    return true;
  }

  /**
   * Verify molecular hash integrity
   * @returns True if molecular hash matches computed hash
   * @throws {MolecularHashMismatchException} When hash doesn't match
   */
  molecularHash(): boolean {
    if (this.molecule.molecularHash !== Atom.hashAtoms({ atoms: this.molecule.atoms as any })) {
      throw new MolecularHashMismatchException();
    }

    return true;
  }

  /**
   * Verify One-Time Signature (OTS) cryptographic proof
   * @returns True if OTS verification passes
   * @throws {SignatureMalformedException} When signature format is invalid
   * @throws {SignatureMismatchException} When signature verification fails
   */
  ots(): boolean {
    // Convert Hm to numeric notation via EnumerateMolecule(Hm)
    const normalizedHash = this.molecule.normalizedHash();

    // Rebuilding OTS out of all the atoms
    let ots = this.molecule.atoms
      .map(atom => atom.otsFragment)
      .reduce((accumulator, otsFragment) => accumulator + otsFragment);

    // Wrong size? Maybe it's compressed
    if (ots.length !== 2048) {
      // Attempting decompression
      ots = base64ToHex(ots);

      // Still wrong? That's a failure
      if (ots.length !== 2048) {
        throw new SignatureMalformedException();
      }
    }

    // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
    const otsChunks = chunkSubstr(ots, 128);

    let keyFragments = '';

    for (const index in otsChunks) {
      let workingChunk = otsChunks[index];

      for (
        let iterationCount = 0, condition = 8 + (normalizedHash[index] || 0);
        iterationCount < condition;
        iterationCount++
      ) {
        workingChunk = new JsSHA('SHAKE256', 'TEXT')
          .update(workingChunk || '')
          .getHash('HEX', { outputLen: 512 });
      }

      keyFragments += workingChunk;
    }

    // Absorb the hashed Kk into the sponge to receive the digest Dk
    const digestSponge = new JsSHA('SHAKE256', 'TEXT');
    digestSponge.update(keyFragments);
    const digest = digestSponge.getHash('HEX', { outputLen: 8192 });

    // Squeeze the sponge to retrieve a 128 byte (64 character) string
    const addressSponge = new JsSHA('SHAKE256', 'TEXT');
    addressSponge.update(digest);
    const address = addressSponge.getHash('HEX', { outputLen: 256 });

    // Signing atom
    const signingAtom = this.molecule.atoms[0];

    if (!signingAtom) {
      throw new AtomsMissingException('No signing atom found');
    }

    // Get a signing address
    let signingAddress = signingAtom.walletAddress;

    // Get signing wallet from first atom's metas
    const signingWallet = Dot.get(signingAtom.aggregatedMeta(), 'signingWallet');

    // Try to get custom signing address from the metas
    if (signingWallet) {
      signingAddress = Dot.get(JSON.parse(signingWallet as string), 'address') as string;
    }

    if (address !== signingAddress) {
      throw new SignatureMismatchException();
    }

    // Looks like we passed all the tests!
    return true;
  }
}

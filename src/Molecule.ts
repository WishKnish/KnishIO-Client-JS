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

import Atom from './Atom'
import AtomMeta from './AtomMeta'
import Wallet from './Wallet'
import type { MetaData } from '@/types'
import JsSHA from 'jssha'
import {
  chunkSubstr,
  hexToBase64
} from './libraries/strings'
import CheckMolecule from './libraries/CheckMolecule'
import {
  generateBundleHash,
  generateBatchId
} from './libraries/crypto'
import { deepCloning } from './libraries/array'
import Dot from './libraries/Dot'
import AtomsMissingException from './exception/AtomsMissingException'
import BalanceInsufficientException from './exception/BalanceInsufficientException'
import NegativeAmountException from './exception/NegativeAmountException'
import SignatureMalformedException from './exception/SignatureMalformedException'
import versions from './versions/index'
import type {
  MoleculeOptions,
  MoleculeStatus,
  WalletLike,
  IsotopeType
} from '@/types'

/**
 * Molecule class used for committing changes to the ledger
 */
export default class Molecule {
  public status: MoleculeStatus | null = null
  public molecularHash: string | null = null
  public readonly createdAt: string
  public cellSlugOrigin: string | null
  public cellSlug: string | null
  public readonly secret: string | null
  public readonly bundle: string | null
  public readonly sourceWallet: WalletLike | null
  public remainderWallet: WalletLike | null = null
  public atoms: Atom[] = []
  public readonly version?: string

  /**
   * Class constructor
   */
  constructor ({
    secret = null,
    bundle = null,
    sourceWallet = null,
    remainderWallet = null,
    cellSlug = null,
    version = null
  }: MoleculeOptions) {
    this.createdAt = String(+new Date())
    this.cellSlugOrigin = this.cellSlug = cellSlug
    this.secret = secret
    this.bundle = bundle
    this.sourceWallet = sourceWallet
    
    if (version !== null && Object.prototype.hasOwnProperty.call(versions, version)) {
      this.version = String(version)
    }

    // Set the remainder wallet for this transaction
    if (remainderWallet || sourceWallet) {
      if (remainderWallet) {
        this.remainderWallet = remainderWallet
      } else if (sourceWallet) {
        const walletInstance = Wallet.create({
          secret,
          bundle,
          token: sourceWallet.token,
          batchId: sourceWallet.batchId,
          characters: sourceWallet.characters || null
        })
        this.remainderWallet = walletInstance.toWalletLike()
      }
    }
  }

  /**
   * Returns the cell slug delimiter
   */
  get cellSlugDelimiter (): string {
    return '.'
  }

  /**
   * Filters the atoms array by the supplied isotope list
   */
  static isotopeFilter (isotopes: IsotopeType | IsotopeType[], atoms: Atom[]): Atom[] {
    const isotopeArray = Array.isArray(isotopes) ? isotopes : [isotopes]
    return atoms.filter(atom => isotopeArray.includes(atom.isotope as IsotopeType))
  }

  /**
   * Generates the next atomic index
   */
  static generateNextAtomIndex (atoms: Atom[]): number {
    return atoms.length
  }

  /**
   * Converts a JSON object into a Molecule Structure instance
   */
  static jsonToObject (json: string): Molecule {
    const target = Object.assign(new Molecule({}), JSON.parse(json))
    const properties = Object.keys(new Molecule({}))

    if (!Array.isArray(target.atoms)) {
      throw new AtomsMissingException()
    }

    for (const index in Object.keys(target.atoms)) {
      target.atoms[index] = Atom.jsonToObject(JSON.stringify(target.atoms[index]))

      for (const property of ['position', 'walletAddress', 'isotope']) {
        const atomIndex = parseInt(index)
        const atomProperty = (target.atoms[atomIndex] as any)[property]
        if (target.atoms[atomIndex].isotope?.toLowerCase() !== 'r' && 
            (typeof atomProperty === 'undefined' || atomProperty === null)) {
          throw new AtomsMissingException('MolecularStructure::jsonToObject() - Required Atom properties are missing!')
        }
      }
    }

    for (const property in target) {
      if (Object.prototype.hasOwnProperty.call(target, property) && !properties.includes(property)) {
        delete (target as any)[property]
      }
    }

    target.atoms = Atom.sortAtoms(target.atoms)

    return target
  }

  /**
   * Accept a string of letters and numbers, and outputs a collection of decimals representing each
   * character according to a pre-defined dictionary. Input string would typically be 64-character
   * hexadecimal string featuring numbers from 0 to 9 and characters from a to f - a total of 15
   * unique symbols. To ensure that string has an even number of symbols, convert it to Base 17
   * (adding G as a possible symbol). Map each symbol to integer values as follows:
   *  0   1   2   3   4   5   6   7  8  9  a   b   c   d   e   f   g
   * -8  -7  -6  -5  -4  -3  -2  -1  0  1  2   3   4   5   6   7   8
   */
  static enumerate (hash: string): number[] {
    const mapped: Record<string, number> = {
      0: -8, 1: -7, 2: -6, 3: -5, 4: -4, 5: -3, 6: -2, 7: -1, 8: 0, 9: 1,
      a: 2, b: 3, c: 4, d: 5, e: 6, f: 7, g: 8
    }

    const characters = hash.split('')
    const result: number[] = []

    for (const character of characters) {
      const lowerChar = character.toLowerCase()
      if (lowerChar in mapped) {
        const value = mapped[lowerChar]
        if (value !== undefined) {
          result.push(value)
        }
      }
    }

    return result
  }

  /**
   * Normalize enumerated string to ensure that the total sum of all symbols is exactly zero. This
   * ensures that exactly 50% of the WOTS+ key is leaked with each usage, ensuring predictable key
   * safety:
   * The sum of each symbol within Hm shall be presented by m
   *  While m0 iterate across that set's integers as Im:
   *    If m0 and Im>-8 , let Im=Im-1
   *    If m<0 and Im<8 , let Im=Im+1
   *    If m=0, stop the iteration
   */
  static normalize (mappedHashArray: number[]): number[] {
    let total = mappedHashArray.reduce((total, num) => total + num)

    const totalCondition = total < 0

    while (total < 0 || total > 0) {
      for (const index of Object.keys(mappedHashArray)) {
        const indexNum = parseInt(index)
        const condition = totalCondition ? (mappedHashArray[indexNum] ?? 0) < 8 : (mappedHashArray[indexNum] ?? 0) > -8

        if (condition) {
          if (totalCondition) {
            mappedHashArray[indexNum] = (mappedHashArray[indexNum] ?? 0) + 1
            ++total
          } else {
            mappedHashArray[indexNum] = (mappedHashArray[indexNum] ?? 0) - 1
            --total
          }

          if (total === 0) {
            break
          }
        }
      }
    }

    return mappedHashArray
  }

  /**
   * Filters the atoms array by the supplied isotope list
   */
  getIsotopes (isotopes: IsotopeType | IsotopeType[]): Atom[] {
    return Molecule.isotopeFilter(isotopes, this.atoms)
  }

  /**
   * Generates the next atomic index
   */
  generateIndex (): number {
    return Molecule.generateNextAtomIndex(this.atoms)
  }

  /**
   * Fills a Molecule's properties with the provided object
   */
  fill (molecule: Molecule): void {
    const keys = Object.keys(molecule)
    for (const key of keys) {
      if (key in this) {
        (this as any)[key] = (molecule as any)[key]
      }
    }
  }

  /**
   * Add an atom to this molecule
   */
  addAtom (atom: Atom): Molecule {
    // Reset the molecular hash
    this.molecularHash = null

    // Create a new atom with the proper index and version set
    const atomWithIndexAndVersion = new Atom({
      position: atom.position,
      walletAddress: atom.walletAddress,
      isotope: atom.isotope as IsotopeType,
      token: atom.token,
      value: atom.value,
      metaType: atom.metaType,
      metaId: atom.metaId,
      meta: atom.meta,
      batchId: atom.batchId,
      index: this.generateIndex(),
      version: this.version ?? undefined,
      otsFragment: atom.otsFragment
    })

    // Add atom
    this.atoms.push(atomWithIndexAndVersion)

    // Sort atoms
    this.atoms = Atom.sortAtoms(this.atoms)

    return this
  }

  /**
   * Add user remainder atom for ContinuID
   */
  addContinuIdAtom (): Molecule {
    if (!this.remainderWallet) {
      throw new AtomsMissingException('Remainder wallet required for ContinuID atom')
    }
    
    this.addAtom(Atom.create({
      isotope: 'I',
      wallet: this.remainderWallet,
      metaType: 'walletBundle',
      metaId: this.remainderWallet.bundle
    }))
    return this
  }

  /**
   * Add policy atom to molecule
   */
  addPolicyAtom ({
    metaType,
    metaId,
    meta = {},
    policy = {}
  }: {
    metaType: string;
    metaId: string;
    meta?: Record<string, unknown>;
    policy?: Record<string, unknown>;
  }): Molecule {
    if (!this.sourceWallet || !this.secret) {
      throw new AtomsMissingException('Source wallet and secret required for policy atom')
    }

    // AtomMeta object initialization
    const atomMeta = new AtomMeta(meta as MetaData)
    atomMeta.addPolicy(policy)

    const wallet = Wallet.create({
      secret: this.secret,
      bundle: this.sourceWallet.bundle || '',
      token: 'USER'
    })

    this.addAtom(Atom.create({
      wallet: wallet.toWalletLike(),
      isotope: 'R',
      metaType,
      metaId,
      meta: atomMeta
    }))
    return this
  }

  /**
   * Initialize a V-type molecule to transfer value from one wallet to another, with a third,
   * regenerated wallet receiving the remainder
   */
  initValue ({
    recipientWallet,
    amount
  }: {
    recipientWallet: WalletLike;
    amount: number;
  }): Molecule {
    if (!this.sourceWallet || this.sourceWallet.balance - amount < 0) {
      throw new BalanceInsufficientException()
    }

    // Initializing a new Atom to remove tokens from source
    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount
    }))
    // Initializing a new Atom to add tokens to recipient
    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: recipientWallet,
      value: amount,
      metaType: 'walletBundle',
      metaId: recipientWallet.bundle
    }))
    // Initializing a remainder atom
    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet?.bundle
    }))

    return this
  }

  /**
   * Initialize an M-type molecule with the given data
   */
  initMeta ({
    meta,
    metaType,
    metaId,
    policy = {}
  }: {
    meta: Record<string, unknown>;
    metaType: string;
    metaId: string;
    policy?: Record<string, unknown>;
  }): Molecule {
    // Initializing a new Atom to hold our metadata
    this.addAtom(Atom.create({
      isotope: 'M',
      wallet: this.sourceWallet,
      metaType,
      metaId,
      meta: new AtomMeta(meta as MetaData)
    }))

    this.addPolicyAtom({
      metaType,
      metaId,
      meta,
      policy
    })

    // User remainder atom
    this.addContinuIdAtom()

    return this
  }

  /**
   * Initialize a C-type molecule to issue a new type of token
   */
  initTokenCreation ({
    recipientWallet,
    amount,
    meta
  }: {
    recipientWallet: WalletLike;
    amount: number;
    meta: Record<string, unknown>;
  }): Molecule {
    const atomMeta = new AtomMeta(meta as MetaData)
    atomMeta.setMetaWallet(recipientWallet)

    // The primary atom tells the ledger that a certain amount of the new token is being issued.
    this.addAtom(Atom.create({
      isotope: 'C',
      wallet: this.sourceWallet,
      value: amount,
      metaType: 'token',
      metaId: recipientWallet.token,
      meta: atomMeta,
      batchId: recipientWallet.batchId
    }))

    // User remainder atom
    this.addContinuIdAtom()

    return this
  }

  /**
   * Builds Atoms to define a new wallet on the ledger
   */
  initWalletCreation (wallet: WalletLike, atomMeta: AtomMeta | null = null): Molecule {
    if (!atomMeta) {
      atomMeta = new AtomMeta()
    }
    atomMeta.setMetaWallet(wallet)
    const creationAtom = Atom.create({
      isotope: 'C',
      wallet: this.sourceWallet,
      metaType: 'wallet',
      metaId: wallet.address,
      meta: atomMeta,
      batchId: wallet.batchId
    })
    this.addAtom(creationAtom)
    this.addContinuIdAtom()

    return this
  }

  /**
   * Builds Atoms to define a new identifier on the ledger
   */
  initIdentifierCreation ({
    type,
    contact,
    code
  }: {
    type: string;
    contact: string;
    code: string;
  }): Molecule {
    const meta = {
      code,
      hash: generateBundleHash(contact.trim(), 'Molecule::initIdentifierCreation')
    }

    this.addAtom(Atom.create({
      isotope: 'C',
      wallet: this.sourceWallet,
      metaType: 'identifier',
      metaId: type,
      meta: new AtomMeta(meta as MetaData)
    }))

    this.addContinuIdAtom()

    return this
  }

  /**
   * Arranges atoms to request tokens from the node itself
   */
  initTokenRequest ({
    token,
    amount,
    metaType,
    metaId,
    meta = {},
    batchId = null
  }: {
    token: string;
    amount: number;
    metaType: string;
    metaId: string;
    meta?: Record<string, unknown>;
    batchId?: string | null;
  }): Molecule {
    meta.token = token

    ;(this as any).local = 1

    this.addAtom(Atom.create({
      isotope: 'T',
      wallet: this.sourceWallet,
      value: amount,
      metaType,
      metaId,
      meta: new AtomMeta(meta as MetaData),
      batchId
    }))

    // User remainder atom
    this.addContinuIdAtom()

    return this
  }

  /**
   * Arranges atoms to request an authorization token from the node
   */
  initAuthorization ({ meta }: { meta: Record<string, unknown> }): Molecule {
    this.addAtom(Atom.create({
      isotope: 'U',
      wallet: this.sourceWallet,
      meta: new AtomMeta(meta as MetaData)
    }))

    // User remainder atom
    this.addContinuIdAtom()

    return this
  }

  /**
   * Burns some amount of tokens from a wallet
   */
  burnToken ({
    amount
  }: {
    amount: number;
    walletBundle?: string | null;
  }): Molecule {
    if (amount < 0.0) {
      throw new NegativeAmountException('Molecule::burnToken() - Amount to burn must be positive!')
    }

    if (!this.sourceWallet || (this.sourceWallet.balance - amount) < 0) {
      throw new BalanceInsufficientException()
    }

    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount
    }))
    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet?.bundle
    }))

    return this
  }

  /**
   * Initializes deposit buffer token operation
   */
  initDepositBuffer ({
    amount,
    tradeRates
  }: {
    amount: number
    tradeRates: unknown
  }): Molecule {
    if (!this.sourceWallet || (this.sourceWallet.balance - amount) < 0) {
      throw new BalanceInsufficientException()
    }

    // Create a buffer wallet
    const bufferWallet = Wallet.create({
      secret: this.secret,
      bundle: this.bundle,
      token: this.sourceWallet.token,
      batchId: this.sourceWallet.batchId
    })
    ;(bufferWallet as any).tradeRates = tradeRates

    // Initializing a new Atom to remove tokens from source
    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: this.sourceWallet,
      value: -amount
    }))

    // Initializing a new Atom to add tokens to recipient
    this.addAtom(Atom.create({
      isotope: 'B',
      wallet: bufferWallet,
      value: amount,
      metaType: 'walletBundle',
      metaId: this.sourceWallet.bundle
    }))

    this.addAtom(Atom.create({
      isotope: 'V',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.sourceWallet.bundle
    }))

    return this
  }

  /**
   * Initializes withdraw buffer token operation
   */
  initWithdrawBuffer ({
    recipients,
    signingWallet = null
  }: {
    recipients: Record<string, number>
    signingWallet?: WalletLike | null
  }): Molecule {
    // Calculate final amount from all recipients
    let amount = 0
    for (const [, recipientAmount] of Object.entries(recipients || {})) {
      amount += recipientAmount
    }
    if (!this.sourceWallet || (this.sourceWallet.balance - amount) < 0) {
      throw new BalanceInsufficientException()
    }

    // Set a metas signing position for molecule correct reconciliation
    const firstAtomMeta = new AtomMeta()
    if (signingWallet) {
      firstAtomMeta.setSigningWallet(signingWallet)
    }

    // Initializing a new Atom to remove tokens from source
    this.addAtom(Atom.create({
      isotope: 'B',
      wallet: this.sourceWallet,
      value: -amount,
      meta: firstAtomMeta,
      metaType: 'walletBundle',
      metaId: this.sourceWallet.bundle
    }))

    // Initializing a new Atom to add tokens to recipient
    for (const [recipientBundle, recipientAmount] of Object.entries(recipients || {})) {
      this.addAtom(new Atom({
        isotope: 'V',
        token: this.sourceWallet.token,
        value: recipientAmount,
        batchId: this.sourceWallet.batchId ? generateBatchId({}) : null,
        metaType: 'walletBundle',
        metaId: recipientBundle
      }))
    }

    this.addAtom(Atom.create({
      isotope: 'B',
      wallet: this.remainderWallet,
      value: this.sourceWallet.balance - amount,
      metaType: 'walletBundle',
      metaId: this.remainderWallet?.bundle
    }))

    return this
  }

  /**
   * Calculate molecular hash
   */
  calculateMolecularHash (): string {
    if (this.atoms.length === 0) {
      throw new AtomsMissingException('Cannot calculate hash for molecule with no atoms')
    }

    const hashResult = Atom.hashAtoms({ atoms: this.atoms })
    return typeof hashResult === 'string' ? hashResult : hashResult.join('')
  }

  /**
   * Creates a one-time signature for a molecule and breaks it up across multiple atoms within that
   * molecule. Resulting 4096 byte (2048 character) string is the one-time signature, which is then compressed.
   */
  sign ({
    bundle = null,
    anonymous = false,
    compressed = true
  }: {
    bundle?: string | null;
    anonymous?: boolean;
    compressed?: boolean;
  } = {}): string | null {
    // Do we have atoms?
    if (this.atoms.length === 0 || this.atoms.filter(atom => !(atom instanceof Atom)).length !== 0) {
      throw new AtomsMissingException()
    }

    // Derive the user's bundle
    if (!anonymous && !this.bundle) {
      ;(this as any).bundle = bundle || generateBundleHash(this.secret || '', 'Molecule::sign')
    }

    // Hash atoms to get molecular hash
    this.molecularHash = Atom.hashAtoms({
      atoms: this.atoms
    }) as string

    // Signing atom
    const signingAtom = this.atoms[0]
    if (!signingAtom) {
      throw new SignatureMalformedException('No atoms available for signing!')
    }

    // Set signing position from the first atom
    let signingPosition = signingAtom.position

    // Get signing wallet from first atom's metas
    const signingWallet = Dot.get(signingAtom.aggregatedMeta(), 'signingWallet')

    // Try to get custom signing position from the metas (local molecule with server secret)
    if (signingWallet && typeof signingWallet === 'string') {
      signingPosition = Dot.get(JSON.parse(signingWallet), 'position') as string | null
    }

    // Signing position is required
    if (!signingPosition) {
      throw new SignatureMalformedException('Signing wallet must have a position!')
    }

    // Generate the private signing key for this molecule
    const key = Wallet.generateKey({
      secret: this.secret || '',
      token: signingAtom.token || '',
      position: signingPosition || ''
    })
    // Subdivide Kk into 16 segments of 256 bytes (128 characters) each
    const keyChunks = chunkSubstr(key, 128)
    // Convert Hm to numeric notation, and then normalize
    const normalizedHash = this.normalizedHash()

    // Building a one-time-signature
    let signatureFragments = ''

    for (const index in keyChunks) {
      let workingChunk = keyChunks[index]

      for (let iterationCount = 0, condition = 8 - (normalizedHash[parseInt(index)] ?? 0); iterationCount < condition; iterationCount++) {
        workingChunk = (new JsSHA('SHAKE256', 'TEXT')).update(workingChunk ?? '').getHash('HEX', { outputLen: 512 })
      }
      signatureFragments += workingChunk
    }

    // Compressing the OTS
    if (compressed) {
      signatureFragments = hexToBase64(signatureFragments)
    }

    // Chunking the signature across multiple atoms
    const chunkedSignature = chunkSubstr(signatureFragments, Math.ceil(signatureFragments.length / this.atoms.length))

    let lastPosition = null

    for (let chunkCount = 0, condition = chunkedSignature.length; chunkCount < condition; chunkCount++) {
      ;(this.atoms[chunkCount] as any).otsFragment = chunkedSignature[chunkCount]
      lastPosition = this.atoms[chunkCount]?.position ?? null
    }

    return lastPosition ?? ''
  }

  /**
   * Returns the base cell slug portion
   */
  cellSlugBase (): string {
    return (this.cellSlug || '').split(this.cellSlugDelimiter)[0] ?? ''
  }

  /**
   * Convert Hm to numeric notation via EnumerateMolecule(Hm)
   */
  normalizedHash (): number[] {
    return Molecule.normalize(Molecule.enumerate(this.molecularHash || ''))
  }

  /**
   * Validates the current molecular structure
   */
  check (senderWallet: WalletLike | null = null): void {
    (new CheckMolecule(this as any)).verify(senderWallet as any)
  }

  /**
   * Returns JSON-ready clone minus protected properties
   */
  toJSON (): Record<string, unknown> {
    const clone = deepCloning(this)
    for (const key of ['remainderWallet', 'secret', 'sourceWallet', 'cellSlugOrigin', 'version']) {
      if (Object.prototype.hasOwnProperty.call(clone, key)) {
        delete (clone as any)[key]
      }
    }
    return clone as Record<string, unknown>
  }
}
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
                      (((((((((((((((((((              ((((((((((((((
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

import HashAtom from './HashAtom'
import type { IsotopeType, TransactionValue, AtomOptions } from '../types/atom'
import type { AtomMetaOptions, MetaData } from '../types/meta'

/**
 * Interface for Version4 constructor parameters
 */
interface Version4Options {
  position?: string | null;
  walletAddress?: string | null;
  isotope?: IsotopeType | null;
  token?: string | null;
  value?: TransactionValue | null;
  batchId?: string | null;
  metaType?: string | null;
  metaId?: string | null;
  meta?: AtomMetaOptions | MetaData | null;
  index?: number | null;
  createdAt?: number | null;
  version?: string | null;
}

/**
 * Version4 represents the fourth version of atom structure in the Knish.IO protocol.
 * 
 * This class extends HashAtom to provide version-specific atom handling capabilities,
 * including:
 * - Structured atom data representation
 * - Consistent property assignment for blockchain operations
 * - Support for all atom types (value, meta, create, transfer, etc.)
 * 
 * Version 4 atoms include enhanced metadata support and improved batch handling
 * for more efficient blockchain operations.
 */
export default class Version4 extends HashAtom {
  public position: string | null;
  public walletAddress: string | null;
  public isotope: IsotopeType | null;
  public token: string | null;
  public value: TransactionValue | null;
  public batchId: string | null;
  public metaType: string | null;
  public metaId: string | null;
  public meta: AtomMetaOptions | MetaData | null;
  public index: number | null;
  public createdAt: number | null;
  public version: string | null;

  /**
   * Creates a new Version4 atom instance
   * 
   * @param options - Configuration options for the atom
   * @param options.position - Position of the atom in the molecule
   * @param options.walletAddress - Wallet address associated with this atom
   * @param options.isotope - Type of atom operation (V, M, C, T, I, R, U, S, B)
   * @param options.token - Token slug for value operations
   * @param options.value - Transaction value (for value atoms)
   * @param options.batchId - Batch identifier for grouping related atoms
   * @param options.metaType - Type of metadata being stored
   * @param options.metaId - Unique identifier for metadata
   * @param options.meta - Metadata content
   * @param options.index - Index within the batch
   * @param options.createdAt - Timestamp of atom creation
   * @param options.version - Protocol version identifier
   */
  constructor({
    position = null,
    walletAddress = null,
    isotope = null,
    token = null,
    value = null,
    batchId = null,
    metaType = null,
    metaId = null,
    meta = null,
    index = null,
    createdAt = null,
    version = null
  }: Version4Options = {}) {
    super()
    
    this.position = position
    this.walletAddress = walletAddress
    this.isotope = isotope
    this.token = token
    this.value = value
    this.batchId = batchId
    this.metaType = metaType
    this.metaId = metaId
    this.meta = meta
    this.index = index
    this.createdAt = createdAt
    this.version = version
  }

  /**
   * Creates a Version4 instance from an existing atom
   * 
   * @param atom - The source atom to create from
   * @returns A new Version4 instance with atom properties
   */
  static create(atom: AtomOptions): Version4 {
    const parameters: Version4Options = {}

    for (const key of Object.keys(atom)) {
      if (Object.prototype.hasOwnProperty.call(atom, key)) {
        (parameters as any)[key] = (atom as any)[key]
      }
    }

    return new Version4(parameters)
  }
}

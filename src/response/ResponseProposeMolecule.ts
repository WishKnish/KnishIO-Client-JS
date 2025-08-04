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
import Response from './Response';
import Dot from '../libraries/Dot';
import Molecule from '../Molecule';
import type MutationProposeMolecule from '../mutation/MutationProposeMolecule';
import type { DotObject } from '../types/libraries/dot';
import type { MoleculeStatus } from '../types/molecule';
import type { ResponseOptions } from '../types';

/**
 * Response for proposing new Molecules
 */
export default class ResponseProposeMolecule extends Response {
  protected $__clientMolecule: unknown;
  protected $__payload: unknown = null;

  /**
   * Class constructor
   *
   * @param query - The mutation that produced this response
   * @param json - The GraphQL response data
   */
  constructor ({
    query,
    json
  }: ResponseOptions) {
    super({
      query,
      json,
      dataKey: 'data.ProposeMolecule'
    })
    this.$__clientMolecule = (query as MutationProposeMolecule).molecule()
  }

  /**
   * Initialize response object with payload data
   */
  protected init(): void {
    const payloadJson = Dot.get(this.data() as DotObject, 'payload')
    try {
      this.$__payload = Object.prototype.toString.call(payloadJson) === '[object String]'
        ? JSON.parse(payloadJson as string)
        : payloadJson
    } catch (err) {
      this.$__payload = null
    }
  }

  /**
   * Returns the client molecule
   */
  clientMolecule(): unknown {
    return this.$__clientMolecule
  }

  /**
   * Returns the resulting molecule
   *
   * @return The molecule instance or null
   */
  molecule(): Molecule | null {
    const data = this.data()

    if (!data) {
      return null
    }

    const molecule = new Molecule({})

    molecule.molecularHash = Dot.get(data as DotObject, 'molecularHash') as string
    molecule.status = Dot.get(data as DotObject, 'status') as MoleculeStatus
    Object.defineProperty(molecule, 'createdAt', {
      value: Dot.get(data as DotObject, 'createdAt') as string,
      writable: false
    })

    return molecule
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @return True if molecule was accepted
   */
  success(): boolean {
    return this.status() === 'accepted'
  }

  /**
   * Returns the status of the proposal
   *
   * @return The proposal status
   */
  status(): string {
    return Dot.get(this.data() as DotObject, 'status', 'rejected') as string
  }

  /**
   * Returns the reason for rejection
   *
   * @return The rejection reason
   */
  reason(): string {
    return Dot.get(this.data() as DotObject, 'reason', 'Invalid response from server') as string
  }

  /**
   * Returns payload object
   *
   * @return The payload data or null
   */
  payload(): unknown {
    return this.$__payload
  }
}
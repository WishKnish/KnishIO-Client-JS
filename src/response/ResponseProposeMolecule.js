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
import Response from './Response'
import Dot from '../libraries/Dot'
import Molecule from '../Molecule'

/**
 * Response for proposing new Molecules
 */
export default class ResponseProposeMolecule extends Response {
  /**
   * Class constructor
   *
   * @param {MutationProposeMolecule} query
   * @param {object} json
   */
  constructor ({
    query,
    json
  }) {
    super({
      query,
      json,
      dataKey: 'data.ProposeMolecule'
    })
    this.$__clientMolecule = query.molecule()
  }

  /**
   * Initialize response object with payload data
   */
  init () {
    const payloadJson = Dot.get(this.data(), 'payload')
    try {
      this.$__payload = Object.prototype.toString.call(payloadJson) === '[object String]'
        ? JSON.parse(payloadJson)
        : payloadJson
    } catch (err) {
      this.$__payload = null
    }
  }

  /**
   * Returns the client molecule
   */
  clientMolecule () {
    return this.$__clientMolecule
  }

  /**
   * Returns the resulting molecule
   *
   * @return {Molecule|null}
   */
  molecule () {
    const data = this.data()

    if (!data) {
      return null
    }

    const molecule = new Molecule({})

    molecule.molecularHash = Dot.get(data, 'molecularHash')
    molecule.status = Dot.get(data, 'status')
    molecule.createdAt = Dot.get(data, 'createdAt')

    return molecule
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @return {boolean}
   */
  success () {
    return this.status() === 'accepted'
  }

  /**
   * Returns the status of the proposal
   *
   * @return {string}
   */
  status () {
    return Dot.get(this.data(), 'status', 'rejected')
  }

  /**
   * Returns the reason for rejection
   *
   * @return {string}
   */
  reason () {
    return Dot.get(this.data(), 'reason', 'Invalid response from server')
  }

  /**
   * Returns payload object
   *
   * @return {null}
   */
  payload () {
    return this.$__payload
  }
}

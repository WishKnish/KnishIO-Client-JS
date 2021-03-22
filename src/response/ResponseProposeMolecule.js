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
import Response from "./Response";
import Dot from "../libraries/Dot";
import MoleculeStructure from "../MoleculeStructure";

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
  constructor ( {
    query,
    json,
  } ) {
    super( {
      query,
      json,
    } );
    this.dataKey = 'data.ProposeMolecule';
    this.$__clientMolecule = query.molecule();
    this.init();
  }

  /**
   * Initialize response object with payload data
   */
  init () {
    const payload_json = Dot.get( this.data(), 'payload' );
    try {
      this.$__payload = JSON.parse( payload_json );
    } catch ( err ) {
      this.$__payload = null;
    }
  }


  /**
   * Returns the client molecule
   */
  clientMolecule () {
    return this.$__clientMolecule;
  }

  /**
   * Returns the resulting molecule
   *
   * @returns {MoleculeStructure|null}
   */
  molecule () {

    const data = this.data();

    if ( !data ) {
      return null;
    }

    const molecule = new MoleculeStructure();

    molecule.molecularHash = Dot.get( data, 'molecularHash' );
    molecule.status = Dot.get( data, 'status' );
    molecule.status = Dot.get( data, 'createdAt' );

    return molecule;
  }

  /**
   * Returns whether molecule was accepted or not
   *
   * @returns {boolean}
   */
  success () {
    return this.status() === 'accepted';
  }

  /**
   * Returns the status of the proposal
   *
   * @returns {string}
   */
  status () {
    return Dot.get( this.data(), 'status', 'rejected' );
  }

  /**
   * Returns the reason for rejection
   *
   * @returns {string}
   */
  reason () {
    return Dot.get( this.data(), 'reason', 'Invalid response from server' );
  }

  /**
   * Returns payload object
   *
   * @returns {null}
   */
  payload () {
    return this.$__payload;
  }

}

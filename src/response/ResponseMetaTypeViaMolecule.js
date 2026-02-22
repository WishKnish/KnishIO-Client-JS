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
                        (///////////////(                (//////////////)
                       (////////////////(               (///////////////)
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

import Query from '../query/Query.js'
import Response from './Response.js'
import CheckMolecule from '../libraries/CheckMolecule.js'

/**
 * Response for MetaType queries via Molecule data.
 *
 * Instead of using the redundant instance-level `metas` field,
 * this response extracts metadata from molecule atoms' `metasJson`,
 * producing a payload format compatible with ResponseMetaType and
 * ResponseMetaTypeViaAtom for drop-in replacement usage.
 */
export default class ResponseMetaTypeViaMolecule extends Response {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ({
    query,
    json
  }) {
    super({
      query,
      json,
      dataKey: 'data.MetaTypeViaAtom'
    })
  }

  /**
   * Extracts metas from a molecule's atoms' metasJson for a specific instance.
   * Filters atoms by matching metaType and metaId, then parses metasJson.
   *
   * @param {object} molecule - Molecule data with atoms array
   * @param {string} metaType - Instance meta type to filter by
   * @param {string} metaId - Instance meta ID to filter by
   * @return {Array<{molecularHash: string, position: string, key: string, value: string, createdAt: string}>}
   */
  static extractMetasFromMolecule (molecule, metaType, metaId) {
    if (!molecule || !molecule.atoms) {
      return []
    }

    const metas = []

    for (const atom of molecule.atoms) {
      // Filter atoms to those matching this instance's metaType and metaId
      if (atom.metaType !== metaType || atom.metaId !== metaId) {
        continue
      }

      if (!atom.metasJson) {
        continue
      }

      let parsed
      try {
        parsed = JSON.parse(atom.metasJson)
        if (!Array.isArray(parsed)) {
          continue
        }
      } catch (e) {
        continue
      }

      for (const entry of parsed) {
        metas.push({
          molecularHash: molecule.molecularHash,
          position: atom.position,
          key: entry.key,
          value: entry.value,
          createdAt: atom.createdAt
        })
      }
    }

    return metas
  }

  /**
   * Returns meta type instance results with metas synthesized from molecule data.
   * Produces the same payload format as ResponseMetaType and ResponseMetaTypeViaAtom:
   * { instances, instanceCount, paginatorInfo }
   *
   * @return {null|{instances: Array, instanceCount: Array, paginatorInfo: object}}
   */
  payload () {
    const metaTypeData = this.data()

    if (!metaTypeData || metaTypeData.length === 0) {
      return null
    }

    const response = {
      instances: {},
      instanceCount: {},
      paginatorInfo: {}
    }

    const metaData = metaTypeData.pop()

    if (metaData.instances) {
      response.instances = metaData.instances.map(instance => {
        // Prefer server-filtered metas (from metas sub-field) when available
        let metas = instance.metas
        if (!metas || metas.length === 0) {
          // Fallback: synthesize from molecule atoms' metasJson
          metas = ResponseMetaTypeViaMolecule.extractMetasFromMolecule(
            instance.molecule,
            instance.metaType,
            instance.metaId
          )
        }

        return {
          ...instance,
          metas
        }
      })
    }

    if (metaData.instanceCount) {
      response.instanceCount = metaData.instanceCount
    }

    if (metaData.paginatorInfo) {
      response.paginatorInfo = metaData.paginatorInfo
    }

    return response
  }

  /**
   * Verifies the cryptographic integrity of all molecules associated
   * with meta instances in this response. For each instance, reconstructs
   * the molecule from server data and runs CheckMolecule.verify() to validate
   * the molecular hash and OTS signature.
   *
   * @return {{ verified: boolean, molecules: Array<{ molecularHash: string, verified: boolean, error: string|null }> }}
   */
  verifyIntegrity () {
    const results = []
    const metaTypeData = this.data()

    if (!metaTypeData || metaTypeData.length === 0) {
      return { verified: true, molecules: results }
    }

    const instances = metaTypeData[metaTypeData.length - 1]?.instances || []

    for (const instance of instances) {
      if (!instance.molecule) continue
      results.push(CheckMolecule.verifyFromServerData(instance.molecule))
    }

    return {
      verified: results.length === 0 || results.every(r => r.verified),
      molecules: results
    }
  }
}

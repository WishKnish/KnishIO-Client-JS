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
import Query from '../query/Query.js'
import Response from '../response/Response.js'

/**
 * Base class used to construct various GraphQL mutations
 */
export default class Mutation extends Query {
  /**
   * Creates a new Request for the given parameters
   *
   * @param {{}} variables
   * @returns {{variables: (Object|null), query: null}}
   */
  createQuery ({ variables = null }) {
    const request = super.createQuery({ variables })
    request.mutation = request.query
    delete request.query
    return request
  }

  /**
   * Sends the Mutation to a Knish.IO node and returns the Response
   * @param {Object||null} variables
   * @param {Object||null} context
   * @returns {Promise<Response|null>}
   */
  async execute ({ variables = {}, context = {} }) {
    this.$__request = this.createQuery({
      variables
    })

    const mergedContext = {
      ...context,
      ...this.createQueryContext()
    }

    try {
      const mutationParams = {
        ...this.$__request,
        context: mergedContext
      }
      const response = await this.client.mutate(mutationParams)

      this.$__response = await this.createResponseRaw(response)

      return this.$__response
    } catch (error) {
      if (error.name === 'AbortError') {
        this.knishIOClient.log('warn', 'Mutation was cancelled')
        // You might want to create a custom response for cancelled mutations
        return new Response({
          query: this,
          json: { data: null, errors: [{ message: 'Mutation was cancelled' }] }
        })
      } else {
        throw error
      }
    }
  }

  createQueryContext () {
    // Override this method in subclasses if needed
    return {}
  }
}

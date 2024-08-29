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
import Query from '../query/Query'
import Response from '../response/Response'

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
   *
   * @param {Object} options
   * @param {Object} options.variables
   * @param {Object} options.context
   * @returns {Promise<Response>}
   */
  async execute ({ variables = null, context = {} }) {
    this.$__request = this.createQuery({
      variables
    })

    const mergedContext = {
      ...context,
      ...this.createQueryContext()
    }

    try {
      const response = await this.client.mutate({
        ...this.$__request,
        context: mergedContext
      })

      this.$__response = await this.createResponseRaw(response)

      return this.$__response
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Mutation was cancelled')
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

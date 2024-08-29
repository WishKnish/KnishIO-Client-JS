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
import CodeException from '../exception/CodeException'
import Response from '../response/Response'

export default class Query {
  /**
   *
   * @param {ApolloClient} apolloClient
   */
  constructor (apolloClient) {
    this.client = apolloClient
    this.$__variables = null
    this.$__query = null
  }

  /**
   * Return a response object
   * Used at KnishIOClient::createMolecule => sets the source wallet from the remainder one stored in response object
   * @return {Response}
   */
  response () {
    return this.$__response
  }

  /**
   * Builds a Response based on JSON input
   *
   * @param response
   * @return {Promise<Response>}
   */
  async createResponseRaw (response) {
    return this.createResponse(response)
  }

  /**
   * Returns a Response object
   *
   * @param {object} json
   * @return {Response}
   */
  createResponse (json) {
    return new Response({
      query: this,
      json
    })
  }

  /**
   * Creates a new Request for the given parameters
   *
   * @param {{}} variables
   * @returns {{variables: (Object|null), query: null}}
   */
  createQuery ({ variables = null }) {
    this.$__variables = this.compiledVariables(variables)

    // Uri is a required parameter
    const uri = this.uri()

    if (!uri) {
      throw new CodeException('Query::createQuery() - Node URI was not initialized for this client instance!')
    }

    if (this.$__query === null) {
      throw new CodeException('Query::createQuery() - GraphQL subscription was not initialized!')
    }

    return {
      query: this.$__query,
      variables: this.variables()
    }
  }

  /**
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {object} variables
   * @return {Promise<Response>}
   */
  async execute ({ variables = null }) {
    this.$__request = this.createQuery({
      variables
    })

    const response = await this.client.query(this.$__request)

    this.$__response = await this.createResponseRaw(response)

    return this.$__response
  }

  /**
   * Returns a variables object for the Query
   *
   * @param {object} variables
   * @return {object}
   */
  compiledVariables (variables = null) {
    return variables || {}
  }

  /**
   * Returns the Knish.IO endpoint URI
   *
   * @return {string}
   */
  uri () {
    return this.client.getUri()
  }

  /**
   * Returns the query variables object
   *
   * @return {object|null}
   */
  variables () {
    return this.$__variables
  }
}

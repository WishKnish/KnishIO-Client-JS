import CodeException from '../exception/CodeException.js'

export default class Subscribe {
  /**
   *
   * @param {UrqlClientWrapper} graphQLClient
   */
  constructor (graphQLClient) {
    this.client = graphQLClient
    this.$__variables = null
    this.$__subscribe = null
  }

  /**
   * Creates a new Request for the given parameters
   *
   * @param {{}} variables
   * @returns {{variables: (Object|null), fetchPolicy: string, query: null}}
   */
  createSubscribe ({
    variables = null
  }) {
    this.$__variables = this.compiledVariables(variables)

    // Uri is a required parameter
    const uri = this.uri()

    if (!uri) {
      throw new CodeException('Subscribe::createSubscribe() - Node URI was not initialized for this client instance!')
    }

    if (this.$__subscribe === null) {
      throw new CodeException('Subscribe::createSubscribe() - GraphQL subscription was not initialized!')
    }

    return {
      query: this.$__subscribe,
      variables: this.variables(),
      fetchPolicy: 'no-cache'
    }
  }

  /**
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {{}} variables
   * @param {function} closure
   * @return {string}
   */
  async execute ({
    variables = null,
    closure
  }) {
    if (!closure) {
      throw new CodeException(`${ this.constructor.name }::execute() - closure parameter is required!`)
    }

    this.$__request = this.createSubscribe({
      variables
    })

    return this.client.subscribe(this.$__request, closure)
  }

  /**
   * Returns a variables object for the Query
   *
   * @param variables
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

import CodeException from "../exception/CodeException";


export default class Subscribe {
  /**
   *
   * @param {SocketClient} socketClient
   */
  constructor ( socketClient ) {
    this.client = socketClient;
    this.$__variables = null;
    this.$__subscribe = null;
  }

  /**
   * Creates a new Request for the given parameters
   *
   * @param {object} variables
   * @param {array|object|null} fields
   * @returns {object}
   */
  createSubscribe ( {
    variables = null,
  } ) {
    this.$__variables = this.compiledVariables( variables );

    // Uri is a required parameter
    let uri = this.uri();

    if ( !uri ) {
      throw new CodeException( 'Subscribe::createSubscribe => Uri does not initialized.' );
    }

    if ( this.$__subscribe === null ) {
      throw new CodeException( 'Subscribe::createSubscribe => GraphQL subscription does not initialized.' );
    }

    return {
      query: this.$__subscribe,
      variables: this.variables(),
      fetchPolicy: 'no-cache',
    }
  }

  /**
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {object} variables
   * @param {function} closure
   * @return {Promise}
   */
  async execute ( {
    variables = null,
    closure,
  } ) {

    this.$__request = this.createSubscribe( {
      variables,
    } );

    this.client.subscribe( this.$__request, closure );
  }

  /**
   * Returns a variables object for the Query
   *
   * @param variables
   * @returns {{}}
   */
  compiledVariables ( variables = null ) {
    return variables || {}
  }

  /**
   * Returns the Knish.IO endpoint URI
   *
   * @return {string}
   */
  uri () {
    return this.client.getUri();
  }

  /**
   * Returns the query variables object
   *
   * @return {object|null}
   */
  variables () {
    return this.$__variables;
  }
}
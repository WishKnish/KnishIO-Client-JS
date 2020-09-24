import Query from "./Query";
import ResponseIdentifier from "../response/ResponseIdentifier";


export default class QueryLinkIdentifierMutation extends Query {

  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `mutation( $bundle: String!, $type: String!, $content: String! ) { LinkIdentifier( bundle: $bundle, type: $type, content: $content ) @fields }`;
    this.$__fields = {
      'type': null,
      'bundle': null,
      'content': null,
      'set': null,
      'message': null,
    };
  }

  /**
   *
   * @param {string} response
   * @return {ResponseIdentifier}
   */
  createResponse ( response ) {
    return new ResponseIdentifier( this, response );
  }

}
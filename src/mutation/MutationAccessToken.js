import Query from "../query/Query";
import ResponseAccessToken from "../response/ResponseAccessToken";


export default class MutationAccessToken extends Query {
  /**
   * Class constructor
   *
   * @param knishIO
   */
  constructor ( knishIO ) {
    super( knishIO );
    this.$__query = `mutation( $cellSlug: String ) { AccessToken( cellSlug: $cellSlug ) @fields }`;
    this.$__fields = {
      'token': null,
      'time': null,
    };
  }

  /**
   * Returns a Response object
   *
   * @param {string} response
   * @return {ResponseAccessToken}
   */
  createResponse ( response ) {
    return new ResponseAccessToken( this, response );
  }
}
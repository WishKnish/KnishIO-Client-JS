import InvalidResponseException from "../exception/InvalidResponseException";
import UnauthenticatedException from "../exception/UnauthenticatedException";
import Dot from "../libraries/Dot";

/**
 *
 */
export default class Response {

  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {

    this.dataKey = null;
    this.errorKey = 'error';
    this.$__payload = null;
    this.$__query = query;
    this.$__originResponse = json;
    this.$__response = json;

    if ( typeof this.$__response === 'undefined' ) {
      throw new InvalidResponseException();
    }

    if ( Dot.has( this.$__response, this.errorKey ) ) {

      const error = Dot.get( this.$__response, this.errorKey );

      if ( String( error ).includes( 'Unauthenticated' ) ) {
        throw new UnauthenticatedException();
      }

      throw new InvalidResponseException();
    }
  }

  /**
   * @return {*}
   */
  data () {

    if ( !this.dataKey ) {
      return this.response();
    }

    // Check key & return custom data from the response
    if ( !Dot.has( this.response(), this.dataKey ) ) {
      throw new InvalidResponseException();
    }

    return Dot.get( this.response(), this.dataKey );
  }

  /**
   * @return {*}
   */
  response () {
    return this.$__response;
  }

  /**
   * @return {*}
   */
  payload () {
    return null;
  }

  /**
   * @return {*}
   */
  query () {
    return this.$__query;
  }
}

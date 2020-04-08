import Response from "./Response";
import Dot from "../libraries/Dot";

export default class ResponseIdentifier extends Response {
  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.data.LinkIdentifier'
  }

  success () {
    return Dot.get( this.data(), 'set' );
  }

  message () {
    return Dot.get( this.data(), 'message' );
  }
}
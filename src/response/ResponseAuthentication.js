import ResponseMolecule from "./ResponseMolecule";
import Dot from "../libraries/Dot";
import InvalidResponseException from "../exception/InvalidResponseException";

export default class ResponseAuthentication extends ResponseMolecule {

  payloadKey ( key ) {
    if ( !Dot.has( this.payload(), key ) ) {
      throw new InvalidResponseException( `ResponseAuthentication: '${ key }' key is not found in the payload.` );
    }
    return Dot.get( this.payload(), key );
  }

  token () {
    return this.payloadKey( 'token' );
  }

  time () {
    return this.payloadKey( 'time' );
  }

  pubkey () {
    return this.payloadKey( 'pubkey' );
  }
}

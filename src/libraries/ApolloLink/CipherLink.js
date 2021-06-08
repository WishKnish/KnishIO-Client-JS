import {
  ApolloLink,
  Operation,
  NextLink
} from 'apollo-link';
import { print } from 'graphql';
import gql from 'graphql-tag';
import {
  operationName,
  operationType
} from './handler';
import CodeException from '../../exception/CodeException';
import Dot from '../Dot';


class CipherLink extends ApolloLink {

  constructor () {
    super();

    this.__wallet = null;
    this.__pubkey = null;
  }

  /**
   * @param {null|Wallet} wallet
   */
  setWallet ( wallet ) {
    this.__wallet = wallet;
  }

  /**
   * @return {null|Wallet}
   */
  getWallet () {
    return this.__wallet;
  }

  /**
   * @param {null|string} pubkey
   */
  setPubKey ( pubkey ) {
    this.__pubkey = pubkey;
  }

  /**
   * @return {null|string}
   */
  getPubKey () {
    return this.__pubkey;
  }

  /**
   *
   * @param {Operation} operation
   * @param {NextLink} forward
   * @return {*}
   */
  request ( operation, forward ) {

    const requestName = operationName( operation ),
      requestType = operationType( operation ),
      isMoleculeMutation = ( requestType === 'mutation' && requestName === 'ProposeMolecule' ),
      condition = [
        ( requestType === 'query' && [ '__schema', 'ContinuId' ].includes( requestName ) ),
        ( requestType === 'mutation' && requestName === 'AccessToken' ),
        ( isMoleculeMutation && Dot.get( operation, 'variables.molecule.atoms.0.isotope' ) === 'U' )
      ],
      cipher = JSON.stringify( {
        query: print( operation.query ),
        variables: JSON.stringify( operation.variables )
      } ),
      wallet = this.getWallet(),
      pubKey = this.getPubKey();

    for ( const key in condition ) {
      if ( condition[ key ] ) {
        return forward( operation );
      }
    }

    if ( !pubKey ) {
      throw new CodeException( 'Server public key missing.' );
    }

    if ( !wallet ) {
      throw new CodeException( 'Authorized wallet missing.' );
    }

    operation.operationName = null;
    operation.query = gql`query ( $Hash: String! ) { CipherHash ( Hash: $Hash ) { hash } }`;
    operation.variables = { Hash: JSON.stringify( wallet.encryptMyMessage( cipher, pubKey ) ) };

    return forward( operation ).map( data => {

      let response = data.data;

      if ( response.data ) {
        response = response.data;
      }

      if ( response.CipherHash && response.CipherHash.hash ) {
        const encrypted = JSON.parse( response.CipherHash.hash );
        const decryption = wallet.decryptMyMessage( encrypted );

        if ( decryption === null ) {
          throw new CodeException( 'Response decryption error.' );
        }

        return decryption;
      }

      return data;
    } );
  }

}

export default CipherLink;

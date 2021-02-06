import KnishIOClient from "../KnishIOClient";
import Dot from "../libraries/Dot";
import {
  generateBundleHash,
  generateSecret
} from "../libraries/crypto";
import ResponseMolecule from "../response/ResponseMolecule";

export default class Test {

  /**
   * Constructor
   * @param graphqlUrl
   */
  constructor ( graphqlUrl ) {
    this.secrets = [ generateSecret(), generateSecret() ];
    this.tokenSlugs = [ 'TESTTOKEN', 'UTENVSTACKABLE' ];
    this.graphqlUrl = graphqlUrl;
    this.clients = {};
  }


  /**
   * Test all KnishIOClient functions
   */
  async testAll () {
    await this.client( this.secrets[ 0 ] )
    await this.client( this.secrets[ 1 ] )
    await this.testCreateToken();
    await this.testCreateWallet();
    await this.testCreateMeta();
    await this.testCreateIdentifier();
    await this.testRequestTokens();
    await this.testTransferToken();
    await this.testClaimShadowWallet();
    await this.testQueryMeta();
    await this.testQueryWallets();
    await this.testQueryShadowWallets();
    await this.testQueryBundle();
    await this.testQueryBalance();
  }

  /**
   * @throws \Exception
   */
  testCreateToken () {
    let token = this.tokenSlugs[ 0 ];
    return this.client( this.secrets[ 0 ] )
      .createToken( {
        token,
        amount: 1000.000000000000,
        tokenMetadata: {
          name: token,
          fungibility: 'stackable',
          supply: 'limited',
          decimals: 0,
          icon: 'icon',
        },
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateToken' );
      } );
  }

  /**
   *
   */
  testCreateWallet () {
    return this.client( this.secrets[ 0 ] )
      .createWallet( this.tokenSlugs[ 1 ] )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateWallet' );
      } );
  }

  /**
   *
   */
  testCreateMeta () {
    return this.client( this.secrets[ 0 ] )
      .createMeta( {
        metaType: 'metaType',
        metaId: 'metaId',
        meta: {
          key1: 'value1',
          key2: 'value2',
        },
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateMeta' );
      } );
  }


  /**
   *
   */
  testCreateIdentifier () {
    return this.client( this.secrets[ 0 ] )
      .createIdentifier( {
        type: 'email',
        contact: 'test@test.com',
        code: '1234'
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateIdentifier' );
      } );
  }

  /**
   *
   */
  testRequestTokens () {
    return this.client( this.secrets[ 0 ] )
      .requestTokens( {
        token: this.tokenSlugs[ 1 ],
        requestedAmount: 10,
        to: this.secrets[ 0 ]
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testRequestTokens' );
      } );
  }

  /**
   *
   */
  testTransferToken () {
    let walletObjectOrBundleHash = generateBundleHash( this.secrets[ 1 ] );
    return this.client( this.secrets[ 0 ] )
      .transferToken( {
        walletObjectOrBundleHash,
        token: this.tokenSlugs[ 0 ],
        amount: 10,
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testTransferToken' );
      } );
  }

  /**
   *
   */
  testClaimShadowWallet () {
    return this.client( this.secrets[ 1 ] )
      .claimShadowWallet( {
        token: this.tokenSlugs[ 0 ],
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testClaimShadowWallet' );
      } );
  }

  /**
   *
   */
  testQueryMeta () {
    return this.client( this.secrets[ 0 ] )
      .queryMeta( {
        metaType: 'metaType',
        metaId: 'metaId',
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryMeta' );
      } );
  }

  /**
   *
   */
  testQueryWallets () {
    return this.client( this.secrets[ 0 ] )
      .queryWallets( {} )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryWallets' );
      } );
  }

  /**
   *
   */
  testQueryShadowWallets () {
    return this.client( this.secrets[ 1 ] )
      .queryShadowWallets( {
        tokenSlug: this.tokenSlugs[ 0 ],
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryShadowWallets' );
      } );
  }

  /**
   *
   */
  testQueryBundle () {
    return this.client( this.secrets[ 0 ] )
      .queryBundle( {} )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryBundle' );
      } );
  }


  /**
   *
   */
  testQueryContinuId () {
    let bundleHash = generateBundleHash( this.secrets[ 0 ] );
    return this.client( this.secrets[ 0 ] )
      .queryContinuId( bundleHash )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryContinuId' );
      } );
  }

  /**
   * @throws \Exception
   */
  testQueryBalance () {
    return this.client( this.secrets[ 0 ] )
      .queryBalance( {
        token: this.tokenSlugs[ 0 ],
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryBalance' );
      } );
  }


  /**
   * Get a client for each secret
   * @param secret
   * @param cellSlug
   */
  client ( secret, cellSlug = 'unit_test' ) {

    // Create new client
    if ( !this.clients[ secret ] ) {

      // Create a client
      this.clients[ secret ] = new KnishIOClient( this.graphqlUrl );

      // Auth the client
      return this.clients[ secret ]
        .requestAuthToken( {
          secret,
          cellSlug,
        } )
        .then( ( response ) => {
          this.checkResponse( response, 'requestAuthToken' );
        } );
    }

    // Return the client by secret
    return this.clients[ secret ];
  }


  /**
   * Check a response
   * @param response
   * @param key
   */
  checkResponse ( response, key ) {

    console.log( ' ############### ' + key + ' ###############' );
    console.log( response );

    // Check molecule response
    if ( response instanceof ResponseMolecule ) {
      if ( !response.success() ) {
        this.debug( response );
      }
      console.assert( response.status() === 'accepted', response )
    }

    // Default response
    else {
      this.debug( response );
    }
  }


  /**
   * Debug output
   * @param response
   */
  debug ( response ) {


    // Reason data on the top of the output
    if ( response.data && Dot.get( response.data() || {}, 'reason' ) ) {
      console.log( response.data().reason );
    } else {
      console.log( response );
    }

  }

}

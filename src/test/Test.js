import KnishIOClient from "../KnishIOClient";
import Dot from "../libraries/Dot";
import { generateBundleHash, generateSecret } from "../libraries/crypto";
import ResponseMolecule from "../response/ResponseMolecule";

export default class Test {

  // All token units
  tokenUnits = [
    [ 'unit_id_1', 'unit_name_1', 'unit_meta_1', ],
    [ 'unit_id_2', 'unit_name_2', 'unit_meta_2', ],
    [ 'unit_id_3', 'unit_name_3', 'unit_meta_3', ],
    [ 'unit_id_4', 'unit_name_4', 'unit_meta_4', ],
    [ 'unit_id_5', 'unit_name_5', 'unit_meta_5', ],
    [ 'unit_id_6', 'unit_name_6', 'unit_meta_6', ],
    [ 'unit_id_7', 'unit_name_7', 'unit_meta_7', ],
    [ 'unit_id_8', 'unit_name_8', 'unit_meta_8', ],
    [ 'unit_id_9', 'unit_name_9', 'unit_meta_9', ],
    [ 'unit_id_10','unit_name_10','unit_meta_10', ],
    [ 'unit_id_11','unit_name_11','unit_meta_11', ],
  ];

  /**
   * Constructor
   * @param graphqlUrl
   */
  constructor ( graphqlUrl ) {
    this.secrets = [ generateSecret(), generateSecret() ];
    this.tokenSlugs = [ 'TESTTOKEN', 'UTENVSTACKABLE', 'UTSTACKUNIT', 'UTENVSTACKUNIT', ];
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

    // Regular stackable token
    this.client( this.secrets[ 0 ] )
      .createToken( this.tokenSlugs[ 0 ], 1000.000000000000, {
        name: this.tokenSlugs[ 0 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon',
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateToken.0' );
      } );

    // Server stackable token
    this.client( this.secrets[ 0 ] )
      .createToken( this.tokenSlugs[ 1 ], 1000.000000000000, {
        name: this.tokenSlugs[ 1 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon',
      } )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateToken.1' );
      } );


    // createUnitableToken
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
      .createMeta( 'metaType', 'metaId', {
        key1: 'value1',
        key2: 'value2',
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
      .createIdentifier( 'email', 'test@test.com', 1234 )
      .then( ( response ) => {
        this.checkResponse( response, 'testCreateIdentifier' );
      } );
  }

  /**
   *
   */
  testRequestTokens () {
    return;
    return this.client( this.secrets[ 0 ] )
      .requestTokens( this.tokenSlugs[ 1 ], 10, this.secrets[ 0 ] )
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
      .transferToken( walletObjectOrBundleHash, this.tokenSlugs[ 0 ], 10 )
      .then( ( response ) => {
        this.checkResponse( response, 'testTransferToken' );
      } );
  }


  /**
   *
   */
  testTransferUnitToken () {

  }

  /**
   *
   */
  async testClaimShadowWallet () {

    let response = await this.client( this.secrets[ 1 ] )
      .queryBalance( this.tokenSlugs[ 0 ] );

    let wallet = await response.payload();

    return await this.client( this.secrets[ 1 ] )
      .claimShadowWallet( this.tokenSlugs[ 0 ], wallet.batchId )
      .then( ( response ) => {
        this.checkResponse( response, 'testClaimShadowWallet' );
      } );
  }

  /**
   *
   */
  testQueryMeta () {
    return this.client( this.secrets[ 0 ] )
      .queryMeta( 'metaType', 'metaId' )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryMeta' );
      } );
  }

  /**
   *
   */
  testQueryWallets () {
    return this.client( this.secrets[ 0 ] )
      .queryWallets()
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryWallets' );
      } );
  }

  /**
   *
   */
  testQueryShadowWallets () {
    return this.client( this.secrets[ 1 ] )
      .queryShadowWallets( this.tokenSlugs[ 0 ] )
      .then( ( response ) => {
        this.checkResponse( response, 'testQueryShadowWallets' );
      } );
  }

  /**
   *
   */
  testQueryBundle () {
    return this.client( this.secrets[ 0 ] )
      .queryBundle()
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
      .queryBalance( this.tokenSlugs[ 0 ] )
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
        .requestAuthToken( secret, cellSlug )
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
   */
  checkResponse ( response, key ) {

    console.log( ' ############### ' + key + ' ###############' );
    console.log( response );

    // Check molecule response
    if ( response instanceof ResponseMolecule ) {
      if ( !response.success() ) {
        this.debug( response );
      }
      console.assert( response.status() == 'accepted', response )
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

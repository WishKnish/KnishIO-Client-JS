import KnishIOClient from "../KnishIOClient";
import Dot from "../libraries/Dot";
import { generateBundleHash, generateSecret } from "../libraries/crypto";
import ResponseMolecule from "../response/ResponseMolecule";

export default class Test {

  /**
   * Constructor
   * @param graphqlUrl
   */
  constructor ( graphqlUrl ) {
    this.secrets = [ generateSecret(), generateSecret() ];
    this.tokenSlugs = [ 'TESTTOKEN', 'UTENVSTACKABLE', 'UTSTACKUNIT', 'UTENVSTACKUNIT', ];
    this.graphqlUrl = graphqlUrl;
    this.clients = {};
    this.tokenUnits = [
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
  async testCreateToken () {

    let client = await this.client( this.secrets[ 0 ] );
    let serverClient = await this.client( process.env.SECRET_TOKEN_KNISH );

    let responses = {};

    // Regular stackable token
    responses[ 0 ] = await client.createToken( this.tokenSlugs[ 0 ], 1000.000000000000, {
        name: this.tokenSlugs[ 0 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon',
      } );
    this.checkResponse( responses[ 0 ], 'testCreateToken.0' );

    // Server stackable token
    responses[ 1 ] = await serverClient.createToken( this.tokenSlugs[ 1 ], 1000.000000000000, {
        name: this.tokenSlugs[ 1 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon',
      } );
    this.checkResponse( responses[ 1 ], 'testCreateToken.1' );



    // --------- UNITABLE TOKENS ----------

    // Create stackable unit token
    responses[ 2 ] = await client.createUnitableToken( this.tokenSlugs[ 2 ], this.tokenUnits, {
      name: this.tokenSlugs[ 2 ],
      supply: 'limited',
    }, 'batch_0' );
    this.checkResponse( responses[ 2 ], 'testCreateToken.2' );


    // --- SERVER CLIENT (used only for the testing - SECRET_TOKEN_KNISH is server var only!)

    // Create server stackable unit token
    responses[ 3 ] = await serverClient.createUnitableToken( this.tokenSlugs[ 3 ], this.tokenUnits, {
      name: this.tokenSlugs[ 3 ],
      supply: 'limited',
    }, 'batch_0' );
    this.checkResponse( responses[ 3 ], 'testCreateToken.3' );
  }

  /**
   *
   */
  async testCreateWallet () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.createWallet( this.tokenSlugs[ 1 ] );
    this.checkResponse( response, 'testCreateWallet' );
  }

  /**
   *
   */
  async testCreateMeta () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.createMeta( 'metaType', 'metaId', {
      key1: 'value1',
      key2: 'value2',
    } );
    this.checkResponse( response, 'testCreateMeta' );
  }


  /**
   *
   */
  async testCreateIdentifier () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.createIdentifier( 'email', 'test@test.com', 1234 );
    this.checkResponse( response, 'testCreateIdentifier' );
  }

  /**
   *
   */
  async testRequestTokens () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.requestTokens( this.tokenSlugs[ 1 ], 10, this.secrets[ 0 ] );
    this.checkResponse( response, 'testRequestTokens' );
  }

  /**
   *
   */
  async testTransferToken () {

    let bundleHash = generateBundleHash( this.secrets[ 1 ] );
    let response;

    let client = await this.client( this.secrets[ 0 ] );
    response = await client.transferToken( bundleHash, this.tokenSlugs[ 0 ], 10, 'batch_1' );
    this.checkResponse( response, 'testTransferToken' );

    let sendingTokenUnits = [ 'unit_id_1', 'unit_id_2' ];
    response = await client.transferToken( bundleHash, this.tokenSlugs[ 2 ], sendingTokenUnits, 'batch_1' );
    this.checkResponse( response, 'testTransferUnitToken' );
  }




  /**
   *
   */
  async testClaimShadowWallet () {
    let client = await this.client( this.secrets[ 1 ] );
    let balanceResponse = await client.queryBalance( this.tokenSlugs[ 0 ] );

    let response = await client.claimShadowWallet( this.tokenSlugs[ 0 ], balanceResponse.payload().batchId );
    this.checkResponse( response, 'testClaimShadowWallet' );
  }

  /**
   *
   */
  async testQueryMeta () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryMeta( 'metaType', 'metaId' );
    this.checkResponse( response, 'testQueryMeta' );
  }

  /**
   *
   */
  async testQueryWallets () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryWallets();
    this.checkResponse( response, 'testQueryWallets' );
  }

  /**
   *
   */
  async testQueryShadowWallets () {
    let client = await this.client( this.secrets[ 1 ] );
    let response = await client.queryShadowWallets( this.tokenSlugs[ 0 ] );
    this.checkResponse( response, 'testQueryShadowWallets' );
  }

  /**
   *
   */
  async testQueryBundle () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryBundle();
    this.checkResponse( response, 'testQueryBundle' );
  }

  /**
   *
   */
  async testQueryContinuId () {
    let bundleHash = generateBundleHash( this.secrets[ 0 ] );

    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryContinuId( bundleHash );
    this.checkResponse( response, 'testQueryContinuId' );
  }

  /**
   * @throws \Exception
   */
  async testQueryBalance () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryBalance( this.tokenSlugs[ 0 ] );
    this.checkResponse( response, 'testQueryBalance' );
  }


  /**
   * Get a client for each secret
   * @param secret
   * @param cellSlug
   */
  async client ( secret, cellSlug = 'unit_test' ) {

    // Create new client
    if ( !this.clients[ secret ] ) {

      // Create a client
      this.clients[ secret ] = new KnishIOClient( this.graphqlUrl );

      // Auth the client
      let response = await this.clients[ secret ]
        .requestAuthToken( secret, cellSlug );

      this.checkResponse( response, 'requestAuthToken' );
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

import KnishIOClient from "../KnishIOClient";
import Dot from "../libraries/Dot";
import { generateBundleHash, generateSecret } from "../libraries/crypto";
import ResponseMolecule from "../response/ResponseProposeMolecule";

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
    await this.testBurnToken();
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
    responses[ 0 ] = await client.createToken( {
      token: this.tokenSlugs[ 0 ],
      amount: 1000.000000000000,
      meta: {
        name: this.tokenSlugs[ 0 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon',
      },
    } );
    this.checkResponse( responses[ 0 ], 'testCreateToken.0' );

    // Server stackable token
    responses[ 1 ] = await serverClient.createToken( {
      token: this.tokenSlugs[ 1 ],
      amount: 1000.000000000000,
      meta: {
        name: this.tokenSlugs[ 1 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon',
      },
    } );
    this.checkResponse( responses[ 1 ], 'testCreateToken.1' );



    // --------- UNITABLE TOKENS ----------

    // Create stackable unit token
    responses[ 2 ] = await client.createUnitableToken( {
      token: this.tokenSlugs[ 2 ],
      units: this.tokenUnits,
      meta: {
        name: this.tokenSlugs[ 2 ],
        supply: 'limited',
      },
      batchId: 'batch_0',
    } );
    this.checkResponse( responses[ 2 ], 'testCreateToken.2' );


    // --- SERVER CLIENT (used only for the testing - SECRET_TOKEN_KNISH is server var only!)

    // Create server stackable unit token
    responses[ 3 ] = await serverClient.createUnitableToken( {
      token: this.tokenSlugs[ 3 ],
      units: this.tokenUnits,
      meta: {
        name: this.tokenSlugs[ 3 ],
        supply: 'limited',
      },
      batchId: 'batch_0',
    } );
    this.checkResponse( responses[ 3 ], 'testCreateToken.3' );
  }

  /**
   *
   */
  async testCreateWallet () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.createWallet( {
      token: this.tokenSlugs[ 1 ]
    } );
    this.checkResponse( response, 'testCreateWallet' );
  }

  /**
   *
   */
  async testCreateMeta () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.createMeta( {
      metaType: 'metaType',
      metaId: 'metaId',
      meta: {
        key1: 'value1',
        key2: 'value2',
      },
    } );
    this.checkResponse( response, 'testCreateMeta' );
  }


  /**
   *
   */
  async testCreateIdentifier () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.createIdentifier( {
      type: 'email',
      contact: 'test@test.com',
      code: 1234,
    } );
    this.checkResponse( response, 'testCreateIdentifier' );
  }

  /**
   *
   */
  async testRequestTokens () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.requestTokens( {
      token: this.tokenSlugs[ 1 ],
      amount: 10,
      to: this.secrets[ 0 ],
      batchId: 'batch_5',
    } );
    this.checkResponse( response, 'testRequestTokens.1' );

    response = await client.requestTokens( {
      token: this.tokenSlugs[ 3 ],
      units: [ 'unit_id_10', 'unit_id_11' ],
      to: this.secrets[ 0 ],
      batchId: 'batch_6',
    } );
    this.checkResponse( response, 'testRequestTokens.2' );
  }


  /**
   *
   * @returns {Promise<void>}
   */
  async testTransferToken () {

    let bundleHash = generateBundleHash( this.secrets[ 1 ] );
    let response;

    let client = await this.client( this.secrets[ 0 ] );
    response = await client.transferToken( {
      recipient: bundleHash,
      token: this.tokenSlugs[ 0 ],
      amount: 10,
      batchId: 'batch_1'
    } );
    this.checkResponse( response, 'testTransferToken' );

    response = await client.transferToken( {
      recipient: bundleHash,
      token: this.tokenSlugs[ 2 ],
      units: [ 'unit_id_1', 'unit_id_2' ],
      batchId: 'batch_2'
    } );
    this.checkResponse( response, 'testTransferUnitToken' );
  }


  /**
   *
   */
  async testBurnToken () {

    let bundleHash = generateBundleHash( this.secrets[ 1 ] );
    let response;

    let client = await this.client( this.secrets[ 0 ] );
    response = await client.burnTokens( {
      token: this.tokenSlugs[ 0 ],
      amount: 10,
      batchId: 'batch_3'
    } );
    this.checkResponse( response, 'testBurnToken' );

    response = await client.burnTokens( {
      token: this.tokenSlugs[ 2 ],
      units: [ 'unit_id_3', 'unit_id_4' ],
      batchId: 'batch_4'
    } );
    this.checkResponse( response, 'testBurnUnitToken' );
  }

  /**
   *
   */
  async testClaimShadowWallet () {
    let client = await this.client( this.secrets[ 1 ] );
    let balanceResponse = await client.queryBalance( {
      token: this.tokenSlugs[ 0 ]
    } );

    let response = await client.claimShadowWallet( {
      token: this.tokenSlugs[ 0 ],
      batchId: balanceResponse.payload().batchId
    } );
    this.checkResponse( response, 'testClaimShadowWallet' );
  }

  /**
   *
   */
  async testQueryMeta () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryMeta( {
      metaType: 'metaType',
      metaId: 'metaId'
    } );
    this.checkResponse( response, 'testQueryMeta' );
  }

  /**
   *
   */
  async testQueryWallets () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryWallets( {} );
    this.checkResponse( response, 'testQueryWallets' );
  }

  /**
   *
   */
  async testQueryShadowWallets () {
    let client = await this.client( this.secrets[ 1 ] );
    let response = await client.queryShadowWallets( {
      token: this.tokenSlugs[ 0 ]
    } );
    this.checkResponse( response, 'testQueryShadowWallets' );
  }

  /**
   *
   */
  async testQueryBundle () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryBundle( {} );
    this.checkResponse( response, 'testQueryBundle' );
  }

  /**
   *
   */
  async testQueryContinuId () {
    let bundleHash = generateBundleHash( this.secrets[ 0 ] );

    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryContinuId( {
      bundle: bundleHash
    } );
    this.checkResponse( response, 'testQueryContinuId' );
  }

  /**
   * @throws \Exception
   */
  async testQueryBalance () {
    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.queryBalance( {
      token: this.tokenSlugs[ 0 ]
    } );
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
      this.clients[ secret ] = new KnishIOClient( {
        uri: this.graphqlUrl,
        logging: true,
      } );

      // Auth the client
      let response = await this.clients[ secret ]
        .requestAuthToken( {
          secret: secret,
          cellSlug: cellSlug,
        } );

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

/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import KnishIOClient from '../KnishIOClient';
import Dot from '../libraries/Dot';
import {
  generateBundleHash,
  generateSecret
} from '../libraries/crypto';
import ResponseMolecule from '../response/ResponseProposeMolecule';
import TokenUnit from '../TokenUnit';

/*

import Test from '@wishknish/knishio-client-js/src/test/Test';
import { KNISHIO_SETTINGS, } from 'src/libraries/constants/knishio';

// Run all test
await Test.run( KNISHIO_SETTINGS.serverUriConfig );

*/

export default class Test {

  /**
   * Run all
   */
  static async run ( uris ) {
    for ( let uriIndex in uris ) {
      let test = new Test( uris[ uriIndex ] );
      await test.testAll();
    }
  }

  /**
   *
   * @param graphqlUrl
   * @param encrypt
   */
  constructor ( graphqlUrl, encrypt = false ) {
    this.encrypt = encrypt;
    this.secrets = [ generateSecret(), generateSecret() ];
    this.tokenSlugs = [ 'TESTTOKEN', 'UTENVSTACKABLE', 'UTSTACKUNIT', 'UTENVSTACKUNIT', 'UTSTACKUNITZONES', 'UTSLUG0', 'UTSLUG1' ];
    this.graphqlUrl = graphqlUrl;
    console.log( `---------- GraphQL URI: ${ this.graphqlUrl }` );

    this.clients = {};
    this.tokenUnits = [
      [ 'unit_id_1', 'unit_name_1' ],
      [ 'unit_id_2', 'unit_name_2' ],
      [ 'unit_id_3', 'unit_name_3' ],
      [ 'unit_id_4', 'unit_name_4' ],
      [ 'unit_id_5', 'unit_name_5' ],
      [ 'unit_id_6', 'unit_name_6' ],
      [ 'unit_id_7', 'unit_name_7' ],
      [ 'unit_id_8', 'unit_name_8' ],
      [ 'unit_id_9', 'unit_name_9' ],
      [ 'unit_id_10', 'unit_name_10' ],
      [ 'unit_id_11', 'unit_name_11' ]
    ];
    this.replenishTokenUnits = [
      [ 'unit_id_12', 'unit_id_12' ],
      [ 'unit_id_13', 'unit_id_13' ],
      [ 'unit_id_14', 'unit_id_14' ],
      [ 'unit_id_15', 'unit_id_15' ]
    ];

    // Generate token units with fragment zones
    let getTokenUnitsFZ = ( tokenUnits, from = 0 ) => {
      let result = [];
      tokenUnits.forEach( ( tokenUnit, key ) => {
        let tokenUnitFZ = Array.from( tokenUnit );
        tokenUnitFZ.push( { fragmentZone: from + key } );
        result.push( tokenUnitFZ );
      } );
      return result;
    };
    this.tokenUnitsFZ = getTokenUnitsFZ( this.tokenUnits );
    this.replenishTokenUnitsFZ = getTokenUnitsFZ( Array.from( this.replenishTokenUnits ), this.tokenUnits.length );
    this.fragmentZones = this.tokenUnitsFZ.length + this.replenishTokenUnitsFZ.length;

    // Init fused token unit IDs
    this.fusedTokenUnitIds = [];
    this.tokenUnitsFZ.slice( 0, 5 ).forEach( ( tokenUnitData ) => {
      this.fusedTokenUnitIds.push( tokenUnitData[ 0 ] );
    } );
  }


  /**
   * Test all KnishIOClient functions
   */
  async testAll () {
    console.info( `Executing test for: ${ this.graphqlUrl }...` );

    await this.client( this.secrets[ 0 ] );
    await this.client( this.secrets[ 1 ] );

    await this.testCreateToken();
    await this.testFuseToken();
    await this.testCreateWallet();
    await this.testCreateMeta();
    await this.testCreateIdentifier();
    await this.testRequestTokens();
    await this.testTransferToken();
    await this.testBurnToken();
    await this.testReplenishToken();
    await this.testClaimShadowWallet();
    await this.testWalletBufferTransactions();
    await this.testQueryMeta();
    await this.testQueryWallets();
    await this.testQueryBundle();
    await this.testQueryBalance();
  }


  /**
   *
   * @returns {Promise<void>}
   */
  async testTokenExpiration () {
    const client = await this.client( this.secrets[ 0 ] );
    const fnTimeout = ( timeout ) => {
      setTimeout( client => {
        console.warn( `setTimeout ${ timeout }` );
        client.queryMeta( {
          metaType: 'metaType',
          metaId: 'metaId'
        } );
      }, timeout, client, timeout );
    };
    fnTimeout( 3000 );
    fnTimeout( 30000 );
    fnTimeout( 61000 );
    fnTimeout( 64000 );
  }

  /**
   * @throws \Exception
   */
  async testCreateToken () {

    let responses = {};

    // Regular stackable token
    let client = await this.client( this.secrets[ 0 ] );
    responses[ 0 ] = await client.createToken( {
      token: this.tokenSlugs[ 0 ],
      amount: 1000.000000000000,
      meta: {
        name: this.tokenSlugs[ 0 ],
        fungibility: 'stackable',
        supply: 'replenishable',
        decimals: 0,
        icon: 'icon'
      },
      batchId: 'batch_0'
    } );
    this.checkResponse( responses[ 0 ], 'testCreateToken.0' );

    // Server stackable token
    let serverClient = await this.client( process.env.SECRET_TOKEN_KNISH );
    responses[ 1 ] = await serverClient.createToken( {
      token: this.tokenSlugs[ 1 ],
      amount: 1000.000000000000,
      meta: {
        name: this.tokenSlugs[ 1 ],
        fungibility: 'stackable',
        supply: 'limited',
        decimals: 0,
        icon: 'icon'
      },
      batchId: 'server_batch_0'
    } );
    this.checkResponse( responses[ 1 ], 'testCreateToken.1' );


    // --------- UNITABLE TOKENS ----------

    // Create stackable unit token
    responses[ 2 ] = await client.createToken( {
      token: this.tokenSlugs[ 2 ],
      units: this.tokenUnits,
      meta: {
        name: this.tokenSlugs[ 2 ],
        supply: 'replenishable',
        fungibility: 'stackable'
      },
      batchId: 'unit_batch_0'
    } );
    this.checkResponse( responses[ 2 ], 'testCreateToken.2' );


    // --- SERVER CLIENT (used only for the testing - SECRET_TOKEN_KNISH is server var only!)

    // Create server stackable unit token
    responses[ 3 ] = await serverClient.createToken( {
      token: this.tokenSlugs[ 3 ],
      units: this.tokenUnits,
      meta: {
        name: this.tokenSlugs[ 3 ],
        supply: 'limited',
        fungibility: 'stackable'
      },
      batchId: 'server_unit_batch_0'
    } );
    this.checkResponse( responses[ 3 ], 'testCreateToken.3' );


    // Create stackable unit token
    responses[ 4 ] = await client.createToken( {
      token: this.tokenSlugs[ 4 ],
      units: this.tokenUnitsFZ,
      meta: {
        name: this.tokenSlugs[ 4 ],
        supply: 'replenishable',
        fungibility: 'stackable',
        fragmentZones: this.fragmentZones
      },
      batchId: 'unit_fz_batch_0'
    } );
    this.checkResponse( responses[ 4 ], 'testCreateToken.4' );

    // --- Tokens for trading
    client = await this.client( this.secrets[ 0 ] );
    for ( const tokenSlug of [ this.tokenSlugs[ 5 ], this.tokenSlugs[ 6 ] ] ) {
      responses[ 0 ] = await client.createToken( {
        token: tokenSlug,
        amount: 1000.000000000000,
        meta: {
          name: tokenSlug,
          fungibility: 'fungible',
          supply: 'limited',
          decimals: 0,
          icon: 'icon'
        }
      } );
      this.checkResponse( responses[ 0 ], `testCreateToken.${ tokenSlug }` );
    }
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
        key2: 'value2'
      }
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
      code: '1234'
    } );

    console.log( ' ############### testCreateIdentifier ###############' );
    if ( response.reason() !== 'Outdated code' ) {
      console.error( 'Error with response.' );
    }
    this.debug( response );
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
      batchId: 'batch_5'
    } );
    this.checkResponse( response, 'testRequestTokens.1' );

    response = await client.requestTokens( {
      token: this.tokenSlugs[ 3 ],
      units: [ 'unit_id_10', 'unit_id_11' ],
      to: this.secrets[ 0 ],
      batchId: 'batch_6'
    } );
    this.checkResponse( response, 'testRequestTokens.2' );
  }


  /**
   *
   * @return {Promise<void>}
   */
  async testTransferToken () {

    let bundleHash = generateBundleHash( this.secrets[ 1 ] );
    let response;

    let client = await this.client( this.secrets[ 0 ] );
    response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      amount: 10,
      batchId: 'batch_1'
    } );
    this.checkResponse( response, 'testTransferToken' );

    response = await client.transferToken( {
      bundleHash,
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
    let response;

    let client = await this.client( this.secrets[ 0 ] );
    response = await client.burnTokens( {
      token: this.tokenSlugs[ 0 ],
      amount: 10
    } );
    this.checkResponse( response, 'testBurnToken' );

    response = await client.burnTokens( {
      token: this.tokenSlugs[ 2 ],
      units: [ 'unit_id_3', 'unit_id_4' ]
    } );
    this.checkResponse( response, 'testBurnUnitToken' );
  }


  /**
   *
   */
  async testReplenishToken () {

    let response;

    let client = await this.client( this.secrets[ 0 ] );
    response = await client.replenishToken( {
      token: this.tokenSlugs[ 0 ],
      amount: 25
    } );
    this.checkResponse( response, 'testReplenishToken' );

    response = await client.replenishToken( {
      token: this.tokenSlugs[ 2 ],
      amount: 0,
      units: this.replenishTokenUnits
    } );
    this.checkResponse( response, 'testReplenishUnitToken' );
  }


  /**
   *
   * @returns {Promise<void>}
   */
  async testFuseToken () {

    let tokenSlug = this.tokenSlugs[ 4 ];

    let recipientSecret = generateSecret();
    let recipientClient = await this.client( recipientSecret );

    let fusedTokenUnit = new TokenUnit( 'fusedTokenUnitId' );

    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.fuseToken( {
      bundleHash: recipientClient.getBundle(),
      tokenSlug,
      newTokenUnit: fusedTokenUnit,
      fusedTokenUnitIds: this.fusedTokenUnitIds
    } );
    this.checkResponse( response, 'testFuseToken' );

    let walletRecipient = ( await recipientClient.queryBalance( { token: tokenSlug } ) ).payload();
    let walletRemainder = ( await client.queryBalance( { token: tokenSlug } ) ).payload();

    // Check recipient wallet
    console.assert( walletRecipient.tokenUnits.length, 1 );
    console.assert( walletRecipient.tokenUnits[ 0 ].id, 'fusedTokenUnitId' );


    // --- Check fused token units in the recipient wallet
    let fusedTokenUnits = walletRecipient.tokenUnits[ 0 ].getFusedTokenUnits();
    console.assert( fusedTokenUnits.length, this.fusedTokenUnitIds.length );

    // Get token unit IDs from the fused metadata of the fused token unit
    let dbFusedTokenUnitIds = [];
    fusedTokenUnits.forEach( ( tokenUnit ) => {
      dbFusedTokenUnitIds.push( tokenUnit[ 0 ] );
    } );
    // ---

    // --- Check remainder token units
    console.assert( walletRemainder.tokenUnits.length, 6 );
    let remainderTokenUnitIds = [];
    walletRemainder.tokenUnits.forEach( ( tokenUnit ) => {
      remainderTokenUnitIds.push( tokenUnit.id );
    } );
    console.assert(
      remainderTokenUnitIds,
      [ 'unit_id_6', 'unit_id_7', 'unit_id_8', 'unit_id_9', 'unit_id_10', 'unit_id_11' ]
    );
  }

  /**
   *
   */
  async testClaimShadowWallet () {
    let client = await this.client( this.secrets[ 1 ] );

    /**
     * @type {ResponseBalance}
     */
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
   * @returns {Promise<void>}
   */
  async testWalletBufferTransactions () {
    let client = await this.client( this.secrets[ 0 ] );

    // Deposit buffer
    let tradeRates = {};
    tradeRates[ this.tokenSlugs[ 1 ] ] = 200 / 100;
    tradeRates[ this.tokenSlugs[ 3 ] ] = 200 / 200;
    let response = await client.depositBufferToken( {
      tokenSlug: this.tokenSlugs[ 5 ],
      amount: 200,
      tradeRates
    } );
    this.checkResponse( response, 'testWalletBufferTransactions: depositBufferToken' );

    // Withdraw buffer
    await client.withdrawBufferToken( {
      tokenSlug: this.tokenSlugs[ 5 ],
      amount: 100
    } );
    this.checkResponse( response, 'testWalletBufferTransactions: withdrawBufferToken' );

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
   *
   * @param secret
   * @param cellSlug
   * @returns {Promise<*>}
   */
  async client ( secret, cellSlug = 'unit_test' ) {

    // Create new client
    if ( !this.clients[ secret ] ) {

      // Create a client
      this.clients[ secret ] = new KnishIOClient( {
        uri: this.graphqlUrl,
        logging: true
      } );

      // Auth the client
      await this.clients[ secret ]
        .requestAuthToken( {
          secret,
          encrypt: this.encrypt,
          cellSlug
        } );
      if ( !this.clients[ secret ].getAuthToken() ) {
        console.log( 'Error with authorize - get an empty response.' );
      }
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

    console.log( ` ############### ${ key } ###############` );

    // Check molecule response
    if ( response instanceof ResponseMolecule ) {
      console.log( response );

      if ( !response.success() ) {
        this.debug( response );
      }
      console.assert( response.success(), response );
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

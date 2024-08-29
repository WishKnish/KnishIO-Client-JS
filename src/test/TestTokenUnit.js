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
import KnishIOClient from '../KnishIOClient'
import Dot from '../libraries/Dot'
import {
  generateBundleHash,
  generateSecret
} from '../libraries/crypto'
import ResponseMolecule from '../response/ResponseProposeMolecule'

/*

import Test from '@wishknish/knishio-client-js/src/test/Test';
import { KNISHIO_SETTINGS, } from 'src/libraries/constants/knishio';

// Run all test
await TestTokenUnit.run( KNISHIO_SETTINGS.serverUriConfig );

*/

export default class TestTokenUnit {
  /**
   *
   * @param graphqlUrl
   * @param encrypt
   */
  constructor ( graphqlUrl, encrypt = false ) {
    this.encrypt = encrypt
    this.secrets = [ generateSecret(), generateSecret() ]
    this.tokenSlugs = [ 'UTNFUNGUNIT' ]
    this.graphqlUrl = graphqlUrl
    console.log( `---------- GraphQL URI: ${ this.graphqlUrl }` )

    this.clients = {}
    this.tokenUnits = [
      [ 'unit_id_1', 'unit_name_1', { url: 'test1.com' } ],
      [ 'unit_id_2', 'unit_name_2', { url: 'test2.com' } ],
      [ 'unit_id_3', 'unit_name_3', { url: 'test3.com' } ],
      [ 'unit_id_4', 'unit_name_4', { url: 'test4.com' } ],
      [ 'unit_id_5', 'unit_name_5', { url: 'test5.com' } ],
      [ 'unit_id_6', 'unit_name_6', { url: 'test6.com' } ]
    ]
  }

  /**
   * Run all
   */
  static async run ( uris ) {
    for ( const uriIndex in uris ) {
      const test = new TestTokenUnit( uris[ uriIndex ] )
      await test.testAll()
    }
  }

  /**
   * Test all KnishIOClient functions
   */
  async testAll () {
    console.info( `Executing test for: ${ this.graphqlUrl }...` )

    await this.client( this.secrets[ 0 ] )
    await this.client( this.secrets[ 1 ] )

    await this.testCreateToken()
    await this.queryWalletsOutput()

    await this.testTransferToken1()
    await this.queryWalletsOutput()

    await this.testTransferToken2()
    await this.queryWalletsOutput()

    await this.testClaimShadowWallet()
    await this.queryWalletsOutput()

    await this.testTransferTokenBack1()
    await this.queryWalletsOutput()

    await this.testTransferTokenBack2()
    await this.queryWalletsOutput()
  }

  /**
   * @throws Exception
   */
  async testCreateToken () {
    const responses = {}

    // Regular stackable token
    const client = await this.client( this.secrets[ 0 ] )

    // --------- UNITABLE TOKENS ----------

    // Create stackable unit token
    responses[ 0 ] = await client.createToken( {
      token: this.tokenSlugs[ 0 ],
      units: this.tokenUnits,
      meta: {
        name: this.tokenSlugs[ 0 ],
        supply: 'replenishable',
        fungibility: 'nonfungible'
      }
    } )
    this.checkResponse( responses[ 0 ], 'testCreateToken.0' )
  }

  /**
   *
   * @return {Promise<void>}
   */
  async testTransferToken1 () {
    const bundleHash = generateBundleHash( this.secrets[ 1 ] )

    const client = await this.client( this.secrets[ 0 ] )
    const response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_1', 'unit_id_2' ]
    } )
    this.checkResponse( response, 'testTransferUnitToken.1' )
  }

  /**
   *
   * @return {Promise<void>}
   */
  async testTransferToken2 () {
    const bundleHash = generateBundleHash( this.secrets[ 1 ] )

    const client = await this.client( this.secrets[ 0 ] )
    const response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_3', 'unit_id_4' ]
    } )
    this.checkResponse( response, 'testTransferUnitToken.2' )
  }

  /**
   *
   */
  async testClaimShadowWallet () {
    const client = await this.client( this.secrets[ 1 ] )

    const response = await client.claimShadowWallet( {
      token: this.tokenSlugs[ 0 ]
    } )
    this.checkResponse( response, 'testClaimShadowWallet' )
  }

  /**
   *
   * @return {Promise<void>}
   */
  async testTransferTokenBack1 () {
    const bundleHash = generateBundleHash( this.secrets[ 0 ] )

    const client = await this.client( this.secrets[ 1 ] )
    const response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_1' ]
    } )
    this.checkResponse( response, 'testTransferBackToken.1' )
  }

  /**
   *
   * @return {Promise<void>}
   */
  async testTransferTokenBack2 () {
    const bundleHash = generateBundleHash( this.secrets[ 0 ] )

    const client = await this.client( this.secrets[ 1 ] )
    const response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_3' ]
    } )
    this.checkResponse( response, 'testTransferBackToken.2' )
  }

  /**
   *
   */
  async queryWalletsOutput () {
    await this.queryWallet( this.secrets[ 0 ], 'Token creation wallet' )
    await this.queryWallet( this.secrets[ 1 ], 'Recipient wallet' )
  }

  /**
   *
   */
  async queryWallet ( secret, title ) {
    const client = await this.client( secret )
    const response = await client.queryWallets( {
      token: this.tokenSlugs[ 0 ]
    } )

    let outputData = 'Wallet not found.'
    if ( response[ 0 ] ) {
      outputData = response[ 0 ].tokenUnits
    }
    console.warn( `--- Query wallet: ${ title }: `, outputData )
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
      } )

      // Auth the client
      await this.clients[ secret ]
        .requestAuthToken( {
          secret,
          encrypt: this.encrypt,
          cellSlug
        } )
      if ( !this.clients[ secret ].getAuthToken() ) {
        console.log( 'Error with authorize - get an empty response.' )
      }
    }

    // Return the client by secret
    return this.clients[ secret ]
  }

  /**
   * Check a response
   * @param response
   * @param key
   */
  checkResponse ( response, key ) {
    console.log( ` ############### ${ key } ###############` )
    console.log( response )

    // Check molecule response
    if ( response instanceof ResponseMolecule ) {
      if ( !response.success() ) {
        this.debug( response )
      }
      console.assert( response.success(), response )
    }

    // Default response
    else {
      this.debug( response )
    }
  }

  /**
   * Debug output
   * @param response
   */
  debug ( response ) {
    // Reason data on the top of the output
    if ( response.data && Dot.get( response.data() || {}, 'reason' ) ) {
      console.log( response.data().reason )
    } else {
      console.log( response )
    }
  }
}

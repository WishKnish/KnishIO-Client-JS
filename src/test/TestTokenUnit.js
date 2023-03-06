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
import TestCase from './TestCase';


/**
 *
 */
export default class TestTokenUnit extends TestCase {


  /**
   *
   * @param graphqlUrl
   * @param encrypt
   */
  constructor ( graphqlUrl, logging = true, encrypt = false ) {
    super( graphqlUrl, logging, encrypt );

    this.tokenSlugs = [ 'UTNFUNGUNIT' ];

    this.tokenUnits = [
      [ 'unit_id_1', 'unit_name_1', {url: 'test1.com'} ],
      [ 'unit_id_2', 'unit_name_2', {url: 'test2.com'} ],
      [ 'unit_id_3', 'unit_name_3', {url: 'test3.com'} ],
      [ 'unit_id_4', 'unit_name_4', {url: 'test4.com'} ],
      [ 'unit_id_5', 'unit_name_5', {url: 'test5.com'} ],
      [ 'unit_id_6', 'unit_name_6', {url: 'test6.com'} ]
    ];
  }


  /**
   * Test all KnishIOClient functions
   */
  async testAll () {
    console.info( `Executing test for: ${ this.graphqlUrl }...` );

    await this.client( this.secrets[ 0 ] );
    await this.client( this.secrets[ 1 ] );

    await this.testCreateToken();
    await this.queryWalletsOutput();

    await this.testTransferToken1();
    await this.queryWalletsOutput();

    await this.testTransferToken2();
    await this.queryWalletsOutput();

    await this.testClaimShadowWallet();
    await this.queryWalletsOutput();

    await this.testTransferTokenBack1();
    await this.queryWalletsOutput();

    await this.testTransferTokenBack2();
    await this.queryWalletsOutput();
  }

  /**
   * @throws \Exception
   */
  async testCreateToken () {

    let responses = {};

    // Regular stackable token
    let client = await this.client( this.secrets[ 0 ] );

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
    } );
    this.checkResponse( responses[ 0 ], 'testCreateToken.0' );
  }


  /**
   *
   * @return {Promise<void>}
   */
  async testTransferToken1 () {

    let bundleHash = generateBundleHash( this.secrets[ 1 ] );

    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_1', 'unit_id_2' ]
    } );
    this.checkResponse( response, 'testTransferUnitToken.1' );
  }

  /**
   *
   * @return {Promise<void>}
   */
  async testTransferToken2 () {

    let bundleHash = generateBundleHash( this.secrets[ 1 ] );

    let client = await this.client( this.secrets[ 0 ] );
    let response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_3', 'unit_id_4' ]
    } );
    this.checkResponse( response, 'testTransferUnitToken.2' );
  }

  /**
   *
   */
  async testClaimShadowWallet () {
    let client = await this.client( this.secrets[ 1 ] );

    let response = await client.claimShadowWallet( {
      token: this.tokenSlugs[ 0 ]
    } );
    this.checkResponse( response, 'testClaimShadowWallet' );
  }


  /**
   *
   * @return {Promise<void>}
   */
  async testTransferTokenBack1 () {

    let bundleHash = generateBundleHash( this.secrets[ 0 ] );

    let client = await this.client( this.secrets[ 1 ] );
    let response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_1' ]
    } );
    this.checkResponse( response, 'testTransferBackToken.1' );
  }

  /**
   *
   * @return {Promise<void>}
   */
  async testTransferTokenBack2 () {

    let bundleHash = generateBundleHash( this.secrets[ 0 ] );

    let client = await this.client( this.secrets[ 1 ] );
    let response = await client.transferToken( {
      bundleHash,
      token: this.tokenSlugs[ 0 ],
      units: [ 'unit_id_3' ]
    } );
    this.checkResponse( response, 'testTransferBackToken.2' );
  }


  /**
   *
   */
  async queryWalletsOutput() {
    await this.queryWallet( this.secrets[ 0 ], 'Token creation wallet' );
    await this.queryWallet( this.secrets[ 1 ], 'Recipient wallet' );
  }


  /**
   *
   */
  async queryWallet ( secret, title ) {
    let client = await this.client( secret );
    let response = await client.queryWallets( {
      token: this.tokenSlugs[ 0 ]
    } );

    let outputData = 'Wallet not found.';
    if ( response[ 0 ] ) {
      outputData = response[ 0 ].tokenUnits;
    }
    console.warn( `--- Query wallet: ${ title }: `, outputData );
  }


}

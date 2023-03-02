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

export default class TestHelper {


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

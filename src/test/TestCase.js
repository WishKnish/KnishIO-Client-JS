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

import TestCase from '@wishknish/knishio-client-js/src/test/TestCase';
import Test from '@wishknish/knishio-client-js/src/test/Test';
import TestTokenUnit from '@wishknish/knishio-client-js/src/test/TestTokenUnit';

await TestCase.run( ( uri ) => { return new Test( uri ); }, KNISHIO_SETTINGS.serverUriConfig );

*/

export default class TestCase {

  /**
   * Run all
   */
  static async run ( factoryClosure, uris ) {
    for ( let uriIndex in uris ) {
      let test = factoryClosure( uris[ uriIndex ] );
      await test.testAll();
    }
  }

  /**
   *
   * @param graphqlUrl
   * @param logging
   * @param encrypt
   */
  constructor ( graphqlUrl, logging = true, encrypt = false ) {
    this.logging = logging;
    this.encrypt = encrypt;
    this.secrets = [
      generateSecret(),
      generateSecret(),
      generateSecret()
    ];
    this.graphqlUrl = graphqlUrl;

    this.clients = {};

    console.log( `---------- GraphQL URI: ${ this.graphqlUrl }` );
  }


  /**
   *
   */
  testAll() {

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
        logging: this.logging
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

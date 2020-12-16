import KnishIOClient from "../KnishIOClient";
import Dot from "../libraries/Dot";
import { generateBundleHash, generateSecret } from "../libraries/crypto";
import ResponseMolecule from "../response/ResponseMolecule";

export default class Test
{

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
    async testAll() {
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
        let tokenSlug = this.tokenSlugs[ 0 ];
        return this.client( this.secrets[ 0 ] )
          .createToken ( tokenSlug, 1000, {
              name: tokenSlug,
              fungibility: 'stackable',
              splittable: 1,
              supply: 'limited',
              decimals: 0,
              icon: 'icon',
          } )
          .then( ( response ) => {
            console.log('########### CREATE TOKEN ################');
            console.log(response.clientMolecule());
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testCreateWallet()
    {
        return this.client( this.secrets[ 0 ] )
          .createWallet ( this.tokenSlugs[ 1 ] )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testCreateMeta()
    {
        return this.client( this.secrets[ 0 ] )
          .createMeta ( 'metaType', 'metaId', {
              key1: 'value1',
              key2: 'value2',
          } )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }


    /**
     *
     */
    testCreateIdentifier() {
        return this.client( this.secrets[ 0 ] )
          .createIdentifier ( 'email', 'test@test.com', 1234 )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testRequestTokens()
    {
        return this.client( this.secrets[ 0 ] )
          .requestTokens ( this.tokenSlugs[ 1 ], 10, this.secrets[ 0 ] )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testTransferToken()
    {
        let walletObjectOrBundleHash = generateBundleHash( this.secrets[ 1 ] );
        return this.client( this.secrets[ 0 ] )
          .transferToken ( walletObjectOrBundleHash, this.tokenSlugs[ 0 ], 10 )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testClaimShadowWallet()
    {
        return this.client( this.secrets[ 1 ] )
          .claimShadowWallet ( this.tokenSlugs[ 0 ] )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testQueryMeta()
    {
        return this.client( this.secrets[ 0 ] )
          .queryMeta ( 'metaType', 'metaId' )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testQueryWallets()
    {
        return this.client( this.secrets[ 0 ] )
          .queryWallets()
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testQueryShadowWallets()
    {
        return this.client( this.secrets[ 1 ] )
          .queryShadowWallets ( this.tokenSlugs[ 0 ] )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     *
     */
    testQueryBundle()
    {
        return this.client( this.secrets[ 0 ] )
          .queryBundle()
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }


    /**
     *
     */
    testQueryContinuId()
    {
        let bundleHash = generateBundleHash( this.secrets[ 0 ] );
        return this.client( this.secrets[ 0 ] )
          .queryContinuId( bundleHash )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }

    /**
     * @throws \Exception
     */
    testQueryBalance () {
       return this.client( this.secrets[ 0 ] )
          .queryBalance( this.tokenSlugs[ 0 ] )
          .then( ( response ) => {
            this.checkResponse( response );
          } );
    }


    /**
     * Get a client for each secret
     * @param secret
     * @param cellSlug
     */
    client( secret, cellSlug = 'unit_test' ) {

        // Create new client
        if ( !this.clients[ secret ] ) {

            // Create a client
            this.clients[ secret ] = new KnishIOClient( this.graphqlUrl );

            // Auth the client
            return this.clients[ secret ]
              .requestAuthToken( secret, cellSlug )
              .then( ( response ) => {
                this.checkResponse( response );
              } );
        }

        // Return the client by secret
        return this.clients[ secret ];
    }


    /**
     * Check a response
     * @param response
     */
    checkResponse ( response ) {

        // Check molecule response
        if (response instanceof ResponseMolecule) {
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
      }
      else {
        console.log( response );
      }

    }

}

/*
import KnishIOClient from "../KnishIOClient";
import Dot from "../libraries/Dot";
import { generateBundleHash, generateSecret } from "../libraries/crypto";
*/
import "../index.js";

export default class Test
{

    /**
     * Constructor
     * @param graphqlUrl
     */
    constructor ( graphqlUrl ) {
        this.secrets = [ generateSecret(), generateSecret() ];
        this.tokenSlugs = [ 'TestToken' ];
        this.graphqlUrl = graphqlUrl;
        this.clients = {};
    }


    /**
     * Test all KnishIOClient functions
     */
    testAll() {
        this.testCreateToken();
        this.testCreateWallet();
        this.testCreateMeta();
        this.testCreateIdentifier();
        this.testRequestTokens();
        this.testTransferToken();
        this.testClaimShadowWallet();
        this.testQueryMeta();
        this.testQueryWallets();
        this.testQueryShadowWallets();
        this.testQueryBundle();
        this.testQueryBalance();
    }

    /**
     * @throws \Exception
     */
    testCreateToken () {
        let tokenSlug = this.tokenSlugs[ 0 ];
        let response = this.client( this.secrets[ 0 ] )
            .createToken ( tokenSlug, 1000, {
                name: tokenSlug,
                fungibility: 'stackable',
                splittable: 1,
                supply: 'limited',
                decimals: 0,
                icon: 'icon',
            } );
        this.checkResponse( response );
    }

    /**
     *
     */
    testCreateWallet()
    {
        let response = this.client( this.secrets[ 0 ] )
            .createWallet ( this.tokenSlugs[ 0 ] );
        this.checkResponse( response );
    }

    /**
     *
     */
    testCreateMeta()
    {
        let response = this.client( this.secrets[ 0 ] )
            .createMeta ( 'metaType', 'metaId', {
                key1: 'value1',
                key2: 'value2',
            } )
        this.checkResponse( response );
    }


    /**
     *
     */
    testCreateIdentifier() {
        let response = this.client( this.secrets[ 0 ] )
            .createIdentifier ( 'email', 'test@test.com', 1234 );
        this.checkResponse( response );
    }

    /**
     *
     */
    testRequestTokens()
    {
        let response = this.client( this.secrets[ 0 ] )
            .requestTokens ( this.tokenSlugs[ 0 ], 10, this.secrets[ 0 ] );
        this.checkResponse( response );
    }

    /**
     *
     */
    testTransferToken()
    {
        let walletObjectOrBundleHash = generateBundleHash( this.secrets[ 1 ] );
        let response = this.client( this.secrets[ 0 ] )
            .transferToken ( walletObjectOrBundleHash, tokenSlug, amount );
        this.checkResponse( response );
    }

    /**
     *
     */
    testClaimShadowWallet()
    {
        let response = this.client( this.secrets[ 1 ] )
            .claimShadowWallet ( this.tokenSlugs[ 0 ] );
        this.checkResponse( response );
    }

    /**
     *
     */
    testQueryMeta()
    {
        let response = this.client( this.secrets[ 0 ] )
            .queryMeta ( 'metaType', 'metaId' );
        this.checkResponse( response );
    }

    /**
     *
     */
    testQueryWallets()
    {
        let response = this.client( this.secrets[ 0 ] )
            .queryWallets ();
        this.checkResponse( response );
    }

    /**
     *
     */
    testQueryShadowWallets()
    {
        let response = this.client( this.secrets[ 1 ] )
            .queryShadowWallets ( this.tokenSlugs[ 0 ] );
        this.checkResponse( response );
    }

    /**
     *
     */
    testQueryBundle()
    {
        let response = this.client( this.secrets[ 0 ] )
            .queryBundle();
        this.checkResponse( response );
    }


    /**
     *
     */
    testQueryContinuId()
    {
        let bundleHash = generateBundleHash( this.secrets[ 0 ] );
        let response = this.client( this.secrets[ 0 ] )
            .queryContinuId( bundleHash );
        this.checkResponse( response );
    }

    /**
     * @throws \Exception
     */
    testQueryBalance () {
        let response = this.client( this.secrets[ 0 ] )
            .queryBalance( this.tokenSlugs[ 0 ] );
        this.checkResponse( response );
    }


    /**
     * Get a client for each secret
     * @param secret
     * @param cellSlug
     */
    client( secret, cellSlug = 'unit_test' ) {

        // Create new client
        if ( this.clients[ secret ] ) {

            // Create a client
            this.clients[ secret ] = new KnishIOClient( this.graphqlUrl );

            // Auth the client
            let response = this.clients[ secret ].requestAuthToken( secret, cellSlug );
            this.checkResponse( response );
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
            if ( !response.data() ) {
                this.debug( response );
            }
        }
    }


    /**
     * Debug output
     * @param response
     */
    debug ( response ) {

        // Debug output
        let output = {
            'query': response.query().constructor.name,
            'url': response.query().url(),
        };

        // Reason data on the top of the output
        if ( Dot.get( response.data || {}, 'reason' ) ) {
            output['reason'] = response.data.reason;
            output['payload'] = response.data.payload;
        }

        // Other debug info
        output[ 'variables' ] = response.query().variables();
        output[ 'response' ] = response.response();

        console.log( output );
    }

}

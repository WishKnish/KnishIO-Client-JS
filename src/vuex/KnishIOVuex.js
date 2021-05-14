import KnishIOClient from '../KnishIOClient';

/**
 * Bridge for KnishIOClient & Vuex
 */
export default class KnishIOVuex {

  /**
   *
   * @param KnishIOClient
   */
  constructor ( KnishIOClient, VuexStore ) {
    this.$__client = KnishIOClient;
    this.$__store = VuexStore;
  }


  /**
   *
   * @param VuexStore
   */
  init() {
    console.log('GET_DEFAULT_STATE');
    console.log(this.$__store.getters[ 'user/GET_DEFAULT_STATE' ])
    console.log(this.$__store.getters);
  }

  /**
   * Retrieves an authorization token from the ledger
   *
   * @param context
   * @param payload
   * @param options
   * @returns {Promise<void>}
   * @constructor
   */
  async authorize ( context, payload, options ) {

    console.log( 'User::authorize() - Starting authorization process...' );

    // Get payload params: newSecret & vm
    let { newSecret, vm, } = payload;

    // Has a new secret: saving secret locally & update it on KnishIOClient
    if ( newSecret ) {
      console.log( 'User::authorize() - Replacing user secret...' );
      await context.commit( 'SET_SECRET', newSecret );
    }

    // Get stored secret & set it to the KnishIOClient
    console.log( 'User::authorize() - Retrieving user identity...' );
    let secret = await context.getters.GET_SECRET;
    if ( secret ) {
      vm.$knishio.setSecret(secret);
    }

    // Auth token default initialization
    let authToken = await context.getters.GET_AUTH_TOKEN;
    console.log( `User::authorize() - Retrieving auth token ${ authToken ? authToken.token : 'NONE' }...` );

    // Try to get a new auth token
    if ( newSecret || !authToken || !authToken.expiresAt || authToken.expiresAt * 1000 < Date.now() ) {
      authToken = await vm.$knishio.authorize({
        secret,
      });
      console.log( `User::authorize() - Get a new auth token ${ authToken.token }...` );

      // Save authToken & set some refresh code
      await context.commit( 'SET_AUTH_TOKEN', authToken );
    }

    // Set an auth token to the KnishIOClient
    vm.$knishio.setAuthToken( authToken );



    // Remove previous timeout for the auth token update
    let authTimeout = await context.getters.GET_AUTH_TIMEOUT;
    clearTimeout( authTimeout );

    // Create a new auth token timeouts
    console.log( `User::authorize() - Set auth timeout to ${ new Date(authToken.expiresAt * 1000) } ...` );
    authTimeout = setTimeout( context => {
      ( async context => {
        await context.dispatch( 'user/AUTHORIZE', payload, { root: true, } );
      } )( context );
    }, ( authToken.expiresAt * 1000 ) - Date.now(), context );
    // Save auth timeout
    await context.commit( 'SET_AUTH_TIMEOUT', authTimeout );

  }

}

import KnishIOClient from '../KnishIOClient';

import { getField as getFieldWrapper, } from 'vuex-map-fields';
import {
  connectionDB,
  getDataPromise,
} from 'src/libraries/storageDB';

// Declaring indexedDB database
const db = connectionDB();

export const getField = getFieldWrapper;

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



  // Init all vuex items
  async init( vm ) {
    this.initGetters();
    this.initSetters();
    // this.initActions();

    await this.$__store.dispatch( 'user/INIT', { vm, } );
  }


  /**
   * Init getters
   */
  initGetters() {


    // Default user state
    let defaultUserState = {
      secret: null,
      username: null,
      avatar: null,
      cover: null,
      metas: null,
      createdAt: null,
      loggedIn: false,
      initialized: false,
      authToken: '',
      authTimeout: null,
    };
    this._mergeObject( this.$__store.getters['user/GET_DEFAULT_STATE'], defaultUserState );


    // Default getters
    let defaultGetters = {
      'user/GET_SECRET': async ( state ) => {
        return state.secret ? state.secret : getDataPromise( db, 'secret' );
      },
      'user/GET_USERNAME': async ( state ) => {
        return state.username ? state.username : getDataPromise( db, 'username' );
      },
      'user/GET_AVATAR': async ( state ) => {
        return state.avatar;
      },
      'user/GET_COVER': async ( state ) => {
        return state.cover;
      },
      'user/GET_BUNDLE': async ( state ) => {
        return state.bundle;
      },
      'user/GET_BUNDLE_OBJECT': async ( state ) => {
        return state.bundleObject;
      },
      'user/GET_PUBLIC_NAME': async ( state ) => {
        return state.publicName;
      },
      'user/GET_METAS': async ( state ) => {
        return state.metas;
      },
      'user/GET_INITIALIZED': async ( state ) => {
        return state.initialized;
      },
      'user/GET_LOGGED_IN': async ( state ) => {
        return state.loggedIn;
      },
      'user/GET_AUTH_TIMEOUT': async ( state ) => {
        return state.authTimeout;
      },
      'user/GET_AUTH_TOKEN': async ( state ) => {
        if ( state.authToken ) {
          return state.authToken;
        }
        let authToken = await getDataPromise( db, 'authToken' );
        return authToken ? JSON.parse( authToken ) : null;
      },
    };
    this._mergeObject( this.$__store.getters, defaultGetters );

    // console.log('GET_DEFAULT_STATE');
    // console.log(this.$__store.getters[ 'user/GET_DEFAULT_STATE' ]);
    // console.log(this.$__store.getters);
  }


  /**
   * Init setters
   */
  initSetters() {
    let defaultSetters = {
      'user/RESET_STATE': async ( state, defaultState ) => {
        console.log( 'User::resetState() - Mutating user state...' );
        await deleteDataPromise( db, 'username' );
        await deleteDataPromise( db, 'secret' );
        Object.assign(state, defaultState);
      },
      'user/SET_USERNAME': async ( state, username ) => {
        state.username = username;
        await setDataPromise( db, 'username', username );
      },
      'user/SET_SECRET': async ( state, secret ) => {
        state.secret = secret;
        await setDataPromise( db, 'secret', secret );
      },
      'user/SET_BUNDLE': async ( state, bundle ) => {
        state.bundle = bundle;
      },
      'user/SET_BUNDLE_OBJECT': async ( state, bundleObject ) => {
        state.bundle = bundleObject;
      },
      'user/SET_COVER': async ( state, cover ) => {
        state.cover = cover;
      },
      'user/SET_AVATAR': async ( state, avatar ) => {
        state.avatar = avatar;
      },
      'user/SET_PUBLIC_NAME': async ( state, publicName ) => {
        state.publicName = publicName;
      },
      'user/SET_CREATED_AT': async ( state, createdAt ) => {
        state.createdAt = createdAt;
      },
      'user/SET_METAS': async ( state, metas ) => {
        state.metas = metas;
      },
      'user/SET_INITIALIZED': async ( state, initialized ) => {
        state.initialized = initialized;
      },
      'user/SET_LOGGED_IN': async ( state, loggedIn ) => {
        state.loggedIn = loggedIn;
      },
      'user/SET_AUTH_TOKEN': async ( state, authToken ) => {
        state.authToken = authToken;
        await setDataPromise( db, 'authToken', JSON.stringify(authToken) );
      },
      'user/SET_AUTH_TIMEOUT': async ( state, authTimeout ) => {
        state.authTimeout = authTimeout;
      },
    };

    console.log( 'sdfgadfgsdfgsdfgdf' );
    console.log( this.$__store );
    this._mergeObject( this.$__store._mutations, defaultSetters );
  }


  /**
   * Init actions
   */
  initActions() {

    this._mergeObject( this.$__store._actions, {
      'user/LOGIN': this.userLogin,
      'user/LOGOUT': this.userLogin,
      'user/REGISTER': this.userRegister,
      'user/INIT': this.userInit,
      'user/AUTHORIZE': this.userAuthorize,
    } );

  }


  /**
   * Attempts to log in the user by hashing a new secret and retrieving the user's data
   * @param context
   * @param username
   * @param password
   * @param secret
   * @param vm
   * @returns {Promise<void>}
   */
  async userLogin ( context, { username, password, secret, vm, } ) {

    console.log( 'User::login() - Starting login process...' );

    if ( !KNISHIO_SETTINGS.salt ) {
      throw 'User::login() - Salt is required for secure hashing!';
    }

    // Starting new Knish.IO session
    if ( !secret ) {
      secret = generateSecret( `${ username }:${ password }:${ KNISHIO_SETTINGS.salt }` );
    }
    const bundle = generateBundleHash( secret );


    // Attempting to retrieve user's metadata for the given secret
    const result = await this.$__client.queryBundle( {
      bundle,
    } );

    if ( result ) {

      console.log( `User::login() - Retrieved ${ Object.keys( result ).length } results for bundle hash ${ bundle }...` );

    } else {

      console.warn( `User::login() - Failed to retrieve results for bundle hash ${ bundle }...` );

    }

    // Successful login, proceed to session initialization
    if ( result && result[ bundle ] && Object.keys( result[ bundle ].metas ).length > 0 ) {

      console.log( 'User::login() - Logging in...' );
      await context.dispatch( 'INIT', { newSecret: secret, username, vm, } );

    } else {

      console.warn( 'User::login() - User not registered; Aborting login...' );
      await context.dispatch( 'LOGOUT', { vm, } );

    }
  }



  /**
   * Validates the registration state of the user to ensure there is no duplicate
   *
   * @param context
   * @param {string} username
   * @param {string} password
   * @param {Vue} vm
   * @returns {Promise<void>}
   * @constructor
   */
  async userRegister ( context, { username, password, vm, } ) {

    console.log( 'User::register() - Starting registration process...' );

    if ( !KNISHIO_SETTINGS.salt ) {
      throw 'User::register() - Salt is required for secure hashing!';
    }

    // Starting new Knish.IO session
    const newSecret = generateSecret( `${ username }:${ password }:${ KNISHIO_SETTINGS.salt }` );

    // Get a bundle from the secret
    const bundle = generateBundleHash( newSecret );

    // Attempting to retrieve user's metadata for the given secret
    const result = await this.$__client.queryBundle( {
      bundle,
    } );

    if ( result ) {

      console.log( `User::register() - Retrieved ${ Object.keys( result ).length } results for bundle hash ${ bundle }...` );

    } else {

      console.warn( `User::register() - Failed to retrieve results for bundle hash ${ bundle }...` );

    }

    // Successful login - this means we can't register!
    if ( result && result[ bundle ] && Object.keys( result[ bundle ].metas ).length > 0 ) {

      console.warn( 'User::register() - User already registered; Aborting registration...' );
      await context.dispatch( 'LOGOUT', { vm, } );

    } else {

      console.log( 'User::register() - User not registered; Registration can proceed...' );
      await context.dispatch( 'INIT', { newSecret, username, vm, } );

    }
  }



  /**
   * Stores an existing user secret or produces a new one
   * This determines the user account all operations will work with
   *
   * @param context
   * @param {string|null} newSecret
   * @param {string|null} username
   * @param {Vue} vm
   * @returns {Promise<void>}
   * @constructor
   */
  async userInit ( context, { newSecret = null, username = null, vm = null, } ) {
    console.log( 'User::init() - Beginning bootstrap procedure...' );

    // Save username
    if ( username ) {
      await context.commit( 'SET_USERNAME', username );
    }

    // User authorization
    await context.dispatch( 'user/AUTHORIZE', { newSecret, vm, }, { root: true, } );

    // Has a secret on the client?
    if ( this.$__client.hasSecret() ) {

      // Getting everything the ledger knows about this bundle
      console.log( 'User::init() - Retrieving wallet bundle metadata...' );
      await context.commit( 'SET_BUNDLE', this.$__client.getBundle() );
      if ( this.$__store._actions.hasOwnProperty('user/UPDATE') ) {
        await context.dispatch('UPDATE', {vm: vm,});
      }
      await context.commit( 'SET_LOGGED_IN', true );

    } else {

      console.warn( 'User::init() - User is not logged in...' );

    }

    context.commit( 'SET_INITIALIZED', true );
    console.log( 'User::init() - Bootstrap complete...' );
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
  async userAuthorize ( context, payload, options ) {

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
      this.$__client.setSecret(secret);
    }

    // Auth token default initialization
    let authToken = await context.getters.GET_AUTH_TOKEN;
    console.log( `User::authorize() - Retrieving auth token ${ authToken ? authToken.token : 'NONE' }...` );

    // Try to get a new auth token
    if ( newSecret || !authToken || !authToken.expiresAt || authToken.expiresAt * 1000 < Date.now() ) {
      authToken = await this.$__client.authorize({
        secret,
      });
      console.log( `User::authorize() - Get a new auth token ${ authToken.token }...` );

      // Save authToken & set some refresh code
      await context.commit( 'SET_AUTH_TOKEN', authToken );
    }

    // Set an auth token to the KnishIOClient
    this.$__client.setAuthToken( authToken );



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


  /**
   * Merge objects
   * @param object
   * @param keyValues
   * @private
   */
  _mergeObject( object, keyValues ) {
    for ( const [ key, value, ] of Object.entries( keyValues ) ) {
      if ( !object.hasOwnProperty( key ) ) {
        object[ key ] = value;
      }
    }
  }

}

import TestHelper from './TestHelper'

test('Token create', () => {

  // const helper = new TestHelper( 'https://laravel.knishio/' );

  /*
  let responses = {};

  // Regular stackable token
  let client = await helper.client( helper.secrets[ 0 ] );
  responses[ 0 ] = await client.createToken( {
    token: helper.tokenSlugs[ 0 ],
    amount: 1000.000000000000,
    meta: {
      name: helper.tokenSlugs[ 0 ],
      fungibility: 'stackable',
      supply: 'replenishable',
      decimals: 0,
      icon: 'icon'
    },
    batchId: 'batch_0'
  } );
  helper.checkResponse( responses[ 0 ], 'testCreateToken.0' );

   */


  /*

  // Server stackable token
  let serverClient = await helper.client( process.env.SECRET_TOKEN_KNISH );
  responses[ 1 ] = await serverClient.createToken( {
    token: helper.tokenSlugs[ 1 ],
    amount: 1000.000000000000,
    meta: {
      name: helper.tokenSlugs[ 1 ],
      fungibility: 'stackable',
      supply: 'limited',
      decimals: 0,
      icon: 'icon'
    },
    batchId: 'server_batch_0'
  } );
  helper.checkResponse( responses[ 1 ], 'testCreateToken.1' );


  // --------- UNITABLE TOKENS ----------

  // Create stackable unit token
  responses[ 2 ] = await client.createToken( {
    token: helper.tokenSlugs[ 2 ],
    units: helper.tokenUnits,
    meta: {
      name: helper.tokenSlugs[ 2 ],
      supply: 'replenishable',
      fungibility: 'stackable'
    },
    batchId: 'unit_batch_0'
  } );
  helper.checkResponse( responses[ 2 ], 'testCreateToken.2' );


  // --- SERVER CLIENT (used only for the testing - SECRET_TOKEN_KNISH is server var only!)

  // Create server stackable unit token
  responses[ 3 ] = await serverClient.createToken( {
    token: helper.tokenSlugs[ 3 ],
    units: helper.tokenUnits,
    meta: {
      name: helper.tokenSlugs[ 3 ],
      supply: 'limited',
      fungibility: 'stackable'
    },
    batchId: 'server_unit_batch_0'
  } );
  helper.checkResponse( responses[ 3 ], 'testCreateToken.3' );


  // Create stackable unit token
  responses[ 4 ] = await client.createToken( {
    token: helper.tokenSlugs[ 4 ],
    units: helper.tokenUnitsFZ,
    meta: {
      name: helper.tokenSlugs[ 4 ],
      supply: 'replenishable',
      fungibility: 'stackable',
      fragmentZones: helper.fragmentZones
    },
    batchId: 'unit_fz_batch_0'
  } );
  helper.checkResponse( responses[ 4 ], 'testCreateToken.4' );

  // --- Tokens for trading
  client = await helper.client( helper.secrets[ 0 ] );
  for ( const tokenSlug of [ helper.tokenSlugs[ 5 ], helper.tokenSlugs[ 6 ] ] ) {
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
    helper.checkResponse( responses[ 0 ], `testCreateToken.${ tokenSlug }` );
  }

   */


});

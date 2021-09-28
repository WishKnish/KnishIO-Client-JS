<div style="text-align:center">
  <img src="https://raw.githubusercontent.com/WishKnish/KnishIO-Technical-Whitepaper/master/KnishIO-Logo.png" alt="Knish.IO: Post-Blockchain Platform" />
</div>
<div style="text-align:center">info@wishknish.com | https://wishknish.com</div>

# Knish.IO Javascript Client SDK

This is an experimental Javascript / NodeJS implementation of the Knish.IO client SDK. Its purpose is to expose class
libraries for building and signing Knish.IO Molecules, composing Atoms, generating Wallets, and so much more.

## Installation

The SDK can be installed via either of the following:

1. `yarn add @wishknish/knishio-client-js`

2. `npm install @wishknish/knishio-client-js --save`

## Basic Usage

The purpose of the Knish.IO SDK is to expose various ledger functions to new or existing applications.

There are two ways to take advantage of these functions:

1. The easy way: use the `KnishIOClient` wrapper class

2. The granular way: build `Atom` and `Molecule` instances and broadcast GraphQL messages yourself

This document will explain both ways.

## The Easy Way: KnishIOClient Wrapper

1. Include the wrapper class in your application code:
   ```javascript
   import { KnishIOClient } from '@wishknish/knishio-client-js'
   ```

2. Instantiate the class with your node URI:
   ```javascript
   const client = new KnishIOClient( {
     uri: myNodeURI
   } );
   ```

3. Set the Cell to match your app:
   ```javascript
   client.setCellSlug( myCellSlug );
   ```
   (**Note:** the `knishio_cells` table on the node must contain an entry for this Cell)


4. Request authorization token from the node:
   ```javascript
   client.requestAuthToken ( {
      seed: 'myTopSecretCode'
   } )
   ```

   (**Note:** the `seed` parameter can be a salted combination of username + password, a biometric hash, an existing
   user identifier from an external authentication process, for example)


5. Begin using `client` to trigger commands described below...

### KnishIOClient Methods

- Query metadata for a **Wallet Bundle**. Omit the `bundleHash` parameter to query your own Wallet Bundle:
  ```javascript
  const result = await client.queryBundle ( {
    bundleHash: 'c47e20f99df190e418f0cc5ddfa2791e9ccc4eb297cfa21bd317dc0f98313b1d',
  } );

  // Raw Metadata
  console.log( result );
  ```

- Query metadata for a **Meta Asset**. Omit any parameters to widen the search:

  ```javascript
  const result = await client.queryMeta ( {
    metaType: 'Vehicle',
    metaId: null, // Meta ID
    key: 'LicensePlate',
    value: '1H17P',
    latest: true // Limit meta values to latest per key
  } );

  // Raw Metadata
  console.log( result );
  ```

- Writing new metadata for a **Meta Asset**.

  ```javascript
  const result = await client.createMeta ( {
    metaType: 'Pokemon',
    metaId: 'Charizard',
    meta: {
      type: 'fire',
      weaknesses: [
        'rock',
        'water',
        'electric'
      ],
      immunities: [
        'ground',
      ],
      hp: 78,
      attack: 84,
    }
  } );

  if( result.success() ) {
    // Do things!
  }

  console.log( result.data() ); // Raw response
  ```

- Query Wallets associated with a Wallet Bundle:

  ```javascript
  const result = await client.queryWallets ( {
    bundleHash: 'c47e20f99df190e418f0cc5ddfa2791e9ccc4eb297cfa21bd317dc0f98313b1d',
    unspent: true // limit results to unspent wallets?
  } );

  console.log( results ); // Raw response
  ```

- Declaring new **Wallets**. If Tokens are sent to undeclared Wallets, **Shadow Wallets** will be used (placeholder
  Wallets that can receive, but cannot send) to store tokens until they are claimed.

  ```javascript
  const result = await client.createWallet ( {
    token: 'FOO' // Token Slug for the wallet we are declaring
  } );

  if( result.success() ) {
    // Do things!
  }

  console.log( result.data() ); // Raw response
  ```

- Issuing new **Tokens**:

  ```javascript
  const result = await client.createToken ( {
    token: 'CRZY', // Token slug (ticker symbol)
    amount: '100000000', // Initial amount to issue
    meta: {
      name: 'CrazyCoin', // Public name for the token
      fungibility: 'fungible', // Fungibility style (fungible / nonfungible / stackable)
      supply: 'limited', // Supply style (limited / replenishable)
      decimals: '2' // Decimal places
    }
  } );

  if( result.success() ) {
    // Do things!
  }

  console.log( result.data() ); // Raw response
  ```

- Transferring **Tokens** to other users:

  ```javascript
  const result = await client.transferToken ( {
    recipient: '7bf38257401eb3b0f20cabf5e6cf3f14c76760386473b220d95fa1c38642b61d', // Recipient's bundle hash,
    token: 'CRZY', // Token slug
    amount: '100'
  } );

  if( result.success() ) {
    // Do things!
  }

  console.log( result.data() ); // Raw response
  ```

## The Hard Way: working directly with Molecules

- Return a Molecule instance (via Promise) that you can manually add atoms to:
    ```javascript
    client.createMolecule ()
    ```

- Return a customized Query instance (via Promise) that can be used to generate arbitrary transactions to the ledger for
  the supplied Query class:
    ```javascript
    client.createMoleculeMutation ( {
      mutationClass: myQueryClass // More info on these below
    } )
    ```

- Retrieves the active balance (in the form of a Wallet object:
    ```javascript
    client.queryBalance ( {
      token: myTokenSlug,
      bundle: myBundleHash // Omit to get your own balance
    } )
    ```

- Create a new Token on the ledger and places initial balance into a new wallet created for you; `tokenMetadata` object
  must contain properties for `name` and `fungibility` (which can presently be `'fungible'`, `'nonfungible'`,
  or `'stackable'`):
    ```javascript
    client.createToken ( {
      token: tokenSlug, 
      amount: initialAmount,
      meta: tokenMetadata
    } )
    ```

- Retrieve a list of Shadow Wallets (wallets that have a balance in a particular token, but no keys - as can happen when
  you are sent tokens for which you lack a prior wallet):
    ```javascript
    client.queryShadowWallets ( {
      token: tokenSlug,
      bundle: myBundleHash // Omit to get your own balance
    } )
    ```

- Attempt to claim a Shadow Wallet by generating keys for it, which turns it into a usable Wallet:
    ```javascript
    client.claimShadowWallet ( {
      token: tokenSlug
    } )
    ```

- Transfer tokens to a recipient Wallet or Bundle:
    ```javascript
    client.transferToken ( {
      recipient: walletObjectOrBundleHash,
      token: tokenSlug,
      amount: transferAmount
    } )
    ```

### Knish.IO Query Classes

The `KnishIOClient` can utilize a wide variety of built-in query classes
via `client.createMoleculeQuery ( myQueryClass )`, in case you need something more flexible than the built-in methods.

After calling `client.createMoleculeQuery ( myQueryClass )`, you will receive a `Query` class instance, which will let
you add any necessary metadata to fulfill the GraphQL query or mutation. The metadata required will be different based
on the type of `Query` class you choose, via an overloaded `fill()` method.

Here are the most commonly used ones:

#### `QueryMetaType` (for retrieving Meta Asset information)

```javascript
// Build the query
const query = await client.createQuery( QueryMetaType );

// Define variable parameters
// (eg: which MetaType we are querying)
const variables = {
  metaType: 'SomeMetaType'
}

// Define which fields we want to get back
const fields = {
  createdAt: null,
  metas: {
    key: null,
    value: null,
  },
}

// Execute the query
const result = await query.execute( {
  variables,
  fields
} );

console.log( result.data() );
```

#### `QueryWalletBundle` (for retrieving information about Wallet Bundles)

```javascript
// Build the query
const query = await client.createQuery( QueryWalletBundle );

// Define variable parameters
// (eg: how we want to filter Wallet Bundles)
const variables = {
  key: 'publicName',
  value: 'Eugene'
}

// Define which fields we want to get back
const fields = {
  bundleHash: null,
  metas: {
    key: null,
    value: null,
  },
}

// Execute the query
const result = await query.execute( {
  variables,
  fields
} );

console.log( result.data() );
```

#### `QueryWalletList` (for getting a list of Wallets)

```javascript
// Build the query
const query = await client.createQuery( QueryWalletList );

// Define variable parameters
// (eg: how we want to filter Wallet Bundles)
const variables = {
  token: 'DYD',
};

// Define which fields we want to get back
const fields = {
  address: null,
  amount: null,
};

// Execute the query
const result = await query.execute( {
  variables,
  fields
} );

console.log( result.data() );
```

## The Extreme Way: DIY Everything

This method involves individually building Atoms and Molecules, triggering the signature and validation processes, and
communicating the resulting signed Molecule mutation or Query to a Knish.IO node via your favorite GraphQL client.

1. Include the relevant classes in your application code:
    ```javascript
   import { Molecule, Wallet } from '@wishknish/knishio-client-js'
    ```

2. Generate a 2048-symbol hexadecimal secret, either randomly, or via hashing login + password + salt, OAuth secret ID,
   biometric ID, or any other static value


3. (optional) Initialize a signing wallet with:
   ```javascript
   const wallet = new Wallet( {
     secret: mySecret,
     token: tokenSlug,
     position: myCustomPosition // (optional) instantiate specific wallet instance vs. random
   
     // (optional) helps you override the character set used by the wallet, for inter-ledger compatibility. Currently supported options are: `GMP`, `BITCOIN`, `FLICKR`, `RIPPLE`, and `IPFS`.
     // characters: myCharacterSet
   } )
   ```

   **WARNING 1:** If ContinuID is enabled on the node, you will need to use a specific wallet, and therefore will first
   need to query the node to retrieve the `position` for that wallet.

   **WARNING 2:** The Knish.IO protocol mandates that all C and M transactions be signed with a `USER` token wallet.


4. Build your molecule with:
   ```javascript
   const molecule = new Molecule( {
     secret: mySecret,
     sourceWallet: mySourceWallet, // (optional) wallet for signing
     remainderWaller: myRemainderWallet, // (optional) wallet to receive remainder tokens
     cellSlug: myCellSlug // (optional) used to point a transaction to a specific branch of the ledger
   } );
   ```

5. Either use one of the shortcut methods provided by the `Molecule` class (which will build `Atom` instances for you),
   or create `Atom` instances yourself.

   DIY example:
    ```javascript
    // This example records a new Wallet on the ledger

    // Define metadata for our new wallet
    const newWalletMeta = {
      address: newWallet.address,
      token: newWallet.token,
      bundle: newWallet.bundle,
      position: newWallet.position,
      batch_id: newWallet.batchId,
    }
   
    // Build the C isotope atom
    const walletCreationAtom = new Atom( {
      position: sourceWallet.position,
      walletAddress: sourceWallet.address,
      isotope: 'C',
      token: sourceWallet.token,
      metaType: 'wallet',
      metaId: newWallet.address,
      meta: newWalletMeta,
      index: molecule.generateIndex()
    } )
   
    // Add the atom to our molecule
    molecule.addAtom( walletCreationAtom )
   
    // Adding a ContinuID / remainder atom
    molecule.addUserRemainderAtom( new Wallet( secret ) );
    ```

   Molecule shortcut method example:
    ```javascript
    // This example commits metadata to some Meta Asset

    // Defining our metadata
    const metadata = {
      foo: 'Foo',
      bar: 'Bar'
    }
    
    molecule.initMeta( {
      meta: metadata,
      metaType: 'MyMetaType',
      metaId: 'MetaId123'
   } );
    ```

6. Sign the molecule with the stored user secret:
    ```javascript
    molecule.sign()
    ```

7. Make sure everything checks out by verifying the molecule:
    ```javascript
    if ( !molecule.check() ) {
       // Throw some exception?
    }
    
    // If we're validating a V isotope transaction,
    // add the source wallet as a parameter
    if ( !molecule.check( sourceWallet ) ) {
       // Insufficient tokens?
    }
    ```

8. Broadcast the molecule to a Knish.IO node:
    ```javascript
    // Build our query object using the KnishIOClient wrapper
    const query = new MutationProposeMolecule( client, molecule );
   
    // Send the query to the node and get a response
    const response = await query.execute();
    ```

9. Inspect the response...
    ```javascript
    // For basic queries, we look at the data property:
    console.log( response.data() )
    ```
   If you are sending a mutation, you can also check if the molecule was accepted by the ledger:
    ```javascript
    // For mutations only 
    console.log( response.success() )
   
    // We can also check the reason for rejection
    console.log( response.reason() )
    ```
   Some queries may also produce a payload, with additional data:
    ```javascript 
    console.log( response.payload() )
    ```
   Payloads are provided by responses to the following queries:
    1. `QueryBalance` and `QueryContinuId` -> returns a `Wallet` instance
    2. `QueryWalletList` -> returns a list of `Wallet` instances
    3. `MutationProposeMolecule`, `MutationRequestAuthorization`, `MutationCreateIdentifier`, `MutationLinkIdentifier`
       , `MutationClaimShadowWallet`, `MutationCreateToken`, `MutationRequestTokens`, and `MutationTransferTokens` ->
       returns molecule metadata

## Getting Help

Knish.IO is active development, and our team is ready to assist with integration questions. The best way to seek help is
to stop by our [Telegram Support Channel](https://t.me/wishknish). You can
also [send us a contact request](https://knish.io/contact) via our website.

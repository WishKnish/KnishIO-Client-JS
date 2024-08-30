<div style="text-align:center">
  <img src="https://raw.githubusercontent.com/WishKnish/KnishIO-Technical-Whitepaper/master/KnishIO-Logo.png" alt="Knish.IO: Post-Blockchain Platform" />
</div>
<div style="text-align:center">info@wishknish.com | https://wishknish.com</div>

# Knish.IO Javascript Client SDK

This is the official Javascript / NodeJS implementation of the Knish.IO client SDK. Its purpose is to expose class libraries for building and signing Knish.IO Molecules, composing Atoms, generating Wallets, and much more.

## Installation

The SDK can be installed via either of the following:

1. `yarn add @wishknish/knishio-client-js`

2. `npm install @wishknish/knishio-client-js --save`

(**Note:** For installations in a Vite-based environment, you will need to install the https://www.npmjs.com/package/vite-plugin-node-polyfills plugin to ensure compatibility with Node.js libraries.)

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
   const client = new KnishIOClient({
     uri: myNodeURI,
     cellSlug: myCellSlug,
     serverSdkVersion: 3, // Optional, defaults to 3
     logging: false // Optional, enables logging
   });
   ```

3. Request authorization token from the node:
   ```javascript
   await client.requestAuthToken({
     seed: 'myTopSecretCode',
     encrypt: true // Optional, enables encryption
   });
   ```

   (**Note:** The `seed` parameter can be a salted combination of username + password, a biometric hash, an existing user identifier from an external authentication process, for example)

4. Begin using `client` to trigger commands described below...

### KnishIOClient Methods

- Query metadata for a **Wallet Bundle**. Omit the `bundle` parameter to query your own Wallet Bundle:
  ```javascript
  const result = await client.queryBundle({
    bundle: 'c47e20f99df190e418f0cc5ddfa2791e9ccc4eb297cfa21bd317dc0f98313b1d',
  });

  console.log(result); // Raw Metadata
  ```

- Query metadata for a **Meta Asset**:

  ```javascript
  const result = await client.queryMeta({
    metaType: 'Vehicle',
    metaId: null, // Meta ID
    key: 'LicensePlate',
    value: '1H17P',
    latest: true, // Limit meta values to latest per key
    throughAtom: true // Optional, query through Atom (default: true)
  });

  console.log(result); // Raw Metadata
  ```

- Writing new metadata for a **Meta Asset**:

  ```javascript
  const result = await client.createMeta({
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
    },
    policy: {} // Optional policy object
  });

  if (result.success()) {
    // Do things!
  }

  console.log(result.data()); // Raw response
  ```

- Query Wallets associated with a Wallet Bundle:

  ```javascript
  const result = await client.queryWallets({
    bundle: 'c47e20f99df190e418f0cc5ddfa2791e9ccc4eb297cfa21bd317dc0f98313b1d',
    token: 'FOO', // Optional, filter by token
    unspent: true // Optional, limit results to unspent wallets
  });

  console.log(result); // Raw response
  ```

- Declaring new **Wallets**:

  (**Note:** If Tokens are sent to undeclared Wallets, **Shadow Wallets** will be used (placeholder
  Wallets that can receive, but cannot send) to store tokens until they are claimed.)

  ```javascript
  const result = await client.createWallet({
    token: 'FOO' // Token Slug for the wallet we are declaring
  });

  if (result.success()) {
    // Do things!
  }

  console.log(result.data()); // Raw response
  ```

- Issuing new **Tokens**:

  ```javascript
  const result = await client.createToken({
    token: 'CRZY', // Token slug (ticker symbol)
    amount: '100000000', // Initial amount to issue
    meta: {
      name: 'CrazyCoin', // Public name for the token
      fungibility: 'fungible', // Fungibility style (fungible / nonfungible / stackable)
      supply: 'limited', // Supply style (limited / replenishable)
      decimals: '2' // Decimal places
    },
    units: [], // Optional, for stackable tokens
    batchId: null // Optional, for stackable tokens
  });

  if (result.success()) {
    // Do things!
  }

  console.log(result.data()); // Raw response
  ```

- Transferring **Tokens** to other users:

  ```javascript
  const result = await client.transferToken({
    bundleHash: '7bf38257401eb3b0f20cabf5e6cf3f14c76760386473b220d95fa1c38642b61d', // Recipient's bundle hash
    token: 'CRZY', // Token slug
    amount: '100',
    units: [], // Optional, for stackable tokens
    batchId: null // Optional, for stackable tokens
  });

  if (result.success()) {
    // Do things!
  }

  console.log(result.data()); // Raw response
  ```

- Creating a new **Rule**:

  ```javascript
  const result = await client.createRule({
    metaType: 'MyMetaType',
    metaId: 'MyMetaId',
    rule: [
      // Rule definition
    ],
    policy: {} // Optional policy object
  });

  if (result.success()) {
    // Do things!
  }

  console.log(result.data()); // Raw response
  ```

- Querying **Atoms**:

  ```javascript
  const result = await client.queryAtom({
    molecularHash: 'hash',
    bundleHash: 'bundle',
    isotope: 'V',
    tokenSlug: 'CRZY',
    latest: true,
    queryArgs: {
      limit: 15,
      offset: 1
    }
  });

  console.log(result.data()); // Raw response
  ```

- Working with **Buffer Tokens**:

  ```javascript
  // Deposit to buffer
  const depositResult = await client.depositBufferToken({
    tokenSlug: 'CRZY',
    amount: 100,
    tradeRates: {
      'OTHER_TOKEN': 0.5
    }
  });

  // Withdraw from buffer
  const withdrawResult = await client.withdrawBufferToken({
    tokenSlug: 'CRZY',
    amount: 50
  });

  console.log(depositResult.data(), withdrawResult.data()); // Raw responses
  ```

- Getting client fingerprint:

  ```javascript
  const fingerprint = await client.getFingerprint();
  console.log(fingerprint);

  const fingerprintData = await client.getFingerprintData();
  console.log(fingerprintData);
  ```

## Advanced Usage: Working with Molecules

For more granular control, you can work directly with Molecules:

- Create a new Molecule:
  ```javascript
  const molecule = await client.createMolecule();
  ```

- Create a custom Mutation:
  ```javascript
  const mutation = await client.createMoleculeMutation({
    mutationClass: MyCustomMutationClass
  });
  ```

- Sign and check a Molecule:
  ```javascript
  molecule.sign();
  if (!molecule.check()) {
    // Handle error
  }
  ```

- Execute a custom Query or Mutation:
  ```javascript
  const result = await client.executeQuery(myQueryOrMutation, variables);
  ```

## The Hard Way: DIY Everything

This method involves individually building Atoms and Molecules, triggering the signature and validation processes, and communicating the resulting signed Molecule mutation or Query to a Knish.IO node via your favorite GraphQL client.

1. Include the relevant classes in your application code:
    ```javascript
    import { Molecule, Wallet, Atom } from '@wishknish/knishio-client-js'
    ```

2. Generate a 2048-symbol hexadecimal secret, either randomly, or via hashing login + password + salt, OAuth secret ID, biometric ID, or any other static value.

3. (optional) Initialize a signing wallet with:
   ```javascript
   const wallet = new Wallet({
     secret: mySecret,
     token: tokenSlug,
     position: myCustomPosition, // (optional) instantiate specific wallet instance vs. random
     characters: myCharacterSet // (optional) override the character set used by the wallet
   })
   ```

   **WARNING 1:** If ContinuID is enabled on the node, you will need to use a specific wallet, and therefore will first need to query the node to retrieve the `position` for that wallet.

   **WARNING 2:** The Knish.IO protocol mandates that all C and M transactions be signed with a `USER` token wallet.

4. Build your molecule with:
   ```javascript
   const molecule = new Molecule({
     secret: mySecret,
     sourceWallet: mySourceWallet, // (optional) wallet for signing
     remainderWallet: myRemainderWallet, // (optional) wallet to receive remainder tokens
     cellSlug: myCellSlug, // (optional) used to point a transaction to a specific branch of the ledger
     version: 4 // (optional) specify the molecule version
   });
   ```

5. Either use one of the shortcut methods provided by the `Molecule` class (which will build `Atom` instances for you), or create `Atom` instances yourself.

   DIY example:
    ```javascript
    // This example records a new Wallet on the ledger

    // Define metadata for our new wallet
    const newWalletMeta = {
      address: newWallet.address,
      token: newWallet.token,
      bundle: newWallet.bundle,
      position: newWallet.position,
      batchId: newWallet.batchId,
    }

    // Build the C isotope atom
    const walletCreationAtom = new Atom({
      position: sourceWallet.position,
      walletAddress: sourceWallet.address,
      isotope: 'C',
      token: sourceWallet.token,
      metaType: 'wallet',
      metaId: newWallet.address,
      meta: newWalletMeta,
      index: molecule.generateIndex()
    })

    // Add the atom to our molecule
    molecule.addAtom(walletCreationAtom)

    // Adding a ContinuID / remainder atom
    molecule.addContinuIdAtom();
    ```

   Molecule shortcut method example:
    ```javascript
    // This example commits metadata to some Meta Asset

    // Defining our metadata
    const metadata = {
      foo: 'Foo',
      bar: 'Bar'
    }

    molecule.initMeta({
      meta: metadata,
      metaType: 'MyMetaType',
      metaId: 'MetaId123',
      policy: {} // Optional policy object
    });
    ```

6. Sign the molecule with the stored user secret:
    ```javascript
    molecule.sign()
    ```

7. Make sure everything checks out by verifying the molecule:
    ```javascript
    try {
      molecule.check();
      // If we're validating a V isotope transaction,
      // add the source wallet as a parameter
      molecule.check(sourceWallet);
    } catch (error) {
      console.error('Molecule check failed:', error);
      // Handle the error
    }
    ```

8. Broadcast the molecule to a Knish.IO node:
    ```javascript
    // Build our query object using the KnishIOClient wrapper
    const mutation = await client.createMoleculeMutation({
      mutationClass: MutationProposeMolecule,
      molecule: molecule
    });

    // Send the query to the node and get a response
    const response = await client.executeQuery(mutation);
    ```

9. Inspect the response...
    ```javascript
    // For basic queries, we look at the data property:
    console.log(response.data())

    // For mutations, check if the molecule was accepted by the ledger:
    console.log(response.success())

    // We can also check the reason for rejection
    console.log(response.reason())

    // Some queries may also produce a payload, with additional data:
    console.log(response.payload())
    ```

   Payloads are provided by responses to the following queries:
    1. `QueryBalance` and `QueryContinuId` -> returns a `Wallet` instance
    2. `QueryWalletList` -> returns a list of `Wallet` instances
    3. `MutationProposeMolecule`, `MutationRequestAuthorization`, `MutationCreateIdentifier`, `MutationLinkIdentifier`, `MutationClaimShadowWallet`, `MutationCreateToken`, `MutationRequestTokens`, and `MutationTransferTokens` -> returns molecule metadata

## Getting Help

Knish.IO is under active development, and our team is ready to assist with integration questions. The best way to seek help is to stop by our [Telegram Support Channel](https://t.me/wishknish). You can also [send us a contact request](https://knish.io/contact) via our website.

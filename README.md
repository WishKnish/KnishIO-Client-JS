# Knish.IO Javascript Client
This is an experimental Javascript / NodeJS implementation of the Knish.IO API client. Its purpose is to expose class libraries for building and signing Knish.IO Molecules, composing Atoms (presently "M" and "V" isotopes are supported), and generating Wallet addresses (public keys) and private keys as per the Knish.IO Technical Whitepaper.

# Getting Started
1. `yarn add @wishknish/knishio-client-js` -or- `npm install @wishknish/knishio-client-js --save`
2. Inside your application code, `import { Molecule, Wallet } from '@wishknish/knishio-client-js';`
3. Build a 2048-character user secret via your preferred methodology (random string?).
4. Initialize a wallet with `let wallet = new Wallet( secret, token );`

You can also specify a third, optional `position` argument represents the private key index (hexadecimal), and must NEVER be used more than once. It will be generated randmly if not provided.

A fourth argument, `saltLength`, helps tweak the length of the random `position`, if the parameter is not provided.

The `token` argument (string) is the slug for the token being transacted with. Knish.IO anticipates user's personal metadata being kept under the `USER` token.

# Building Your Molecule
1. Build your molecule with `let molecule = new Molecule( cellId );` The `cellId` argument represents the slug for your Knish.IO cell. It's meant to segregate molecules of one use case from others. Leave it null if not sure.
2. For a "M"-type molecule, build your metadata as an array of objects, for example:
```javascript
const data = [
  {
    key: 'name',
    value: 'foo'
  },
  {
    key: 'email',
    value: 'bar'
  },
  //...
];
```
or
```javascript
const data = {
  name: 'foo',
  email: 'bar',
  //...
};
```
3. Initialize the molecule as "M"-type: `molecule.initMeta( wallet, data, metaType, metaId );` The `metaType` and `metaId` arguments represent a polymorphic key to whatever asset you are attaching this metadata to.
4. Sign the molecule with the user secret: `molecule.sign( secret );`
5. Make sure everything checks out by verifying the molecule:
```javascript
if ( Molecule.verifyMolecularHash( molecule ) &&
     Molecule.verifyOts( molecule ) &&
     Molecule.verifyTokenIsotopeV( molecule ) ) {
  //...  Do stuff? Send the molecule to a Knish.IO node, maybe?
}
```

# Broadcasting
1. Knish.IO nodes use GraphQL to receive new molecules as a Mutation. The code for the mutation is as follows:
```
  mutation MoleculeMutation($molecule: MoleculeInput!) {
    ProposeMolecule(
      molecule: $molecule,
    ) {
      molecularHash,
      height,
      depth,
      status,
      reason,
      reasonPayload,
      createdAt,
      receivedAt,
      processedAt,
      broadcastedAt
    }
  }
```
2. Use your favorite GraphQL client to send the mutation to a Knish.IO node with the molecule you've signed as the only parameter.
3. The `status` field of the response will indicate whether the molecule was accepted or rejected, or if it's pending further processing. The `reason` and `reasonPayload` fields can help further diagnose and handle rejections.

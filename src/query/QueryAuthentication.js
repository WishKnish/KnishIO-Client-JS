import QueryMoleculePropose from "./QueryMoleculePropose";
import Wallet from '../Wallet'
import Molecule from "../Molecule";
import ResponseAuthentication from "../response/ResponseAuthentication";

export default class QueryAuthentication extends QueryMoleculePropose {

  /**
   * @param client
   * @param url
   */
  constructor ( client, url ) {
    super( client, url );
  }

  /**
   * @param {string} secret
   * @param {Wallet} continueId
   */
  initMolecule ( secret, continueId = null ) {

    this.$__remainderWallet = new Wallet( secret );

    const wallet = new Wallet( secret );

    if ( continueId ) {
      wallet.address = continueId.address;
      wallet.batchId = continueId.batchId;
      wallet.bundle = continueId.bundle;
      wallet.position = continueId.position;
      wallet.characters = continueId.characters;
      wallet.pubkey = continueId.pubkey;
      wallet.balance = continueId.amount * 1.0;
      wallet.token = continueId.token;
    }

    this.$__molecule = new Molecule();
    this.$__molecule.initAuthentication( wallet, this.$__remainderWallet );
    this.$__molecule.sign( secret );
    this.$__molecule.check();
  }

  createResponse ( response ) {
    return new ResponseAuthentication( this, response );
  }
}

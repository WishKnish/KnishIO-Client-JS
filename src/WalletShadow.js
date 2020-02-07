import Base58 from './libraries/Base58';
import { Wallet } from "./index";


export default class WalletShadow extends Wallet {

  /**
   * @param {string} bundleHash
   * @param {string} token
   * @param {string|null} batchId
   * @param {string|null} characters
   */
  constructor ( bundleHash, token = null, batchId = null, characters = null ) {

    super();
    this.token = token || 'USER';
    this.balance = 0;
    this.molecules = {};
    this.bundle = bundleHash;
    this.batchId = batchId;
    this.characters = ( new Base58() )[ characters ] !== 'undefined' ? characters : null;

    // Empty values
    this.key = null;
    this.address = null;
    this.position = null;
    this.privkey = null;
    this.pubkey = null;

  }

}

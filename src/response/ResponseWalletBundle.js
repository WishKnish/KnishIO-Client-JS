import Response from "./Response";


export default class ResponseWalletBundle extends Response {
  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.WalletBundle';
    this.init ()
  }
}
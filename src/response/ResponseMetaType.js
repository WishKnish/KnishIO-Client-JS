import Response from "./Response";


export default class ResponseMetaType extends Response {
  /**
   * @param query
   * @param json
   */
  constructor ( query, json ) {
    super( query, json );
    this.dataKey = 'data.MetaType';
    this.init();
  }
}

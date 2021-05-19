import Response from './Response';

export default class ResponseActiveSession extends Response {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ( {
    query,
    json
  } ) {
    super( {
      query,
      json
    } );
    this.dataKey = 'data.ActiveSession';
    this.init();
  }
}

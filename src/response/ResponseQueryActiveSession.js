import Response from './Response';

export default class ResponseQueryActiveSession extends Response {
  /**
   * Class constructor
   *
   * @param {Query} query
   * @param {object} json
   */
  constructor ( { query, json} ) {
    super( { query, json, } );
    this.dataKey = 'data.ActiveUser';
    this.init();
  }

  payload () {
    const list = this.data();

    if ( !list ) {
      return null;
    }

    const activeUser = [];

    for ( let item of list ) {

      if ( item.jsonData ) {
        item.jsonData = JSON.parse( item.jsonData );
      }

      activeUser.push( item );
    }

    return activeUser;
  }

}

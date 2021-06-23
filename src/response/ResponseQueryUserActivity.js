import Response from './Response';
import Dot from "../libraries/Dot";

export default class ResponseQueryUserActivity extends Response {
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
    this.dataKey = 'data.UserActivity';
    this.init();
  }

  payload () {
    const data = JSON.parse( JSON.stringify( this.data() ) );

    if ( data.instances ) {
      for ( const datum of data.instances ) {
        datum.jsonData = JSON.parse( datum.jsonData );
      }
    }

    return data;
  }

}

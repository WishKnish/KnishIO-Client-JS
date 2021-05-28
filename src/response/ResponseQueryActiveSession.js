import Response from './Response';

export default class ResponseQueryActiveSession extends Response {
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
    this.dataKey = 'data.ActiveUser';
    this.init();
  }

  payload () {
    const list = this.data();

    if ( !list ) {
      return null;
    }

    const activeUsers = [];

    for ( let item of list ) {

      const activeSession = { ...item };

      if ( activeSession.jsonData ) {
        activeSession.jsonData = JSON.parse( activeSession.jsonData );
      }

      if ( activeSession.createdAt ) {
        activeSession.createdAt = new Date( activeSession.createdAt );
      }

      if ( activeSession.updatedAt ) {
        activeSession.updatedAt = new Date( activeSession.updatedAt );
      }

      activeUsers.push( activeSession );
    }

    return activeUsers;
  }

}

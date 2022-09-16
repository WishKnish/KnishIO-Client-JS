/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/
import { ApolloLink } from '@apollo/client/core';


class AuthLink extends ApolloLink {

  constructor () {
    super();

    this.auth = '';
  }

  /**
   *
   * @return {string}
   */
  getAuthToken () {
    return this.auth;
  }

  /**
   * @param {string} auth
   */
  setAuthToken ( auth ) {
    this.auth = auth;
  }

  /**
   *
   * @param {Operation} operation
   * @param {NextLink | undefined} forward
   * @returns {Observable<FetchResult> | null}
   */
  request ( operation, forward ) {

    operation.setContext( ( { headers = {} } ) => ( {
      headers: {
        ...headers,
        'X-Auth-Token': this.getAuthToken()
      }
    } ) );

    return forward( operation );
  }
}

export default AuthLink;

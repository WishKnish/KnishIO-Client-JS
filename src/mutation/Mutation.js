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
import Query from '../query/Query';
import { Operation } from 'apollo-link';

/**
 * Base class used to construct various GraphQL mutations
 */
export default class Mutation extends Query {
  /**
   *
   * @param {ApolloClient} apolloClient
   */
  constructor ( apolloClient ) {
    super( apolloClient );
  }

  /**
   * Creates a new Request for the given parameters
   *
   * @param {object} variables
   * @param {array|object|null} fields
   * @returns {Operation}
   */
  createQuery ( { variables = null } ) {

    const request = super.createQuery( { variables } );

    request.mutation = request.query;

    delete request.query;

    return request;
  }

  /**
   * Sends the Query to a Knish.IO node and returns the Response
   *
   * @param {object} variables
   */
  async execute ( { variables = null } ) {

    this.$__request = this.createQuery( {
      variables
    } );

    let response = await this.client.mutate( this.$__request );

    this.$__response = await this.createResponseRaw( response );

    return this.$__response;
  }
}

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

/**
 * @param {Operation} operation
 * @return {string}
 */
export function operationName (operation) {
  const operationDefinition = operation.query
    .definitions.find(definitionNode => definitionNode.kind === 'OperationDefinition')
  const fieldNode = operationDefinition.selectionSet
    .selections.find(definitionNode => definitionNode.kind === 'Field')

  return fieldNode.name.value
}

/**
 * @param {Operation} operation
 * @return {string}
 */
export function operationType (operation) {
  const operationDefinition = operation.query
    .definitions.find(definitionNode => definitionNode.kind === 'OperationDefinition')

  return operationDefinition.operation
}

export function errorHandler ({
  graphQLErrors,
  networkError,
  operation,
  forward,
  response
}) {
  if (graphQLErrors) {
    graphQLErrors.map(({
      message,
      debugMessage,
      locations,
      path
    }) => console.error(
      `[GraphQL error]: ${ message }\r\n`,
      `  Message : ${ debugMessage }\r\n`,
      `  Path    : ${ path }\r\n`,
      `  Location: ${ locations }\r\n`
    ))
  }

  if (networkError) {
    const {
      name,
      statusCode,
      result = {}
    } = networkError
    console.error(`[Network error]: ${ name }, status code: ${ statusCode }`)
    // if you would also like to retry automatically on
    // network errors, we recommend that you use
    // apollo-link-retry
  }
}

/**
 * Handle GraphQL and network errors
 * @param {Object} errorInfo - Error information object
 */
export function errorHandler ({
  graphQLErrors,
  networkError,
  operation,
  forward,
  response
}) {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, debugMessage, locations, path }) =>
      console.error(
        `[GraphQL error]: ${message}`,
        `\n  Message : ${debugMessage}`,
        `\n  Path    : ${path}`,
        `\n  Location: ${JSON.stringify(locations)}`
      )
    )
  }

  if (networkError) {
    const { name, statusCode, result = {} } = networkError
    console.error(`[Network error]: ${name}, status code: ${statusCode}`)
    // TODO: Implement automatic retry logic for network errors
    // This could involve using an exponential backoff strategy
  }

  // You can add custom error handling logic here
  // For example, you could dispatch actions to update the app state on certain errors
}

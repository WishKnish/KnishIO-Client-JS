/**
 * Extract the operation name from a GraphQL operation
 * @param {Object} operation - GraphQL operation object
 * @returns {string} Operation name
 */
export function operationName (operation) {
  const operationDefinition = operation.query.definitions.find(
    definitionNode => definitionNode.kind === 'OperationDefinition'
  )
  const fieldNode = operationDefinition.selectionSet.selections.find(
    definitionNode => definitionNode.kind === 'Field'
  )
  return fieldNode.name.value
}

/**
 * Extract the operation type from a GraphQL operation
 * @param {Object} operation - GraphQL operation object
 * @returns {string} Operation type (query, mutation, subscription)
 */
export function operationType (operation) {
  const operationDefinition = operation.query.definitions.find(
    definitionNode => definitionNode.kind === 'OperationDefinition'
  )
  return operationDefinition.operation
}

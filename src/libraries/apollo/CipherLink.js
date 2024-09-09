import { ApolloLink, gql } from '@apollo/client/core'
import { print } from 'graphql'
import { operationName, operationType } from './operationUtils'
import CodeException from '../../exception/CodeException'
import Dot from '../Dot'

/**
 * Custom Apollo Link for handling encryption and decryption of GraphQL operations
 */
class CipherLink extends ApolloLink {
  constructor () {
    super()
    this.__wallet = null
    this.__pubkey = null
  }

  /**
   * Set the wallet for encryption
   * @param {Object|null} wallet - Wallet object
   */
  setWallet (wallet) {
    this.__wallet = wallet
  }

  /**
   * Get the current wallet
   * @returns {Object|null} Wallet object
   */
  getWallet () {
    return this.__wallet
  }

  /**
   * Set the public key for encryption
   * @param {string|null} pubkey - Public key
   */
  setPubKey (pubkey) {
    this.__pubkey = pubkey
  }

  /**
   * Get the current public key
   * @returns {string|null} Public key
   */
  getPubKey () {
    return this.__pubkey
  }

  /**
   * Handle the request and apply encryption if necessary
   * @param {Object} operation - GraphQL operation
   * @param {function} forward - Function to forward the operation
   * @returns {Observable} Observable of the operation result
   */
  request (operation, forward) {
    const requestName = operationName(operation)
    const requestType = operationType(operation)
    const isMoleculeMutation = (requestType === 'mutation' && requestName === 'ProposeMolecule')

    // Check if encryption should be skipped
    const skipEncryption = [
      (requestType === 'query' && ['__schema', 'ContinuId'].includes(requestName)),
      (requestType === 'mutation' && requestName === 'AccessToken'),
      (isMoleculeMutation && Dot.get(operation, 'variables.molecule.atoms.0.isotope') === 'U')
    ].some(condition => condition)

    if (skipEncryption) {
      return forward(operation)
    }

    const wallet = this.getWallet()
    const pubKey = this.getPubKey()

    if (!pubKey) {
      throw new CodeException('CipherLink::request() - Node public key missing!')
    }

    if (!wallet) {
      throw new CodeException('CipherLink::request() - Authorized wallet missing!')
    }

    const cipher = {
      query: print(operation.query),
      variables: JSON.stringify(operation.variables)
    }

    // Encrypt the operation
    operation.operationName = null
    operation.query = gql`query ($Hash: String!) { CipherHash(Hash: $Hash) { hash } }`
    operation.variables = { Hash: JSON.stringify(wallet.encryptMessage(cipher, pubKey)) }

    // Forward the encrypted operation and handle the response
    return forward(operation).map(data => {
      let response = data.data

      if (response.data) {
        response = response.data
      }

      if (response.CipherHash && response.CipherHash.hash) {
        const encrypted = JSON.parse(response.CipherHash.hash)
        const decryption = wallet.decryptMessage(encrypted)

        if (decryption === null) {
          throw new CodeException('CipherLink::request() - Unable to decrypt response!')
        }

        return decryption
      }

      return data
    })
  }
}

export default CipherLink

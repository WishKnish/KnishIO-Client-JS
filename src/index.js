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

// =============================================================================
// CORE CLASSES
// =============================================================================

import Atom from './Atom.js'
import AtomMeta from './AtomMeta.js'
import Molecule from './Molecule.js'
import Wallet from './Wallet.js'
import Meta from './Meta.js'
import AuthToken from './AuthToken.js'
import TokenUnit from './TokenUnit.js'
import PolicyMeta from './PolicyMeta.js'
import KnishIOClient from './KnishIOClient.js'

// Validation
import CheckMolecule from './libraries/CheckMolecule.js'

// Utilities
import Dot from './libraries/Dot.js'
import Decimal from './libraries/Decimal.js'

// =============================================================================
// BASE CLASSES
// =============================================================================

import Query from './query/Query.js'
import Mutation from './mutation/Mutation.js'
import Response from './response/Response.js'

// =============================================================================
// QUERY CLASSES
// =============================================================================

import QueryActiveSession from './query/QueryActiveSession.js'
import QueryAtom from './query/QueryAtom.js'
import QueryBalance from './query/QueryBalance.js'
import QueryBatch from './query/QueryBatch.js'
import QueryBatchHistory from './query/QueryBatchHistory.js'
import QueryContinuId from './query/QueryContinuId.js'
import QueryMetaType from './query/QueryMetaType.js'
import QueryMetaTypeViaAtom from './query/QueryMetaTypeViaAtom.js'
import QueryMetaTypeViaMolecule from './query/QueryMetaTypeViaMolecule.js'
import QueryPolicy from './query/QueryPolicy.js'
import QueryToken from './query/QueryToken.js'
import QueryUserActivity from './query/QueryUserActivity.js'
import QueryWalletBundle from './query/QueryWalletBundle.js'
import QueryWalletList from './query/QueryWalletList.js'

// =============================================================================
// MUTATION CLASSES
// =============================================================================

import MutationActiveSession from './mutation/MutationActiveSession.js'
import MutationAppendRequest from './mutation/MutationAppendRequest.js'
import MutationClaimShadowWallet from './mutation/MutationClaimShadowWallet.js'
import MutationCreateIdentifier from './mutation/MutationCreateIdentifier.js'
import MutationCreateMeta from './mutation/MutationCreateMeta.js'
import MutationCreateRule from './mutation/MutationCreateRule.js'
import MutationCreateToken from './mutation/MutationCreateToken.js'
import MutationCreateWallet from './mutation/MutationCreateWallet.js'
import MutationDepositBufferToken from './mutation/MutationDepositBufferToken.js'
import MutationLinkIdentifier from './mutation/MutationLinkIdentifier.js'
import MutationPeering from './mutation/MutationPeering.js'
import MutationProposeMolecule from './mutation/MutationProposeMolecule.js'
import MutationRequestAuthorization from './mutation/MutationRequestAuthorization.js'
import MutationRequestAuthorizationGuest from './mutation/MutationRequestAuthorizationGuest.js'
import MutationRequestTokens from './mutation/MutationRequestTokens.js'
import MutationTransferTokens from './mutation/MutationTransferTokens.js'
import MutationWithdrawBufferToken from './mutation/MutationWithdrawBufferToken.js'

// =============================================================================
// RESPONSE CLASSES
// =============================================================================

import ResponseActiveSession from './response/ResponseActiveSession.js'
import ResponseAppendRequest from './response/ResponseAppendRequest.js'
import ResponseAtom from './response/ResponseAtom.js'
import ResponseAuthorizationGuest from './response/ResponseAuthorizationGuest.js'
import ResponseBalance from './response/ResponseBalance.js'
import ResponseClaimShadowWallet from './response/ResponseClaimShadowWallet.js'
import ResponseContinuId from './response/ResponseContinuId.js'
import ResponseCreateIdentifier from './response/ResponseCreateIdentifier.js'
import ResponseCreateMeta from './response/ResponseCreateMeta.js'
import ResponseCreateRule from './response/ResponseCreateRule.js'
import ResponseCreateToken from './response/ResponseCreateToken.js'
import ResponseCreateWallet from './response/ResponseCreateWallet.js'
import ResponseLinkIdentifier from './response/ResponseLinkIdentifier.js'
import ResponseMetaType from './response/ResponseMetaType.js'
import ResponseMetaTypeViaAtom from './response/ResponseMetaTypeViaAtom.js'
import ResponseMetaTypeViaMolecule from './response/ResponseMetaTypeViaMolecule.js'
import ResponsePeering from './response/ResponsePeering.js'
import ResponsePolicy from './response/ResponsePolicy.js'
import ResponseProposeMolecule from './response/ResponseProposeMolecule.js'
import ResponseQueryActiveSession from './response/ResponseQueryActiveSession.js'
import ResponseQueryUserActivity from './response/ResponseQueryUserActivity.js'
import ResponseRequestAuthorization from './response/ResponseRequestAuthorization.js'
import ResponseRequestAuthorizationGuest from './response/ResponseRequestAuthorizationGuest.js'
import ResponseRequestTokens from './response/ResponseRequestTokens.js'
import ResponseTransferTokens from './response/ResponseTransferTokens.js'
import ResponseWalletBundle from './response/ResponseWalletBundle.js'
import ResponseWalletList from './response/ResponseWalletList.js'

// =============================================================================
// LIBRARY FUNCTIONS
// =============================================================================

import {
  base64ToHex,
  bufferToHexString,
  charsetBaseConvert,
  chunkSubstr,
  hexStringToBuffer,
  hexToBase64,
  isHex,
  isNumeric,
  randomString
} from './libraries/strings.js'

import {
  generateBatchId,
  generateBundleHash,
  generateSecret,
  shake256
} from './libraries/crypto.js'

import {
  chunkArray,
  deepCloning,
  diff,
  intersect
} from './libraries/array.js'

// =============================================================================
// EXCEPTION SYSTEM
// =============================================================================

export {
  AtomIndexException,
  AtomsMissingException,
  AuthorizationRejectedException,
  BalanceInsufficientException,
  BatchIdException,
  CodeException,
  InvalidResponseException,
  MetaMissingException,
  MolecularHashMismatchException,
  MolecularHashMissingException,
  NegativeAmountException,
  PolicyInvalidException,
  SignatureMalformedException,
  SignatureMismatchException,
  StackableUnitAmountException,
  StackableUnitDecimalsException,
  TransferBalanceException,
  TransferMalformedException,
  TransferMismatchedException,
  TransferRemainderException,
  TransferToSelfException,
  TransferUnbalancedException,
  UnauthenticatedException,
  WalletShadowException,
  WrongTokenTypeException
} from './exception/index.js'

// =============================================================================
// NAMED EXPORTS
// =============================================================================

export {
  // Core classes
  Atom,
  AtomMeta,
  Molecule,
  Wallet,
  Meta,
  AuthToken,
  TokenUnit,
  PolicyMeta,
  KnishIOClient,

  // Validation
  CheckMolecule,

  // Utilities
  Dot,
  Decimal,

  // Base classes
  Query,
  Mutation,
  Response,

  // Queries
  QueryActiveSession,
  QueryAtom,
  QueryBalance,
  QueryBatch,
  QueryBatchHistory,
  QueryContinuId,
  QueryMetaType,
  QueryMetaTypeViaAtom,
  QueryMetaTypeViaMolecule,
  QueryPolicy,
  QueryToken,
  QueryUserActivity,
  QueryWalletBundle,
  QueryWalletList,

  // Mutations
  MutationActiveSession,
  MutationAppendRequest,
  MutationClaimShadowWallet,
  MutationCreateIdentifier,
  MutationCreateMeta,
  MutationCreateRule,
  MutationCreateToken,
  MutationCreateWallet,
  MutationDepositBufferToken,
  MutationLinkIdentifier,
  MutationPeering,
  MutationProposeMolecule,
  MutationRequestAuthorization,
  MutationRequestAuthorizationGuest,
  MutationRequestTokens,
  MutationTransferTokens,
  MutationWithdrawBufferToken,

  // Responses
  ResponseActiveSession,
  ResponseAppendRequest,
  ResponseAtom,
  ResponseAuthorizationGuest,
  ResponseBalance,
  ResponseClaimShadowWallet,
  ResponseContinuId,
  ResponseCreateIdentifier,
  ResponseCreateMeta,
  ResponseCreateRule,
  ResponseCreateToken,
  ResponseCreateWallet,
  ResponseLinkIdentifier,
  ResponseMetaType,
  ResponseMetaTypeViaAtom,
  ResponseMetaTypeViaMolecule,
  ResponsePeering,
  ResponsePolicy,
  ResponseProposeMolecule,
  ResponseQueryActiveSession,
  ResponseQueryUserActivity,
  ResponseRequestAuthorization,
  ResponseRequestAuthorizationGuest,
  ResponseRequestTokens,
  ResponseTransferTokens,
  ResponseWalletBundle,
  ResponseWalletList,

  // String utilities
  chunkSubstr,
  base64ToHex,
  bufferToHexString,
  charsetBaseConvert,
  hexStringToBuffer,
  hexToBase64,
  isHex,
  isNumeric,
  randomString,

  // Crypto utilities
  generateSecret,
  generateBundleHash,
  generateBatchId,
  shake256,

  // Array utilities
  chunkArray,
  deepCloning,
  diff,
  intersect
}

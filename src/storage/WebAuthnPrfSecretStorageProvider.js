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

import SecretStorageException from '../exception/SecretStorageException.js'
import { zeroizeBytes, withSecureBytes } from '../libraries/secureMemory.js'
import {
  sealEnvelope,
  openEnvelope,
  uint8ArrayToBase64,
  base64ToUint8Array
} from './secretEnvelope.js'

export const PRF_SALT_LABEL = 'knishio:secret-storage:webauthn-prf:v1'
export const KEK_INFO = 'knishio:secret-storage:kek:v1'
const KEY_PREFIX = 'knishio:secret:'
const GCM_IV_LENGTH = 12

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function base64UrlEncode (bytes) {
  return uint8ArrayToBase64(bytes)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlDecode (str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  return base64ToUint8Array(base64)
}

function toUint8Array (buf) {
  if (buf instanceof Uint8Array) {
    return buf
  }
  if (ArrayBuffer.isView(buf)) {
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  }
  return new Uint8Array(buf)
}

async function computePrfSalt () {
  const hash = await globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(PRF_SALT_LABEL))
  return new Uint8Array(hash)
}

async function deriveKekFromPrf (prfOutput, prfSalt) {
  const hkdfKey = await globalThis.crypto.subtle.importKey(
    'raw',
    prfOutput,
    'HKDF',
    false,
    ['deriveKey']
  )

  return await globalThis.crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: prfSalt,
      info: textEncoder.encode(KEK_INFO)
    },
    hkdfKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * Hardware-attested passkey PRF secret storage provider.
 * Wraps a random device passphrase under a KEK derived from the WebAuthn PRF extension.
 */
export default class WebAuthnPrfSecretStorageProvider {
  /**
   * @param {object} options
   * @param {object} options.backend
   * @param {{ id?: string, name: string }} options.rp
   * @param {{ id: Uint8Array, name: string, displayName: string }} options.user
   * @param {object} [options.credentials]
   * @param {string} [options.alias]
   */
  constructor (options) {
    this.providerType = 'webauthn-prf'
    this.backend = options.backend
    this.rp = options.rp
    this.user = options.user
    this.credentialsContainer = options.credentials
    this.alias = options.alias || 'default'
    this.cachedPassphrase = undefined
  }

  get credentials () {
    if (this.credentialsContainer) {
      return this.credentialsContainer
    }
    if (typeof globalThis.navigator !== 'undefined' && globalThis.navigator.credentials) {
      return globalThis.navigator.credentials
    }
    throw SecretStorageException.unavailable(
      this.providerType,
      'WebAuthn credentials container is not available'
    )
  }

  get recordKey () {
    return `knishio:webauthn-prf:${this.alias}`
  }

  isHardwareBacked () {
    // The PRF secret is bound to the authenticator hardware, but the derived KEK
    // material is handled by page JS and passkey attestation is not verified here.
    return false
  }

  async isAvailable () {
    const hasWebCrypto =
      typeof globalThis.crypto !== 'undefined' &&
      typeof globalThis.crypto.subtle !== 'undefined'
    const hasCredentials = Boolean(
      this.credentialsContainer ||
      (typeof globalThis.navigator !== 'undefined' &&
        globalThis.navigator.credentials &&
        typeof globalThis.PublicKeyCredential !== 'undefined')
    )
    return hasWebCrypto && hasCredentials
  }

  /**
   * Enroll a new passkey credential with PRF support and wrap a random device passphrase
   */
  async enroll () {
    const existing = await this.backend.getItem(this.recordKey)
    if (existing) {
      return
    }

    if (!await this.isAvailable()) {
      throw SecretStorageException.unavailable(this.providerType, 'WebAuthn PRF is not available')
    }

    const challenge = new Uint8Array(32)
    globalThis.crypto.getRandomValues(challenge)

    const credential = await this.credentials.create({
      publicKey: {
        rp: this.rp,
        user: {
          id: this.user.id,
          name: this.user.name,
          displayName: this.user.displayName
        },
        challenge,
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 }
        ],
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'required'
        },
        extensions: {
          prf: {}
        }
      }
    })

    if (!credential) {
      throw SecretStorageException.unavailable(this.providerType, 'Authenticator creation returned null')
    }

    const extResults = credential.getClientExtensionResults?.()
    if (extResults?.prf?.enabled !== true) {
      throw SecretStorageException.unavailable(
        this.providerType,
        'authenticator does not support the PRF extension'
      )
    }

    const credentialIdBytes = new Uint8Array(credential.rawId)
    const prfSalt = await computePrfSalt()

    const getChallenge = new Uint8Array(32)
    globalThis.crypto.getRandomValues(getChallenge)

    const assertion = await this.credentials.get({
      publicKey: {
        challenge: getChallenge,
        rpId: this.rp.id,
        allowCredentials: [
          {
            type: 'public-key',
            id: credentialIdBytes
          }
        ],
        userVerification: 'required',
        extensions: {
          prf: {
            eval: {
              first: prfSalt
            }
          }
        }
      }
    })

    const getExtResults = assertion?.getClientExtensionResults?.()
    const firstOutput = getExtResults?.prf?.results?.first
    if (!firstOutput) {
      throw SecretStorageException.unavailable(
        this.providerType,
        'authenticator returned no PRF result'
      )
    }

    const prfBytes = toUint8Array(firstOutput)
    const kek = await deriveKekFromPrf(prfBytes, prfSalt)

    const devicePassphraseBytes = new Uint8Array(32)
    globalThis.crypto.getRandomValues(devicePassphraseBytes)
    const devicePassphrase = uint8ArrayToBase64(devicePassphraseBytes)

    const iv = new Uint8Array(GCM_IV_LENGTH)
    globalThis.crypto.getRandomValues(iv)

    const passphraseBytes = textEncoder.encode(devicePassphrase)
    try {
      const encryptedBuffer = await globalThis.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv
        },
        kek,
        passphraseBytes
      )

      const record = {
        version: 1,
        credentialId: base64UrlEncode(credentialIdBytes),
        iv: uint8ArrayToBase64(iv),
        ciphertext: uint8ArrayToBase64(new Uint8Array(encryptedBuffer))
      }

      await this.backend.setItem(this.recordKey, JSON.stringify(record))
      this.cachedPassphrase = devicePassphrase
    } finally {
      zeroizeBytes(passphraseBytes)
      zeroizeBytes(devicePassphraseBytes)
    }
  }

  /**
   * Unlock the device passphrase using the enrolled WebAuthn PRF credential
   */
  async unlock () {
    if (this.cachedPassphrase) {
      return this.cachedPassphrase
    }

    const rawRecord = await this.backend.getItem(this.recordKey)
    if (!rawRecord) {
      throw SecretStorageException.unavailable(
        this.providerType,
        'no enrolled credential; call enroll() first'
      )
    }

    let record
    try {
      record = JSON.parse(rawRecord)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted PRF record format')
    }

    const credentialIdBytes = base64UrlDecode(record.credentialId)
    const prfSalt = await computePrfSalt()

    const challenge = new Uint8Array(32)
    globalThis.crypto.getRandomValues(challenge)

    const assertion = await this.credentials.get({
      publicKey: {
        challenge,
        rpId: this.rp.id,
        allowCredentials: [
          {
            type: 'public-key',
            id: credentialIdBytes
          }
        ],
        userVerification: 'required',
        extensions: {
          prf: {
            eval: {
              first: prfSalt
            }
          }
        }
      }
    })

    const extResults = assertion?.getClientExtensionResults?.()
    const firstOutput = extResults?.prf?.results?.first
    if (!firstOutput) {
      throw SecretStorageException.unavailable(
        this.providerType,
        'authenticator returned no PRF result'
      )
    }

    const prfBytes = toUint8Array(firstOutput)
    const kek = await deriveKekFromPrf(prfBytes, prfSalt)

    const iv = base64ToUint8Array(record.iv)
    const ciphertext = base64ToUint8Array(record.ciphertext)

    try {
      const decryptedBuffer = await globalThis.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv
        },
        kek,
        ciphertext
      )

      const decryptedBytes = new Uint8Array(decryptedBuffer)
      try {
        this.cachedPassphrase = textDecoder.decode(decryptedBytes)
        return this.cachedPassphrase
      } finally {
        zeroizeBytes(decryptedBytes)
      }
    } catch {
      throw SecretStorageException.decryptionFailed(
        'wrapped device passphrase failed authentication under the enrolled credential'
      )
    }
  }

  /**
   * Lock the provider by clearing cached passphrase material
   */
  lock () {
    this.cachedPassphrase = undefined
  }

  async storeSecret (bundleHash, secret, options = {}) {
    if (!bundleHash) {
      throw new SecretStorageException('Bundle hash cannot be empty')
    }
    if (!secret) {
      throw new SecretStorageException('Secret cannot be empty')
    }
    if (options.passphrase) {
      throw new SecretStorageException(
        'WebAuthnPrfSecretStorageProvider derives its passphrase from the authenticator; options.passphrase is not accepted'
      )
    }

    const passphrase = await this.unlock()
    const metadata = {
      bundleHash,
      label: options.label,
      createdAt: Date.now(),
      hardwareBacked: false,
      providerType: this.providerType
    }

    const payload = await sealEnvelope(secret, passphrase, metadata)
    await this.backend.setItem(`${KEY_PREFIX}${bundleHash}`, JSON.stringify(payload))
  }

  async retrieveSecret (bundleHash, options = {}) {
    if (options.passphrase) {
      throw new SecretStorageException(
        'WebAuthnPrfSecretStorageProvider derives its passphrase from the authenticator; options.passphrase is not accepted'
      )
    }

    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    if (!raw) {
      return null
    }

    let payload
    try {
      payload = JSON.parse(raw)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted payload format')
    }

    const passphrase = await this.unlock()
    try {
      const decryptedBytes = await openEnvelope(payload, passphrase)
      try {
        return textDecoder.decode(decryptedBytes)
      } finally {
        zeroizeBytes(decryptedBytes)
      }
    } catch (err) {
      if (err instanceof SecretStorageException) {
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      throw SecretStorageException.decryptionFailed(msg)
    }
  }

  async withSecret (bundleHash, fn, options = {}) {
    if (options.passphrase) {
      throw new SecretStorageException(
        'WebAuthnPrfSecretStorageProvider derives its passphrase from the authenticator; options.passphrase is not accepted'
      )
    }

    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    if (!raw) {
      throw SecretStorageException.notFound(bundleHash)
    }

    let payload
    try {
      payload = JSON.parse(raw)
    } catch {
      throw SecretStorageException.decryptionFailed('Corrupted payload format')
    }

    const passphrase = await this.unlock()
    try {
      const decryptedBytes = await openEnvelope(payload, passphrase)
      return await withSecureBytes(decryptedBytes, async (bytes) => {
        const secretString = textDecoder.decode(bytes)
        return await fn(secretString)
      })
    } catch (err) {
      if (err instanceof SecretStorageException) {
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      throw SecretStorageException.decryptionFailed(msg)
    }
  }

  async deleteSecret (bundleHash) {
    const key = `${KEY_PREFIX}${bundleHash}`
    const result = await this.backend.removeItem(key)
    return result !== false
  }

  async hasSecret (bundleHash) {
    const raw = await this.backend.getItem(`${KEY_PREFIX}${bundleHash}`)
    return raw !== null
  }

  async listSecrets () {
    const keys = await this.backend.keys()
    const matchingKeys = keys.filter(k => k.startsWith(KEY_PREFIX))
    const results = []

    for (const key of matchingKeys) {
      const raw = await this.backend.getItem(key)
      if (raw) {
        try {
          const payload = JSON.parse(raw)
          if (payload.metadata) {
            results.push(payload.metadata)
          }
        } catch {
          // Ignore unparseable entries
        }
      }
    }

    return results
  }
}

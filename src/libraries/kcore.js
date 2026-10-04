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
 * Optional kcore backend (KnishIO-Crypto-Core through @wishknish/knishio-kcore) for the WOTS+
 * hot paths and ML-KEM.
 *
 * The package is an optionalDependency of this SDK, so npm installs it where it can and the SDK
 * still works where it cannot (or in browsers). Every function returns `null` when kcore is off,
 * missing, or the input is not one it is guaranteed to treat exactly like the pure-JS path, and
 * the caller then runs its existing code.
 *
 * Environment, read on first use:
 *   KNISHIO_KCORE         auto (default) | off | require. `require` turns a failed load into a
 *                         KcoreUnavailable thrown from every call.
 *   KNISHIO_KCORE_MODULE  module specifier or absolute directory to load instead of
 *                         '@wishknish/knishio-kcore'.
 *
 * Loading needs `process.getBuiltinModule` (Node >= 20.16 or 22.3); without it, as in browsers,
 * kcore is simply unavailable.
 */

const ABI_VERSION = 1
const DEFAULT_SPECIFIER = '@wishknish/knishio-kcore'
const HEX = /^[0-9a-f]+$/
const MLKEM_SIZES = {
  1024: { pk: 1568, sk: 3168, ct: 1568 },
  768: { pk: 1184, sk: 2400, ct: 1088 }
}
const SEED_BYTES = 64
const COINS_BYTES = 32

export class KcoreUnavailable extends Error {
  constructor (message) {
    super(message)
    this.name = 'KcoreUnavailable'
  }
}

// Load result: state is null (not attempted), 'off', 'ok' or 'failed'.
let state = null
let lib = null
let reason = null
let mode = 'auto'

function readMode () {
  const value = String(globalThis.process?.env?.KNISHIO_KCORE ?? 'auto').toLowerCase()
  if (value !== 'auto' && value !== 'off' && value !== 'require') {
    throw new Error(`KNISHIO_KCORE must be auto, off or require, got '${value}'`)
  }
  return value
}

function load () {
  const gbm = globalThis.process?.getBuiltinModule
  if (typeof gbm !== 'function') {
    return 'process.getBuiltinModule unavailable (Node >= 20.16 or 22.3 required)'
  }
  const specifier = globalThis.process?.env?.KNISHIO_KCORE_MODULE || DEFAULT_SPECIFIER
  try {
    // The vite CJS/IIFE bundles replace `import.meta` with `{}`; CJS has `__filename` instead.
    const base = typeof __filename === 'string' ? __filename : import.meta.url
    const candidate = gbm('node:module').createRequire(base)(specifier)
    const abi = candidate.abiVersion()
    if (abi !== ABI_VERSION) {
      return `ABI version ${abi}, expected ${ABI_VERSION} (${specifier})`
    }
    lib = candidate
    return null
  } catch (e) {
    return `${e && e.message ? e.message : e} (${specifier})`
  }
}

/**
 * True when kcore is loaded. In `require` mode a failed load throws on every call.
 */
function ensure () {
  if (state === null) {
    mode = readMode()
    if (mode === 'off') {
      state = 'off'
    } else {
      reason = load()
      state = reason === null ? 'ok' : 'failed'
    }
  }
  if (state === 'failed' && mode === 'require') {
    throw new KcoreUnavailable(`kcore unavailable: ${reason}`)
  }
  return state === 'ok'
}

/**
 * Forget the load result so the next call re-reads the environment (tests only).
 */
export function _reset () {
  state = null
  lib = null
  reason = null
  mode = 'auto'
}

/**
 * @return {boolean}
 */
export function available () {
  return ensure()
}

/**
 * @return {'napi'|'wasm'|null}
 */
export function backend () {
  return ensure() ? lib.backend : null
}

function isHex (value, length) {
  return typeof value === 'string' && value.length === length && HEX.test(value)
}

function isBytes (value, length) {
  return value instanceof Uint8Array && value.length === length
}

/**
 * WOTS+ address of a 2048-hex private key (`Wallet.generateAddress`).
 *
 * @param {string} key
 * @return {string|null}
 */
export function wotsAddress (key) {
  if (!ensure() || !isHex(key, 2048)) {
    return null
  }
  try {
    return lib.wotsAddress(key)
  } catch {
    return null
  }
}

/**
 * Advances `counts.length` WOTS+ chains of 128 lowercase hex characters each.
 * `CheckMolecule.ots()` passes peer-supplied text here, so anything outside lowercase hex and
 * integer counts 0..64 stays on the caller's own loop.
 *
 * @param {string} chunks
 * @param {number[]} counts
 * @return {string|null}
 */
export function chainsHex (chunks, counts) {
  if (!ensure()) {
    return null
  }
  const n = Array.isArray(counts) ? counts.length : 0
  if (n < 1 || n > 64 || !isHex(chunks, 128 * n)) {
    return null
  }
  if (!counts.every(c => Number.isInteger(c) && c >= 0 && c <= 64)) {
    return null
  }
  try {
    return lib.chainsHex(chunks, counts)
  } catch {
    return null
  }
}

/**
 * @param {number} set - 1024 or 768
 * @param {Uint8Array} seed - 64 bytes
 * @return {{publicKey: Uint8Array, secretKey: Uint8Array}|null}
 */
export function mlkemKeypair (set, seed) {
  if (!ensure() || !MLKEM_SIZES[set] || !isBytes(seed, SEED_BYTES)) {
    return null
  }
  try {
    return lib.mlkemKeypair(set, seed)
  } catch {
    return null
  }
}

/**
 * Encapsulates against `publicKey` with fresh coins on every call: repeating coins against one
 * key would repeat the ciphertext and the shared secret.
 *
 * @param {number} set - 1024 or 768
 * @param {Uint8Array} publicKey
 * @return {{cipherText: Uint8Array, sharedSecret: Uint8Array}|null}
 */
export function mlkemEncaps (set, publicKey) {
  if (!ensure()) {
    return null
  }
  const sizes = MLKEM_SIZES[set]
  if (!sizes || !isBytes(publicKey, sizes.pk)) {
    return null
  }
  const coins = globalThis.crypto.getRandomValues(new Uint8Array(COINS_BYTES))
  try {
    return lib.mlkemEncaps(set, publicKey, coins)
  } catch {
    return null
  } finally {
    coins.fill(0)
  }
}

/**
 * @param {number} set - 1024 or 768
 * @param {Uint8Array} cipherText
 * @param {Uint8Array} secretKey
 * @return {Uint8Array|null} the 32-byte shared secret
 */
export function mlkemDecaps (set, cipherText, secretKey) {
  if (!ensure()) {
    return null
  }
  const sizes = MLKEM_SIZES[set]
  if (!sizes || !isBytes(cipherText, sizes.ct) || !isBytes(secretKey, sizes.sk)) {
    return null
  }
  try {
    return lib.mlkemDecaps(set, cipherText, secretKey)
  } catch {
    return null
  }
}

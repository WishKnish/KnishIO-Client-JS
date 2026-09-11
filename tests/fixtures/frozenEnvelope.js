/**
 * Copied byte-for-byte from sdks/shared-test-results/cross-platform-test-vectors.json
 * (vectors.secret_storage_envelope.tests[0]). A round-trip test passes regardless of
 * framing casing; this frozen payload proves this SDK reads peer output. Do not regenerate.
 */
export const FROZEN_TS_0_9_7_ENVELOPE = '{"version":1,"ciphertext":"dQjZ4cR+ZBefuF4xSib8Qv/H2oZ5Qv8mRCRmQuLaCDYoBaRMqPQRullxZsID","iv":"3Q8ArAH0ZEgYFpoE","salt":"4LWNzAFGrY4SzcPulKMVcg==","algorithm":"AES-GCM","iterations":100000,"metadata":{"bundleHash":"deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef","label":"probe","createdAt":1788558526546,"hardwareBacked":false,"providerType":"webcrypto-aes-gcm"}}'

export const XSDK_BUNDLE = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
export const XSDK_PASSPHRASE = 'cross-sdk-pass'
export const XSDK_PLAINTEXT = 'MASTER-SECRET-CROSS-SDK-PROBE'

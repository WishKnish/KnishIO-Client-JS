/**
 * Copied byte-for-byte from sdks/shared-test-results/cross-platform-test-vectors.json
 * (vectors.secret_storage_envelope.tests[0] and tests[1]). A round-trip test passes regardless of
 * framing casing; these frozen payloads prove this SDK reads peer output. Pinned by cross-platform-canonical
 * drift guards — do not regenerate.
 */
export const FROZEN_TS_0_9_7_ENVELOPE = '{"version":1,"ciphertext":"dQjZ4cR+ZBefuF4xSib8Qv/H2oZ5Qv8mRCRmQuLaCDYoBaRMqPQRullxZsID","iv":"3Q8ArAH0ZEgYFpoE","salt":"4LWNzAFGrY4SzcPulKMVcg==","algorithm":"AES-GCM","iterations":100000,"metadata":{"bundleHash":"deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef","label":"probe","createdAt":1788558526546,"hardwareBacked":false,"providerType":"webcrypto-aes-gcm"}}'

export const XSDK_BUNDLE = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
export const XSDK_PASSPHRASE = 'cross-sdk-pass'
export const XSDK_PLAINTEXT = 'MASTER-SECRET-CROSS-SDK-PROBE'

export const FROZEN_JS_1_1_0_RECOVERY_ENVELOPE = '{"version":1,"ciphertext":"L5aLK9OsXSQKxUDZYuKp6XRdqgMvmuXo6aphBnzDW7B/DLD0ydx0SByRFJaGyedWvakM","iv":"e1qXQy3KppMCPCfv","salt":"wcTJpsmFGXaMRyyQOcg/Qw==","algorithm":"AES-GCM","iterations":100000,"metadata":{"bundleHash":"deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef","createdAt":1700000000000,"hardwareBacked":false,"providerType":"webcrypto-aes-gcm","label":"backup-recovery"}}'

export const XSDK_RECOVERY_PASSPHRASE = 'recovery-passphrase-restore-42'
export const XSDK_RECOVERY_PLAINTEXT = 'RECOVERY-SECRET-PROBE-MATRIX-BACKUP'
export const XSDK_REENROLLED_PRIMARY_PASSPHRASE = 'xsdk-reenrolled-primary-pass'

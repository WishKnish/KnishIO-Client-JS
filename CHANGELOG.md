# Changelog

All notable changes to the KnishIO Client JS SDK are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Releases are published to npm (`@wishknish/knishio-client-js`) from a git tag.
Conventions for tags, commits, and these entries: `docs/SDK-RELEASE-CONVENTIONS.md`
in the KnishIOClientSDK monorepo.

This file was backfilled on 2026-07-27 from the repository's own tag and commit
history. Entries at and below `0.7.8` are reconstructed from commit messages
rather than written at release time; where the history does not substantiate a
detail, the entry says so instead of guessing.

## [Unreleased]

## [0.9.4] — 2026-09-04

### Added

- **Hardware Envelope Encryption & Secure Memory Provider**: Introduced `SecretStorageException`
  (`src/exception/SecretStorageException.js`).
- **WebCrypto Envelope Encryption Provider** (`src/storage/WebCryptoSecretStorageProvider.js`): AES-GCM
  (256-bit) envelope encryption with PBKDF2-HMAC-SHA256 (100,000 iterations) key derivation, pluggable
  `MemoryStorageBackend`, and auto-zeroized intermediate buffers.
- **In-Memory Storage Provider** (`src/storage/MemorySecretStorageProvider.js`): In-memory storage fallback
  for headless environments and test harnesses.
- **Memory Hygiene & Zeroization Utilities** (`src/libraries/secureMemory.js`): Explicit buffer clearing
  (`zeroizeBytes`), scoped execution (`withSecureBytes`, `withSecureString`), and timing-safe comparison
  (`constantTimeCompare`).
- **KnishIOClient Secret Storage Integration**: `KnishIOClient` accepts `secretStorage` in constructor and
  `initialize()`, provides `setSecretStorage()`, `getSecretStorage()`, and `retrieveSecret()`, and unwraps
  the master secret just-in-time for molecule construction (`createMolecule()`) and auth token refresh
  (`executeQuery()`) without permanently retaining cleartext secrets in client heap memory.
- `Molecule.sign()` default parameter: defaults to `{}` so calling `sign()` without arguments does not throw.

### Changed — cross-SDK gauntlet reporting integrity

- The self-test now publishes cross-validation **coverage**, not just a verdict:
  `crossValidation.{ran,targetsExpected,targetsValidated}` and `runId` sit alongside
  `crossSdkCompatible` in the results file. The boolean alone could not distinguish
  "validated every peer, all passed" from "validated nothing and so found no failures".
- `crossSdkCompatible` now defaults to **false** and must be earned. It was `true`, so every
  early return out of cross-validation published a pass.
- Cross-validation **fails** instead of reporting "compatible" when the shared results
  directory is missing or holds no peer results. Absence of evidence is not evidence of
  compatibility.
- Round 1 no longer asserts a cross-SDK verdict it cannot have.
- A coverage floor is required before a pass: every expected peer must have been validated,
  in addition to no individual check having failed.
- Each peer is now checked for all 7 required molecule types. The validation loop iterates
  the molecule keys that are **present**, so an omitted molecule was indistinguishable from
  a validated one.
- Peer results are matched with `*-results.json`. ``.endsWith('.json')`` also matched the canonical vector
  **masters** living in that directory and fed them into the peer loop as SDK results.

Contract for these fields: `sdks/canonical-test-keys.json` in the KnishIOClientSDK
monorepo. Audit: `docs/audits/REPORTING-INTEGRITY-2026-08-05.md`.

### Changed

- The Round-1 exit code no longer requires `crossSdkCompatible`, a check Round 1 skips by
  design.

### Added

- Yarn Berry pinned via `.yarnrc.yml` and `.yarn/releases/`.
- CI gates a CHANGELOG entry on manifest version bumps.

## [0.9.3] — 2026-07-21

### Fixed

- Stack-safe base64 serialization of ML-KEM keys in `Wallet`: the previous
  `String.fromCharCode.apply(null, bytes)` spread overflowed the JS call stack
  for large encrypted payloads. Now chunked.
- The same overflow in the shared public helpers `hexToBase64`, `base64ToHex`,
  and `chunkArray` (they carried an independent copy of the bug).
- `randomString` was brought onto the same chunked pattern for consistency. Its
  input is capped by the 65 536-byte `crypto.getRandomValues` quota, so it could
  not actually overflow — this is a parity change, not a crash fix.

## [0.9.2] — 2026-07-12

Coordinated dependency-security release across all 8 SDKs. Release record:
`docs/sdk-release-0.9.2-execution-2026-07-12.md` (monorepo).

### Changed

- Replaced the unmaintained dev toolchain (jest 30 + `@swc` transform).

### Added

- `npm audit --omit=dev --audit-level=high` gate in CI.
- Tag-driven publish workflow using npm Trusted Publishing (OIDC); `NPM_TOKEN`
  dropped. The publish job runs in the `release` GitHub environment.

### Notes

- `0.9.1` was staged in `package.json` on 2026-06-30 (a clear error message when
  a node advertises a non-ML-KEM recipient key) but was never tagged and never
  published to npm. That fix ships in `0.9.2`.

## [0.9.0] — 2026-06-29

Coordinated `0.9.0` across all 8 SDKs, marking the post-quantum ML-KEM transport
milestone. Runbook: `docs/sdk-release-audit-2026-06-29.md` (monorepo).

### Added

- **ML-KEM768 CipherHash encrypted transport** plus auth-time conveyance of the
  source wallet's ML-KEM public key (PQ Phase E).
- Multi-recipient stackable (NFT) transfer builder (WP-544).
- Cross-SDK canonical parity vectors in the self-test: `tokenCreation`,
  `walletCreation`, `shadowWalletClaim`, and `mlkem768` keygen + decrypt.
- `buffer_withdraw_conservation` regression lock.
- First CI workflow for this repo (ESLint gate + jest) — the lint gate had been
  local-only and bypassable until now.

### Removed

- Dead `QueryUserActivity` query.
- Dead, non-conserving `addStackableTransfer` (staged as `0.8.3`, never
  published; its removal reaches consumers here).

### Changed

- Refreshed stale 1024-era cross-platform test data to the canonical 2048-hex
  secret.
- The CipherHash round-trip test asserts decrypted payload contents rather than
  only `success()`.

## [0.8.2] — 2026-06-13

### Changed

- Repaired the ESLint configuration and made a clean pass over the sources.

### Added

- Query cancellation support.

## [0.8.1] — 2026-06-13

### Added

- `defaultRequestPolicy` client option — fresh-by-default reads for long-lived
  clients.
- Cross-SDK vector assertions for `atom_value_format` and
  `buffer_deposit_conservation` (the JS SDK is the reference anchor for both),
  plus a shared-master vectors test and a meta-verification test.

### Fixed

- urql `requestPolicy` is now forwarded, so a caller-supplied policy actually
  takes effect (previously silently ignored, yielding stale reads).
- Subscriptions: wonka v3 requires `pipe(..., subscribe(h))` (F-22).

## [0.8.0] — 2026-06-05

Published to npm; no corresponding git tag exists in this repository.

### Changed

- **BREAKING:** `generateSecret` now outputs the canonical 2048-hex secret
  (previously 1024). The 1024 output was a prefix of the 2048 one, so derived
  bundle hashes change for callers that relied on the old length.

### Added

- Patent vector asserting the WOTS+ OTS address under the two-pass protocol
  derivation.

## [0.7.8] — 2026-06-03

Published to npm; no corresponding git tag exists in this repository.

### Fixed

- Policy ContinuID signing (F-3): the R-atom is signed from the established
  source wallet instead of a freshly created one, so policy molecules pass
  ContinuID validation.

### Added

- `setSocketUri`.
- DataBraid embedding-status observability.

## Earlier releases

`0.7.7` and earlier predate this project's conventional-commit discipline; their
commit messages do not support accurate reconstruction. See the git tag history
and the [npm version list](https://www.npmjs.com/package/@wishknish/knishio-client-js?activeTab=versions).

[Unreleased]: https://github.com/WishKnish/KnishIO-Client-JS/compare/v0.9.4...HEAD
[0.9.4]: https://github.com/WishKnish/KnishIO-Client-JS/releases/tag/v0.9.4
[0.9.3]: https://github.com/WishKnish/KnishIO-Client-JS/releases/tag/v0.9.3
[0.9.2]: https://github.com/WishKnish/KnishIO-Client-JS/releases/tag/v0.9.2
[0.9.0]: https://github.com/WishKnish/KnishIO-Client-JS/releases/tag/v0.9.0
[0.8.2]: https://github.com/WishKnish/KnishIO-Client-JS/releases/tag/0.8.2
[0.8.1]: https://github.com/WishKnish/KnishIO-Client-JS/releases/tag/0.8.1
[0.8.0]: https://www.npmjs.com/package/@wishknish/knishio-client-js/v/0.8.0
[0.7.8]: https://www.npmjs.com/package/@wishknish/knishio-client-js/v/0.7.8

#!/usr/bin/env bash
# This repo's CycloneDX SBOM — one definition shared by ci, audit, publish and local runs.
# Usage: bash .github/scripts/sbom.sh [OUT_DIR]   (default sbom-out)
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."
OUT="${1:-sbom-out}"
case "$OUT" in ''|/) echo "SBOM FAIL refusing OUT_DIR '$OUT'" >&2; exit 1 ;; esac
VERSION="$(bash .github/scripts/check-version.sh | sed -n 's/^OK: version is \([^ ]*\).*/\1/p')"
[ -n "$VERSION" ] || { echo "SBOM FAIL could not read the version" >&2; exit 1; }
rm -rf "$OUT"; mkdir -p "$OUT/gen"
# No lockfile is committed: CI materializes package-lock.json with the cooldown resolve first.
[ -f package-lock.json ] || { echo "SBOM FAIL package-lock.json missing — run the cooldown resolve first" >&2; exit 1; }
npm sbom --sbom-format cyclonedx --sbom-type library --omit dev --package-lock-only > "$OUT/gen/npm.cdx.json"
python3 .github/scripts/sbom.py --name knishio-client-js --version "$VERSION" --type library \
  --base "$OUT/gen/npm.cdx.json" --out "$OUT"

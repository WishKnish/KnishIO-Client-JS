#!/usr/bin/env bash
#
# Version consistency gate for the KnishIO JavaScript SDK.
#
#   check-version.sh              -> every place this repo declares its version must agree
#   check-version.sh 0.9.4        -> ...and they must all equal that value (the release tag)
#
# Why this is a script and not inline YAML: a gate that only exists inside a workflow can only
# be exercised by triggering that workflow. This publish workflow runs on tag pushes only, so
# inline logic could not be tested without cutting a real release — the gate would ship
# unproven. As a script it runs locally, in CI on every push, and in the publish job, from one
# definition.
#
# The failure it exists to catch is real: the C++ sibling SDK once shipped a binary reporting
# v0.9.1 after its own manifest had already moved to 0.9.2, and nothing noticed until an
# external audit went looking.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

expected="${1:-}"
# Tolerate a leading 'v' so callers can pass a raw tag ref without pre-stripping.
expected="${expected#v}"

declare -a names=() values=()

collect() {
  names+=("$1")
  values+=("$2")
}

# --- version sources for this repo ------------------------------------------------------
collect "package.json version" \
  "$(sed -n 's/^  "version": *"\([^"]*\)".*/\1/p' package.json | head -1)"
# -----------------------------------------------------------------------------------------

mismatches=()

for i in "${!names[@]}"; do
  if [[ -z "${values[$i]}" ]]; then
    mismatches+=("${names[$i]}: could not parse a version — the source moved or the pattern is stale")
  fi
done

# Every declared source must agree with the first one.
reference="${values[0]}"
for i in "${!names[@]}"; do
  [[ -n "${values[$i]}" ]] || continue
  if [[ "${values[$i]}" != "$reference" ]]; then
    mismatches+=("${names[$i]} is '${values[$i]}' but ${names[0]} is '$reference'")
  fi
done

# And, when a version was supplied, they must all equal it.
if [[ -n "$expected" ]]; then
  for i in "${!names[@]}"; do
    [[ -n "${values[$i]}" ]] || continue
    if [[ "${values[$i]}" != "$expected" ]]; then
      mismatches+=("${names[$i]} is '${values[$i]}' but the expected version is '$expected'")
    fi
  done
fi

for i in "${!names[@]}"; do
  printf '  %-34s %s\n' "${names[$i]}" "${values[$i]:-<unparsed>}"
done
[[ -n "$expected" ]] && printf '  %-34s %s\n' "expected (tag)" "$expected"

if [[ ${#mismatches[@]} -gt 0 ]]; then
  echo "::error::version consistency check FAILED"
  printf '::error::%s\n' "${mismatches[@]}"
  exit 1
fi

echo "OK: version is $reference${expected:+ and matches the expected $expected}"

# Export for downstream workflow steps when running under Actions.
if [[ -n "${GITHUB_OUTPUT:-}" ]]; then
  echo "version=$reference" >> "$GITHUB_OUTPUT"
fi

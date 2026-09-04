#!/usr/bin/env bash
# Fails if `hugo build` emits a deprecation warning that isn't a known
# module-origin one (see known-deprecations.txt). Catches deprecations
# introduced by our own config/templates, and new ones after a Hugo upgrade.
set -uo pipefail
cd "$(dirname "$0")/.."

allowed=$(grep -v '^\s*#' scripts/known-deprecations.txt | grep -v '^\s*$')

# Collect the deprecated API/config key named in each warning.
# Pull the deprecated API/config key out of each warning. Two shapes exist:
#   deprecated: <api> was deprecated in Hugo vX ...
#   deprecated: project config key <key> was deprecated in Hugo vX ...
found=$(hugo build --logLevel warn --renderToMemory 2>&1 \
  | sed -n 's/.*deprecated: \(.*\) was deprecated in Hugo .*/\1/p' \
  | sed 's/^project config key //' \
  | sort -u)

unknown=""
while IFS= read -r item; do
  [ -z "$item" ] && continue
  if ! grep -Fxq "$item" <<<"$allowed"; then
    unknown+="  $item"$'\n'
  fi
done <<<"$found"

if [ -n "$unknown" ]; then
  echo "New deprecation warning(s) not in scripts/known-deprecations.txt:"
  printf '%s' "$unknown"
  echo "Fix them in this repo, or add them to the allowlist if they're upstream."
  exit 1
fi
echo "No new deprecations ($(grep -c . <<<"$allowed") known module warnings allowlisted)."

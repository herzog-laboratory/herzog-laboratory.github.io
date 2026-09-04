#!/usr/bin/env bash
# Fails if `hugo build` emits a deprecation warning that isn't a known
# module-origin one (see known-deprecations.txt). Catches deprecations
# introduced by our own config/templates, and new ones after a Hugo upgrade.
set -uo pipefail
cd "$(dirname "$0")/.."

allowed=$(grep -v '^\s*#' scripts/known-deprecations.txt | grep -v '^\s*$')

# Run the build once and keep both its output and its exit status. Piping hugo
# straight into sed would discard the status and let a build that failed outright
# be reported as "no new deprecations".
output=$(hugo build --logLevel warn --renderToMemory 2>&1)
status=$?

if [ "$status" -ne 0 ]; then
  echo "hugo build failed (exit $status) -- deprecations not checked:"
  printf '%s\n' "$output" | tail -20
  exit "$status"
fi

# Pull the deprecated API/config key out of each warning. Two shapes exist:
#   deprecated: <api> was deprecated in Hugo vX ...
#   deprecated: project config key <key> was deprecated in Hugo vX ...
found=$(printf '%s\n' "$output" \
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

#!/bin/sh
set -eu

config_file=${1:-/etc/gsi-one/supabase-keepalive.env}
. "$config_file"

: "${SUPABASE_URL:?Set SUPABASE_URL in the cron environment file}"
: "${SUPABASE_ANON_KEY:?Set SUPABASE_ANON_KEY in the cron environment file}"

case "$SUPABASE_URL" in
  https://*) ;;
  *) printf '%s\n' 'SUPABASE_URL must use HTTPS.' >&2; exit 1 ;;
esac

response=$(curl --disable --fail --silent --show-error \
  --connect-timeout 5 --max-time 15 --retry 2 --retry-max-time 45 \
  --header "apikey: $SUPABASE_ANON_KEY" \
  "${SUPABASE_URL%/}/rest/v1/rpc/gsi_keepalive")

if [ "$response" != '1' ]; then
  printf '%s\n' 'Supabase keepalive returned an unexpected response.' >&2
  exit 1
fi

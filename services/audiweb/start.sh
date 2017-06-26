#!/bin/sh -e

echo "Starting audiweb"

envsubst < "${VPS_HOME}/services/audiweb/env" > "$DISK_ROOT/audiweb/audiweb/infra/env"

"$DISK_ROOT/audiweb/audiweb/infra/audiweb.sh" start -d


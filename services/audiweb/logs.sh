#!/bin/sh -e

if [ "$1" = "-f" ]; then
  args="-f"
fi

"$DISK_ROOT/audiweb/audiweb/infra/audiweb.sh" logs $args


#!/bin/sh -e

if [ "$1" = "-f" ]; then
  args="-f"
fi

"$DISK_ROOT/vaultage/vaultage/resources/docker-nginx/vaultage.sh" logs $args


#!/bin/sh -e

CHANNEL="latest"

docker image remove "nodered/node-red-docker:$CHANNEL" || echo "already removed"
docker run -d --init -p ${PORT_RED}:1880 --name node-red --restart always -v "$DISK_ROOT/node-red":/data "nodered/node-red-docker:$CHANNEL"

# Not working because owncloud doesn't detect the changes in the filesystem:
# docker run -d --init -p ${PORT_VAULTAGE}:3000 --name vaultage --restart always -u www-data -v "$DISK_ROOT/cloud/data/files/hmil/files/vaultage":/var/www/.vaultage hmil/vaultage

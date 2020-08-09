#!/bin/sh -e

CHANNEL="dev"

docker image remove "hmil/vaultage:$CHANNEL"
docker run -d --init -p ${PORT_VAULTAGE}:3000 --name vaultage --restart always -v "$DISK_ROOT/vaultage":/home/node/.vaultage "hmil/vaultage:$CHANNEL"

# Not working because owncloud doesn't detect the changes in the filesystem:
# docker run -d --init -p ${PORT_VAULTAGE}:3000 --name vaultage --restart always -u www-data -v "$DISK_ROOT/cloud/data/files/hmil/files/vaultage":/var/www/.vaultage hmil/vaultage

#!/bin/sh -e

docker run -d --init -p ${PORT_VAULTAGE}:3000 --name vaultage --restart always -v "$DISK_ROOT/vaultage":/home/node/.vaultage hmil/vaultage
# docker run -d --init -p ${PORT_VAULTAGE}:3000 --name vaultage --restart always -v "/mnt/data/cloud/data/hmil/files/vaultage":/home/node/.vaultage hmil/vaultage

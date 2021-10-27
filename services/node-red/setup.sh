#!/bin/sh -e

CHANNEL="latest"

docker image remove "nodered/node-red-docker:$CHANNEL" || echo "already removed"
docker run -d --init -p ${PORT_RED}:1880 --name node-red --restart always -v "$DISK_ROOT/node-red":/data "nodered/node-red:$CHANNEL"


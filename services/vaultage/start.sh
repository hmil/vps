#!/bin/sh -e

echo "Starting vaultage server"
echo "The port is ${PORT_VAULTAGE}"

"$DISK_ROOT/vaultage/vaultage/resources/docker-nginx/vaultage.sh" start

chown :www-data /mnt/data/vaultage/vaultage/config.php
chmod 660 /mnt/data/vaultage/vaultage/config.php
chmod 600 /mnt/data/vaultage/vaultage/resources/docker-nginx/env


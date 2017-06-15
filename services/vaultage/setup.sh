#!/bin/sh -e

cd "$DISK_ROOT/vaultage"

if [ -e "vaultage" ];
    cd vaultage
    echo "Updating vaultage"
    git pull
else
    echo "Downloading vaultage"
    git clone git@github.com:lbarman/vaultage.git#v3
    cd vaultage
fi

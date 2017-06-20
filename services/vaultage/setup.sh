set -e

cd "$DISK_ROOT/vaultage"

if [ -e "vaultage" ]; then
    cd vaultage
    echo "Updating vaultage"
    git pull
else
    echo "Downloading vaultage"
    git clone "https://github.com/lbarman/vaultage.git"
    cd vaultage
    git checkout v3
fi

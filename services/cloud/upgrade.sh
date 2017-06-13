#!/bin/sh -e

usage() {
  echo "usage: update.sh owncloud-version.tar.bz2"
}

if [ ! -e "$1" ]; then
  echo "File not found"
  usage
  exit 1
fi

cd "${DISK_ROOT}"

echo "> Removing backup dirs..."
rm -rf "cloud_backup"
rm -rf "cloud.old"

echo "> Stopping cloud service..."
"${VPS_HOME}/bin/vps" stop cloud

echo "> Backing up files..."
mkdir "cloud_backup"
mv "cloud/data" "cloud_backup/data"
mv "cloud/config" "cloud_backup/config"
cp -r "cloud_db" "cloud_backup/cloud_db"
mv "cloud" "cloud.old"

echo "> Unpacking archive..."
cp "$1" "cloud.tar.bz2"
tar xjf "cloud.tar.bz2"
mv owncloud cloud
chown -R www-data cloud
rm "cloud.tar.bz2"

echo "> Restoring config and data"
mv "cloud_backup/data" "cloud/data" # This would be too long to copy
rm -rf "cloud/config"
cp -r "cloud_backup/config" "cloud/config"
chown -R www-data "cloud/config"

echo "> Restarting cloud service..."
"${VPS_HOME}/bin/vps" start cloud
sleep 10

echo "> Running upgrade procedure..."
cd "${VPS_HOME}/services/cloud"
docker-compose run --user www-data owncloud php occ upgrade

echo "> Upgrade complete!"

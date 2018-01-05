#!/bin/sh -e


backup() {
  ts=`date +%y.%m.%d-%H.%M`
  echo "backing up $1"
  . "$VPS_HOME/services/$1/backup.config"
  cd "$DISK_ROOT/$1"
  mkdir -p "$BACKUP_DEST/$1"
  zip -r "$BACKUP_DEST/$1/$ts.zip" $BACKUP_INCLUDE
  chown www-data:www-data "$BACKUP_DEST/$1/$ts.zip"
}

. "$VPS_HOME/backup/config"

for i in $BACKUP_TARGETS; do
  backup "$i"
done

# docker exec cloud_owncloud_1 /bin/bash -c 'sudo -u www-data ./occ files:scan --path=hmil/files/backups'
docker exec -u www-data cloud_owncloud_1 /bin/bash -c './occ files:scan --path=hmil/files/backups'

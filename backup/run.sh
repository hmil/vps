#!/bin/sh -e


backup() {
  ts=`date +%y.%m.%d.%H.%M`
  echo "backing up $1"
  . "$VPS_HOME/$1/backup.config"
  cd "$DISK_ROOT/$1"
  mkdir -p "$BACKUP_DEST/$1"
  zip -r "$BACKUP_DEST/$1/$ts.zip" $BACKUP_INCLUDE
}

. "$VPS_HOME/backup/config"

for i in $BACKUP_TARGETS; do
  backup "$i"
done


echo "Setting up cron job"
cronutils update vps_backup "15 10 * * Mon VPS_HOME=\"$VPS_HOME\" \"$VPS_HOME/services/backup/run.sh\""

if [ -e "$VPS_HOME/backup/config" ]; then
  . "$VPS_HOME/backup/config"
fi

echo "Where to backup the files ($BACKUP_DEST)"
read next
if [ ! -z $next ]; then
  BACKUP_DEST="$next"
fi

while : ; do
    echo "currently backed up: $BACKUP_TARGETS"
    echo "What would you like to backup?"
    read next
    echo ""
    [ -z $next ] && break
    if [ -e "$VPS_HOME/$next/backup.config" ]; then
      BACKUP_TARGETS="$BACKUP_TARGETS $next"
    else
      echo "Error: Invalid target\n"
    fi
done

cat > "$VPS_HOME/backup/config" <<EOF
export BACKUP_TARGETS="$BACKUP_TARGETS"
export BACKUP_DEST="$BACKUP_DEST"
export DISK_ROOT="$DISK_ROOT"
EOF

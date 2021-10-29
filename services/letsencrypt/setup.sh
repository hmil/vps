

if [ -z "`which letsencrypt`" ]; then
  apt install python3-pip

  pip3 install certbot
  pip3 install certbot-dns-ovh
fi

if [ ! -e "/var/www/letsencrypt" ]; then
  echo "Creating letsencrypt dir"
  mkdir -p /var/www/letsencrypt
fi

crontab -l | grep letsencrypt >/dev/null
if [ "$?" -ne 0 ]; then
  echo "Setting up cron job"
  cronutils update letsencrypt "28 10,5 * * * letsencrypt renew"
fi

root="root hmil.fr"

setup() {
  if [ ! -e "/var/www/letsencrypt/$1" ]; then
    mkdir "/var/www/letsencrypt/$1"
  fi
  letsencrypt certonly --webroot -w "/var/www/letsencrypt/$1" -d "$2"
}

setup_wildcard() {
  certbot certonly \
    --dns-ovh \
    --dns-ovh-credentials "${DISK_ROOT}/ovh.ini" \
    -d hmil.fr \
    -d *.hmil.fr
}

case $1 in
  "root" )
    setup $root
    ;;
  "wildcard" )
    setup_wildcard
    ;;
  * )
    echo "invalid target: $1"
    ;;
esac

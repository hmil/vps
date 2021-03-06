

if [ -z "`which letsencrypt`" ]; then
  add-apt-repository ppa:certbot/certbot
  apt-get install letsencrypt
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
travel="travel travel.hmil.fr"
files="files files.hmil.fr"
transmission="transmission transmission.hmil.fr"
blog="blog blog.hmil.fr"
cloud="cloud cloud.hmil.fr"
www="www www.hmil.fr"
services="services services.hmil.fr"
mqtt="mqtt mqtt.hmil.fr"
gaston="gaston gaston.hmil.fr"
turingwars="turingwars turingwars.hmil.fr"
red="red red.hmil.fr"

setup() {
  if [ ! -e "/var/www/letsencrypt/$1" ]; then
    mkdir "/var/www/letsencrypt/$1"
  fi
  letsencrypt certonly --webroot -w "/var/www/letsencrypt/$1" -d "$2"
}

setup_wildcard() {
  certbot -a certbot-dns-ovh certonly \
    --dns-ovh \
    --dns-ovh-credentials "${DISK_ROOT}/ovh.ini" \
    -d hmil.fr \
    -d *.hmil.fr
}

case $1 in
  "root" )
    setup $root
    ;;
  "travel" )
    setup $travel
    ;;
  "blog" )
    setup $blog
    ;;
  "files" )
    setup $files
    ;;
  "gaston" )
    setup $gaston
    ;;
  "transmission" )
    setup $transmission
    ;;
  "turingwars" )
    setup $turingwars
    ;;
  "cloud" )
    setup $cloud
    ;;
  "root" )
    setup $root
    ;;
  "mqtt" )
    setup $mqtt
    ;;
  "www" )
    setup $www
    ;;
  "services" )
    setup $services
    ;;
  "red")
    setup $red
    ;;
  "wildcard" )
    setup_wildcard
    ;;
  * )
    echo "invalid target: $1"
    ;;
esac



if [ -z "`which letsencrypt`" ]; then
  apt-get install letsencrypt
fi

if [ ! -e "/var/www/letsencrypt" ]; then
  echo "Creating letsencrypt dir"
  mkdir /var/www/letsencrypt
fi

crontab -l | grep letsencrypt >/dev/null
if [ "$?" -ne 0 ]; then
  echo "Setting up cron job"
  echo "28 10,5 * * * letsencrypt renew" | crontab
fi

travel="travel travel.hmil.fr"
files="files files.hmil.fr"
transmission="transmission transmission.hmil.fr"
blog="blog blog.hmil.fr"
cloud="cloud cloud.hmil.fr"

setup() {
  if [ ! -e "/var/www/letsencrypt/$1" ]; then
    mkdir "/var/www/letsencrypt/$1"
  fi
  letsencrypt certonly --webroot -w "/var/www/letsencrypt/$1" -d "$2"
}

case $1 in
  "travel" )
    setup $travel
    ;;
  "blog" )
    setup $blog
    ;;
  "files" )
    setup $files
    ;;
  "transmission" )
    setup $transmission
    ;;
  "cloud" )
    setup $cloud
    ;;
  "all" )
    setup $travel
    ;;
  * )
    echo "invalid target: $1"
    ;;
esac

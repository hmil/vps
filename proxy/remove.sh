

remove() {
  rm "/etc/nginx/sites-enabled/$1"
}

case "$1" in
  "blog" )
    remove blog
  ;;
  "cloud" )
    remove cloud
  ;;
  "files" )
    remove files
  ;;
  "homepage" )
    remove homepage
  ;;
  "transmission" )
    remove transmission
  ;;
  "travel" )
    remove travel
  ;;
  * )
    echo "invalid target: $1"
    exit 1
  ;;
esac

service nginx reload

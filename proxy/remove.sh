

remove() {
  rm "/etc/nginx/sites-enabled/$1"
}

case "$1" in
  "blog" )
    remove travel
  ;;
  "cloud" )
    remove travel
  ;;
  "files" )
    remove travel
  ;;
  "homepage" )
    remove travel
  ;;
  "transmission" )
    remove travel
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

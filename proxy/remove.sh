

setup() {
  rm "/etc/nginx/sites-enabled/$1"
}

case "$1" in 
  "travel" )
    setup travel
  ;;
  "" )
    setup travel
  ;;
  * )
    echo "invalid target: $1"
    exit 1
  ;;
esac

service nginx reload



setup() {
  cp "$VPS_HOME/proxy/sites/$1" "/etc/nginx/sites-enabled/$1"
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

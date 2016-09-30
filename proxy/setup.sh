

setup() {
  envsubst < "$VPS_HOME/proxy/sites/$1" > "/etc/nginx/sites-enabled/$1"
}

if [ -e "$VPS_HOME/proxy/sites/$1" ]; then
  setup "$1"
else
  echo "invalid target: $1"
  exit 1  
fi

service nginx reload


# Make sure the default site isn't messing around
if [ -e '/etc/nginx/sites-enabled/default' ]; then
  rm -f /etc/nginx/sites-enabled/default
fi

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

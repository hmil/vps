#!/bin/sh -xe

echo "Setting up host"

# Docker setup
apt-get update
apt-get install nginx apt-transport-https ca-certificates

# Docker-compose setup
sh <<EOF
curl -L https://github.com/docker/compose/releases/download/1.25.5/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
EOF

# Utilities
apt-get install zip syslog-ng fail2ban

# Config
cp syslog-ng/*.conf /etc/syslog-ng/conf.d/
cp logrotate/* /etc/logrotate.d/

echo "Done."

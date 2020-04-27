#!/bin/sh -xe

echo "Setting up host"

# Docker setup
apt-get update
apt-get install nginx apt-transport-https ca-certificates
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
sh -c 'echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" > /etc/apt/sources.list.d/docker.list'
apt-get update
apt-get install linux-image-extra-$(uname -r) linux-image-extra-virtual
apt-get install docker-engine
service docker start

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

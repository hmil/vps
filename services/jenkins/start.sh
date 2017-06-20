
cd "$VPS_HOME/services/jenkins"

if [ ! -e "ssh-keys" ]; then
   mkdir -p ssh-keys/master
   mkdir ssh-keys/slave
   ssh-keygen -b 2048 -t rsa -f ssh-keys/master/id_rsa -q -N ""
   cat ssh-keys/master/id_rsa.pub >> ssh-keys/slave/authorized_keys
   chown 10000:10000 ssh-keys/master/*
fi

docker-compose up -d
# Docker adds rules at the beginning of the FORWARD table
# so we want to reload the firewall to make sure the firewall
# rule stays on top
service firewall reload


docker-compose up -d
docker exec -ti cloud_owncloud_1 /bin/bash -c 'apt-get update && apt-get install sudo'
# Docker adds rules at the beginning of the FORWARD table
# so we want to reload the firewall to make sure the firewall
# rule stays on top
service firewall reload


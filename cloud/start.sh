docker-compose up -d
docker exec -ti cloud_owncloud_1 /bin/bash -c 'apt-get update && apt-get install sudo'

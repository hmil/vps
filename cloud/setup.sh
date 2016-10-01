docker-compose up -d cloud_owncloud_1
docker exec -ti owncloud /bin/bash -c 'apt-get update && apt-get install sudo'
docker-compose down

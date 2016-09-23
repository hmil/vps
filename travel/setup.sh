wait_for_mysql() {
  echo "Waiting for mysql..."
  while ! docker exec travel_db_1 sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1;"' >/dev/null; do
    sleep 3
    echo "Mysql is not ready..."
  done
  echo "Mysql is ready!"
}

docker-compose up -d

echo "Would you like to restore a SQL dump (y/N)?"
read input


if [ ! -z "$input" ] && ( [ "$input" = "Y" ] || [ "$input" = "y" ] ); then
  echo "Enter the path to the sql dump"
  read dump_file
  wait_for_mysql
  echo "Applying sql dump"
  docker exec -i travel_db_1 sh -c 'exec mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD"' < "$dump_file"
fi

echo "Patching wordpress config for reverse-proxy"
docker-compose exec wordpress sh -c 'echo "\$_SERVER[\"HTTPS\"]=\$_SERVER[\"HTTPS\"];" >> wp-config.php'

echo "Ensuring folder access rights"
chown -R www-data:www-data "${DISK_ROOT}/travel/wp-content/"

docker-compose down

wait_for_mysql() {
  echo "Waiting for mysql..."
  while ! sudo docker run --link dump:mysql --rm mysql sh -c 'mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -utravel -pu6U7erz3ZxP92Bu' >/dev/null; do
    sleep 3
    echo "Mysql is not ready..."
  done
  echo "Mysql is ready!"
}

if [ -z "$DISK_ROOT" ]; then
  exit 1
fi

echo "Would you like to restore a SQL dump (Y/n)?"
read input

. "$VPS_HOME/env"

if [ -z "$input" ] || [ "$input" = "Y" ] || [ "$input" = "y" ]; then
  echo "Enter the path to the sql dump"
  read dump_file
  echo "Creating mysql container"
  sudo docker run --name dump \
    -v "${DISK_ROOT}/travel/mysql:/var/lib/mysql" \
    -e "MYSQL_ROOT_PASSWORD=${TRAVEL_MYSQL_ROOT_PASSWORD}" \
    -e "MYSQL_DATABASE=${TRAVEL_MYSQL_DATABASE}" \
    -e "MYSQL_USER=${TRAVEL_MYSQL_USER}" \
    -e "MYSQL_PASSWORD=${TRAVEL_MYSQL_PASSWORD}" \
    -d mysql:5.7
  wait_for_mysql
  echo "Applying sql dump"
  sudo docker run -i --link dump:mysql --rm mysql sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -utravel -pu6U7erz3ZxP92Bu' < "$dump_file"
  echo "Cleaning containers"
  sudo docker stop dump
  sudo docker rm dump
fi

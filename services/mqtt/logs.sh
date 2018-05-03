
if [ "$1" = "-f" ]; then
  args="-f"
fi

tail $args /var/log/containers | grep mqtt

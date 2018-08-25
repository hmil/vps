
if [ "$1" = "-f" ]; then
  args="-f"
fi

cd turingwars-infra && docker-compose logs $args


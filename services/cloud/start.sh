docker-compose up -d
# Docker adds rules at the beginning of the FORWARD table
# so we want to reload the firewall to make sure the firewall
# rule stays on top
service firewall reload


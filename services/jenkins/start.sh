
cd "$VPS_HOME/services/jenkins"

# usage: gen_ssh client_dir
# Creates an ssh key for a client in directory client_dir
gen_ssh() {

  client_dir="$1"
  
  mkdir -p "$client_dir"
  if [ ! -e "$client_dir/id_rsa" ]; then
    ssh-keygen -b 2048 -t rsa -f "$client_dir/id_rsa" -q -N ""
  fi
}

# usage: auth_ssh client_dir server_dir
# authorize the client on the server
auth_ssh() {
   
  client_dir="$1"
  server_dir="$2"
   
  mkdir -p "$client_dir"
  mkdir -p "$server_dir"

  echo "" | cat "$client_dir/id_rsa.pub" - >> "$server_dir/authorized_keys"
  # TODO: add server to client's known hosts
}


gen_ssh audiweb/.ssh
auth_ssh audiweb/.ssh audiweb/php/.ssh
chown -R 10000:10000 audiweb/.ssh audiweb/php/.ssh

docker-compose up -d --build
# Docker adds rules at the beginning of the FORWARD table
# so we want to reload the firewall to make sure the firewall
# rule stays on top
service firewall reload


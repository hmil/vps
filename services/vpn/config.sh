#!/bin/sh

usage() {
  echo "Usage: config <add_client | get_client> CLIENT_NAME"
  exit 1
}

add_client() {
  if [ -z "$1" ]; then
    echo "Usage: add_client CLIENT_NAME" 1>&2
    exit 1
  fi
  docker-compose run --rm openvpn easyrsa build-client-full "$1"
}

get_client() {
  if [ -z "$1" ]; then
    echo "Usage: get_client CLIENT_NAME" 1>&2
    exit 1
  fi
  docker-compose run --rm openvpn ovpn_getclient $1 > $1.ovpn
}

rm_client() {
  if [ -z "$1" ]; then
    echo "Usage: rm_client CLIENT_NAME" 1>&2
    exit 1
  fi
  docker-compose run --rm openvpn ovpn_revokeclient $1
}

cmd="$1"
shift
case $cmd in
  "add_client" )
    add_client $@
    ;;
  "get_client" )
    get_client $@
    ;;
  "rm_client" )
    rm_client $@
    ;;
  *)
    usage
    ;;
esac


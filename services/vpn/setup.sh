docker-compose run --rm openvpn ovpn_genconfig -u udp://vpn.hmil.fr:${PORT_VPN}
docker-compose run --rm openvpn ovpn_initpki

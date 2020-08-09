set -e
./firewall

cp ./firewall /etc/init.d/firewall
update-rc.d firewall defaults

set -e
${VPS_HOME}/firewall/firewall

cp ${VPS_HOME}/firewall/firewall /etc/init.d/firewall
update-rc.d firewall defaults

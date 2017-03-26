#!/bin/sh

envsubst < jail.local > /etc/fail2ban/jail.local
cp -f vps.conf /etc/fail2ban/jail.d/
cp -f filters/* /etc/fail2ban/filter.d/

sudo service fail2ban reload

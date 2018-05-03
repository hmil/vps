#!/bin/sh

if [ ! -e "${DISK_ROOT}/gaston/betta-feeder" ]; then
    git clone https://github.com/hmil/betta-feeder.git "${DISK_ROOT}/gaston/betta-feeder"
else
    cd "${DISK_ROOT}/gaston/betta-feeder"
    git pull
fi

cd "${DISK_ROOT}/gaston/betta-feeder/server"
npm install


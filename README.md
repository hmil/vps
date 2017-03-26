VPS infra
=========

Setup:

```
cp env.template env
vim env # Insert your secretz
chmod 600 env
sudo chown root:root env
```

Usage:

```
sudo env VPS_HOME=`pwd` ./bin/vps
```


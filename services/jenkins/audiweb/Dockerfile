FROM "jenkinsci/jnlp-slave"

USER root

RUN apt-get update && apt-get install -y \
    php5-cli \
    wget \
    make \
    --no-install-recommends && rm -r /var/lib/apt/lists/*

USER jenkins


FROM "jenkinsci/jnlp-slave"

USER root

RUN apt-get update && apt-get install -y \
    wget \
    make \
    --no-install-recommends && rm -r /var/lib/apt/lists/*

USER jenkins


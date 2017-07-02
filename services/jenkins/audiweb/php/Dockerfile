FROM php:7.1-cli

RUN apt-get update && apt-get install -y \
		openssh-server \
                wget \
	--no-install-recommends && rm -r /var/lib/apt/lists/*
RUN mkdir /var/run/sshd
RUN echo 'root:test' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile


RUN docker-php-ext-install pdo pdo_mysql
RUN docker-php-ext-enable pdo pdo_mysql

COPY ./php-DEV.ini /usr/local/etc/php/php.ini

ENV HOME /home/jenkins
RUN groupadd -g 10000 jenkins
RUN useradd -c "Jenkins user" -d $HOME -u 10000 -g 10000 -m jenkins

RUN mkdir -p /home/jenkins
RUN chown jenkins:jenkins /home/jenkins

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]


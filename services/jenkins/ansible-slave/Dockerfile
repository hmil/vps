FROM "jenkinsci/jnlp-slave"
MAINTAINER Hadrien Milano <hmil.fr>

#ADD http://releases.ansible.com/ansible/ansible-2.0.0-0.6.rc1.tar.gz /tmp/ansible.tar.gz

#RUN cd /opt \
# && tar xvfz /tmp/ansible.tar.gz \
# && ln -s ansible* ansible \
# && echo "export PATH=/opt/ansible/bin:$PATH" >/etc/profile.d/ansible.sh
USER root

#RUN apt-get update && apt-get install -y --no-install-recommends \
#		software-properties-common
#RUN apt-add-repository ppa:ansible/ansible
RUN apt-get update && apt-get install -y --no-install-recommends \
		ansible
RUN rm -rf /var/lib/apt/lists/*;

USER jenkins

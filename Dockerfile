FROM node:boron

RUN mkdir /opt; cd /opt; mkdir reTHINK; cd reTHINK; mkdir dev-protostubs;

# Copy all the source of dev-protostubs to inside the docker
COPY . /opt/reTHINK/dev-protostubs/

# Change the work directory
WORKDIR /opt/reTHINK/dev-protostubs

# Install app dependencies
RUN npm install

FROM node:boron

COPY . /home/dev-protostubs

# Change the work directory
WORKDIR /home/dev-protostubs

# preinstall
RUN node bin/preinstall

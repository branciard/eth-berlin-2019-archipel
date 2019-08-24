FROM node:11-alpine

RUN apk add --no-cache git

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm install
RUN npm run build
RUN npm -g install . --no-optional

ENTRYPOINT ["orchestrator"]

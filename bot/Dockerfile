FROM node:latest

WORKDIR /app

COPY ./app/ .

RUN apt-get update && apt install npm -y
RUN npm ci

CMD ["node", "index.js"]

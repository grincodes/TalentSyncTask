FROM node:20-buster-slim

WORKDIR /usr/src


COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


CMD ["node", "dist/main"]

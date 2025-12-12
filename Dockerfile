FROM node:lts-alpine3.22

COPY . .

RUN npm ci

CMD ["npm", "run", "dev"]

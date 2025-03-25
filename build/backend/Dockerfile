FROM node:23-alpine

WORKDIR /app
COPY ./package.json .
RUN npm install

COPY ./app.js .
COPY ./models ./models
COPY ./middlewares ./middlewares
COPY ./db ./db
COPY ./routes ./routes
COPY ./public ./public
CMD npm start
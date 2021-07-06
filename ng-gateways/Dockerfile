FROM node:14.16-alpine as build

WORKDIR /usr/src/app/web

COPY ./package*.json ./
COPY ./angular.json ./
COPY ./tsconfig.app.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.spec.json ./
COPY ./karma.conf.js ./

RUN npm install && npm audit fix

COPY . ./

# change for npm run build for production
RUN npm ci && npm run build:dev

FROM nginx:alpine

COPY --from=build /usr/src/app/web/dist/gateways /usr/share/nginx/html/app

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/web.conf /etc/nginx/conf.d/

EXPOSE 9000

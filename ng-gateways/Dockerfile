FROM node:alpine as development

WORKDIR /usr/src/app

COPY ./ng-gateways/package*.json ./
COPY ./ng-gateways/angular.json ./

RUN npm install --only=development

COPY . .

RUN npm ci && npm run build:dev

FROM nginx:alpine

COPY --from=development /usr/src/app/dist/ng-gateways /usr/share/nginx/html

EXPOSE 80

FROM node:alpine as production

WORKDIR /usr/src/app

COPY ./ng-gatewayspackage*.json ./
COPY ./ng-gateways/angular.json ./

RUN npm install --only=development

COPY . .

RUN npm ci && npm run build

FROM nginx:alpine

COPY --from=development /usr/src/app/dist/ng-gateways /usr/share/nginx/html

EXPOSE 80

FROM node:alpine AS development

WORKDIR /usr/src/app

COPY ./gateways/package*.json ./
COPY ./gateways/.env.example ./.env

RUN npm -g install npm@7.19.1 && npm install

COPY . .

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./gateways/package*.json ./
COPY ./gateways/.env.example ./.env

RUN npm -g install npm@7.19.1 && npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
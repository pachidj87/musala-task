FROM node:14.16-alpine AS development

WORKDIR /usr/src/app/api

COPY ./package*.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./
COPY ./nest-cli.json ./

RUN npm install

COPY . ./

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app/api

COPY ./package*.json ./
COPY ./tsconfig.build.json ./
COPY ./tsconfig.json ./
COPY ./nest-cli.json ./

RUN npm install --omit=dev

COPY . ./

COPY --from=development /usr/src/app/api/dist ./dist

CMD ["node", "dist/main"]

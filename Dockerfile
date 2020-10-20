FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json /app
RUN npm ci

COPY . /app
RUN npm run build

FROM node:lts-alpine

WORKDIR /app
RUN npm install -g serve --silent

COPY --from=builder /app/build /app

EXPOSE 8080
CMD ["serve", "-p", "8080", "-s", "/app"]
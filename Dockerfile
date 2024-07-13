FROM node:lts AS builder

WORKDIR /root
ARG BASE_URL /
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM thesilican/httpd

COPY --from=builder /root/dist /public

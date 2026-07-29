FROM node:24.12.0-alpine

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .
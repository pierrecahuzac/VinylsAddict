FROM node:25-alpine

WORKDIR /api

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 33000

CMD ["pnpm", "start"]
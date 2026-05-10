FROM node:22-alpine

WORKDIR /api

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./


RUN pnpm install --ignore-scripts
COPY . .
RUN pnpm prisma generate
EXPOSE 33000

CMD ["pnpm",  "start"]
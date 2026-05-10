FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install --ignore-scripts

COPY . .

EXPOSE 55173

CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "55173"]

FROM node:22-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 33000

CMD ["npm", "start"]

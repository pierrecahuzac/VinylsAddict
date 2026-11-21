FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_BACKEND_URL_DEV=https://api.partagetacollection.eu/api
ENV VITE_BACKEND_URL_DEV=$VITE_BACKEND_URL_DEV
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/vite.config.ts ./vite.config.ts
COPY --from=build /app/dist ./dist
EXPOSE 55173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "55173"]

FROM node:18-alpine AS backend

WORKDIR /app/server
COPY server/server/package*.json ./
RUN npm install --only=production

COPY server/server/ ./

FROM node:18-alpine AS frontend

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

# Copy backend
COPY --from=backend /app/server ./server
# Copy frontend build
COPY --from=frontend /app/client/build ./server/public

WORKDIR /app/server

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "app.js"]
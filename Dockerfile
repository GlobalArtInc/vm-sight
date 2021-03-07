FROM node:alpine AS ui-build
WORKDIR /app
COPY client/ ./client/
RUN cd client && npm install && npm run build

FROM node:alpine AS server-build
WORKDIR /app
COPY --from=ui-build /app/client/dist ./client/dist
COPY api ./api/
RUN cd api && npm install
COPY api/server.js ./api/

EXPOSE 3600

CMD ["node", "./api/server.js"]
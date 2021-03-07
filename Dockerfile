FROM node:10 AS ui-build
WORKDIR /usr/src/app
COPY backend/ ./backend/
RUN cd backend && yarn && yarn build

FROM node:10 AS server-build
WORKDIR /root/
COPY --from=ui-build /usr/src/app/frontend/build ./frontend/build
COPY backend/package*.json ./backend/
RUN cd backend && yarn
COPY backend/server.js ./backend/

EXPOSE 3080

CMD ["node", "./backend/server.js"]
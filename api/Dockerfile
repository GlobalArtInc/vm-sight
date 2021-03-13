FROM node:alpine
WORKDIR /app
COPY . .
RUN yarn
 
EXPOSE 3600
CMD ["node", "./server.js"]
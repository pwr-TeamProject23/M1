FROM node:20-alpine as builder

WORKDIR /app

COPY . .

RUN npm install && npm run build



FROM nginx:alpine as deployment

ENV NODE_ENV=production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
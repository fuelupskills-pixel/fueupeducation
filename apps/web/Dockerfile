FROM node:18-alpine AS runner

WORKDIR /app

COPY apps/web/package.json ./
RUN npm install

COPY apps/web/next.config.js ./
COPY apps/web/app ./app
COPY apps/web/components ./components
COPY apps/web/public ./public

EXPOSE 3000

CMD ["npm", "run", "dev"]

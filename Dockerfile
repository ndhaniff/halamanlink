FROM node:22-alpine AS build
WORKDIR /app

ARG APP_DOMAIN=localhost
ARG APP_URL=http://localhost:4321

ENV APP_DOMAIN=$APP_DOMAIN
ENV APP_URL=$APP_URL
ENV ASTRO_DATABASE_FILE=/tmp/astro-build.db

COPY package*.json ./
RUN npm ci

COPY . .
RUN mkdir -p /tmp && npm run build

FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
ENV ASTRO_DATABASE_FILE=/app/data/content.db
ENV UPLOAD_DIR=/app/data/uploads

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /tmp/astro-build.db /app/db-init/content.db
COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN chmod +x /app/docker-entrypoint.sh && mkdir -p /app/data /app/data/uploads/avatars /app/db-init

VOLUME ["/app/data"]

EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4321/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/app/docker-entrypoint.sh"]

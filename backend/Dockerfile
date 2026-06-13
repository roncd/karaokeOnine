# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base

ARG BUILD_VERSION=local
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown

LABEL org.opencontainers.image.title="backend" \
  org.opencontainers.image.description="Backend karaoké O'nine" \
  org.opencontainers.image.version="${BUILD_VERSION}" \
  org.opencontainers.image.revision="${VCS_REF}" \
  org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.source="https://github.com/roncd/karaokeOnine"

WORKDIR /app

ENV NODE_ENV=production \
  PORT=3000

FROM base AS dependencies

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --omit=dev --prefer-offline --no-audit --no-fund

FROM base AS runtime

RUN --mount=type=cache,target=/var/cache/apk \
  apk update \
  && apk upgrade --no-cache openssl libcrypto3 libssl3 \
  && rm -rf /var/cache/apk/* \
  && addgroup -S app && adduser -S app -G app

COPY --from=dependencies --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app package*.json ./
COPY --chown=app:app src ./src
COPY --chown=app:app assets ./assets

ARG CACHE_BUST

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]

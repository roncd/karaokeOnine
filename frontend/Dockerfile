# syntax=docker/dockerfile:1.7

# Build pour le web
FROM node:20-alpine AS base

ARG BUILD_VERSION=local
ARG VCS_REF=unknown
ARG BUILD_DATE=unknown

LABEL org.opencontainers.image.title="frontend" \
  org.opencontainers.image.description="Fronted karaoké O'nine" \
  org.opencontainers.image.version="${BUILD_VERSION}" \
  org.opencontainers.image.revision="${VCS_REF}" \
  org.opencontainers.image.created="${BUILD_DATE}" \
  org.opencontainers.image.source="https://github.com/roncd/karaokeOnine"

WORKDIR /app

FROM base AS dependencies

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
  npm ci --prefer-offline --no-audit --no-fund

FROM dependencies AS builder

ARG EXPO_PUBLIC_API_URL
ARG CACHE_BUST

ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL \
  EXPO_NO_TELEMETRY=1 \
  CI=1

COPY app.json index.js App.js ./
COPY assets ./assets
COPY src ./src

RUN npx expo export --platform web

FROM dependencies AS dev

ARG EXPO_PUBLIC_API_URL

ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL \
  EXPO_NO_TELEMETRY=1

COPY app.json index.js App.js ./
COPY assets ./assets
COPY src ./src

EXPOSE 8081

CMD ["npx", "expo", "start", "--web", "--port", "8081", "--host", "lan"]

FROM nginx:alpine AS runtime

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

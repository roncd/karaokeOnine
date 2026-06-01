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

RUN addgroup -S app && adduser -S app -G app

FROM base AS dependencies
COPY package*.json ./
RUN npm ci \
  && npm cache clean --force

FROM dependencies AS builder
COPY . .

RUN npx expo export --platform web

FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
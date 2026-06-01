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

RUN addgroup -S app && adduser -S app -G app

FROM base AS dependencies

COPY package*.json ./
RUN npm ci --omit=dev \
  && mkdir -p node_modules \
  && npm cache clean --force

FROM base AS runtime

COPY --from=dependencies --chown=app:app /app/node_modules ./node_modules
COPY --chown=app:app package*.json ./

COPY --chown=app:app src ./src

USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/app.js"]
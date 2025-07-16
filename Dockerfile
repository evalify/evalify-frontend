# Staging dockerfile
FROM node:20.9.0-bullseye-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN npm run build

FROM node:20.9.0-bullseye-slim AS runner

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=7070
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
EXPOSE 7070
HEALTHCHECK --interval=60s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:7070/api/health || exit 1
CMD ["npm", "start"]


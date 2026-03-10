# Stage 1: Build
FROM oven/bun:1 AS build
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Serve
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html \
 && chown -R nginx:nginx /var/cache/nginx \
 && chown -R nginx:nginx /var/log/nginx \
 && touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid \
 && sed -i 's/^user  nginx;/#user  nginx;/' /etc/nginx/nginx.conf \
 && mkdir -p /tmp/nginx && chown nginx:nginx /tmp/nginx

EXPOSE 8080

USER nginx

HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

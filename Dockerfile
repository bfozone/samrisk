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

# OpenShift runs containers as non-root with arbitrary UIDs
RUN chown -R nginx:0 /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    chmod -R g+w /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

EXPOSE 8080
USER 1001

CMD ["nginx", "-g", "daemon off;"]

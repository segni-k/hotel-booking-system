#!/bin/sh
set -e

cd /var/www/html

# Render provides $PORT; default to 10000 if not set
export PORT="${PORT:-10000}"
echo "==> Binding to port $PORT"

# Inject PORT into nginx config
sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/http.d/default.conf

# Generate app key if not set
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Create storage symlink
php artisan storage:link --force 2>/dev/null || true

# Cache configuration for production
php artisan config:cache
php artisan route:cache

# Only cache views if the directory exists and has files
if [ -d "resources/views" ] && [ "$(ls -A resources/views 2>/dev/null)" ]; then
    php artisan view:cache
fi

# Run migrations
php artisan migrate --force

# Seed database (only if tables are empty)
php artisan db:seed --force 2>/dev/null || true

echo "==> Application ready!"

exec "$@"

FROM php:8.4-fpm

WORKDIR /var/www

# system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring

# install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copy app FIRST (important fix)
COPY . .

# install dependencies AFTER full code exists
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# permissions (important for Laravel)
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
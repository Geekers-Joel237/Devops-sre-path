# Stratégie B : Découplée (Nginx + PHP-FPM)
FROM php:8.2-fpm

# 1. Installation des dépendances système et extensions PHP
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && docker-php-ext-install pdo_pgsql zip bcmath

# 2. Configuration PHP
WORKDIR /var/www/html

# 3. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Copie des fichiers de l'application
# Le .dockerignore exclut le .env local et le dossier vendor
COPY . .

# 5. Création du fichier .env de base (Fallback)
# On copie l'exemple pour avoir la structure, les variables réelles seront injectées par Docker
RUN cp .env.example .env

# 6. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 7. Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

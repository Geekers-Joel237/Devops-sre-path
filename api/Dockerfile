# Stratégie B : Découplée (Nginx + PHP-FPM)
FROM php:8.2-fpm

# 1. Installation des dépendances système et extensions PHP
# (Identique à avant, sauf qu'on n'a plus besoin des outils Apache)
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    git \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && docker-php-ext-install pdo_pgsql zip bcmath

# 2. Configuration PHP
# On définit le dossier de travail
WORKDIR /var/www/html

# 3. Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 4. Copie des fichiers de l'application
COPY . .

# 5. Installation des dépendances PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 6. Permissions
# PHP-FPM tourne aussi sous www-data par défaut
RUN chown -R www-data:www-data storage bootstrap/cache

# Note : On n'expose pas de port ici, car PHP-FPM écoute sur le port 9000 par défaut
# et on ne veut pas qu'il soit accessible directement depuis l'extérieur.

FROM php:8.2-fpm-alpine

ARG user=www-data
ARG uid=1000

# Configurações de PHP otimizadas para produção
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini \
    && echo "opcache.enable=1" > /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.interned_strings_buffer=8" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=4000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=60" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.fast_shutdown=1" >> /usr/local/etc/php/conf.d/opcache.ini

# Instalar dependências usando apk (gerenciador de pacotes do Alpine)
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    npm \
    bash

# Instalar extensões PHP
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    opcache

# Instalar Node.js via apk
RUN apk add --no-cache nodejs

# Atualizar npm para uma versão específica
RUN npm install -g npm@10.8.2

# Copiar Composer do imagem oficial
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configurar usuário www-data com UID específico
RUN deluser www-data || true && \
    addgroup -g $uid -S www-data && \
    adduser -u $uid -S -D -H -h /var/www -s /sbin/nologin -G www-data www-data

# Criar diretórios necessários e configurar permissões
RUN mkdir -p /var/www/storage/logs && \
    mkdir -p /var/www/storage/framework/cache && \
    mkdir -p /var/www/storage/framework/sessions && \
    mkdir -p /var/www/storage/framework/views && \
    mkdir -p /var/www/bootstrap/cache && \
    chmod -R 775 /var/www/storage && \
    chmod -R 775 /var/www/bootstrap/cache && \
    chown -R www-data:www-data /var/www

# Criar diretório home para composer
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Criar script de inicialização
RUN echo '#!/bin/sh\n\
mkdir -p /var/www/storage/logs\n\
mkdir -p /var/www/storage/framework/cache\n\
mkdir -p /var/www/storage/framework/sessions\n\
mkdir -p /var/www/storage/framework/views\n\
mkdir -p /var/www/bootstrap/cache\n\
chmod -R 777 /var/www/storage\n\
chmod -R 777 /var/www/bootstrap/cache\n\
chown -R www-data:www-data /var/www/storage\n\
chown -R www-data:www-data /var/www/bootstrap/cache\n\
# Otimizações para produção\n\
if [ "$APP_ENV" = "production" ]; then\n\
  php artisan config:cache || true\n\
  php artisan route:cache || true\n\
  php artisan view:cache || true\n\
  php artisan event:cache || true\n\
fi\n\
exec php-fpm\n\
' > /usr/local/bin/start-container && \
    chmod +x /usr/local/bin/start-container

WORKDIR /var/www

# Definir o script de inicialização como ponto de entrada
CMD ["/usr/local/bin/start-container"]
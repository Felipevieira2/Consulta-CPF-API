FROM php:8.2-fpm

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

# Modificado: Separando a atualização e instalação para evitar problemas com o script de pós-atualização
RUN apt-get update || true
RUN apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    gnupg \
    lsb-release

# Instalar Node.js e npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - || true
RUN apt-get install -y nodejs || true
RUN npm install -g npm@10.8.2 || true

# Modificado: Usando comandos separados e ignorando erros
RUN apt-get clean || true
RUN rm -rf /var/lib/apt/lists/* || true
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd opcache

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN usermod -u $uid $user && \
    groupmod -g $uid $user

# Adiciona comandos para configurar permissões do storage
RUN mkdir -p /var/www/storage/logs && \
    chmod -R 775 /var/www/storage && \
    chown -R $user:$user /var/www/storage

# Cria um script de inicialização para configurar permissões a cada inicialização
RUN echo '#!/bin/bash\n\
mkdir -p /var/www/storage/logs\n\
chmod -R 777 /var/www/storage\n\
chown -R www-data:www-data /var/www/storage\n\
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

RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

WORKDIR /var/www

# Define o script de inicialização como ponto de entrada
CMD ["/usr/local/bin/start-container"]
# Usar Alpine como base - muito mais leve
FROM alpine:3.18

# Instalar PHP e Apache
RUN apk add --no-cache \
    php82 \
    php82-fpm \
    php82-gd \
    php82-mysqli \
    php82-pdo \
    php82-pdo_mysql \
    php82-mbstring \
    php82-exif \
    php82-bcmath \
    php82-zip \
    php82-opcache \
    php82-xml \
    php82-curl \
    php82-redis \
    apache2 \
    nodejs \
    npm \
    mysql-client \
    git \
    curl \
    unzip \
    zip

# Configurar o Apache
RUN mkdir -p /run/apache2

# Configurar e rodar PHP-FPM
RUN mkdir -p /run/php

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalar dependências do sistema
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    mariadb-client \
    && rm -rf /var/cache/apk/*

# Configurar e instalar extensões PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    gd \
    mysqli \
    pdo \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    zip \
    opcache

# Copiar a configuração do Apache
COPY apache-config.conf /etc/apache2/conf-available/apache-config.conf

# Habilitar a configuração do Apache
RUN a2enconf apache-config

# Definir diretório de trabalho
WORKDIR /var/www/html

# Copiar a aplicação Laravel
COPY . /var/www/html

# Dar permissões corretas para os diretórios do Laravel
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# Instalar dependências do Laravel
RUN composer install --no-interaction --no-dev --optimize-autoloader

# Copiar o arquivo .env de exemplo (se não existir um .env)
RUN if [ ! -f .env ]; then cp .env.example .env; fi

# Gerar chave da aplicação
RUN php artisan key:generate

# Copiar o script de inicialização
COPY init.sh /usr/local/bin/init.sh
RUN chmod +x /usr/local/bin/init.sh

# Expor portas
EXPOSE 80 9000

# Criar script para iniciar tanto o Apache quanto o PHP-FPM
RUN echo '#!/bin/bash\n\
service apache2 start\n\
/usr/local/bin/init.sh\n\
php-fpm' > /usr/local/bin/start-services.sh \
    && chmod +x /usr/local/bin/start-services.sh

# Iniciar Apache e PHP-FPM
CMD ["/usr/local/bin/start-services.sh"] 


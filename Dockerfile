# Usando uma imagem base do PHP com Apache
FROM php:8.2-apache

# Atualiza os pacotes e instala dependências necessárias
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    default-mysql-client \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

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

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Habilitar módulos necessários do Apache
RUN a2enmod rewrite headers expires deflate

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

# Instalar o módulo Redis
RUN pecl install redis && docker-php-ext-enable redis

# Expor portas
EXPOSE 80

# Criar script para iniciar o Apache
RUN echo '#!/bin/bash\n\
service apache2 start\n\
/usr/local/bin/init.sh' > /usr/local/bin/start-services.sh \
    && chmod +x /usr/local/bin/start-services.sh

# Iniciar Apache
CMD ["/usr/local/bin/start-services.sh"]
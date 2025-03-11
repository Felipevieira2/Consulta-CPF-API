FROM php:8.2-fpm

ARG user=www-data
ARG uid=1000

RUN apt update && apt install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    gnupg \
    lsb-release

# Instalar Node.js e npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs && \
    npm install -g npm@10.8.2

RUN apt clean && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

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
exec php-fpm\n\
' > /usr/local/bin/start-container && \
    chmod +x /usr/local/bin/start-container

RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

WORKDIR /var/www

# Remova a linha USER $user para que o script de inicialização seja executado como root
# USER $user

# Define o script de inicialização como ponto de entrada
CMD ["/usr/local/bin/start-container"]
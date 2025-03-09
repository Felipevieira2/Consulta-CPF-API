#!/bin/bash

# Esperar o MySQL estar disponível usando PHP
echo "Aguardando MySQL..."
while ! php -r "try { new PDO('mysql:host=db;dbname=app_db', 'app_user', 'app_password'); echo 'Conectado!'; } catch (PDOException \$e) { exit(1); }" > /dev/null 2>&1; do
    echo "Tentando conectar ao MySQL..."
    sleep 2
done
echo "MySQL disponível!"

# Limpar cache
php artisan cache:clear
php artisan config:clear

# Executar migrações
php artisan migrate --force

# Executar seeders (opcional, descomente se necessário)
# php artisan db:seed --force

# Otimizar (opcional para produção)
# php artisan optimize

echo "Aplicação Laravel inicializada com sucesso!"

# Iniciar Apache em primeiro plano
exec apache2-foreground 
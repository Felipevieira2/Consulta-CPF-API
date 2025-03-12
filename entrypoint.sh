#!/bin/bash
set -e

if [ -z "$(ls -A /var/lib/mysql)" ]; then
    echo "Diretório de dados vazio. Inicializando o banco de dados..."
    mysqld --initialize-insecure
fi

exec "$@"
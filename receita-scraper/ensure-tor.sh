#!/bin/bash
# Script para garantir que TOR está rodando antes de usar o scraper

# Verificar se TOR está rodando
if pgrep -x "tor" > /dev/null; then
    echo "✅ TOR já está rodando"
    exit 0
fi

# Se não estiver, verificar se está instalado
if ! command -v tor &> /dev/null; then
    echo "📦 Instalando TOR..."
    apt update -qq
    apt install -y tor -qq
fi

# Iniciar TOR
echo "🚀 Iniciando TOR..."
mkdir -p /var/lib/tor /var/log/tor
chmod 700 /var/lib/tor /var/log/tor
tor > /var/log/tor/tor.log 2>&1 &

# Aguardar inicializar
echo "⏳ Aguardando TOR inicializar..."
for i in {1..10}; do
    if netstat -tuln 2>/dev/null | grep -q 9050 || ss -tuln 2>/dev/null | grep -q 9050; then
        echo "✅ TOR iniciado com sucesso!"
        exit 0
    fi
    sleep 1
done

echo "❌ TOR não iniciou no tempo esperado"
echo "📋 Ver logs: cat /var/log/tor/tor.log"
exit 1


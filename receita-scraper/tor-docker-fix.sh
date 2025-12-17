#!/bin/bash
# Script de correção rápida do TOR no Docker
# Execute: bash tor-docker-fix.sh

clear
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🧅 TOR DOCKER - CORREÇÃO RÁPIDA                         ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 1. Instalar TOR se necessário
if ! command -v tor &> /dev/null; then
    echo "📦 Instalando TOR..."
    apt update -qq
    apt install -y tor net-tools curl -qq
    echo "✅ TOR instalado"
else
    echo "✅ TOR já está instalado"
fi
echo ""

# 2. Parar qualquer instância anterior
echo "🛑 Limpando processos anteriores..."
pkill -9 tor 2>/dev/null || true
sleep 2
echo "✅ Limpo"
echo ""

# 3. Criar configuração mínima
echo "📝 Configurando TOR..."
mkdir -p /var/lib/tor /var/log/tor
chmod 700 /var/lib/tor /var/log/tor
cat > /etc/tor/torrc << 'EOF'
User root
DataDirectory /var/lib/tor
Log notice file /var/log/tor/log
SOCKSPort 0.0.0.0:9050
EOF
echo "✅ Configurado"
echo ""

# 4. Iniciar TOR
echo "🚀 Iniciando TOR..."
tor -f /etc/tor/torrc > /var/log/tor/log 2>&1 &
echo "   Aguardando inicialização..."
sleep 8
echo "✅ TOR iniciado"
echo ""

# 5. Verificar
echo "🔍 Verificando..."
if netstat -tuln 2>/dev/null | grep -q 9050 || ss -tuln 2>/dev/null | grep -q 9050; then
    echo "✅ Porta 9050 aberta"
else
    echo "❌ Porta 9050 não abriu"
    echo "   Veja: cat /var/log/tor/log"
    exit 1
fi
echo ""

# 6. Testar
echo "🧪 Testando conexão..."
sleep 3
IP_TOR=$(curl -s --connect-timeout 10 --socks5-hostname 127.0.0.1:9050 https://api.ipify.org 2>&1)

if [ $? -eq 0 ] && [ ! -z "$IP_TOR" ] && [ "$IP_TOR" != "curl"* ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ TOR FUNCIONANDO!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🧅 Seu IP TOR: $IP_TOR"
    echo "🔒 Seu IP real está oculto!"
    echo ""
    echo "💡 Próximos passos:"
    echo "   cd /app/receita-scraper"
    echo "   npm run test:tor:linux:visual"
else
    echo "❌ Erro ao testar: $IP_TOR"
    echo ""
    echo "📋 Últimas linhas do log:"
    tail -n 20 /var/log/tor/log
    exit 1
fi


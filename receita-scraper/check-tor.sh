#!/bin/bash

echo "🔍 Diagnóstico do TOR"
echo "===================="
echo ""

# 1. Verificar se TOR está instalado
echo "1️⃣ Verificando instalação do TOR..."
if command -v tor &> /dev/null; then
    echo "   ✅ TOR está instalado"
    tor --version | head -n 1
else
    echo "   ❌ TOR NÃO está instalado"
    echo "   💡 Instale: apt update && apt install -y tor"
fi
echo ""

# 2. Verificar se o serviço está rodando
echo "2️⃣ Verificando serviço TOR..."
if systemctl is-active --quiet tor 2>/dev/null; then
    echo "   ✅ Serviço TOR está ativo"
    systemctl status tor --no-pager | head -n 5
elif pgrep -x "tor" > /dev/null; then
    echo "   ✅ Processo TOR está rodando"
    ps aux | grep tor | grep -v grep
else
    echo "   ❌ TOR NÃO está rodando"
    echo "   💡 Inicie: systemctl start tor"
    echo "   💡 Ou manual: tor --defaults-torrc /usr/share/tor/tor-service-defaults-torrc -f /etc/tor/torrc &"
fi
echo ""

# 3. Verificar porta 9050
echo "3️⃣ Verificando porta 9050..."
if netstat -tuln 2>/dev/null | grep -q 9050; then
    echo "   ✅ Porta 9050 está aberta"
    netstat -tuln | grep 9050
elif ss -tuln 2>/dev/null | grep -q 9050; then
    echo "   ✅ Porta 9050 está aberta"
    ss -tuln | grep 9050
else
    echo "   ❌ Porta 9050 NÃO está aberta"
    echo "   💡 TOR não está escutando na porta"
fi
echo ""

# 4. Verificar se está em Docker
echo "4️⃣ Verificando ambiente..."
if [ -f /.dockerenv ] || grep -q docker /proc/1/cgroup 2>/dev/null; then
    echo "   📦 Rodando dentro de Docker"
    echo "   💡 Pode precisar de configurações especiais"
else
    echo "   🖥️ Rodando no host"
fi
echo ""

# 5. Ver logs do TOR (se existir)
echo "5️⃣ Últimos logs do TOR..."
if [ -f /var/log/tor/log ]; then
    echo "   📋 Logs encontrados:"
    tail -n 10 /var/log/tor/log | sed 's/^/   /'
else
    echo "   ⚠️ Arquivo de log não encontrado"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 SOLUÇÕES RÁPIDAS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔧 Para instalar TOR:"
echo "   apt update && apt install -y tor"
echo ""
echo "🚀 Para iniciar TOR (método 1 - systemd):"
echo "   systemctl start tor"
echo ""
echo "🚀 Para iniciar TOR (método 2 - manual):"
echo "   tor &"
echo ""
echo "🚀 Para iniciar TOR em Docker (método 3):"
echo "   tor --defaults-torrc /usr/share/tor/tor-service-defaults-torrc -f /etc/tor/torrc &"
echo ""
echo "🔍 Para testar conexão:"
echo "   curl --socks5-hostname 127.0.0.1:9050 https://api.ipify.org"
echo ""


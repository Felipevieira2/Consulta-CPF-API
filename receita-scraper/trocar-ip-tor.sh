#!/bin/bash
# Script para trocar o IP do TOR (novo circuito)

echo "🔄 Trocando circuito TOR..."

# Ver IP atual
echo "📍 IP TOR atual:"
IP_ANTES=$(curl -s --connect-timeout 10 --socks5-hostname 127.0.0.1:9050 https://api.ipify.org 2>/dev/null || echo "Não detectado")
echo "   $IP_ANTES"
echo ""

# Parar TOR
echo "🛑 Parando TOR..."
pkill -9 tor 2>/dev/null
sleep 2

# Limpar arquivos temporários
rm -f /var/lib/tor/lock 2>/dev/null
rm -f /run/tor/tor.pid 2>/dev/null

# Iniciar TOR novamente
echo "🚀 Iniciando TOR com novo circuito..."
mkdir -p /var/lib/tor /var/log/tor
chmod 700 /var/lib/tor /var/log/tor
tor > /var/log/tor/tor.log 2>&1 &

# Aguardar TOR conectar
echo "⏳ Aguardando TOR conectar (pode levar até 30s)..."
for i in {1..30}; do
    if netstat -tuln 2>/dev/null | grep -q 9050 || ss -tuln 2>/dev/null | grep -q 9050; then
        echo "✅ TOR conectado!"
        break
    fi
    sleep 1
    if [ $((i % 5)) -eq 0 ]; then
        echo "   Aguardando... ${i}s"
    fi
done

# Aguardar mais um pouco para garantir conexão estável
sleep 5

# Testar novo IP
echo ""
echo "📍 Novo IP TOR:"
IP_DEPOIS=$(curl -s --connect-timeout 10 --socks5-hostname 127.0.0.1:9050 https://api.ipify.org 2>/dev/null || echo "Erro ao obter IP")
echo "   $IP_DEPOIS"

# Comparar
echo ""
if [ "$IP_ANTES" != "$IP_DEPOIS" ] && [ "$IP_DEPOIS" != "Erro ao obter IP" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ IP TROCADO COM SUCESSO!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   Antes: $IP_ANTES"
    echo "   Depois: $IP_DEPOIS"
else
    echo "⚠️ IP não mudou ou erro na conexão"
    echo "   Pode precisar aguardar mais tempo"
fi

# Testar velocidade
echo ""
echo "🧪 Testando velocidade do novo circuito..."
TIME_START=$(date +%s)
curl -s --connect-timeout 30 --max-time 30 --socks5-hostname 127.0.0.1:9050 https://www.google.com > /dev/null 2>&1
RESULT=$?
TIME_END=$(date +%s)
TIME_DIFF=$((TIME_END - TIME_START))

if [ $RESULT -eq 0 ]; then
    echo "✅ Circuito funcionando (${TIME_DIFF}s)"
    if [ $TIME_DIFF -lt 5 ]; then
        echo "   🚀 Rápido!"
    elif [ $TIME_DIFF -lt 15 ]; then
        echo "   👍 Velocidade normal"
    else
        echo "   🐢 Lento, considere trocar novamente"
    fi
else
    echo "❌ Circuito muito lento ou com problemas"
    echo "💡 Tente executar novamente: bash trocar-ip-tor.sh"
fi

echo ""
echo "💡 Agora tente o scraper novamente!"


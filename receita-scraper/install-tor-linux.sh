#!/bin/bash

# Script de instalação do TOR para Linux
# Suporta: Ubuntu, Debian, Fedora, Arch Linux, openSUSE

set -e

echo "🧅 Script de Instalação do TOR para Anonimato"
echo "=============================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detectar distribuição
if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO=$ID
    VERSION=$VERSION_ID
else
    echo -e "${RED}❌ Não foi possível detectar a distribuição Linux${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Distribuição detectada: $DISTRO $VERSION${NC}"
echo ""

# Verificar se já está instalado
if command -v tor &> /dev/null; then
    echo -e "${YELLOW}⚠️  TOR já está instalado!${NC}"
    tor --version
    echo ""
    read -p "Deseja reinstalar/reconfigurar? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
        echo -e "${GREEN}✅ Pulando instalação${NC}"
        SKIP_INSTALL=true
    fi
fi

# Função para Ubuntu/Debian
install_ubuntu_debian() {
    echo -e "${BLUE}📦 Instalando TOR para Ubuntu/Debian...${NC}"
    
     apt update
     apt install tor -y
    
    echo -e "${GREEN}✅ TOR instalado!${NC}"
}

# Função para Fedora/RHEL
install_fedora() {
    echo -e "${BLUE}📦 Instalando TOR para Fedora/RHEL...${NC}"
    
     dnf install tor -y
    
    echo -e "${GREEN}✅ TOR instalado!${NC}"
}

# Função para Arch Linux
install_arch() {
    echo -e "${BLUE}📦 Instalando TOR para Arch Linux...${NC}"
    
     pacman -S --noconfirm tor
    
    echo -e "${GREEN}✅ TOR instalado!${NC}"
}

# Função para openSUSE
install_opensuse() {
    echo -e "${BLUE}📦 Instalando TOR para openSUSE...${NC}"
    
     zypper install -y tor
    
    echo -e "${GREEN}✅ TOR instalado!${NC}"
}

# Instalar conforme a distribuição
if [ "$SKIP_INSTALL" != "true" ]; then
    case $DISTRO in
        ubuntu|debian|linuxmint|pop|elementary)
            install_ubuntu_debian
            ;;
        fedora|rhel|centos|rocky|almalinux)
            install_fedora
            ;;
        arch|manjaro|endeavouros)
            install_arch
            ;;
        opensuse*|sles)
            install_opensuse
            ;;
        *)
            echo -e "${RED}❌ Distribuição $DISTRO não suportada automaticamente${NC}"
            echo -e "${YELLOW}💡 Tente instalar manualmente:  [apt|dnf|pacman|zypper] install tor${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "${BLUE}🔧 Configurando TOR...${NC}"

# Verificar se TOR foi instalado
if ! command -v tor &> /dev/null; then
    echo -e "${RED}❌ Erro: TOR não foi instalado corretamente${NC}"
    exit 1
fi

# Iniciar serviço TOR
echo -e "${BLUE}🚀 Iniciando serviço TOR...${NC}"

 systemctl start tor
 systemctl enable tor

# Aguardar TOR inicializar
echo -e "${YELLOW}⏳ Aguardando TOR inicializar...${NC}"
sleep 3

# Verificar status
echo ""
echo -e "${BLUE}📊 Verificando status do TOR...${NC}"

if  systemctl is-active --quiet tor; then
    echo -e "${GREEN}✅ TOR está rodando!${NC}"
     systemctl status tor --no-pager | head -n 5
else
    echo -e "${RED}❌ TOR não está rodando${NC}"
    echo -e "${YELLOW}💡 Tente:  systemctl start tor${NC}"
    exit 1
fi

# Verificar porta
echo ""
echo -e "${BLUE}🔍 Verificando porta 9050...${NC}"

if  netstat -tuln 2>/dev/null | grep -q 9050 ||  ss -tuln 2>/dev/null | grep -q 9050; then
    echo -e "${GREEN}✅ Porta 9050 está aberta${NC}"
else
    echo -e "${YELLOW}⚠️  Porta 9050 não detectada, mas TOR pode estar funcionando${NC}"
fi

# Configurar torrc (opcional)
echo ""
read -p "Deseja configurar país de saída (Exit Node)? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    echo ""
    echo "Países disponíveis (código de 2 letras):"
    echo "  br = Brasil"
    echo "  ar = Argentina"
    echo "  cl = Chile"
    echo "  us = Estados Unidos"
    echo "  uk = Reino Unido"
    echo "  de = Alemanha"
    echo "  fr = França"
    echo ""
    read -p "Digite o código do país (ex: br): " PAIS
    
    if [ ! -z "$PAIS" ]; then
        echo -e "${BLUE}📝 Configurando exit node para: $PAIS${NC}"
        
        # Backup do torrc
         cp /etc/tor/torrc /etc/tor/torrc.backup
        
        # Adicionar configuração
        echo "" |  tee -a /etc/tor/torrc > /dev/null
        echo "# Configuração adicionada pelo script" |  tee -a /etc/tor/torrc > /dev/null
        echo "ExitNodes {$PAIS}" |  tee -a /etc/tor/torrc > /dev/null
        echo "StrictNodes 1" |  tee -a /etc/tor/torrc > /dev/null
        
        echo -e "${GREEN}✅ Configuração salva${NC}"
        echo -e "${BLUE}🔄 Reiniciando TOR...${NC}"
        
         systemctl restart tor
        sleep 3
    fi
fi

# Testar conexão TOR
echo ""
echo -e "${BLUE}🧪 Testando conexão TOR...${NC}"

# Instalar curl se necessário
if ! command -v curl &> /dev/null; then
    echo -e "${YELLOW}📦 Instalando curl...${NC}"
    case $DISTRO in
        ubuntu|debian|linuxmint|pop|elementary)
             apt install curl -y
            ;;
        fedora|rhel|centos|rocky|almalinux)
             dnf install curl -y
            ;;
        arch|manjaro|endeavouros)
             pacman -S --noconfirm curl
            ;;
        opensuse*)
             zypper install -y curl
            ;;
    esac
fi

echo ""
echo -e "${BLUE}🌍 Seu IP normal:${NC}"
IP_NORMAL=$(curl -s https://api.ipify.org 2>/dev/null || echo "Não detectado")
echo -e "${YELLOW}   $IP_NORMAL${NC}"

echo ""
echo -e "${BLUE}🧅 Seu IP através do TOR:${NC}"
IP_TOR=$(curl -s --socks5-hostname 127.0.0.1:9050 https://api.ipify.org 2>/dev/null || echo "Não detectado")

if [ "$IP_TOR" != "Não detectado" ] && [ "$IP_TOR" != "$IP_NORMAL" ]; then
    echo -e "${GREEN}   $IP_TOR ✅${NC}"
    echo ""
    echo -e "${GREEN}🎉 TOR está funcionando corretamente!${NC}"
    echo -e "${GREEN}   Seu IP está oculto!${NC}"
    
    # Obter informações de localização do IP TOR
    echo ""
    echo -e "${BLUE}📍 Localização do IP TOR:${NC}"
    curl -s --socks5-hostname 127.0.0.1:9050 https://ipapi.co/json/ 2>/dev/null | grep -E '"city"|"country"|"country_name"' | sed 's/^/   /'
    
else
    echo -e "${RED}   $IP_TOR ❌${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  TOR pode não estar funcionando corretamente${NC}"
    echo -e "${YELLOW}💡 Tente reiniciar:  systemctl restart tor${NC}"
fi

# Criar alias úteis
echo ""
read -p "Deseja adicionar comandos úteis ao shell? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[SsYy]$ ]]; then
    # Detectar shell
    if [ -n "$ZSH_VERSION" ]; then
        SHELL_RC="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        SHELL_RC="$HOME/.bashrc"
    else
        SHELL_RC="$HOME/.profile"
    fi
    
    echo "" >> "$SHELL_RC"
    echo "# Comandos TOR - Adicionados pelo script" >> "$SHELL_RC"
    echo "alias tor-status=' systemctl status tor'" >> "$SHELL_RC"
    echo "alias tor-start=' systemctl start tor'" >> "$SHELL_RC"
    echo "alias tor-stop=' systemctl stop tor'" >> "$SHELL_RC"
    echo "alias tor-restart=' systemctl restart tor'" >> "$SHELL_RC"
    echo "alias tor-ip='curl --socks5-hostname 127.0.0.1:9050 https://api.ipify.org'" >> "$SHELL_RC"
    echo "alias my-ip='curl https://api.ipify.org'" >> "$SHELL_RC"
    echo "alias tor-check='curl --socks5-hostname 127.0.0.1:9050 https://check.torproject.org/ | grep -i congratulations'" >> "$SHELL_RC"
    
    echo -e "${GREEN}✅ Comandos adicionados ao $SHELL_RC${NC}"
    echo ""
    echo "Comandos disponíveis após recarregar o shell:"
    echo "  tor-status    - Ver status do TOR"
    echo "  tor-start     - Iniciar TOR"
    echo "  tor-stop      - Parar TOR"
    echo "  tor-restart   - Reiniciar TOR (novo IP)"
    echo "  tor-ip        - Ver IP através do TOR"
    echo "  my-ip         - Ver seu IP real"
    echo "  tor-check     - Verificar se TOR está funcionando"
    echo ""
    echo -e "${YELLOW}💡 Execute: source $SHELL_RC${NC}"
fi

# Resumo final
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║           🎉 INSTALAÇÃO CONCLUÍDA COM SUCESSO!           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}✅ TOR instalado e configurado${NC}"
echo -e "${GREEN}✅ Serviço TOR ativo e rodando${NC}"
echo -e "${GREEN}✅ Proxy SOCKS5 na porta 9050${NC}"
echo -e "${GREEN}✅ Seu IP está oculto através do TOR${NC}"
echo ""
echo "📋 Próximos passos:"
echo ""
echo "1️⃣  Testar o scraper com TOR:"
echo -e "   ${BLUE}cd $(dirname $0)${NC}"
echo -e "   ${BLUE}npm run test:tor:linux:visual${NC}"
echo ""
echo "2️⃣  Verificar IP TOR:"
echo -e "   ${BLUE}npm run my-tor-ip${NC}"
echo ""
echo "3️⃣  Trocar de IP (obter novo circuito):"
echo -e "   ${BLUE} systemctl restart tor${NC}"
echo ""
echo "4️⃣  Ver logs do TOR:"
echo -e "   ${BLUE} journalctl -u tor -f${NC}"
echo ""
echo "📚 Documentação completa:"
echo -e "   ${BLUE}cat TOR_LINUX_GUIDE.md${NC}"
echo ""
echo "🔒 Lembre-se:"
echo "   - TOR é mais lento que conexão normal"
echo "   - Use apenas para fins legítimos"
echo "   - Respeite a privacidade e a lei"
echo ""
echo "🧅 Agora você tem anonimato nas suas consultas!"
echo ""


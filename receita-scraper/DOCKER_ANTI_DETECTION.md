# 🛡️ Guia Anti-Detecção para Docker

## ✅ Melhorias Implementadas no scraper.js

### 1. **User-Agent Realista e Rotativo**
- Usa diferentes User-Agents reais do Safari
- Muda a cada execução

### 2. **Headers HTTP Completos**
- Accept, Accept-Language, Accept-Encoding
- DNT, Connection, Upgrade-Insecure-Requests
- Sec-Fetch-* headers realistas

### 3. **Propriedades do Navigator**
- Remove `navigator.webdriver`
- Mock de `plugins` (navegadores reais têm plugins)
- `languages` realistas (pt-BR, pt, en-US, en)
- `hardwareConcurrency` e `deviceMemory`
- `connection` com valores realistas

### 4. **Comportamento Humano**
- ✅ Movimentos de mouse aleatórios
- ✅ Delays variados ao digitar (50-200ms por tecla)
- ✅ Pausas ocasionais durante digitação
- ✅ Scroll antes de preencher formulário
- ✅ Hesitação antes de clicar no hCaptcha

### 5. **Sistema de Cache de Cookies** ⭐ MUITO IMPORTANTE
- Salva cookies do hCaptcha entre execuções
- Reutiliza cookies para ter melhor "reputação"
- Arquivo: `cookies_hcaptcha.json`

### 6. **Interação Melhorada com hCaptcha**
- Movimento de mouse em trajetória curva (mais humano)
- Aguarda tempo aleatório antes de clicar
- Movimento em 3 etapas até o checkbox

## 🐳 Configurações Recomendadas para Docker

### Opção 1: Usar o scraper.js melhorado (WebKit)

O arquivo já está otimizado! Basta reconstruir o container:

```bash
cd c:\Users\felip\dev\consulta-cpf
docker-compose down
docker-compose build --no-cache receita-scraper
docker-compose up -d receita-scraper
```

### Opção 2: Adicionar mais memória ao container (RECOMENDADO)

Edite o `docker-compose.yml`:

```yaml
receita-scraper:
  # ... outras configurações ...
  shm_size: '2gb'  # Previne travamentos do navegador
  mem_limit: '4g'  # Limite de memória
  environment:
    - NODE_OPTIONS=--max-old-space-size=3072
```

## 🧪 Como Testar

### 1. Teste Local (Windows) - Deve funcionar bem:
```bash
cd receita-scraper
node scraper.js 12345678901 01011990
```

### 2. Teste no Docker:
```bash
# Ver logs em tempo real
docker-compose logs -f receita-scraper

# Executar teste dentro do container
docker-compose exec receita-scraper node scraper.js 12345678901 01011990

# Ou via API
curl -X POST http://localhost:3435/consultar-cpf \
  -H "Content-Type: application/json" \
  -d '{"cpf":"12345678901","birthDate":"01011990"}'
```

## 📊 O que observar nos logs

### ✅ Sinais de SUCESSO:
```
✅ Cookies do hCaptcha carregados (melhor reputação!)
🎯 Tentando interagir com hCaptcha de forma HUMANA...
✅ Checkbox clicado de forma humana
✅ Cookies salvos para próxima execução
```

### ❌ Sinais de PROBLEMA:
```
❌ Timeout: Checkbox não foi marcado após 30 segundos
⚠️ Erro na interação com hCaptcha
```

## 💡 Dicas Importantes

### 1. **Primeira execução pode falhar**
- Na primeira vez, o navegador não tem cookies salvos
- O hCaptcha pode ser mais rigoroso
- Execute 2-3 vezes seguidas - vai melhorar!

### 2. **Não execute muitas vezes seguidas**
- Aguarde 30-60 segundos entre consultas
- O site da Receita pode bloquear por rate-limiting

### 3. **Se continuar travando no Docker**
- Verifique os logs: `docker-compose logs receita-scraper`
- Aumente a memória disponível (shm_size)
- Considere usar Chromium em vez de WebKit no Docker

### 4. **Persistir cookies entre reinicializações**
```yaml
# No docker-compose.yml
volumes:
  - ./receita-scraper:/app
  - ./receita-scraper/cookies_hcaptcha.json:/app/cookies_hcaptcha.json
```

## 🔄 Se ainda não funcionar no Docker

Use o `scraper-linux-chromium.js` que tem melhor suporte no Docker:

1. Edite `server.js` linha 9-12:
```javascript
// Forçar uso do Chromium no Docker
if (process.env.NODE_ENV === 'production' || process.env.USE_CHROMIUM === 'true' || process.env.DOCKER === 'true') {
    console.log('🖥️ Usando Chromium para servidor...');
    const { consultarCPF: consultarCPFChromium } = require('./scraper-linux-chromium');
    consultarCPF = consultarCPFChromium;
}
```

2. Adicione no `docker-compose.yml`:
```yaml
environment:
  - DOCKER=true
```

3. Reconstrua:
```bash
docker-compose build --no-cache receita-scraper
docker-compose up -d receita-scraper
```

## 📈 Monitoramento

Verifique se está funcionando:

```bash
# Health check
curl http://localhost:3435/health

# Logs em tempo real
docker-compose logs -f receita-scraper

# Verificar cookies salvos
cat receita-scraper/cookies_hcaptcha.json
```

## ✨ Resumo das Melhorias

| Técnica | Antes | Depois |
|---------|-------|--------|
| User-Agent | Fixo | Rotativo (4 opções) |
| Headers HTTP | Básicos | Completos (10+ headers) |
| Navigator | webdriver visível | Totalmente mascarado |
| Digitação | Uniforme | Humana (delays variados) |
| Mouse | Sem movimento | Trajetória curva |
| Cookies | Não salvava | Sistema de cache |
| Interação hCaptcha | Clique direto | Movimento + hesitação |

Todas essas melhorias juntas devem reduzir MUITO a detecção de bot! 🎯

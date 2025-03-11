# Serviço de Consulta CPF na Receita Federal

Este serviço permite consultar informações de CPF diretamente no site da Receita Federal, extraindo os dados de forma automatizada.

## Funcionalidades

- Consulta de CPF com informações básicas
- Versão turbo otimizada com cache e instância compartilhada de navegador
- Screenshots do processo para debug
- Estatísticas de uso da API

## Rotas

### Consulta Padrão

```
POST /consultar-cpf
```

Corpo da requisição:
```json
{
  "cpf": "12345678909",
  "birthDate": "01/01/1990"
}
```

### Consulta Turbo (Otimizada)

```
POST /consulta-turbo
```

Corpo da requisição:
```json
{
  "cpf": "12345678909",
  "birthDate": "01/01/1990",
  "debug": false,
  "cache": true
}
```

Parâmetros opcionais:
- `debug`: Ativa ou desativa a captura de screenshots para debug
- `cache`: Ativa ou desativa o cache de consultas

### Estatísticas

```
GET /stats-turbo
```

Retorna estatísticas de uso da API turbo, incluindo hits de cache, performance e uso de recursos.

### Screenshots

```
GET /listar-screenshots
GET /listar-screenshots-turbo
```

Retorna lista de screenshots disponíveis para visualização.

## Otimizações da Versão Turbo

A versão turbo inclui várias otimizações em relação à versão padrão:

1. **Instância compartilhada do navegador**
   - Um único navegador Chrome é inicializado e compartilhado entre todas as requisições
   - Reduz significativamente o tempo de inicialização e o consumo de memória

2. **Sistema de cache**
   - Resultados são armazenados em cache por 30 minutos
   - Consultas repetidas são servidas instantaneamente sem acessar a Receita Federal

3. **Controle de concorrência**
   - Limita o número de consultas simultâneas para evitar sobrecarga
   - Implementa fila de requisições quando o limite é atingido

4. **Otimizações de performance**
   - Bloqueio mais agressivo de recursos desnecessários (imagens, CSS, etc.)
   - Timeouts mais eficientes e recuperação de falhas
   - Extração de dados otimizada com Map

5. **Retry automático**
   - Em caso de falha, tenta a consulta novamente automaticamente
   - Configurável através de parâmetros

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor em modo desenvolvimento
npm run dev

# Iniciar servidor em produção
npm start
```

## Requisitos

- Node.js 14+
- Navegador Chrome instalado no sistema (para a versão atual do puppeteer)

## Notas

Este serviço é apenas para fins educacionais. O uso automatizado do site da Receita Federal pode estar sujeito a termos de serviço específicos. Use por sua conta e risco. 
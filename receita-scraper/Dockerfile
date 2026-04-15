FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Variáveis de ambiente
ENV UV_THREADPOOL_SIZE=1
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV NODE_ENV=production
# 👇 Força o path explícito dos browsers
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

WORKDIR /app

COPY package*.json ./

RUN npm ci --no-audit --no-fund

# 👇 Instala webkit com dependências de sistema no path correto
RUN npx playwright install --with-deps webkit

COPY . .

CMD ["npm", "run", "dev"]

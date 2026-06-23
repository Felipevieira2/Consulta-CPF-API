<<<<<<< HEAD
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
=======
FROM node:18-bullseye

# Instalar dependências do sistema para Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libcairo2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências npm
RUN npm install --loglevel verbose

# Instalar apenas Chromium (mais rápido e estável no Docker)
RUN npx playwright install chromium
RUN npx playwright install-deps chromium

# Copiar o resto do código
COPY . .

EXPOSE 3000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]
>>>>>>> d7bc0852fdff864d98df757d0269a9966b1fa1c7

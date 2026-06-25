FROM node:18-bullseye

# Instalar dependências do sistema para Playwright e XVFB (necessário para rodar extensões em headless no Linux/Docker)
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
    xvfb \
    xauth \
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

# Comando para desenvolvimento rodando sob o Xvfb virtual display
CMD ["xvfb-run", "--server-args=-screen 0 1366x768x24", "npm", "run", "dev"]
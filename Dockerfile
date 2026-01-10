# ====================================
# Dockerfile Unificado - Frontend + Backend
# ====================================

# ============ STAGE 1: Build Frontend ============
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Argumentos de build para variáveis de ambiente
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_BACKEND_URL

# Definir variáveis de ambiente para o build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Criar .env.production
RUN if [ -n "$VITE_SUPABASE_URL" ]; then \
      echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env.production; \
      echo "VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY" >> .env.production; \
      echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" >> .env.production; \
      echo "✅ .env.production criado"; \
      cat .env.production; \
    fi

# Build do frontend
RUN npm run build

# ============ STAGE 2: Setup Backend ============
FROM python:3.11-slim AS backend-setup

WORKDIR /backend

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código do backend
COPY backend/ .

# Criar pasta de uploads
RUN mkdir -p uploads

# ============ STAGE 3: Production - Nginx + Python ============
FROM python:3.11-slim

WORKDIR /app

# Instalar Nginx e Supervisor (para rodar múltiplos processos)
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

# Copiar dependências Python do stage anterior
COPY --from=backend-setup /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-setup /usr/local/bin/uvicorn /usr/local/bin/uvicorn

# Copiar backend
COPY --from=backend-setup /backend /app/backend

# Copiar frontend buildado
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Configurar Nginx
RUN rm /etc/nginx/sites-enabled/default
COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

# Configurar Supervisor para rodar Nginx e Backend juntos
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expor portas
EXPOSE 80

# Comando para iniciar supervisor (que inicia nginx e backend)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
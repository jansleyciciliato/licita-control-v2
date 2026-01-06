# Etapa 1: build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Receber variáveis de ambiente como build args
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

# Se as variáveis não vieram como ARG, tentar pegar de ENV
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_PUBLISHABLE_KEY=${VITE_SUPABASE_PUBLISHABLE_KEY}

# Criar .env.production dinamicamente durante o build
RUN if [ -n "$VITE_SUPABASE_URL" ]; then \
      echo "VITE_SUPABASE_URL=$VITE_SUPABASE_URL" > .env.production; \
      echo "VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY" >> .env.production; \
      echo "✅ .env.production criado com variáveis de ambiente"; \
      cat .env.production; \
    else \
      echo "⚠️  Variáveis não encontradas, usando .env.production do projeto (se existir)"; \
    fi

RUN npm run build

# Verificar se o build foi criado
RUN ls -la dist/

# Etapa 2: nginx
FROM nginx:alpine

# Remove config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
# 🚀 Guia de Deploy: ProRevest V5 no HestiaCP com Domínio prorevesttintas.com.br

## 📋 PRÉ-REQUISITOS

### ✔️ Ambiente Local
- ✅ Projeto no GitHub: https://github.com/OARANHA/PROREVEST-V5.git
- ✅ Node.js 18+ instalado
- ✅ Acesso SSH à VPS
- ✅ Domínio configurado: prorevesttintas.com.br
- ✅ HestiaCP instalado na VPS

### ✔️ Serviços Externos
- ✅ Supabase configurado e funcionando
- ✅ Variáveis de ambiente documentadas

---

## 🏗️ ARQUITETURA DE DEPLOY

### Opção 1: Deploy Estático (Recomendado)
```
VPS (HestiaCP) → Build Estático → Nginx → Domínio
```

### Opção 2: Deploy Node.js (Avançado)
```
VPS (HestiaCP) → PM2 → Node.js → Nginx → Domínio
```

---

## 📁 ESTRUTURA OTIMIZADA DEPLOY

### 🗂️ Estrutura de Pastas
```
/home/usuario/web/prorevesttintas.com.br/
├── public_html/                 # Arquivos estáticos
│   ├── assets/                 # CSS, JS, imagens otimizadas
│   ├── index.html
│   └── ...
├── private/                    # Arquivos privados
│   ├── build/                 # Build intermediário
│   ├── logs/                  # Logs da aplicação
│   └── backups/                # Backups
└── scripts/                   # Scripts de deploy
    ├── deploy.sh
    ├── backup.sh
    └── health-check.sh
```

---

## 🛠️ CONFIGURAÇÃO DO HESTIACP

### 1. Criar Conta de Usuário
```bash
# Acessar HestiaCP painel admin
# Criar novo usuário: prorevest_user
# Pacote: Default ou customizado
```

### 2. Adicionar Domínio
```bash
# Painel HestiaCP → Web → Add Domain
Domain: prorevesttintas.com.br
User: prorevest_user
IP: IP da VPS
```

### 3. Configurar SSL
```bash
# Painel HestiaCP → Web → SSL Support
# Ativar SSL/TLS (Let's Encrypt)
# Forçar HTTPS
```

---

## 📦 PREPARAÇÃO DO PROJETO

### 1. Otimizar Build para Produção
```bash
# No projeto local
cd ProRevest_v4

# Instalar dependências de produção
npm ci --only=production

# Build otimizado
npm run build

# Testar build localmente
npm run preview
```

### 2. Configurar Variáveis de Ambiente
```bash
# Criar .env.production
VITE_SUPABASE_URL=seu_supabase_url
VITE_SUPABASE_ANON_KEY=seu_supabase_anon_key
VITE_SITE_URL=https://prorevesttintas.com.br
VITE_APP_NAME=ProRevest Tintas
VITE_APP_DESCRIPTION=Tintas premium para transformar seus ambientes
```

### 3. Otimizar ViteConfig
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  },
  preview: {
    host: '0.0.0.0',
    port: 3000
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
```

---

## 🚀 SCRIPTS DE DEPLOY

### 1. Script Principal (deploy.sh)
```bash
#!/bin/bash

# Variáveis
DOMAIN="prorevesttintas.com.br"
USER="prorevest_user"
REPO_URL="https://github.com/OARANHA/PROREVEST-V5.git"
DEPLOY_DIR="/home/$USER/web/$DOMAIN/private/deploy"
PUBLIC_DIR="/home/$USER/web/$DOMAIN/public_html"
BACKUP_DIR="/home/$USER/web/$DOMAIN/private/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "🚀 Iniciando deploy do ProRevest V5..."

# Criar backup do atual
echo "📦 Criando backup..."
if [ -d "$PUBLIC_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" -C "$PUBLIC_DIR" .
fi

# Clonar repositório
echo "📥 Clonando repositório..."
rm -rf "$DEPLOY_DIR"
git clone "$REPO_URL" "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Instalar dependências
echo "📦 Instalando dependências..."
npm ci --only=production

# Build da aplicação
echo "🔨 Buildando aplicação..."
npm run build

# Copiar arquivos para public_html
echo "📁 Copiando arquivos..."
rm -rf "$PUBLIC_DIR"/*
cp -r dist/* "$PUBLIC_DIR/"

# Ajustar permissões
echo "🔐 Ajustando permissões..."
chown -R $USER:$USER "$PUBLIC_DIR"
chmod -R 755 "$PUBLIC_DIR"

# Limpar cache
echo "🧹 Limpando cache..."
rm -rf "$DEPLOY_DIR"

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Site disponível em: https://$DOMAIN"
```

### 2. Script de Backup (backup.sh)
```bash
#!/bin/bash

DOMAIN="prorevesttintas.com.br"
USER="prorevest_user"
PUBLIC_DIR="/home/$USER/web/$DOMAIN/public_html"
BACKUP_DIR="/home/$USER/web/$DOMAIN/private/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup dos arquivos
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" -C "$PUBLIC_DIR" .

# Backup do banco (se necessário)
# mysqldump -u user -p database > "$BACKUP_DIR/db_$DATE.sql"

echo "✅ Backup criado: $BACKUP_DIR/files_$DATE.tar.gz"

# Remover backups antigos (manter últimos 5)
find "$BACKUP_DIR" -name "files_*.tar.gz" -type f -mtime +7 -delete
```

### 3. Health Check (health-check.sh)
```bash
#!/bin/bash

DOMAIN="prorevesttintas.com.br"
LOG_FILE="/home/prorevest_user/web/$DOMAIN/private/logs/health.log"

# Verificar se site está online
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")

if [ "$HTTP_CODE" = "200" ]; then
    echo "$(date): ✅ Site online (HTTP $HTTP_CODE)" >> "$LOG_FILE"
    exit 0
else
    echo "$(date): ❌ Site offline (HTTP $HTTP_CODE)" >> "$LOG_FILE"
    
    # Enviar notificação (opcional)
    # curl -X POST "webhook_url" -d "Site $DOMAIN está offline"
    
    exit 1
fi
```

---

## 🔧 CONFIGURAÇÃO DO NGINX

### Custom Nginx Config
```nginx
# /home/prorevest_user/conf/web/prorevesttintas.com.br/nginx.conf

server {
    listen 443 ssl http2;
    server_name prorevesttintas.com.br www.prorevesttintas.com.br;
    
    # SSL Configuration
    ssl_certificate /home/prorevest_user/conf/web/ssl.prorevesttintas.com.br.pem;
    ssl_certificate_key /home/prorevest_user/conf/web/ssl.prorevesttintas.com.br.key;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Performance
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Cache estático
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # SPA fallback
    location / {
        root /home/prorevest_user/web/prorevesttintas.com.br/public_html;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Security
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
    
    # Health endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
    
    # Error pages
    error_page 404 /index.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name prorevesttintas.com.br www.prorevesttintas.com.br;
    return 301 https://$server_name$request_uri;
}
```

---

## 📋 CHECKLIST DE DEPLOY

### Antes do Deploy
- [ ] Backup completo do site atual
- [ ] Variáveis de ambiente configuradas
- [ ] DNS apontando para VPS
- [ ] SSL configurado no HestiaCP
- [ ] Teste de build local funcionando

### Durante o Deploy
- [ ] Script de deploy executado com sucesso
- [ ] Arquivos copiados corretamente
- [ ] Permissões ajustadas
- [ ] Cache limpo

### Pós-Deploy
- [ ] Site acessível via HTTPS
- [ ] Todas as páginas funcionando
- [ ] Console sem erros
- [ ] Supabase conectado
- [ ] Health check passando
- [ ] Backup criado

---

## 🔍 TESTES DE VALIDAÇÃO

### 1. Testes Automatizados
```bash
# Teste de disponibilidade
curl -I https://prorevesttintas.com.br

# Teste de SSL
openssl s_client -connect prorevesttintas.com.br:443

# Teste de performance
curl -w "@curl-format.txt" -o /dev/null -s https://prorevesttintas.com.br
```

### 2. Testes Manuais
- [ ] Home page carrega corretamente
- [ ] Navegação entre páginas funciona
- [ ] Formulários enviam dados
- [ ] Imagens carregam
- [ ] Responsividade mobile
- [ ] Console sem erros

---

## 📊 MONITORAMENTO

### 1. Logs
```bash
# Logs Nginx
tail -f /var/log/nginx/prorevesttintas.com.br.access.log
tail -f /var/log/nginx/prorevesttintas.com.br.error.log

# Logs da aplicação
tail -f /home/prorevest_user/web/prorevesttintas.com.br/private/logs/health.log
```

### 2. Health Check
```bash
# Adicionar ao crontab
*/5 * * * * /home/prorevest_user/web/prorevesttintas.com.br/scripts/health-check.sh
```

---

## 🚨 SOLUÇÃO DE PROBLEMAS

### Problemas Comuns

#### 403 Forbidden
```bash
# Verificar permissões
chmod -R 755 /home/prorevest_user/web/prorevesttintas.com.br/public_html
chown -R prorevest_user:prorevest_user /home/prorevesttintas.com.br/public_html
```

#### 502 Bad Gateway
```bash
# Restart Nginx
systemctl restart nginx

# Verificar configuração
nginx -t
```

#### Site não carrega
```bash
# Verificar logs
tail -f /var/log/nginx/error.log

# Testar build local
npm run preview
```

---

## 🔄 AUTOMAÇÃO AVANÇADA

### GitHub Actions (Opcional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to HestiaCP

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /home/prorevest_user/web/prorevesttintas.com.br
            ./scripts/deploy.sh
```

---

## 📞 SUPORTE

### Contatos Emergenciais
- **Hospedagem:** Painel HestiaCP
- **Domínio:** Registrador do domínio
- **Backup:** Scripts automáticos

### Documentação Útil
- [HestiaCP Documentation](https://docs.hestiacp.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/build.html#deploying-a-static-site)
- [React Router Deployment](https://reactrouter.com/en/main/start/deployment)

---

## ✅ RESUMO FINAL

**Status:** Pronto para deploy  
**Domínio:** prorevesttintas.com.br  
**Hospedagem:** HestiaCP  
**Deploy:** Estático otimizado  
**SSL:** Ativo (Let's Encrypt)  
**Backup:** Automatizado  
**Monitoramento:** Health check  

**🚀 ProRevest V5 pronto para produção!**

# Guia de Migração: Deploy Estático → Node.js na VPS

## Por Que Migrar?

### Problemas Atuais (Deploy Estático)
- ❌ Loaders do React Router não funcionam em modo SPA
- ❌ Geração de PDF quebrada
- ❌ Sem processamento server-side
- ❌ Performance limitada no primeiro carregamento
- ❌ APIs admin limitadas

### Benefícios do Node.js
- ✅ SSR completo com React Router v7
- ✅ PDF generation funcional
- ✅ Processamento de imagens no servidor
- ✅ Performance superior
- ✅ SEO otimizado
- ✅ Logs e monitoramento
- ✅ Ambiente de produção completo

## Requisitos da VPS

### Sistema Operacional
- Ubuntu 20.04+ ou Debian 10+
- Mínimo 2GB RAM (recomendado 4GB)
- 20GB+ de espaço em disco
- Acesso SSH com sudo

### Software Necessário
- Node.js 18+ (LTS)
- PM2 (Process Manager)
- Nginx (Proxy reverso)
- Certbot (SSL gratuito)

## Passo a Passo de Instalação

### 1. Conectar à VPS via SSH
```bash
ssh root@SUA_VPS_IP
```

### 2. Atualizar Sistema
```bash
apt update && apt upgrade -y
```

### 3. Instalar Node.js (via NodeSource)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

### 4. Verificar Instalação
```bash
node --version  # Deve mostrar v18.x.x
npm --version   # Deve mostrar 9.x.x
```

### 5. Instalar PM2
```bash
npm install -g pm2
```

### 6. Instalar Nginx
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 7. Instalar Certbot (SSL)
```bash
apt install certbot python3-certbot-nginx -y
```

## Configuração do Projeto

### 1. Preparar Projeto para Produção
```bash
# No seu projeto local
cd ProRevest_v4

# Remover configuração SPA
# Editar react-router.config.ts:
export default {
  // Remover: ssr: false
} satisfies Config;

# Instalar dependências
npm install

# Build para produção
npm run build
```

### 2. Configurar Variáveis de Ambiente
```bash
# Criar .env.production na VPS
cat > .env.production << EOF
VITE_SUPABASE_URL=sua_supabase_url
VITE_SUPABASE_ANON_KEY=sua_supabase_anon_key
NODE_ENV=production
PORT=3000
EOF
```

### 3. Script de Deploy Automatizado

Criar `scripts/deploy-nodejs.sh`:
```bash
#!/bin/bash

# Configurações
VPS_IP="SUA_VPS_IP"
VPS_USER="root"
PROJECT_DIR="/var/www/prorevest"
APP_NAME="prorevest-app"

echo "🚀 Iniciando deploy para Node.js VPS..."

# 1. Build local
echo "📦 Fazendo build local..."
npm run build

# 2. Upload para VPS
echo "📤 Enviando arquivos para VPS..."
rsync -avz --delete build/ $VPS_USER@$VPS_IP:$PROJECT_DIR/
rsync -avz package.json $VPS_USER@$VPS_IP:$PROJECT_DIR/
rsync -avz .env.production $VPS_USER@$VPS_IP:$PROJECT_DIR/.env

# 3. Instalar dependências na VPS
echo "📚 Instalando dependências na VPS..."
ssh $VPS_USER@$VPS_IP "cd $PROJECT_DIR && npm ci --production"

# 4. Reiniciar aplicação com PM2
echo "🔄 Reiniciando aplicação..."
ssh $VPS_USER@$VPS_IP "cd $PROJECT_DIR && pm2 restart $APP_NAME || pm2 start npm --name $APP_NAME -- start"

# 5. Status
echo "✅ Deploy concluído!"
ssh $VPS_USER@$VPS_IP "pm2 status"
```

### 4. Configurar PM2

Criar `ecosystem.config.js` no projeto:
```javascript
module.exports = {
  apps: [{
    name: 'prorevest-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/prorevest',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/prorevest/error.log',
    out_file: '/var/log/prorevest/out.log',
    log_file: '/var/log/prorevest/combined.log',
    time: true
  }]
};
```

### 5. Configurar Nginx

Criar `/etc/nginx/sites-available/prorevest`:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Configurar SSL
```bash
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

## Comandos de Gerenciamento

### PM2
```bash
# Iniciar aplicação
pm2 start ecosystem.config.js

# Listar processos
pm2 status

# Reiniciar
pm2 restart prorevest-app

# Ver logs
pm2 logs prorevest-app

# Monitorar
pm2 monit

# Salvar configuração
pm2 save
pm2 startup
```

### Nginx
```bash
# Testar configuração
nginx -t

# Recarregar configuração
systemctl reload nginx

# Ver logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Backup e Manutenção

### Script de Backup Automático
```bash
#!/bin/bash
# /usr/local/bin/backup-prorevest.sh

BACKUP_DIR="/backup/prorevest"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/var/www/prorevest"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C $PROJECT_DIR .

# Backup do banco (se necessário)
# pg_dump dbname > $BACKUP_DIR/db_$DATE.sql

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup concluído: $DATE"
```

### Crontab para Backup Diário
```bash
# Adicionar ao crontab
crontab -e

# Linha para backup diário às 2h
0 2 * * * /usr/local/bin/backup-prorevest.sh
```

## Monitoramento

### Instalar Monitoramento Básico
```bash
# Instalar htop
apt install htop -y

# Monitorar recursos
htop

# Monitorar PM2
pm2 monit

# Monitorar Nginx
tail -f /var/log/nginx/access.log
```

## Solução de Problemas Comuns

### Porta Ocupada
```bash
# Ver portas em uso
netstat -tlnp | grep :3000

# Matar processo
kill -9 PID
```

### Permissões
```bash
# Corrigir permissões
chown -R www-data:www-data /var/www/prorevest
chmod -R 755 /var/www/prorevest
```

### Memória Insuficiente
```bash
# Criar swap file
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## Performance

### Otimizações
- Usar CDN para assets estáticos
- Configurar cache no Nginx
- Otimizar imagens
- Usar compression (gzip)
- Configurar headers de cache

### Exemplo de Cache Nginx
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Migração Gradual

### Fase 1: Setup
1. Instalar Node.js na VPS
2. Configurar ambiente básico
3. Testar com aplicação simples

### Fase 2: Deploy
1. Fazer deploy do projeto
2. Configurar SSL
3. Testar funcionalidades

### Fase 3: Migração
1. Apontar DNS para nova VPS
2. Monitorar funcionamento
3. Remover deploy estático antigo

## Custo Estimado

### VPS Básica (Recomendada)
- 2GB RAM, 2 CPU, 20GB SSD: ~$5-10/mês
- 4GB RAM, 2 CPU, 40GB SSD: ~$15-20/mês

### Comparação
- Deploy estático: $0-5/mês
- Node.js VPS: $5-20/mês
- Benefícios: Infinitamente superiores

## Conclusão

A migração para Node.js na VPS transformará completamente sua aplicação:
- Performance superior
- Funcionalidades completas
- Escalabilidade
- Profissionalismo

O investimento é mínimo comparado aos benefícios obtidos!

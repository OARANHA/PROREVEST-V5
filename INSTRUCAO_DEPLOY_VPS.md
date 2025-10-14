# 🚀 Instruções de Deploy - VPS ProRevest

## 📋 Dados da VPS
- **IP:** 194.163.167.131
- **Domínio:** prorevesttintas.com.br
- **Usuário HestiaCP:** prorevest
- **Acesso SSH:** root
- **SSL:** ✅ Já ativado

## 🔧 Passo a Passo para Deploy

### 1. Acessar a VPS via SSH
```bash
ssh root@194.163.167.131
```

### 2. Navegar para o diretório do domínio
```bash
cd /home/prorevest/web/prorevesttintas.com.br
```

### 3. Criar estrutura de diretórios
```bash
mkdir -p private/{backups,logs,scripts}
mkdir -p public_html
```

### 4. Verificar estrutura atual
```bash
ls -la
ls -la public_html/
```

### 5. Fazer upload dos arquivos necessários

**Opção A: Copiar arquivos via SCP (do seu local)**
```bash
# Copiar script de deploy
scp ProRevest_v4/scripts/deploy.sh root@194.163.167.131:/home/prorevest/web/prorevesttintas.com.br/scripts/

# Copiar .env.production
scp ProRevest_v4/.env.production root@194.163.167.131:/home/prorevest/web/prorevesttintas.com.br/

# Copiar .htaccess
scp ProRevest_v4/.htaccess root@194.163.167.131:/home/prorevest/web/prorevesttintas.com.br/
```

**Opção B: Criar arquivos diretamente na VPS**
```bash
# Criar script de deploy
nano /home/prorevest/web/prorevesttintas.com.br/scripts/deploy.sh
# (colar o conteúdo do script)

# Criar .env.production
nano /home/prorevest/web/prorevesttintas.com.br/.env.production
# (colar o conteúdo e configurar variáveis)

# Criar .htaccess
nano /home/prorevest/web/prorevesttintas.com.br/.htaccess
# (colar o conteúdo)
```

### 6. Configurar permissões
```bash
chmod +x /home/prorevest/web/prorevesttintas.com.br/scripts/deploy.sh
chown -R prorevest:prorevest /home/prorevest/web/prorevesttintas.com.br/
```

### 7. Configurar variáveis de ambiente
```bash
nano /home/prorevest/web/prorevesttintas.com.br/.env.production
```

**Configure as variáveis importantes:**
```bash
VITE_SUPABASE_URL=SEU_SUPABASE_URL_REAL
VITE_SUPABASE_ANON_KEY=SEU_SUPABASE_ANON_KEY_REAL
VITE_SITE_URL=https://prorevesttintas.com.br
VITE_APP_NAME=ProRevest Tintas
VITE_APP_DESCRIPTION=Tintas premium para transformar seus ambientes
```

### 8. Verificar instalação do Node.js
```bash
node --version
npm --version
```

Se não tiver Node.js, instalar:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### 9. Executar o deploy
```bash
cd /home/prorevest/web/prorevesttintas.com.br
./scripts/deploy.sh
```

### 10. Verificar se o site está no ar
```bash
curl -I https://prorevesttintas.com.br
```

## 🔍 Verificação Pós-Deploy

### 1. Verificar arquivos no public_html
```bash
ls -la /home/prorevest/web/prorevesttintas.com.br/public_html/
```

### 2. Verificar logs do deploy
```bash
tail -f /home/prorevest/web/prorevesttintas.com.br/private/logs/deploy_*.log
```

### 3. Verificar logs do Nginx
```bash
tail -f /var/log/nginx/prorevesttintas.com.br.access.log
tail -f /var/log/nginx/prorevesttintas.com.br.error.log
```

### 4. Testar no navegador
Acesse: https://prorevesttintas.com.br

## 🚨 Solução de Problemas

### Se o site não carregar (404/403)
```bash
# Verificar permissões
chown -R prorevest:prorevest /home/prorevest/web/prorevesttintas.com.br/public_html
chmod -R 755 /home/prorevest/web/prorevesttintas.com.br/public_html

# Restart Nginx
systemctl restart nginx
```

### Se o build falhar
```bash
# Verificar Node.js
node --version
npm --version

# Verificar espaço em disco
df -h

# Limpar cache
npm cache clean --force
```

### Se o GitHub não clonar
```bash
# Verificar conectividade
curl -I https://github.com/OARANHA/PROREVEST-V5.git

# Instalar Git se necessário
apt update && apt install git -y
```

## 🔄 Deploy Automático (Opcional)

### Configurar Cron Job para Health Check
```bash
# Editar crontab do root
crontab -e

# Adicionar linha para health check a cada 5 minutos
*/5 * * * * /home/prorevest/web/prorevesttintas.com.br/scripts/health-check.sh
```

### Criar script de health check
```bash
nano /home/prorevest/web/prorevesttintas.com.br/scripts/health-check.sh
```

Conteúdo:
```bash
#!/bin/bash
DOMAIN="prorevesttintas.com.br"
LOG_FILE="/home/prorevest/web/$DOMAIN/private/logs/health.log"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")

if [ "$HTTP_CODE" = "200" ]; then
    echo "$(date): ✅ Site online (HTTP $HTTP_CODE)" >> "$LOG_FILE"
else
    echo "$(date): ❌ Site offline (HTTP $HTTP_CODE)" >> "$LOG_FILE"
fi
```

Dar permissão:
```bash
chmod +x /home/prorevest/web/prorevesttintas.com.br/scripts/health-check.sh
```

## 📁 Estrutura Final Esperada

```
/home/prorevest/web/prorevesttintas.com.br/
├── public_html/                 # Arquivos estáticos do site
│   ├── index.html
│   ├── assets/
│   │   ├── index-abc123.css
│   │   └── index-def456.js
│   └── ...
├── private/
│   ├── backups/                # Backups automáticos
│   ├── logs/                   # Logs do deploy
│   └── scripts/                # Scripts de automação
│       ├── deploy.sh
│       └── health-check.sh
├── .env.production             # Variáveis de ambiente
└── .htaccess                   # Configuração Apache
```

## ✅ Checklist Final

- [ ] SSH acessado com sucesso
- [ ] Estrutura de diretórios criada
- [ ] Arquivos de deploy copiados
- [ ] Variáveis de ambiente configuradas
- [ ] Permissões ajustadas
- [ ] Node.js verificado
- [ ] Script de deploy executado
- [ ] Site acessível via HTTPS
- [ ] Logs verificados
- [ ] Health check funcionando

## 📞 Comandos Úteis

```bash
# Verificar status do Nginx
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# Verificar logs em tempo real
tail -f /var/log/nginx/prorevesttintas.com.br.access.log

# Verificar espaço em disco
df -h

# Verificar uso de memória
free -h

# Verificar processos ativos
ps aux | grep node

# Limpar cache do npm
npm cache clean --force

# Verificar permissões
ls -la /home/prorevest/web/prorevesttintas.com.br/
```

**🚀 Após seguir esses passos, o ProRevest V5 estará no ar em https://prorevesttintas.com.br!**

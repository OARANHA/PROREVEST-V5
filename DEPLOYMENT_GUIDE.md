# Guia de Implantação do Sistema Tintas Prorevest

Este guia descreve os passos necessários para implantar corretamente o sistema ProRevest em um novo ambiente.

## 1. Configuração Inicial

### 1.1. Criar Projeto no Supabase

1. Acesse o [Supabase](https://supabase.io) e crie um novo projeto
2. Anote as credenciais do projeto:
   - Project URL
   - anon key
   - service_role key

### 1.2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 2. Configuração do Banco de Dados

### 2.1. Executar Migrações

As migrações são aplicadas automaticamente pelo Supabase, mas você pode verificar se todas foram aplicadas:

```bash
# Se estiver usando o CLI do Supabase
npx supabase link --project-ref SEU_PROJECT_REF
npx supabase db push
```

### 2.2. Verificar Políticas de Segurança

Certifique-se de que as migrações foram aplicadas na ordem correta:

1. `20250401000000_profiles_table.sql` - Cria a tabela de perfis
2. `20250912000000_fix_profiles_rls_recursion.sql` - Corrige problema de recursão

Para verificar as políticas atuais:

```sql
SELECT * FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles';
```

Deve haver 3 políticas:
- "Admins can manage all profiles" (usando a função helper)
- "Users can update their own profile"
- "Users can view their own profile"

### 2.3. Criar Função Helper (se necessário)

Se a função helper `is_admin_user()` não existir, ela será criada pela migração `20250401000000_profiles_table.sql`.

## 3. Configuração de Usuários

### 3.1. Criar Usuário Administrador

Para criar um usuário administrador, primeiro registre um usuário normal através da interface, depois atualize seu papel no banco de dados:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'ID_DO_USUARIO';
```

Ou use a página de inicialização do banco de dados em `/admin/init-db` para criar automaticamente um usuário administrador.

### 3.2. Inicializar Perfis de Usuários Existentes

Se você tiver usuários existentes sem perfis, use a página `/admin/init-profiles` para criar perfis automaticamente para eles.

## 4. Build e Deploy da Aplicação

### 4.1. Instalar Dependências

```bash
npm install
```

### 4.2. Build de Produção

```bash
npm run build
```

### 4.3. Deploy

Para deploy em produção, siga as instruções específicas da sua plataforma de hospedagem.

## 5. Verificação Pós-Implantação

### 5.1. Testar Acesso

1. Acesse a aplicação através do URL de produção
2. Faça login com um usuário normal
3. Verifique se consegue acessar a página "Meus Projetos"
4. Faça login com um usuário administrador
5. Verifique se consegue acessar a área administrativa em `/admin`

### 5.2. Testar Funcionalidades Críticas

1. Solicitar amostra
2. Visualizar amostras
3. Criar projeto
4. Acessar catálogo de produtos

## 6. Monitoramento e Manutenção

### 6.1. Logs

Verifique os logs da aplicação para identificar possíveis erros:

```bash
# Se estiver usando Docker
docker logs nome_do_container

# Se estiver em uma plataforma como Railway ou Vercel
# Use o painel da plataforma para acessar os logs
```

### 6.2. Atualizações

Ao atualizar o sistema:

1. Faça backup do banco de dados
2. Verifique se há novas migrações no diretório `supabase/migrations`
3. Aplique as migrações conforme necessário
4. Teste todas as funcionalidades críticas após a atualização

## 7. Troubleshooting

### 7.1. Erro de Recursão Infinita

Se encontrar o erro "infinite recursion detected in policy for relation 'profiles'", verifique se:

1. A função helper `is_admin_user()` existe
2. A política "Admins can manage all profiles" está usando a função helper
3. Não há políticas antigas ainda ativas

### 7.2. Problemas de Acesso

Se usuários não conseguirem acessar determinadas funcionalidades:

1. Verifique as políticas RLS das tabelas envolvidas
2. Confirme que o usuário tem o papel correto (admin/user)
3. Verifique se há triggers ou funções que possam estar interferindo

## 8. Backup e Recuperação

### 8.1. Backup do Banco de Dados

```bash
# Usando o CLI do Supabase
npx supabase db dump --file backup.sql
```

### 8.2. Recuperação

```bash
# Usando o CLI do Supabase
npx supabase db reset
npx supabase db push
```

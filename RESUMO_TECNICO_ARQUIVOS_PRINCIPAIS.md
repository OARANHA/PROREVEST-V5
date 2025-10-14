Resumo Técnico dos Principais Arquivos
1. Arquivo de Configuração (package.json)
Tecnologia Principal: React Router v7 com Vite
Gerenciamento de Estado: Context API do React
Autenticação: Supabase Auth
Estilização: Tailwind CSS
Tipagem: TypeScript
Fontes: Cormorant Garamond e Inter
2. Ponto de Entrada (app/root.tsx)
Configuração do HTML base da aplicação
Implementação de provedores de contexto (ThemeProvider e AuthProvider)
Gerenciamento de links e metadados
Tratamento de erros global com boundary
3. Contexto de Autenticação (app/contexts/AuthContext.tsx)
Gerenciamento de estado da autenticação usando Supabase
Funções para login, registro e logout
Observador de mudanças no estado de autenticação
Hook personalizado useAuth para acesso fácil ao contexto
4. Cliente Supabase (app/lib/supabaseClient.ts)
Configuração do cliente Supabase usando variáveis de ambiente
Conexão com o backend para operações de banco de dados e autenticação
5. Páginas Principais
Login (app/routes/login.tsx)
Formulário de autenticação com validação
Integração com o contexto de autenticação
Redirecionamento após login bem-sucedido
Links para recuperação de senha e reenvio de confirmação
Registro (app/routes/register.tsx)
Formulário de cadastro com validação de campos
Confirmação de senha e validação de requisitos
Integração com o contexto de autenticação
Seleção de profissão e empresa
Meus Projetos (app/routes/meus-projetos.tsx)
Dashboard principal do usuário autenticado
Abas para gerenciamento de projetos, orçamentos e amostras
Integração com serviços de projeto, orçamento e amostra
Exibição de dados em formato de cards e tabelas
6. Serviços
Serviço de Projetos (app/services/projectService.ts)
Operações CRUD para projetos e itens de projeto
Integração com Supabase para persistência de dados
Tipos TypeScript para projetos e itens
Serviço de Produtos (app/services/productService.ts)
Busca de produtos com detalhes (categorias, acabamentos, cores, variantes)
Operações para categorias, acabamentos, texturas e cores
Estrutura tipada para todos os elementos de produto
7. Componentes de UI
Layout (app/components/Layout.tsx)
Estrutura base da aplicação
Cabeçalho com navegação e autenticação
Rodapé com informações institucionais
Integração com tema claro/escuro
Provedor de Tema (app/components/ThemeProvider.tsx)
Gerenciamento de tema claro/escuro
Persistência de preferência do usuário
Hook personalizado para uso do tema
A aplicação segue uma arquitetura moderna com React Router para roteamento, Supabase para backend e autenticação, e Tailwind CSS para estilização. O código é fortemente tipado com TypeScript e segue boas práticas de organização em camadas (componentes, contextos, serviços e rotas).
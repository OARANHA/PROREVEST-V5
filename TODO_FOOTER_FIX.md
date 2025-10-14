# Tarefa: Corrigir Footer Duplicado

## Descrição do Problema
Algumas páginas (/catalogo, /sobre, /contato, /blog) estão aparecendo com footer duplicado, enquanto outras páginas têm footer correto. Parece que há um footer sendo renderizado dentro da main class e outro fora, causando duplicação.

## Objetivo
Garantir que todas as páginas tenham apenas UM footer, posicionado fora da main class (no final do documento).

## Lista de Tarefas

- [ ] Investigar arquivos de páginas que estão com footer duplicado
- [ ] Verificar estrutura do Layout component
- [ ] Verificar root.tsx para renderização condicional
- [ ] Analisar SiteFooter component
- [ ] Identificar causa da duplicação
- [ ] Corrigir estrutura para garantir footer único
- [ ] Testar todas as páginas afetadas
- [ ] Verificar que páginas com footer correto continuem funcionando

## Arquivos a Investigar
1. app/routes/catalogo.tsx - página de catálogo
2. app/routes/sobre.tsx - página sobre nós
3. app/routes/contato.tsx - página de contato
4. app/routes/blog.tsx - página de blog
5. app/routes/blog.$slug.tsx - página de post individual do blog
6. app/components/Layout.tsx - layout principal
7. app/root.tsx - raiz com renderização condicional
8. app/components/SiteFooter.tsx - componente do footer

## Possíveis Causas
1. Layout component renderizando footer dentro do conteúdo
2. Root.tsx aplicando footer adicionalmente ao Layout
3. Páginas individuais com footer próprio conflitando com Layout
4. Duplação de componentes em estrutura de layout
5. Condicional incorreta no Layout ou root

## Solução Esperada
- Footer deve ser renderizado APENAS uma vez por página
- Footer deve estar posicionado FORA da main class
- Estrutura deve ser: <body><main>conteúdo</main><footer>footer</footer></body>
- Componentes internos NÃO devem ter footer próprio

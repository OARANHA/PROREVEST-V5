# Árvore do Projeto Prorevest v1.2

```
prorevest_v1.2/
├── .dockerignore
├── .env.example
├── .env.local
├── .gitignore
├── CHANGELOG.md
├── DEPLOYMENT_GUIDE.md
├── Dockerfile
├── package-lock.json
├── package.json
├── PROJECT_PLAN.md
├── react-router.config.ts
├── README.md
├── RESUMO_TECNICO_ARQUIVOS_PRINCIPAIS.md
├── tsconfig.json
├── vite.config.ts
├── ARVORE_PROJETO.md
├── .kilocode/
├── .qoder/
├── app/
│   ├── app.css
│   ├── app.tsx
│   ├── root.tsx
│   ├── routes.ts
│   ├── components/
│   │   ├── AreaSection.tsx
│   │   ├── BenefitsSection.tsx
│   │   ├── CatalogFilters.tsx
│   │   ├── CatalogSidebar.tsx
│   │   ├── CategorySection.tsx
│   │   ├── ColorSection.tsx
│   │   ├── ColorWheel.tsx
│   │   ├── ConsultorButton.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── FilterProgress.tsx
│   │   ├── FinishSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HomeLayout.tsx
│   │   ├── InspirationSection.tsx
│   │   ├── InstagramSection.tsx
│   │   ├── Layout.tsx
│   │   ├── ModernLandingPage.tsx
│   │   ├── PriceSection.tsx
│   │   ├── ProductBadges.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductTypeSection.tsx
│   │   ├── SeasonalThemeToggle.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── SiteHeader.tsx
│   │   ├── SortDropdown.tsx
│   │   ├── ThemeProvider.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── ui/
│   │       └── button.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useProfile.ts
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   └── utils.ts
│   ├── routes/
│   │   ├── admin-layout.tsx
│   │   ├── assinatura-orcamento.tsx
│   │   ├── blog.$slug.tsx
│   │   ├── blog.tsx
│   │   ├── calculadora-rendimento.tsx
│   │   ├── catalogo.tsx
│   │   ├── comparador.tsx
│   │   ├── contato-consultor.tsx
│   │   ├── contato.tsx
│   │   ├── debug-user.tsx
│   │   ├── destaques-semana.tsx
│   │   ├── esqueci-senha.tsx
│   │   ├── home_prorevest.tsx
│   │   ├── home.tsx
│   │   ├── login.tsx
│   │   ├── meus-projetos.tsx
│   │   ├── moodboard.tsx
│   │   ├── orcamento.tsx
│   │   ├── perfil.tsx
│   │   ├── produto.$id.tsx
│   │   ├── projects.$slug.tsx
│   │   ├── projects.tsx
│   │   ├── register.tsx
│   │   ├── resend-confirmation.tsx
│   │   ├── reset-password.tsx
│   │   ├── simulador.tsx
│   │   ├── sobre.tsx
│   │   ├── solicitar-amostra.tsx
│   │   ├── +types/
│   │   │   └── auth/
│   │   ├── admin/
│   │   │   ├── ai-color-assistant.tsx
│   │   │   ├── api-webhooks.tsx
│   │   │   ├── architecture.tsx
│   │   │   ├── backup-lgpd.tsx
│   │   │   ├── blog-posts.tsx
│   │   │   ├── bo-export.tsx
│   │   │   ├── cad-plans.tsx
│   │   │   ├── ci-cd.tsx
│   │   │   ├── cloud-storage.tsx
│   │   │   ├── collaborative-moodboards.tsx
│   │   │   ├── data-export.tsx
│   │   │   ├── digital-signature-admin.tsx
│   │   │   ├── digital-signature.tsx
│   │   │   ├── dosage-formulas.tsx
│   │   │   ├── dosage-machines.tsx
│   │   │   ├── dynamic-templates.$id.edit.tsx
│   │   │   ├── dynamic-templates.tsx
│   │   │   ├── editable-layers.tsx
│   │   │   ├── email-templates.tsx
│   │   │   ├── final-testing.tsx
│   │   │   ├── formula-history.tsx
│   │   │   ├── formula-import-export.tsx
│   │   │   ├── gamification.tsx
│   │   │   ├── generate-quote-pdf.tsx
│   │   │   ├── index.tsx
│   │   │   ├── init-db.tsx
│   │   │   ├── intelligent-reports.tsx
│   │   │   ├── logistics-dashboard.tsx
│   │   │   ├── magic-calculator.tsx
│   │   │   ├── notification-settings.tsx
│   │   │   ├── offline-mode.tsx
│   │   │   ├── predictive-alerts.tsx
│   │   │   ├── production-reports.tsx
│   │   │   ├── products.tsx
│   │   │   ├── project-cases.tsx
│   │   │   ├── quote-templates.tsx
│   │   │   ├── quotes.$id.tsx
│   │   │   ├── region-heatmap.tsx
│   │   │   ├── reports.tsx
│   │   │   ├── sample-tracking.tsx
│   │   │   ├── samples.tsx
│   │   │   ├── schedule-emails.tsx
│   │   │   ├── system-logs.tsx
│   │   │   ├── technical-config.tsx
│   │   │   ├── technical-settings.tsx
│   │   │   ├── test-db.tsx
│   │   │   ├── tinting-machines.tsx
│   │   │   ├── users.tsx
│   │   │   └── quotes/
│   │   │       └── index.tsx
│   │   └── auth/
│   │       └── callback.tsx
│   ├── services/
│   │   ├── blogService.ts
│   │   ├── databaseService.ts
│   │   ├── digitalSignatureService.ts
│   │   ├── dosageService.ts
│   │   ├── emailService.ts
│   │   ├── exportService.ts
│   │   ├── gamificationService.ts
│   │   ├── offlineService.ts
│   │   ├── pdfService.ts
│   │   ├── productService.ts
│   │   ├── projectService.ts
│   │   ├── quoteService.ts
│   │   ├── reportService.ts
│   │   ├── sampleService.ts
│   │   ├── technicalConfigService.ts
│   │   ├── templateService.ts
│   │   ├── userService.ts
│   │   └── welcome/
│   │       ├── logo-dark.svg
│   │       ├── logo-light.svg
│   │       └── welcome.tsx
├── public/
│   ├── favicon.ico
│   └── images/
│       ├── banner.png
│       ├── banner01.jpeg
│       ├── banner2.jpg
│       ├── banner3.jpg
│       ├── banner4.jpg
│       ├── banner4.png
│       ├── hero-bg.jpg
│       ├── project-1.jpg
│       ├── project-2.jpg
│       └── project-3.jpg
├── scripts/
│   └── verify-security-policies.js
└── supabase/
    └── migrations/
        └── 20250912000000_fix_profiles_rls_recursion.sql
```

## Resumo da Estrutura

O projeto Prorevest v1.2 é uma aplicação web full-stack com as seguintes características principais:

### Diretórios Principais:
- **app/**: Contém todo o código fonte da aplicação React
- **public/**: Arquivos estáticos acessíveis publicamente
- **scripts/**: Scripts utilitários do projeto
- **supabase/**: Migrações e configurações do banco de dados

### Estrutura da Aplicação (app/):
- **components/**: Componentes React reutilizáveis
  - **ui/**: Componentes de interface básicos
- **contexts/**: Contextos React para gerenciamento de estado
- **hooks/**: Hooks personalizados
- **lib/**: Bibliotecas e utilitários
- **routes/**: Definições de rotas da aplicação
  - **admin/**: Rotas da área administrativa
  - **auth/**: Rotas de autenticação
- **services/**: Serviços para integração com APIs e funcionalidades

### Rotas Principais:
- Rotas públicas: home, blog, catálogo, contato, etc.
- Rotas de autenticação: login, register, recuperação de senha
- Rotas de usuário: perfil, meus-projetos
- Rotas administrativas: extenso conjunto de rotas para gestão do sistema

### Recursos Implementados:
- Sistema de autenticação completo
- Catálogo de produtos com filtros
- Sistema de orçamentos
- Blog
- Moodboards
- Dashboard administrativo completo
- Integração com Supabase para banco de dados
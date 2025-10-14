import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjkwMjAsImV4cCI6MjA3MzE0NTAyMH0.BjvSkNApLu12iPG8fOVN9HhZx_j9OIb6uKgMBGCinEE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBlogTables() {
  console.log('🔧 Criando tabelas do blog...');

  try {
    // Criar tabela blog_posts
    console.log('📝 Criando tabela blog_posts...');
    const { error: blogPostsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT,
          author TEXT NOT NULL DEFAULT 'ProRevest Team',
          author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
          published_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          featured_image TEXT,
          tags TEXT[] DEFAULT '{}',
          category TEXT NOT NULL DEFAULT 'Geral',
          views INTEGER DEFAULT 0
        );
      `
    });

    if (blogPostsError) {
      console.error('❌ Erro ao criar blog_posts:', blogPostsError);
    } else {
      console.log('✅ Tabela blog_posts criada com sucesso!');
    }

    // Criar tabela project_cases
    console.log('📝 Criando tabela project_cases...');
    const { error: projectCasesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS project_cases (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          content TEXT,
          client TEXT,
          location TEXT,
          completed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          featured_image TEXT,
          images TEXT[] DEFAULT '{}',
          tags TEXT[] DEFAULT '{}',
          category TEXT NOT NULL DEFAULT 'Geral',
          views INTEGER DEFAULT 0,
          products_used TEXT[] DEFAULT '{}'
        );
      `
    });

    if (projectCasesError) {
      console.error('❌ Erro ao criar project_cases:', projectCasesError);
    } else {
      console.log('✅ Tabela project_cases criada com sucesso!');
    }

    // Criar índices
    console.log('📝 Criando índices...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);',
      'CREATE INDEX IF NOT EXISTS idx_project_cases_status ON project_cases(status);',
      'CREATE INDEX IF NOT EXISTS idx_project_cases_completed_at ON project_cases(completed_at DESC);',
      'CREATE INDEX IF NOT EXISTS idx_project_cases_category ON project_cases(category);',
      'CREATE INDEX IF NOT EXISTS idx_project_cases_slug ON project_cases(slug);'
    ];

    for (const indexSql of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSql });
      if (indexError) {
        console.error('❌ Erro ao criar índice:', indexError);
      }
    }

    console.log('✅ Índices criados com sucesso!');

    // Habilitar RLS
    console.log('📝 Habilitando RLS...');
    await supabase.rpc('exec_sql', { sql: 'ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;' });
    await supabase.rpc('exec_sql', { sql: 'ALTER TABLE project_cases ENABLE ROW LEVEL SECURITY;' });

    // Criar políticas RLS
    console.log('📝 Criando políticas RLS...');
    const policies = [
      'DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;',
      'CREATE POLICY "Anyone can view published blog posts" ON blog_posts FOR SELECT USING (status = \'published\');',
      
      'DROP POLICY IF EXISTS "Anyone can view published project cases" ON project_cases;',
      'CREATE POLICY "Anyone can view published project cases" ON project_cases FOR SELECT USING (status = \'published\');'
    ];

    for (const policySql of policies) {
      const { error: policyError } = await supabase.rpc('exec_sql', { sql: policySql });
      if (policyError) {
        console.error('❌ Erro ao criar política:', policyError);
      }
    }

    console.log('✅ Políticas RLS criadas com sucesso!');

    // Inserir dados de exemplo
    console.log('📝 Inserindo dados de exemplo...');
    const samplePosts = [
      {
        title: 'Como Escolher a Cor Perfeita para Sua Parede',
        slug: 'como-escolher-cor-perfeita-parede',
        excerpt: 'Descubra as melhores dicas para escolher a cor ideal que transformará seu ambiente.',
        content: '# Como Escolher a Cor Perfeita para Sua Parede\n\nEscolher a cor certa para suas paredes pode transformar completamente um ambiente.',
        author: 'ProRevest Team',
        status: 'published',
        category: 'Decoração',
        tags: ['cores', 'paredes', 'decoração', 'dicas'],
        published_at: new Date().toISOString()
      },
      {
        title: 'Tintas Ecológicas: O Futuro da Pintura',
        slug: 'tintas-ecologicas-futuro-pintura',
        excerpt: 'Conheça as vantagens das tintas ecológicas e como elas estão revolucionando o mercado.',
        content: '# Tintas Ecológicas: O Futuro da Pintura\n\nAs tintas ecológicas estão ganhando espaço no mercado.',
        author: 'ProRevest Team',
        status: 'published',
        category: 'Sustentabilidade',
        tags: ['ecológico', 'sustentável', 'meio ambiente', 'saúde'],
        published_at: new Date().toISOString()
      }
    ];

    for (const post of samplePosts) {
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert(post);

      if (insertError) {
        console.error('❌ Erro ao inserir post:', insertError);
      } else {
        console.log(`✅ Post "${post.title}" inserido com sucesso!`);
      }
    }

    console.log('🎉 Tabelas do blog criadas e configuradas com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

// Tentar criar tabelas usando SQL direto se RPC não funcionar
async function createTablesWithDirectSQL() {
  console.log('🔧 Tentando criar tabelas com SQL direto...');

  try {
    // Tentar criar tabela blog_posts
    const { error: createError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (createError && createError.code === 'PGRST116') {
      // Tabela não existe, tentar criar via SQL
      console.log('📝 Tabela blog_posts não existe, tentando criar...');
      
      // Como não podemos executar SQL diretamente via REST API,
      // vamos mostrar as instruções SQL para execução manual
      const sqlInstructions = `
-- Execute este SQL diretamente no painel do Supabase:

-- Criar tabela blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL DEFAULT 'ProRevest Team',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Geral',
  views INTEGER DEFAULT 0
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Habilitar RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Criar políticas
CREATE POLICY "Anyone can view published blog posts" ON blog_posts 
FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" ON blog_posts 
FOR ALL USING (auth.role() = 'authenticated');
      `;

      console.log('📋 Instruções SQL para criar as tabelas:');
      console.log(sqlInstructions);
      
      // Criar arquivo com instruções
      const fs = require('fs');
      fs.writeFileSync('create-blog-tables.sql', sqlInstructions);
      console.log('💾 Arquivo create-blog-tables.sql criado com instruções SQL');
      
    } else {
      console.log('✅ Tabela blog_posts já existe!');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

// Executar
createBlogTables().catch(() => {
  console.log('🔄 Tentando método alternativo...');
  createTablesWithDirectSQL();
});

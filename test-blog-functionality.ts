import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjkwMjAsImV4cCI6MjA3MzE0NTAyMH0.BjvSkNApLu12iPG8fOVN9HhZx_j9OIb6uKgMBGCinEE';

const supabase = createClient(supabaseUrl, supabaseKey);

// Definir variáveis globalmente para o BlogService
(process as any).env.VITE_SUPABASE_URL = supabaseUrl;
(process as any).env.VITE_SUPABASE_ANON_KEY = supabaseKey;

async function testBlogFunctionality() {
  console.log('🧪 Testando funcionalidades do blog...\n');

  try {
    // Teste 1: Verificar se tabelas existem
    console.log('1️⃣ Verificando tabelas...');
    const { data: tables, error: tablesError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('❌ Erro ao acessar tabela blog_posts:', tablesError);
      return;
    }
    console.log('✅ Tabela blog_posts acessível');

    // Teste 2: Buscar posts publicados
    console.log('\n2️⃣ Buscando posts publicados...');
    const posts = await BlogService.getPublishedBlogPosts();
    console.log(`✅ Encontrados ${posts.length} posts publicados`);

    if (posts.length > 0) {
      console.log('📝 Posts encontrados:');
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title} (${post.category})`);
      });
    }

    // Teste 3: Buscar categorias
    console.log('\n3️⃣ Buscando categorias...');
    const categories = await BlogService.getBlogCategories();
    console.log(`✅ Categorias encontradas: ${categories.join(', ')}`);

    // Teste 4: Buscar post por slug
    if (posts.length > 0) {
      console.log('\n4️⃣ Testando busca por slug...');
      const firstPost = posts[0];
      const postBySlug = await BlogService.getBlogPostBySlug(firstPost.slug);
      
      if (postBySlug) {
        console.log(`✅ Post encontrado por slug: ${postBySlug.title}`);
        console.log(`   📅Publicado em: ${new Date(postBySlug.published_at || postBySlug.created_at).toLocaleDateString('pt-BR')}`);
        console.log(`   👤 Autor: ${postBySlug.author}`);
        console.log(`   📊 Views: ${postBySlug.views}`);
      } else {
        console.log('❌ Post não encontrado pelo slug');
      }
    }

    // Teste 5: Buscar tags
    console.log('\n5️⃣ Buscando tags...');
    const tags = await BlogService.getBlogTags();
    console.log(`✅ Tags encontradas: ${tags.join(', ')}`);

    console.log('\n🎉 Todos os testes do blog foram concluídos com sucesso!');
    console.log('\n🌐 Acesse o blog em: http://localhost:5174/blog');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testBlogFunctionality();

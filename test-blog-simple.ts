import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjkwMjAsImV4cCI6MjA3MzE0NTAyMH0.BjvSkNApLu12iPG8fOVN9HhZx_j9OIb6uKgMBGCinEE';

const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('❌ Erro ao buscar posts:', postsError);
      return;
    }

    console.log(`✅ Encontrados ${posts.length} posts publicados`);

    if (posts.length > 0) {
      console.log('📝 Posts encontrados:');
      posts.forEach((post: any, index: number) => {
        console.log(`   ${index + 1}. ${post.title} (${post.category})`);
      });
    }

    // Teste 3: Buscar categorias
    console.log('\n3️⃣ Buscando categorias...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('blog_posts')
      .select('category')
      .not('category', 'is', null);

    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError);
    } else {
      const categories = [...new Set(categoriesData?.map((item: any) => item.category) || [])];
      console.log(`✅ Categorias encontradas: ${categories.join(', ')}`);
    }

    // Teste 4: Buscar post por slug
    if (posts.length > 0) {
      console.log('\n4️⃣ Testando busca por slug...');
      const firstPost = posts[0];
      const { data: postBySlug, error: slugError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', firstPost.slug)
        .single();

      if (slugError) {
        console.error('❌ Erro ao buscar post por slug:', slugError);
      } else if (postBySlug) {
        console.log(`✅ Post encontrado por slug: ${postBySlug.title}`);
        console.log(`   📅Publicado em: ${new Date(postBySlug.published_at || postBySlug.created_at).toLocaleDateString('pt-BR')}`);
        console.log(`   👤 Autor: ${postBySlug.author}`);
        console.log(`   📊 Views: ${postBySlug.views}`);
      }
    }

    // Teste 5: Buscar tags
    console.log('\n5️⃣ Buscando tags...');
    const { data: tagsData, error: tagsError } = await supabase
      .from('blog_posts')
      .select('tags');

    if (tagsError) {
      console.error('❌ Erro ao buscar tags:', tagsError);
    } else {
      const allTags: string[] = [];
      tagsData?.forEach((post: any) => {
        if (post.tags && Array.isArray(post.tags)) {
          allTags.push(...post.tags);
        }
      });
      const uniqueTags = [...new Set(allTags)];
      console.log(`✅ Tags encontradas: ${uniqueTags.join(', ')}`);
    }

    console.log('\n🎉 Todos os testes do blog foram concluídos com sucesso!');
    console.log('\n🌐 Acesse o blog em: http://localhost:5174/blog');
    console.log('📝 Teste também a página individual: http://localhost:5174/blog/como-escolher-cor-perfeita-parede');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  }
}

// Executar testes
testBlogFunctionality();

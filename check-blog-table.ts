import { supabase } from './app/lib/supabaseClient';

async function checkBlogTable() {
  console.log('🔍 Verificando estrutura da tabela blog_posts...');
  
  try {
    // Verificar se a tabela existe
    const { data: tables, error: tablesError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Erro ao acessar tabela blog_posts:', tablesError);
      console.log('📋 Detalhes do erro:', {
        code: tablesError.code,
        message: tablesError.message,
        details: tablesError.details
      });
      
      // Tentar verificar quais tabelas existem
      console.log('\n🔍 Verificando tabelas existentes...');
      const { data: existingTables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (existingTables) {
        console.log('📋 Tabelas existentes:');
        existingTables.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
      }
    } else {
      console.log('✅ Tabela blog_posts existe!');
      console.log('📊 Estrutura da tabela:');
      console.log(tables);
    }
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

checkBlogTable();

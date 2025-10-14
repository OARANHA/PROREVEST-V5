import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listExistingTables() {
  try {
    console.log('Verificando tabelas existentes...');
    
    // Verificar tabelas específicas que esperamos
    const expectedTables = [
      'categories', 
      'finishes', 
      'textures', 
      'colors', 
      'products', 
      'product_variants', 
      'profiles',
      'auth.users',
      'auth.profiles'
    ];
    
    console.log('Verificação de tabelas específicas:');
    for (const tableName of expectedTables) {
      try {
        // Para tabelas do auth, precisamos usar uma abordagem diferente
        if (tableName.startsWith('auth.')) {
          console.log(`- ${tableName}: Tabela do sistema de autenticação`);
          continue;
        }
        
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ ${tableName}: Não acessível (${tableError.message})`);
        } else {
          console.log(`✓ ${tableName}: Acessível (${tableData?.length || 0} registros)`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: Erro ao acessar (${err})`);
      }
    }
    
    // Tentar verificar estruturas específicas
    console.log('\nVerificando estrutura de tabelas principais:');
    
    // Verificar se a tabela products tem as colunas esperadas
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, slug')
        .limit(1);
      
      if (productsError) {
        console.log('❌ Tabela products: Erro ao acessar estrutura');
      } else {
        console.log('✓ Tabela products: Estrutura acessível');
      }
    } catch (err) {
      console.log('❌ Tabela products: Erro ao verificar estrutura');
    }
    
    // Verificar se a tabela categories tem as colunas esperadas
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(1);
      
      if (categoriesError) {
        console.log('❌ Tabela categories: Erro ao acessar estrutura');
      } else {
        console.log('✓ Tabela categories: Estrutura acessível');
      }
    } catch (err) {
      console.log('❌ Tabela categories: Erro ao verificar estrutura');
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
listExistingTables();
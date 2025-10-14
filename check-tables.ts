import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('Verificando tabelas...');
    
    // Verificar cada tabela
    const tables = ['categories', 'finishes', 'textures', 'colors', 'products', 'product_variants'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Tabela '${table}' não acessível:`, error.message);
        } else {
          console.log(`✓ Tabela '${table}' acessível - ${data?.length || 0} registros encontrados`);
        }
      } catch (error) {
        console.log(`❌ Erro ao acessar tabela '${table}':`, error);
      }
    }
    
    console.log('Verificação concluída!');
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
checkTables();
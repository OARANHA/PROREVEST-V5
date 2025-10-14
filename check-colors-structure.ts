import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColorsStructure() {
  try {
    console.log('Verificando estrutura da tabela colors...');
    
    // Tentar inserir um registro simples para verificar quais colunas são aceitas
    const testRecord = {
      name: 'Test Color',
      hex_code: '#000000'
    };
    
    const { data, error } = await supabase
      .from('colors')
      .insert([testRecord])
      .select('*');
    
    if (error) {
      console.log('Erro ao inserir registro de teste:', error.message);
    } else {
      console.log('Registro inserido com sucesso. Colunas disponíveis:');
      if (data && data.length > 0) {
        console.log(Object.keys(data[0]));
      }
      
      // Remover o registro de teste
      if (data && data.length > 0) {
        await supabase
          .from('colors')
          .delete()
          .eq('name', 'Test Color');
        console.log('Registro de teste removido');
      }
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
checkColorsStructure();
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testando conexão com Supabase...');
    
    // Tentar uma operação simples
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    
    if (error) {
      console.error('Erro na conexão:', error.message);
    } else {
      console.log('Conexão bem sucedida!');
      console.log('Dados:', data);
    }
  } catch (error) {
    console.error('Erro ao testar conexão:', error);
  }
}

// Executar se chamado diretamente
testConnection();
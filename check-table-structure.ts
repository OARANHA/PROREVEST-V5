import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupTestRecords() {
  try {
    console.log('Removendo registros de teste...');
    
    // Remover registros de teste
    const { error: categoriesError } = await supabase
      .from('categories')
      .delete()
      .eq('name', 'Test Category');
    
    if (categoriesError) {
      console.log('Erro ao remover registros de teste de categories:', categoriesError.message);
    } else {
      console.log('✓ Registros de teste removidos de categories');
    }
    
    const { error: finishesError } = await supabase
      .from('finishes')
      .delete()
      .eq('name', 'Test Finish');
    
    if (finishesError) {
      console.log('Erro ao remover registros de teste de finishes:', finishesError.message);
    } else {
      console.log('✓ Registros de teste removidos de finishes');
    }
    
    const { error: texturesError } = await supabase
      .from('textures')
      .delete()
      .eq('name', 'Test Texture');
    
    if (texturesError) {
      console.log('Erro ao remover registros de teste de textures:', texturesError.message);
    } else {
      console.log('✓ Registros de teste removidos de textures');
    }
    
    console.log('Limpeza concluída!');
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
cleanupTestRecords();

async function checkTableStructure() {
  try {
    console.log('Verificando estrutura das tabelas...');
    
    // Verificar estrutura da tabela categories
    console.log('\n--- Estrutura da tabela categories ---');
    try {
      // Tentar inserir um registro simples para verificar quais colunas são aceitas
      const testRecord = {
        name: 'Test Category',
        description: 'Test Description'
      };
      
      const { data, error } = await supabase
        .from('categories')
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
            .from('categories')
            .delete()
            .eq('name', 'Test Category');
        }
      }
    } catch (err) {
      console.log('Erro ao verificar categories:', err);
    }
    
    // Verificar estrutura da tabela finishes
    console.log('\n--- Estrutura da tabela finishes ---');
    try {
      // Tentar inserir um registro simples para verificar quais colunas são aceitas
      const testRecord = {
        name: 'Test Finish',
        description: 'Test Description'
      };
      
      const { data, error } = await supabase
        .from('finishes')
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
            .from('finishes')
            .delete()
            .eq('name', 'Test Finish');
        }
      }
    } catch (err) {
      console.log('Erro ao verificar finishes:', err);
    }
    
    // Verificar estrutura da tabela textures
    console.log('\n--- Estrutura da tabela textures ---');
    try {
      // Tentar inserir um registro simples para verificar quais colunas são aceitas
      const testRecord = {
        name: 'Test Texture',
        description: 'Test Description'
      };
      
      const { data, error } = await supabase
        .from('textures')
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
            .from('textures')
            .delete()
            .eq('name', 'Test Texture');
        }
      }
    } catch (err) {
      console.log('Erro ao verificar textures:', err);
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
checkTableStructure();
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAdminRoles() {
  try {
    console.log('Atualizando papéis de administrador...');
    
    // Atualizar perfis com role = 'Admin' para 'admin'
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('role', 'Admin')
      .select();

    if (error) {
      console.error('Erro ao atualizar papéis:', error);
    } else {
      console.log(`Atualizados ${data.length} perfis com papel de administrador`);
      console.log('Perfis atualizados:', data);
    }
    
    // Verificar perfis com role = 'admin'
    const { data: adminProfiles, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');

    if (adminError) {
      console.error('Erro ao buscar perfis de administrador:', adminError);
    } else {
      console.log(`Encontrados ${adminProfiles.length} perfis com papel de administrador`);
      console.log('Perfis de administrador:', adminProfiles);
    }
    
    console.log('Processo concluído!');
    
  } catch (error) {
    console.error('Erro ao atualizar papéis de administrador:', error);
  }
}

updateAdminRoles();
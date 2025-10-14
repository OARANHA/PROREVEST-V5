const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfilesForCurrentUsers() {
  try {
    // Lista de usuários atuais
    const currentUsers = [
      {
        id: '062ecce8-ad75-440e-9e45-7bc0665c7b4c',
        email: 'teste@tintaszanai.com.br',
        full_name: 'Usuário de Teste'
      },
      {
        id: '95fcb14d-ba3a-4a40-b69c-1457ed66d9fc',
        email: 'teste2@tintaszanai.com.br',
        full_name: 'Usuário de Teste 2'
      }
    ];

    console.log(`Criando perfis para ${currentUsers.length} usuários...`);
    
    // Criar perfis para esses usuários
    for (const user of currentUsers) {
      console.log(`Criando perfil para usuário ${user.email}...`);
      
      // Criar perfil na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.full_name || '',
          role: 'customer'
        });

      if (profileError) {
        console.error(`Erro ao criar perfil na tabela profiles para usuário ${user.id}:`, profileError);
      } else {
        console.log(`Perfil criado na tabela profiles para usuário ${user.id}`);
      }
      
      // Criar perfil na tabela user_profiles
      const { error: userProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          full_name: user.full_name || '',
          role: 'visitor'
        });

      if (userProfileError) {
        console.error(`Erro ao criar perfil na tabela user_profiles para usuário ${user.id}:`, userProfileError);
      } else {
        console.log(`Perfil criado na tabela user_profiles para usuário ${user.id}`);
      }
    }
    
    console.log('Processo concluído!');
    
  } catch (error) {
    console.error('Erro ao criar perfis diretamente:', error);
  }
}

createProfilesForCurrentUsers();
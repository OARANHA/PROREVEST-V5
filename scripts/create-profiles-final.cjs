const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfilesDirectly() {
  try {
    // Lista de usuários que identificamos anteriormente que não têm perfis
    const usersWithoutProfiles = [
      {
        id: 'b9dd16e3-ab1c-432d-8b44-0904503f83a0',
        email: 'admin@tintaszanai.com.br',
        full_name: ''
      },
      {
        id: '8b1c14ef-c318-478e-b003-0bcca08f6fe5',
        email: 'o_aranha@hotmail.com',
        full_name: 'ALESSANDRO DELFINO'
      },
      {
        id: 'fe8fe8ac-ad8d-47b5-bdb9-fa8ab7e884a3',
        email: 'aranha.com@gmail.com',
        full_name: ''
      }
    ];

    console.log(`Criando perfis para ${usersWithoutProfiles.length} usuários...`);
    
    // Criar perfis para esses usuários
    for (const user of usersWithoutProfiles) {
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

createProfilesDirectly();
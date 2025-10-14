const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfilesDirectly() {
  try {
    // Criar perfis para os usuários existentes que não têm perfis
    console.log('Criando perfis para usuários existentes...');
    
    // Obter todos os usuários do auth que não têm perfil em nenhuma das tabelas
    const { data: users, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email, raw_user_meta_data->full_name');

    if (usersError) throw usersError;

    // Filtrar usuários que não têm perfis em nenhuma das tabelas
    const usersWithoutProfiles = [];
    for (const user of users) {
      // Verificar se o usuário tem perfil na tabela profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // Verificar se o usuário tem perfil na tabela user_profiles
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
      
      // Se não tiver perfil em nenhuma das tabelas, adicionar à lista
      if ((!profileData || profileError) && (!userProfileData || userProfileError)) {
        usersWithoutProfiles.push({
          id: user.id,
          email: user.email,
          full_name: user.raw_user_meta_data?.full_name || ''
        });
      }
    }

    if (usersWithoutProfiles.length > 0) {
      console.log(`Encontrados ${usersWithoutProfiles.length} usuários sem perfil. Criando perfis...`);
      
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
    } else {
      console.log('Nenhum usuário sem perfil encontrado');
    }
    
    console.log('Processo concluído!');
    
  } catch (error) {
    console.error('Erro ao criar perfis diretamente:', error);
  }
}

createProfilesDirectly();
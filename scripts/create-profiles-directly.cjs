const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfilesDirectly() {
  try {
    // Desativar RLS temporariamente para a tabela profiles
    console.log('Desativando RLS para a tabela profiles...');
    const { error: disableProfilesRLSError } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableProfilesRLSError) {
      console.error('Erro ao desativar RLS para profiles:', disableProfilesRLSError);
    } else {
      console.log('RLS desativado para a tabela profiles');
    }
    
    // Desativar RLS temporariamente para a tabela user_profiles
    console.log('Desativando RLS para a tabela user_profiles...');
    const { error: disableUserProfilesRLSError } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableUserProfilesRLSError) {
      console.error('Erro ao desativar RLS para user_profiles:', disableUserProfilesRLSError);
    } else {
      console.log('RLS desativado para a tabela user_profiles');
    }
    
    // Criar perfis para os usuários existentes que não têm perfis
    console.log('Criando perfis para usuários existentes...');
    
    // Obter todos os usuários do auth que não têm perfil em nenhuma das tabelas
    const { data: users, error: usersError } = await supabase.rpc('execute_sql', {
      sql: `
        SELECT id, email, raw_user_meta_data->>'full_name' as full_name
        FROM auth.users
        WHERE id NOT IN (SELECT id FROM profiles)
        OR id NOT IN (SELECT id FROM user_profiles)
      `
    });

    if (usersError) throw usersError;

    if (users && users.length > 0) {
      console.log(`Encontrados ${users.length} usuários sem perfil. Criando perfis...`);
      
      // Criar perfis para esses usuários
      for (const user of users) {
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
    
    // Reativar RLS para a tabela profiles
    console.log('Reativando RLS para a tabela profiles...');
    const { error: enableProfilesRLSError } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;'
    });
    
    if (enableProfilesRLSError) {
      console.error('Erro ao reativar RLS para profiles:', enableProfilesRLSError);
    } else {
      console.log('RLS reativado para a tabela profiles');
    }
    
    // Reativar RLS para a tabela user_profiles
    console.log('Reativando RLS para a tabela user_profiles...');
    const { error: enableUserProfilesRLSError } = await supabase.rpc('execute_sql', {
      sql: 'ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;'
    });
    
    if (enableUserProfilesRLSError) {
      console.error('Erro ao reativar RLS para user_profiles:', enableUserProfilesRLSError);
    } else {
      console.log('RLS reativado para a tabela user_profiles');
    }
    
    console.log('Processo concluído!');
    
  } catch (error) {
    console.error('Erro ao criar perfis diretamente:', error);
  }
}

createProfilesDirectly();
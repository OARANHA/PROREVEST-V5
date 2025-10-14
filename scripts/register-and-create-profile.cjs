const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function registerAndCreateProfile() {
  try {
    console.log('Registrando novo usuário de teste...');
    
    // Registrar um novo usuário
    const { data, error } = await supabase.auth.signUp({
      email: 'teste2@tintaszanai.com.br',
      password: 'SenhaTeste123!',
      options: {
        data: {
          full_name: 'Usuário de Teste 2'
        }
      }
    });

    if (error) {
      console.error('Erro ao registrar usuário:', error);
      return;
    }

    console.log('Usuário registrado com sucesso:', data.user.id);
    
    // Criar o perfil manualmente na tabela profiles
    console.log('Criando perfil na tabela profiles...');
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: 'Usuário de Teste 2',
        role: 'customer'
      });

    if (profileError) {
      console.error('Erro ao criar perfil na tabela profiles:', profileError);
    } else {
      console.log('Perfil criado com sucesso na tabela profiles');
    }
    
    // Criar o perfil manualmente na tabela user_profiles
    console.log('Criando perfil na tabela user_profiles...');
    const { error: userProfileError } = await supabase
      .from('user_profiles')
      .insert({
        id: data.user.id,
        full_name: 'Usuário de Teste 2',
        role: 'visitor'
      });

    if (userProfileError) {
      console.error('Erro ao criar perfil na tabela user_profiles:', userProfileError);
    } else {
      console.log('Perfil criado com sucesso na tabela user_profiles');
    }
    
    // Verificar se os perfis foram criados
    console.log('Verificando criação dos perfis...');
    
    // Verificar na tabela profiles
    const { data: profileData, error: checkProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (checkProfileError) {
      console.log('Perfil não encontrado na tabela profiles');
    } else {
      console.log('Perfil encontrado na tabela profiles:', profileData);
    }
    
    // Verificar na tabela user_profiles
    const { data: userProfileData, error: checkUserProfileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (checkUserProfileError) {
      console.log('Perfil não encontrado na tabela user_profiles');
    } else {
      console.log('Perfil encontrado na tabela user_profiles:', userProfileData);
    }
    
  } catch (error) {
    console.error('Erro ao registrar usuário de teste:', error);
  }
}

registerAndCreateProfile();
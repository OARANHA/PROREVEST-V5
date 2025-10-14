const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function registerTestUser() {
  try {
    console.log('Registrando novo usuário de teste...');
    
    // Registrar um novo usuário
    const { data, error } = await supabase.auth.signUp({
      email: 'teste@tintaszanai.com.br',
      password: 'SenhaTeste123!',
      options: {
        data: {
          full_name: 'Usuário de Teste'
        }
      }
    });

    if (error) {
      console.error('Erro ao registrar usuário:', error);
      return;
    }

    console.log('Usuário registrado com sucesso:', data.user.id);
    
    // Verificar se o perfil foi criado nas tabelas
    console.log('Verificando criação do perfil...');
    
    // Verificar na tabela profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.log('Perfil não encontrado na tabela profiles');
    } else {
      console.log('Perfil encontrado na tabela profiles:', profileData);
    }
    
    // Verificar na tabela user_profiles
    const { data: userProfileData, error: userProfileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userProfileError) {
      console.log('Perfil não encontrado na tabela user_profiles');
    } else {
      console.log('Perfil encontrado na tabela user_profiles:', userProfileData);
    }
    
  } catch (error) {
    console.error('Erro ao registrar usuário de teste:', error);
  }
}

registerTestUser();
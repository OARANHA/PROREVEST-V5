const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase com as credenciais fornecidas
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createProfileForOAranha() {
  try {
    const userId = 'e45ab720-800a-4fcc-a192-77e6e70b10f1';
    const userEmail = 'o_aranha@hotmail.com';
    const userFullName = 'ALESSANDRO DELFINO';
    
    console.log(`Criando perfil para usuário ${userEmail}...`);
    
    // Criar perfil na tabela profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: userFullName,
        role: 'customer'
      });

    if (profileError) {
      console.error(`Erro ao criar perfil na tabela profiles para usuário ${userId}:`, profileError);
    } else {
      console.log(`Perfil criado na tabela profiles para usuário ${userId}`);
    }
    
    // Criar perfil na tabela user_profiles
    const { error: userProfileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        full_name: userFullName,
        role: 'visitor'
      });

    if (userProfileError) {
      console.error(`Erro ao criar perfil na tabela user_profiles para usuário ${userId}:`, userProfileError);
    } else {
      console.log(`Perfil criado na tabela user_profiles para usuário ${userId}`);
    }
    
    console.log('Processo concluído!');
    
  } catch (error) {
    console.error('Erro ao criar perfil para o usuário:', error);
  }
}

createProfileForOAranha();
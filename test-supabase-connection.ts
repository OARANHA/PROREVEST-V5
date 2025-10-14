import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NjkwMjAsImV4cCI6MjA3MzE0NTAyMH0.BjvSkNApLu12iPG8fOVN9HhZx_j9OIb6uKgMBGCinEE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  
  try {
    // Test 1: Conexão básica
    console.log('📡 Testando conexão básica...');
    const { data, error } = await supabase.from('products').select('count').single();
    
    if (error) {
      console.error('❌ Erro na conexão básica:', error);
      return;
    }
    
    console.log('✅ Conexão básica funcionando');
    
    // Test 2: Verificar se a tabela products existe
    console.log('📋 Verificando tabela products...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (productsError) {
      console.error('❌ Erro ao acessar tabela products:', productsError);
      return;
    }
    
    console.log('✅ Tabela products acessível');
    
    // Test 3: Query complexa (similar à do erro)
    console.log('🔍 Testando query complexa...');
    const { data: complexData, error: complexError } = await supabase
      .from('products')
      .select(`
        *,
        categories(*),
        finishes(*),
        product_variants(
          *,
          textures(*),
          colors(*)
        )
      `)
      .eq('is_archived', false)
      .limit(12);
    
    if (complexError) {
      console.error('❌ Erro na query complexa:', complexError);
      return;
    }
    
    console.log('✅ Query complexa funcionando');
    console.log('📊 Resultados:', complexData?.length || 0, 'produtos encontrados');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testConnection();

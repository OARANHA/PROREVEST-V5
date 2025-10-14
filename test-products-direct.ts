import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testProductsQuery() {
  console.log('🔍 Testando query exata do ProductService...');
  
  // Query exata do ProductService
  const { data, error } = await supabase
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
    .order('name');

  if (error) {
    console.error('❌ Erro na query:', error);
  } else {
    console.log('✅ Query executada com sucesso!');
    console.log('📦 Produtos encontrados:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('📋 Primeiro produto completo:', JSON.stringify(data[0], null, 2));
    }
  }

  // Teste simples só de produtos
  console.log('\n🔍 Testando query simples de produtos...');
  const { data: simpleData, error: simpleError } = await supabase
    .from('products')
    .select('*')
    .eq('is_archived', false);

  if (simpleError) {
    console.error('❌ Erro na query simples:', simpleError);
  } else {
    console.log('✅ Query simples executada!');
    console.log('📦 Produtos simples encontrados:', simpleData?.length || 0);
  }
}

testProductsQuery().catch(console.error);
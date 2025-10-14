import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkAndClean() {
  console.log('🔍 Verificando políticas RLS...');
  
  // Verificar RLS
  const { data: rlsData, error: rlsError } = await supabase
    .rpc('exec_sql', { 
      query: `
        SELECT schemaname, tablename, rowsecurity 
        FROM pg_tables 
        WHERE tablename IN ('products', 'colors', 'categories', 'textures', 'product_variants');
      `
    });
    
  if (rlsError) {
    console.log('⚠️ Não foi possível verificar RLS:', rlsError.message);
  } else {
    console.log('📋 Políticas RLS:', rlsData);
  }
  
  console.log('\n🗑️ Tentando deletar com TRUNCATE...');
  
  // Tentar TRUNCATE CASCADE
  const { error: truncateError } = await supabase
    .rpc('exec_sql', { 
      query: 'TRUNCATE TABLE products CASCADE;'
    });
    
  if (truncateError) {
    console.log('⚠️ TRUNCATE falhou:', truncateError.message);
    
    console.log('🗑️ Tentando DELETE direto...');
    
    // Tentar DELETE direto
    const { error: deleteError } = await supabase
      .rpc('exec_sql', { 
        query: 'DELETE FROM products;'
      });
      
    if (deleteError) {
      console.log('❌ DELETE falhou:', deleteError.message);
    } else {
      console.log('✅ DELETE executado');
    }
  } else {
    console.log('✅ TRUNCATE executado');
  }
  
  // Verificação final
  const { data: finalProducts } = await supabase
    .from('products')
    .select('*');
    
  console.log('📊 Produtos restantes:', finalProducts?.length || 0);
}

checkAndClean();
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function forceCleanProducts() {
  console.log('🔍 Verificando produtos restantes...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
    
  if (error) {
    console.error('❌ Erro:', error);
    return;
  }
  
  console.log('📦 Produtos encontrados:', products?.length || 0);
  
  if (products && products.length > 0) {
    console.log('🗑️ Forçando remoção de todos os produtos...');
    
    // Delete manual de cada produto
    for (const product of products) {
      const { error: delError } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);
        
      if (delError) {
        console.error('❌ Erro ao deletar produto', product.id, ':', delError);
      } else {
        console.log('✅ Produto deletado:', product.name || product.id);
      }
    }
  }
  
  // Verificação final
  const { data: finalCheck } = await supabase
    .from('products')
    .select('*');
    
  console.log('📊 Produtos finais:', finalCheck?.length || 0);
}

forceCleanProducts();
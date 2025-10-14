import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkProducts() {
  console.log('🔍 Verificando produtos no banco...');
  
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        description,
        category:categories(name),
        finish:finishes(name)
      `)
      .limit(10);
      
    if (error) {
      console.error('❌ Erro ao buscar produtos:', error);
      return;
    }

    console.log(`📦 Produtos encontrados: ${products?.length || 0}`);
    
    if (products && products.length > 0) {
      console.log('\n📋 Lista de produtos:');
      products.forEach((product, index) => {
        console.log(`\n${index + 1}. ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Slug: ${product.slug || 'N/A'}`);
        console.log(`   Categoria: ${product.category?.name || 'N/A'}`);
        console.log(`   Acabamento: ${product.finish?.name || 'N/A'}`);
        console.log(`   Descrição: ${product.description ? product.description.substring(0, 100) + '...' : 'N/A'}`);
      });
    } else {
      console.log('❌ Nenhum produto encontrado no banco de dados');
    }
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  }
}

checkProducts().then(() => {
  console.log('\n✅ Verificação concluída');
  process.exit(0);
});
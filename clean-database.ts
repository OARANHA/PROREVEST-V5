import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function cleanDatabase() {
  console.log('🧹 Limpando banco de dados...');
  
  try {
    // Limpar product_variants primeiro (devido às foreign keys)
    console.log('🗑️ Limpando product_variants...');
    const { error: variantsError } = await supabase
      .from('product_variants')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (variantsError) {
      console.error('❌ Erro ao limpar product_variants:', variantsError);
    } else {
      console.log('✅ product_variants limpo');
    }

    // Limpar products
    console.log('🗑️ Limpando products...');
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (productsError) {
      console.error('❌ Erro ao limpar products:', productsError);
    } else {
      console.log('✅ products limpo');
    }

    // Limpar colors
    console.log('🗑️ Limpando colors...');
    const { error: colorsError } = await supabase
      .from('colors')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (colorsError) {
      console.error('❌ Erro ao limpar colors:', colorsError);
    } else {
      console.log('✅ colors limpo');
    }

    // Limpar categories
    console.log('🗑️ Limpando categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (categoriesError) {
      console.error('❌ Erro ao limpar categories:', categoriesError);
    } else {
      console.log('✅ categories limpo');
    }

    // Limpar textures
    console.log('🗑️ Limpando textures...');
    const { error: texturesError } = await supabase
      .from('textures')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (texturesError) {
      console.error('❌ Erro ao limpar textures:', texturesError);
    } else {
      console.log('✅ textures limpo');
    }

    console.log('🎉 Banco de dados limpo com sucesso!');
    
    // Verificar se está realmente limpo
    console.log('\n🔍 Verificando limpeza...');
    
    const { data: remainingProducts } = await supabase
      .from('products')
      .select('*');
    
    const { data: remainingColors } = await supabase
      .from('colors')
      .select('*');
    
    const { data: remainingVariants } = await supabase
      .from('product_variants')
      .select('*');
    
    console.log(`📊 Produtos restantes: ${remainingProducts?.length || 0}`);
    console.log(`🎨 Cores restantes: ${remainingColors?.length || 0}`);
    console.log(`🔗 Variantes restantes: ${remainingVariants?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

cleanDatabase();
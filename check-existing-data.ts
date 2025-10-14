import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingData() {
  try {
    console.log('Verificando dados existentes...');
    
    // Verificar categorias
    console.log('\n--- Categorias ---');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      console.log('Erro ao buscar categorias:', categoriesError.message);
    } else {
      console.log(`Encontradas ${categories?.length || 0} categorias:`);
      categories?.forEach(cat => {
        console.log(`- ${cat.name} (${cat.slug})`);
      });
    }
    
    // Verificar acabamentos
    console.log('\n--- Acabamentos ---');
    const { data: finishes, error: finishesError } = await supabase
      .from('finishes')
      .select('*');
    
    if (finishesError) {
      console.log('Erro ao buscar acabamentos:', finishesError.message);
    } else {
      console.log(`Encontrados ${finishes?.length || 0} acabamentos:`);
      finishes?.forEach(fin => {
        console.log(`- ${fin.name} (${fin.slug})`);
      });
    }
    
    // Verificar texturas
    console.log('\n--- Texturas ---');
    const { data: textures, error: texturesError } = await supabase
      .from('textures')
      .select('*');
    
    if (texturesError) {
      console.log('Erro ao buscar texturas:', texturesError.message);
    } else {
      console.log(`Encontradas ${textures?.length || 0} texturas:`);
      textures?.forEach(tex => {
        console.log(`- ${tex.name} (${tex.slug})`);
      });
    }
    
    // Verificar cores
    console.log('\n--- Cores ---');
    const { data: colors, error: colorsError } = await supabase
      .from('colors')
      .select('*');
    
    if (colorsError) {
      console.log('Erro ao buscar cores:', colorsError.message);
    } else {
      console.log(`Encontradas ${colors?.length || 0} cores:`);
      colors?.forEach(col => {
        console.log(`- ${col.name} (${col.hex_code})`);
      });
    }
    
    // Verificar produtos
    console.log('\n--- Produtos ---');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*');
    
    if (productsError) {
      console.log('Erro ao buscar produtos:', productsError.message);
    } else {
      console.log(`Encontrados ${products?.length || 0} produtos:`);
      products?.forEach(prod => {
        console.log(`- ${prod.name} (${prod.slug})`);
      });
    }
    
    // Verificar perfis
    console.log('\n--- Perfis ---');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.log('Erro ao buscar perfis:', profilesError.message);
    } else {
      console.log(`Encontrados ${profiles?.length || 0} perfis:`);
      profiles?.forEach(profile => {
        console.log(`- ${profile.full_name || 'Sem nome'} (${profile.role})`);
      });
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
checkExistingData();
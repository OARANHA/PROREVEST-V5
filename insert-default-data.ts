import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function insertDefaultData() {
  try {
    console.log('Inserindo dados padrão...');
    
    // Inserir categorias padrão
    const defaultCategories = [
      { name: "Tinta Acrílica", slug: "tinta-acrilica", description: "Tintas acrílicas para uso interno e externo" },
      { name: "Tinta Esmalte", slug: "tinta-esmalte", description: "Esmaltes sintéticos para acabamentos especiais" },
      { name: "Tinta Texturizada", slug: "tinta-texturizada", description: "Tintas com efeitos texturizados" },
      { name: "Primer/Selador", slug: "primer-selador", description: "Produtos preparatórios para superfícies" },
      { name: "Verniz", slug: "verniz", description: "Vernizes e acabamentos transparentes" }
    ];
    
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from('categories')
      .insert(defaultCategories)
      .select();
    
    if (categoriesError) {
      console.log('Erro ao inserir categorias:', categoriesError.message);
    } else {
      console.log(`✓ ${insertedCategories?.length || 0} categorias inseridas`);
    }
    
    // Inserir acabamentos padrão
    const defaultFinishes = [
      { name: "Fosco", slug: "fosco", description: "Acabamento fosco sem brilho" },
      { name: "Acetinado", slug: "acetinado", description: "Acabamento com leve brilho" },
      { name: "Semi-Brilho", slug: "semi-brilho", description: "Acabamento com brilho moderado" },
      { name: "Brilhante", slug: "brilhante", description: "Acabamento com alto brilho" },
      { name: "Texturizado", slug: "texturizado", description: "Acabamento com textura" }
    ];
    
    const { data: insertedFinishes, error: finishesError } = await supabase
      .from('finishes')
      .insert(defaultFinishes)
      .select();
    
    if (finishesError) {
      console.log('Erro ao inserir acabamentos:', finishesError.message);
    } else {
      console.log(`✓ ${insertedFinishes?.length || 0} acabamentos inseridos`);
    }
    
    // Inserir texturas padrão
    const defaultTextures = [
      { name: "Lisa", slug: "lisa", description: "Superfície lisa" },
      { name: "Riscada", slug: "riscada", description: "Textura riscada" },
      { name: "Casca de Ovo", slug: "casca-de-ovo", description: "Textura casca de ovo" },
      { name: "Grafiato", slug: "grafiato", description: "Textura grafiato" },
      { name: "Rustica", slug: "rustica", description: "Textura rústica" }
    ];
    
    const { data: insertedTextures, error: texturesError } = await supabase
      .from('textures')
      .insert(defaultTextures)
      .select();
    
    if (texturesError) {
      console.log('Erro ao inserir texturas:', texturesError.message);
    } else {
      console.log(`✓ ${insertedTextures?.length || 0} texturas inseridas`);
    }
    
    // Inserir cores padrão
    const defaultColors = [
      { name: "Branca", hex_code: "#FFFFFF", category: "Neutras" },
      { name: "Preta", hex_code: "#000000", category: "Neutras" },
      { name: "Cinza", hex_code: "#808080", category: "Neutras" },
      { name: "Vermelha", hex_code: "#FF0000", category: "Vivas" },
      { name: "Azul", hex_code: "#0000FF", category: "Vivas" },
      { name: "Verde", hex_code: "#00FF00", category: "Vivas" },
      { name: "Amarela", hex_code: "#FFFF00", category: "Vivas" },
      { name: "Rosa", hex_code: "#FFC0CB", category: "Pastéis" },
      { name: "Roxa", hex_code: "#800080", category: "Pastéis" },
      { name: "Laranja", hex_code: "#FFA500", category: "Vivas" }
    ];
    
    const { data: insertedColors, error: colorsError } = await supabase
      .from('colors')
      .insert(defaultColors)
      .select();
    
    if (colorsError) {
      console.log('Erro ao inserir cores:', colorsError.message);
    } else {
      console.log(`✓ ${insertedColors?.length || 0} cores inseridas`);
    }
    
    console.log('Dados padrão inseridos com sucesso!');
  } catch (error) {
    console.error('Erro geral:', error);
  }
}

// Executar se chamado diretamente
insertDefaultData();
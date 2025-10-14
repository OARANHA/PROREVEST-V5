import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Função para criar slug a partir do nome
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Categorias de produtos industriais
const industrialCategories = [
  {
    name: 'Tintas Acrílicas',
    description: 'Tintas à base de água para uso interno e externo'
  },
  {
    name: 'Esmaltes Sintéticos',
    description: 'Tintas à base de solvente para madeiras e metais'
  },
  {
    name: 'Texturas',
    description: 'Revestimentos texturizados para paredes e fachadas'
  },
  {
    name: 'Impermeabilizantes',
    description: 'Produtos para proteção contra umidade e infiltrações'
  },
  {
    name: 'Massas',
    description: 'Produtos para preparação e nivelamento de superfícies'
  }
];

// Acabamentos disponíveis
const industrialFinishes = [
  {
    name: 'Fosco',
    description: 'Acabamento sem brilho, ideal para disfarçar imperfeições'
  },
  {
    name: 'Acetinado',
    description: 'Acabamento com brilho suave e elegante'
  },
  {
    name: 'Brilhante',
    description: 'Acabamento com alto brilho e reflexo'
  },
  {
    name: 'Semibrilho',
    description: 'Acabamento intermediário entre acetinado e brilhante'
  },
  {
    name: 'Texturizado',
    description: 'Acabamento com relevo e textura'
  }
];

// Produtos industriais baseados no catálogo
const industrialProducts = [
  // TINTAS ACRÍLICAS
  {
    name: 'Tinta Acrílica Premium',
    description: 'Tinta acrílica de alta qualidade para uso interno e externo. Excelente cobertura e durabilidade.',
    category: 'Tintas Acrílicas',
    finish: 'Fosco',
    technical_data: JSON.stringify({
      coverage: '12-14 m²/L',
      drying_time: '30 minutos ao toque, 2 horas entre demãos',
      application: 'Pincel, rolo ou pistola',
      package_sizes: ['3.6L', '18L']
    }),
    is_featured: true
  },
  {
    name: 'Tinta Acrílica Econômica',
    description: 'Tinta acrílica com excelente custo-benefício para projetos residenciais.',
    category: 'Tintas Acrílicas',
    finish: 'Fosco',
    technical_data: JSON.stringify({
      coverage: '10-12 m²/L',
      drying_time: '45 minutos ao toque, 3 horas entre demãos',
      application: 'Pincel, rolo',
      package_sizes: ['3.6L', '18L']
    }),
    is_featured: false
  },

  // ESMALTES SINTÉTICOS
  {
    name: 'Esmalte Sintético Brilhante',
    description: 'Esmalte sintético de alta qualidade com acabamento brilhante e proteção superior.',
    category: 'Esmaltes Sintéticos',
    finish: 'Brilhante',
    technical_data: JSON.stringify({
      coverage: '14-16 m²/L',
      drying_time: '2-4 horas ao toque, 12-24 horas entre demãos',
      application: 'Pincel, rolo ou pistola',
      package_sizes: ['900ml', '3.6L', '18L']
    }),
    is_featured: true
  },
  {
    name: 'Esmalte Sintético Acetinado',
    description: 'Esmalte sintético com acabamento acetinado, ideal para ambientes internos.',
    category: 'Esmaltes Sintéticos',
    finish: 'Acetinado',
    technical_data: JSON.stringify({
      coverage: '12-14 m²/L',
      drying_time: '2-4 horas ao toque, 12-24 horas entre demãos',
      application: 'Pincel, rolo ou pistola',
      package_sizes: ['900ml', '3.6L', '18L']
    }),
    is_featured: false
  },

  // TEXTURAS
  {
    name: 'Textura Acrílica Rústica',
    description: 'Textura acrílica para acabamentos rústicos em fachadas e muros.',
    category: 'Texturas',
    finish: 'Texturizado',
    technical_data: JSON.stringify({
      coverage: '2-4 m²/L (dependendo da textura)',
      drying_time: '4-6 horas ao toque, 24 horas para secagem completa',
      application: 'Desempenadeira, rolo de espuma ou pistola',
      package_sizes: ['18L', '25kg']
    }),
    is_featured: true
  },
  {
    name: 'Textura Acrílica Grafiato',
    description: 'Textura acrílica para efeito grafiato em paredes internas e externas.',
    category: 'Texturas',
    finish: 'Texturizado',
    technical_data: JSON.stringify({
      coverage: '2-3 m²/L',
      drying_time: '4-6 horas ao toque, 24 horas para secagem completa',
      application: 'Desempenadeira de aço inox',
      package_sizes: ['18L', '25kg']
    }),
    is_featured: false
  },

  // IMPERMEABILIZANTES
  {
    name: 'Impermeabilizante Acrílico',
    description: 'Impermeabilizante flexível para lajes, terraços e áreas úmidas.',
    category: 'Impermeabilizantes',
    finish: 'Fosco',
    technical_data: JSON.stringify({
      coverage: '1-2 m²/L por demão',
      drying_time: '2-4 horas entre demãos, 72 horas para cura total',
      application: 'Rolo de lã, trincha ou vassoura de pelo',
      package_sizes: ['3.6L', '18L']
    }),
    is_featured: true
  },
  {
    name: 'Impermeabilizante para Concreto',
    description: 'Impermeabilizante cristalizante para estruturas de concreto.',
    category: 'Impermeabilizantes',
    finish: 'Fosco',
    technical_data: JSON.stringify({
      coverage: '1 kg/m² em duas demãos',
      drying_time: '4-6 horas entre demãos, 7 dias para cura total',
      application: 'Trincha, vassoura de pelo ou pulverizador',
      package_sizes: ['4kg', '18kg']
    }),
    is_featured: false
  },

  // MASSAS
  {
    name: 'Massa Corrida PVA',
    description: 'Massa niveladora para ambientes internos.',
    category: 'Massas',
    finish: 'Fosco',
    technical_data: JSON.stringify({
      coverage: '4-6 m²/L por demão',
      drying_time: '3 horas entre demãos, 6 horas para lixamento',
      application: 'Desempenadeira de aço ou espátula',
      package_sizes: ['3.6L', '18L', '25kg']
    }),
    is_featured: false
  },
  {
    name: 'Massa Acrílica',
    description: 'Massa niveladora para ambientes internos e externos.',
    category: 'Massas',
    finish: 'Fosco',
    technical_data: JSON.stringify({
      coverage: '4-6 m²/L por demão',
      drying_time: '3 horas entre demãos, 6 horas para lixamento',
      application: 'Desempenadeira de aço ou espátula',
      package_sizes: ['3.6L', '18L', '25kg']
    }),
    is_featured: true
  }
];

async function main() {
  console.log('🚀 Iniciando inserção de produtos industriais...');
  
  // Inserir categorias
  console.log('📋 Inserindo categorias...');
  const categoryMap = new Map();
  
  for (const category of industrialCategories) {
    // Verificar se a categoria já existe
    const { data: existingCategories, error: searchError } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', category.name)
      .limit(1);
      
    if (searchError) {
      console.error(`❌ Erro ao buscar categoria ${category.name}:`, searchError);
      continue;
    }
    
    if (existingCategories && existingCategories.length > 0) {
      console.log(`✅ Categoria ${category.name} já existe, ID: ${existingCategories[0].id}`);
      categoryMap.set(category.name, existingCategories[0].id);
      continue;
    }
    
    // Inserir nova categoria
    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert({
        name: category.name,
        description: category.description,
        is_archived: false
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error(`❌ Erro ao inserir categoria ${category.name}:`, insertError);
      continue;
    }
    
    console.log(`✅ Categoria ${category.name} criada com ID: ${newCategory.id}`);
    categoryMap.set(category.name, newCategory.id);
  }
  
  // Inserir acabamentos
  console.log('📋 Inserindo acabamentos...');
  const finishMap = new Map();
  
  for (const finish of industrialFinishes) {
    // Verificar se o acabamento já existe
    const { data: existingFinishes, error: searchError } = await supabase
      .from('finishes')
      .select('id, name')
      .eq('name', finish.name)
      .limit(1);
      
    if (searchError) {
      console.error(`❌ Erro ao buscar acabamento ${finish.name}:`, searchError);
      continue;
    }
    
    if (existingFinishes && existingFinishes.length > 0) {
      console.log(`✅ Acabamento ${finish.name} já existe, ID: ${existingFinishes[0].id}`);
      finishMap.set(finish.name, existingFinishes[0].id);
      continue;
    }
    
    // Inserir novo acabamento
    const { data: newFinish, error: insertError } = await supabase
      .from('finishes')
      .insert({
        name: finish.name,
        description: finish.description,
        is_archived: false
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error(`❌ Erro ao inserir acabamento ${finish.name}:`, insertError);
      continue;
    }
    
    console.log(`✅ Acabamento ${finish.name} criado com ID: ${newFinish.id}`);
    finishMap.set(finish.name, newFinish.id);
  }
  
  // Inserir produtos
  console.log('📋 Inserindo produtos...');
  let processedProducts = 0;
  
  for (const product of industrialProducts) {
    const slug = createSlug(product.name);
    
    // Verificar se o produto já existe
    const { data: existingProducts, error: searchError } = await supabase
      .from('products')
      .select('id, name')
      .eq('name', product.name)
      .limit(1);
      
    if (searchError) {
      console.error(`❌ Erro ao buscar produto ${product.name}:`, searchError);
      continue;
    }
    
    if (existingProducts && existingProducts.length > 0) {
      console.log(`⚠️ Produto ${product.name} já existe, pulando...`);
      continue;
    }
    
    // Obter IDs de categoria e acabamento
    const categoryId = categoryMap.get(product.category);
    const finishId = finishMap.get(product.finish);
    
    if (!categoryId) {
      console.error(`❌ Categoria ${product.category} não encontrada para o produto ${product.name}`);
      continue;
    }
    
    if (!finishId) {
      console.error(`❌ Acabamento ${product.finish} não encontrado para o produto ${product.name}`);
      continue;
    }
    
    // Inserir novo produto
    const { data: newProduct, error: insertError } = await supabase
      .from('products')
      .insert({
        name: product.name,
        slug: slug,
        description: product.description,
        technical_data: product.technical_data,
        category_id: categoryId,
        finish_id: finishId,
        is_featured: product.is_featured,
        is_archived: false
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error(`❌ Erro ao inserir produto ${product.name}:`, insertError);
      continue;
    }
    
    console.log(`✅ Produto ${product.name} criado com ID: ${newProduct.id}`);
    processedProducts++;
  }
  
  console.log(`🎉 Processo concluído! ${processedProducts} produtos industriais processados.`);
  
  // Verificar produtos existentes
  const { data: existingProducts, error: listError } = await supabase
    .from('products')
    .select('id, name, category_id, finish_id')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (listError) {
    console.error('❌ Erro ao listar produtos existentes:', listError);
  } else {
    console.log(`📋 Produtos existentes (${existingProducts?.length || 0}):`);
    existingProducts?.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.id})`);
    });
  }
}

main().catch(error => {
  console.error('❌ Erro não tratado:', error);
  process.exit(1);
});
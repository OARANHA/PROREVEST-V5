import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Função para criar slug
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

async function createProductsWithRealSchema() {
  console.log('🏗️ Criando produtos com estrutura real do banco...');

  // 1. Criar categorias (estrutura real: id, name, description, created_at, is_archived)
  const categories = [
    { name: 'Tintas Acrílicas', description: 'Tintas à base de água para uso interno e externo' },
    { name: 'Esmaltes Sintéticos', description: 'Esmaltes à base de solvente para acabamento' },
    { name: 'Texturas', description: 'Revestimentos texturizados decorativos' },
    { name: 'Primers e Fundos', description: 'Produtos preparatórios para superfícies' },
    { name: 'Tintas Especiais', description: 'Tintas com propriedades específicas' },
    { name: 'Vernizes', description: 'Produtos de proteção e acabamento transparente' }
  ];

  console.log('📂 Criando categorias...');
  const createdCategories = new Map();
  
  for (const cat of categories) {
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('categories')
      .select('*')
      .eq('name', cat.name)
      .single();

    if (existing) {
      console.log(`✅ Categoria já existe: ${cat.name}`);
      createdCategories.set(cat.name, existing.id);
    } else {
      const { data, error } = await supabase
        .from('categories')
        .insert({ 
          name: cat.name, 
          description: cat.description 
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Erro ao criar categoria ${cat.name}:`, error);
      } else {
        console.log(`✅ Categoria criada: ${cat.name}`);
        createdCategories.set(cat.name, data.id);
      }
    }
  }

  // 2. Criar acabamentos (estrutura real: id, name, description, created_at, is_archived)
  const finishes = [
    { name: 'Fosco', description: 'Acabamento sem brilho' },
    { name: 'Acetinado', description: 'Acabamento com brilho suave' },
    { name: 'Brilhante', description: 'Acabamento com alto brilho' },
    { name: 'Texturizado', description: 'Acabamento com textura' }
  ];

  console.log('🎨 Criando acabamentos...');
  const createdFinishes = new Map();
  
  for (const finish of finishes) {
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('finishes')
      .select('*')
      .eq('name', finish.name)
      .single();

    if (existing) {
      console.log(`✅ Acabamento já existe: ${finish.name}`);
      createdFinishes.set(finish.name, existing.id);
    } else {
      const { data, error } = await supabase
        .from('finishes')
        .insert({ 
          name: finish.name, 
          description: finish.description 
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Erro ao criar acabamento ${finish.name}:`, error);
      } else {
        console.log(`✅ Acabamento criado: ${finish.name}`);
        createdFinishes.set(finish.name, data.id);
      }
    }
  }

  // 3. Criar produtos industriais baseados no catálogo
  // Estrutura real: id, name, slug, description, technical_data, application_video_url, category_id, finish_id, is_featured, created_at, is_archived
  const industrialProducts = [
    // Tintas Acrílicas
    {
      name: 'Tinta Acrílica Premium',
      category: 'Tintas Acrílicas',
      finish: 'Fosco',
      description: 'Tinta acrílica de alta qualidade para paredes internas e externas',
      technical_data: {
        rendimento: '12-14 m²/L',
        secagem: '30 minutos ao toque',
        diluicao: 'Água até 20%',
        aplicacao: 'Pincel, rolo ou pistola',
        preco: 'R$ 89,90'
      }
    },
    {
      name: 'Tinta Acrílica Econômica',
      category: 'Tintas Acrílicas',
      finish: 'Fosco',
      description: 'Tinta acrílica com ótimo custo-benefício',
      technical_data: {
        rendimento: '10-12 m²/L',
        secagem: '45 minutos ao toque',
        diluicao: 'Água até 25%',
        aplicacao: 'Pincel, rolo',
        preco: 'R$ 59,90'
      }
    },
    {
      name: 'Tinta Acrílica Acetinada',
      category: 'Tintas Acrílicas',
      finish: 'Acetinado',
      description: 'Tinta acrílica com acabamento acetinado lavável',
      technical_data: {
        rendimento: '12-14 m²/L',
        secagem: '30 minutos ao toque',
        diluicao: 'Água até 15%',
        aplicacao: 'Pincel, rolo ou pistola',
        preco: 'R$ 99,90'
      }
    },

    // Esmaltes Sintéticos
    {
      name: 'Esmalte Sintético Brilhante',
      category: 'Esmaltes Sintéticos',
      finish: 'Brilhante',
      description: 'Esmalte sintético de alta durabilidade e brilho',
      technical_data: {
        rendimento: '14-16 m²/L',
        secagem: '4-6 horas',
        diluicao: 'Aguarrás até 10%',
        aplicacao: 'Pincel, rolo ou pistola',
        preco: 'R$ 119,90'
      }
    },
    {
      name: 'Esmalte Sintético Acetinado',
      category: 'Esmaltes Sintéticos',
      finish: 'Acetinado',
      description: 'Esmalte sintético com acabamento acetinado',
      technical_data: {
        rendimento: '14-16 m²/L',
        secagem: '4-6 horas',
        diluicao: 'Aguarrás até 10%',
        aplicacao: 'Pincel, rolo ou pistola',
        preco: 'R$ 109,90'
      }
    },

    // Texturas
    {
      name: 'Textura Acrílica Rústica',
      category: 'Texturas',
      finish: 'Texturizado',
      description: 'Textura acrílica para efeitos decorativos rústicos',
      technical_data: {
        rendimento: '3-4 m²/L',
        secagem: '2-4 horas',
        diluicao: 'Água até 5%',
        aplicacao: 'Rolo, desempenadeira',
        preco: 'R$ 149,90'
      }
    },
    {
      name: 'Textura Acrílica Lisa',
      category: 'Texturas',
      finish: 'Texturizado',
      description: 'Textura acrílica para acabamento liso decorativo',
      technical_data: {
        rendimento: '4-5 m²/L',
        secagem: '2-4 horas',
        diluicao: 'Água até 5%',
        aplicacao: 'Rolo, desempenadeira',
        preco: 'R$ 129,90'
      }
    },

    // Primers e Fundos
    {
      name: 'Primer Acrílico Universal',
      category: 'Primers e Fundos',
      finish: 'Fosco',
      description: 'Primer preparatório para diversas superfícies',
      technical_data: {
        rendimento: '12-15 m²/L',
        secagem: '30 minutos ao toque',
        diluicao: 'Água até 20%',
        aplicacao: 'Pincel, rolo ou pistola',
        preco: 'R$ 79,90'
      }
    },
    {
      name: 'Fundo Preparador de Paredes',
      category: 'Primers e Fundos',
      finish: 'Fosco',
      description: 'Fundo selador para paredes novas e antigas',
      technical_data: {
        rendimento: '10-12 m²/L',
        secagem: '45 minutos ao toque',
        diluicao: 'Água até 30%',
        aplicacao: 'Pincel, rolo',
        preco: 'R$ 69,90'
      }
    },

    // Tintas Especiais
    {
      name: 'Tinta Antimofo',
      category: 'Tintas Especiais',
      finish: 'Fosco',
      description: 'Tinta com propriedades fungicidas e bactericidas',
      technical_data: {
        rendimento: '10-12 m²/L',
        secagem: '30 minutos ao toque',
        diluicao: 'Água até 15%',
        aplicacao: 'Pincel, rolo',
        preco: 'R$ 139,90'
      }
    },
    {
      name: 'Tinta Térmica',
      category: 'Tintas Especiais',
      finish: 'Fosco',
      description: 'Tinta com propriedades de isolamento térmico',
      technical_data: {
        rendimento: '8-10 m²/L',
        secagem: '45 minutos ao toque',
        diluicao: 'Água até 10%',
        aplicacao: 'Rolo, pistola',
        preco: 'R$ 189,90'
      }
    },

    // Vernizes
    {
      name: 'Verniz Acrílico Brilhante',
      category: 'Vernizes',
      finish: 'Brilhante',
      description: 'Verniz acrílico transparente de alta proteção',
      technical_data: {
        rendimento: '16-18 m²/L',
        secagem: '2-4 horas',
        diluicao: 'Água até 10%',
        aplicacao: 'Pincel, rolo',
        preco: 'R$ 159,90'
      }
    },
    {
      name: 'Verniz Acrílico Fosco',
      category: 'Vernizes',
      finish: 'Fosco',
      description: 'Verniz acrílico transparente fosco',
      technical_data: {
        rendimento: '16-18 m²/L',
        secagem: '2-4 horas',
        diluicao: 'Água até 10%',
        aplicacao: 'Pincel, rolo',
        preco: 'R$ 149,90'
      }
    }
  ];

  console.log('🎨 Criando produtos...');
  let successCount = 0;

  for (const product of industrialProducts) {
    const categoryId = createdCategories.get(product.category);
    const finishId = createdFinishes.get(product.finish);

    if (!categoryId) {
      console.error(`❌ Categoria não encontrada: ${product.category}`);
      continue;
    }

    if (!finishId) {
      console.error(`❌ Acabamento não encontrado: ${product.finish}`);
      continue;
    }

    const slug = createSlug(product.name);
    
    // Verificar se já existe
    const { data: existing } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (existing) {
      console.log(`✅ Produto já existe: ${product.name}`);
      successCount++;
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          slug: slug,
          description: product.description,
          category_id: categoryId,
          finish_id: finishId,
          technical_data: product.technical_data,
          is_featured: Math.random() > 0.7 // 30% chance de ser destaque
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Erro ao criar produto ${product.name}:`, error);
      } else {
        console.log(`✅ Produto criado: ${product.name} - ${product.technical_data.preco}`);
        successCount++;
      }
    }
  }

  console.log(`\n🎉 ${successCount} produtos industriais processados com sucesso!`);

  // Verificar produtos criados
  const { data: finalProducts, error: finalError } = await supabase
    .from('products')
    .select(`
      name,
      technical_data,
      categories(name),
      finishes(name)
    `)
    .order('name');

  if (finalError) {
    console.error('❌ Erro ao verificar produtos:', finalError);
  } else {
    console.log('\n📋 Produtos no catálogo:');
    finalProducts?.forEach(product => {
      const preco = product.technical_data?.preco || 'Preço não informado';
      console.log(`- ${product.name} | ${product.categories?.name} | ${product.finishes?.name} | ${preco}`);
    });
  }
}

createProductsWithRealSchema().catch(console.error);
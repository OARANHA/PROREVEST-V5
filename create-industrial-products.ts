import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Produtos industriais típicos baseados em catálogos Pro Revest
const industrialProducts = [
  // TINTAS ACRÍLICAS
  {
    name: 'Tinta Acrílica Premium',
    description: 'Tinta acrílica de alta qualidade para uso interno e externo. Excelente cobertura e durabilidade.',
    category: 'Tintas Acrílicas',
    subcategory: 'Premium',
    finish: 'Fosco',
    coverage: '12-14 m²/L',
    drying_time: '30 minutos ao toque, 2 horas entre demãos',
    application: 'Pincel, rolo ou pistola',
    colors_available: 'Todas as cores da cartela',
    technical_specs: {
      viscosity: '90-110 KU',
      solids: '45-50%',
      density: '1.35-1.45 g/cm³'
    },
    price_range: 'R$ 45,00 - R$ 65,00',
    package_sizes: ['3.6L', '18L'],
    image_url: '/images/products/tinta-acrilica-premium.jpg'
  },
  {
    name: 'Tinta Acrílica Econômica',
    description: 'Tinta acrílica com excelente custo-benefício para projetos residenciais.',
    category: 'Tintas Acrílicas',
    subcategory: 'Econômica',
    finish: 'Fosco',
    coverage: '10-12 m²/L',
    drying_time: '45 minutos ao toque, 3 horas entre demãos',
    application: 'Pincel, rolo',
    colors_available: 'Cores básicas da cartela',
    technical_specs: {
      viscosity: '85-105 KU',
      solids: '40-45%',
      density: '1.30-1.40 g/cm³'
    },
    price_range: 'R$ 25,00 - R$ 35,00',
    package_sizes: ['3.6L', '18L'],
    image_url: '/images/products/tinta-acrilica-economica.jpg'
  },

  // ESMALTES SINTÉTICOS
  {
    name: 'Esmalte Sintético Brilhante',
    description: 'Esmalte sintético de alta qualidade com acabamento brilhante e proteção superior.',
    category: 'Esmaltes Sintéticos',
    subcategory: 'Brilhante',
    finish: 'Brilhante',
    coverage: '14-16 m²/L',
    drying_time: '2-4 horas ao toque, 12-24 horas entre demãos',
    application: 'Pincel, rolo ou pistola',
    colors_available: 'Todas as cores da cartela',
    technical_specs: {
      viscosity: '70-90 KU',
      solids: '50-55%',
      density: '1.20-1.30 g/cm³'
    },
    price_range: 'R$ 55,00 - R$ 75,00',
    package_sizes: ['900ml', '3.6L', '18L'],
    image_url: '/images/products/esmalte-sintetico-brilhante.jpg'
  },
  {
    name: 'Esmalte Sintético Acetinado',
    description: 'Esmalte sintético com acabamento acetinado, ideal para ambientes internos.',
    category: 'Esmaltes Sintéticos',
    subcategory: 'Acetinado',
    finish: 'Acetinado',
    coverage: '12-14 m²/L',
    drying_time: '2-4 horas ao toque, 12-24 horas entre demãos',
    application: 'Pincel, rolo ou pistola',
    colors_available: 'Cores selecionadas da cartela',
    technical_specs: {
      viscosity: '75-95 KU',
      solids: '48-53%',
      density: '1.25-1.35 g/cm³'
    },
    price_range: 'R$ 50,00 - R$ 70,00',
    package_sizes: ['900ml', '3.6L', '18L'],
    image_url: '/images/products/esmalte-sintetico-acetinado.jpg'
  },

  // TINTAS TEXTURIZADAS
  {
    name: 'Textura Acrílica Rústica',
    description: 'Textura acrílica para acabamentos rústicos em fachadas e muros.',
    category: 'Texturas',
    subcategory: 'Rústica',
    finish: 'Texturizado',
    coverage: '2-4 m²/L (dependendo da textura)',
    drying_time: '1 hora ao toque, 4 horas para repintura',
    application: 'Rolo, desempenadeira ou pistola',
    colors_available: 'Cores terrosas e neutras',
    technical_specs: {
      viscosity: '120-150 KU',
      solids: '55-65%',
      density: '1.50-1.70 g/cm³'
    },
    price_range: 'R$ 35,00 - R$ 55,00',
    package_sizes: ['18L', '25kg'],
    image_url: '/images/products/textura-rustica.jpg'
  },
  {
    name: 'Textura Acrílica Lisa',
    description: 'Textura acrílica com acabamento liso para fachadas modernas.',
    category: 'Texturas',
    subcategory: 'Lisa',
    finish: 'Texturizado Liso',
    coverage: '3-5 m²/L',
    drying_time: '45 minutos ao toque, 3 horas para repintura',
    application: 'Rolo, desempenadeira',
    colors_available: 'Todas as cores da cartela',
    technical_specs: {
      viscosity: '100-130 KU',
      solids: '50-60%',
      density: '1.45-1.65 g/cm³'
    },
    price_range: 'R$ 40,00 - R$ 60,00',
    package_sizes: ['18L', '25kg'],
    image_url: '/images/products/textura-lisa.jpg'
  },

  // PRIMERS E FUNDOS
  {
    name: 'Primer Acrílico Branco',
    description: 'Primer acrílico de alta aderência para preparação de superfícies.',
    category: 'Primers e Fundos',
    subcategory: 'Acrílico',
    finish: 'Fosco',
    coverage: '12-15 m²/L',
    drying_time: '30 minutos ao toque, 2 horas para repintura',
    application: 'Pincel, rolo ou pistola',
    colors_available: 'Branco, cinza claro',
    technical_specs: {
      viscosity: '85-105 KU',
      solids: '42-48%',
      density: '1.30-1.40 g/cm³'
    },
    price_range: 'R$ 30,00 - R$ 45,00',
    package_sizes: ['3.6L', '18L'],
    image_url: '/images/products/primer-acrilico.jpg'
  },
  {
    name: 'Fundo Preparador de Paredes',
    description: 'Fundo selador para paredes novas e repinturas.',
    category: 'Primers e Fundos',
    subcategory: 'Selador',
    finish: 'Fosco',
    coverage: '15-20 m²/L',
    drying_time: '2-4 horas',
    application: 'Pincel, rolo',
    colors_available: 'Incolor, branco',
    technical_specs: {
      viscosity: '60-80 KU',
      solids: '25-35%',
      density: '1.10-1.20 g/cm³'
    },
    price_range: 'R$ 20,00 - R$ 35,00',
    package_sizes: ['3.6L', '18L'],
    image_url: '/images/products/fundo-preparador.jpg'
  },

  // TINTAS ESPECIAIS
  {
    name: 'Tinta Epóxi Bicomponente',
    description: 'Tinta epóxi de alta resistência para pisos industriais.',
    category: 'Tintas Especiais',
    subcategory: 'Epóxi',
    finish: 'Brilhante',
    coverage: '8-12 m²/L',
    drying_time: '4-6 horas ao toque, 24 horas para tráfego',
    application: 'Rolo, pincel',
    colors_available: 'Cinza, verde, azul, vermelho',
    technical_specs: {
      viscosity: '200-300 cP',
      solids: '75-85%',
      density: '1.40-1.60 g/cm³'
    },
    price_range: 'R$ 80,00 - R$ 120,00',
    package_sizes: ['3.2L (A+B)', '16L (A+B)'],
    image_url: '/images/products/tinta-epoxi.jpg'
  },
  {
    name: 'Tinta Antiferrugem',
    description: 'Tinta com propriedades anticorrosivas para estruturas metálicas.',
    category: 'Tintas Especiais',
    subcategory: 'Antiferrugem',
    finish: 'Acetinado',
    coverage: '10-14 m²/L',
    drying_time: '2-4 horas ao toque, 8-12 horas entre demãos',
    application: 'Pincel, rolo, pistola',
    colors_available: 'Vermelho óxido, cinza, preto',
    technical_specs: {
      viscosity: '80-100 KU',
      solids: '45-55%',
      density: '1.35-1.50 g/cm³'
    },
    price_range: 'R$ 60,00 - R$ 85,00',
    package_sizes: ['900ml', '3.6L', '18L'],
    image_url: '/images/products/tinta-antiferrugem.jpg'
  },

  // VERNIZES
  {
    name: 'Verniz Acrílico Brilhante',
    description: 'Verniz acrílico transparente com proteção UV.',
    category: 'Vernizes',
    subcategory: 'Acrílico',
    finish: 'Brilhante',
    coverage: '16-20 m²/L',
    drying_time: '1 hora ao toque, 4 horas entre demãos',
    application: 'Pincel, rolo, pistola',
    colors_available: 'Incolor',
    technical_specs: {
      viscosity: '60-80 KU',
      solids: '35-45%',
      density: '1.05-1.15 g/cm³'
    },
    price_range: 'R$ 45,00 - R$ 65,00',
    package_sizes: ['900ml', '3.6L'],
    image_url: '/images/products/verniz-acrilico.jpg'
  }
];

async function createIndustrialProducts() {
  console.log('🏭 Criando produtos industriais...');
  
  try {
    // Primeiro, criar as categorias
    const categories = [...new Set(industrialProducts.map(p => p.category))];
    
    console.log('📂 Criando categorias...');
    for (const categoryName of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert({
          name: categoryName,
          description: `Categoria ${categoryName}`,
          slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        }, {
          onConflict: 'name'
        });
        
      if (error) {
        console.error(`❌ Erro ao criar categoria ${categoryName}:`, error);
      } else {
        console.log(`✅ Categoria criada: ${categoryName}`);
      }
    }
    
    // Buscar IDs das categorias
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name');
    
    const categoryMap = new Map(categoriesData?.map(c => [c.name, c.id]) || []);
    
    console.log('\n🎨 Criando produtos...');
    
    // Criar produtos
    for (const product of industrialProducts) {
      const categoryId = categoryMap.get(product.category);
      
      if (!categoryId) {
        console.error(`❌ Categoria não encontrada: ${product.category}`);
        continue;
      }
      
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          category_id: categoryId,
          subcategory: product.subcategory,
          finish: product.finish,
          coverage: product.coverage,
          drying_time: product.drying_time,
          application: product.application,
          colors_available: product.colors_available,
          technical_specs: product.technical_specs,
          price_range: product.price_range,
          package_sizes: product.package_sizes,
          image_url: product.image_url,
          is_featured: Math.random() > 0.7, // 30% chance de ser destaque
          is_available: true,
          sku: `PRO-${product.name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        });
        
      if (error) {
        console.error(`❌ Erro ao criar produto ${product.name}:`, error);
      } else {
        console.log(`✅ Produto criado: ${product.name}`);
      }
    }
    
    // Verificação final
    const { data: finalProducts } = await supabase
      .from('products')
      .select('*');
      
    console.log(`\n🎉 ${finalProducts?.length || 0} produtos criados com sucesso!`);
    
    // Mostrar alguns produtos criados
    if (finalProducts && finalProducts.length > 0) {
      console.log('\n📋 Primeiros produtos:');
      finalProducts.slice(0, 3).forEach(p => {
        console.log(`- ${p.name} (${p.sku})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createIndustrialProducts();
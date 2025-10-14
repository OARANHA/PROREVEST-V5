import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Produtos industriais simplificados baseados no schema existente
const industrialProducts = [
  // TINTAS ACRÍLICAS
  {
    name: 'Tinta Acrílica Premium',
    description: 'Tinta acrílica de alta qualidade para uso interno e externo. Excelente cobertura e durabilidade.',
    full_description: 'Tinta acrílica premium com tecnologia avançada, oferece excelente cobertura, durabilidade e resistência às intempéries. Ideal para fachadas, muros e ambientes internos.',
    category: 'Tintas Acrílicas',
    finish: 'Fosco',
    price: 55.90,
    technical_data: {
      coverage: '12-14 m²/L',
      drying_time: '30 minutos ao toque, 2 horas entre demãos',
      application: 'Pincel, rolo ou pistola',
      viscosity: '90-110 KU',
      solids: '45-50%',
      density: '1.35-1.45 g/cm³'
    },
    warranty: {
      period: '5 anos',
      conditions: 'Aplicação conforme especificações técnicas'
    },
    badges: ['Premium', 'Resistente'],
    is_featured: true,
    rating: 4.8,
    reviews: 156
  },
  {
    name: 'Tinta Acrílica Econômica',
    description: 'Tinta acrílica com excelente custo-benefício para projetos residenciais.',
    full_description: 'Tinta acrílica econômica que não abre mão da qualidade. Perfeita para renovações e projetos com orçamento controlado.',
    category: 'Tintas Acrílicas',
    finish: 'Fosco',
    price: 32.50,
    technical_data: {
      coverage: '10-12 m²/L',
      drying_time: '45 minutos ao toque, 3 horas entre demãos',
      application: 'Pincel, rolo',
      viscosity: '85-105 KU',
      solids: '40-45%',
      density: '1.30-1.40 g/cm³'
    },
    warranty: {
      period: '3 anos',
      conditions: 'Aplicação conforme especificações técnicas'
    },
    badges: ['Econômica', 'Custo-Benefício'],
    is_featured: false,
    rating: 4.2,
    reviews: 89
  },

  // ESMALTES SINTÉTICOS
  {
    name: 'Esmalte Sintético Brilhante',
    description: 'Esmalte sintético de alta qualidade com acabamento brilhante e proteção superior.',
    full_description: 'Esmalte sintético premium com acabamento brilhante intenso. Oferece proteção superior contra corrosão e intempéries.',
    category: 'Esmaltes Sintéticos',
    finish: 'Brilhante',
    price: 68.90,
    technical_data: {
      coverage: '14-16 m²/L',
      drying_time: '2-4 horas ao toque, 12-24 horas entre demãos',
      application: 'Pincel, rolo ou pistola',
      viscosity: '70-90 KU',
      solids: '50-55%',
      density: '1.20-1.30 g/cm³'
    },
    warranty: {
      period: '7 anos',
      conditions: 'Aplicação sobre primer adequado'
    },
    badges: ['Brilhante', 'Proteção Superior'],
    is_featured: true,
    rating: 4.9,
    reviews: 203
  },
  {
    name: 'Esmalte Sintético Acetinado',
    description: 'Esmalte sintético com acabamento acetinado, ideal para ambientes internos.',
    full_description: 'Esmalte sintético com acabamento acetinado elegante. Combina durabilidade com estética refinada.',
    category: 'Esmaltes Sintéticos',
    finish: 'Acetinado',
    price: 62.50,
    technical_data: {
      coverage: '12-14 m²/L',
      drying_time: '2-4 horas ao toque, 12-24 horas entre demãos',
      application: 'Pincel, rolo ou pistola',
      viscosity: '75-95 KU',
      solids: '48-53%',
      density: '1.25-1.35 g/cm³'
    },
    warranty: {
      period: '5 anos',
      conditions: 'Uso interno ou externo protegido'
    },
    badges: ['Acetinado', 'Elegante'],
    is_featured: false,
    rating: 4.6,
    reviews: 127
  },

  // TINTAS TEXTURIZADAS
  {
    name: 'Textura Acrílica Rústica',
    description: 'Textura acrílica para acabamentos rústicos em fachadas e muros.',
    full_description: 'Textura acrílica que proporciona acabamento rústico autêntico. Ideal para fachadas que buscam um visual natural e diferenciado.',
    category: 'Texturas',
    finish: 'Texturizado',
    price: 45.90,
    technical_data: {
      coverage: '2-4 m²/L (dependendo da textura)',
      drying_time: '1 hora ao toque, 4 horas para repintura',
      application: 'Rolo, desempenadeira ou pistola',
      viscosity: '120-150 KU',
      solids: '55-65%',
      density: '1.50-1.70 g/cm³'
    },
    warranty: {
      period: '8 anos',
      conditions: 'Aplicação sobre base preparada'
    },
    badges: ['Rústico', 'Fachadas'],
    is_featured: true,
    rating: 4.7,
    reviews: 94
  },
  {
    name: 'Textura Acrílica Lisa',
    description: 'Textura acrílica com acabamento liso para fachadas modernas.',
    full_description: 'Textura acrílica com acabamento liso e uniforme. Perfeita para projetos arquitetônicos modernos e contemporâneos.',
    category: 'Texturas',
    finish: 'Texturizado Liso',
    price: 52.90,
    technical_data: {
      coverage: '3-5 m²/L',
      drying_time: '45 minutos ao toque, 3 horas para repintura',
      application: 'Rolo, desempenadeira',
      viscosity: '100-130 KU',
      solids: '50-60%',
      density: '1.45-1.65 g/cm³'
    },
    warranty: {
      period: '10 anos',
      conditions: 'Aplicação conforme normas técnicas'
    },
    badges: ['Moderno', 'Lisa'],
    is_featured: false,
    rating: 4.5,
    reviews: 76
  },

  // PRIMERS E FUNDOS
  {
    name: 'Primer Acrílico Universal',
    description: 'Primer acrílico de alta aderência para preparação de superfícies.',
    full_description: 'Primer acrílico universal com excelente aderência em diversas superfícies. Base fundamental para um acabamento perfeito.',
    category: 'Primers e Fundos',
    finish: 'Fosco',
    price: 38.90,
    technical_data: {
      coverage: '12-15 m²/L',
      drying_time: '30 minutos ao toque, 2 horas para repintura',
      application: 'Pincel, rolo ou pistola',
      viscosity: '85-105 KU',
      solids: '42-48%',
      density: '1.30-1.40 g/cm³'
    },
    warranty: {
      period: '2 anos',
      conditions: 'Produto de preparação'
    },
    badges: ['Universal', 'Preparação'],
    is_featured: false,
    rating: 4.4,
    reviews: 112
  },

  // TINTAS ESPECIAIS
  {
    name: 'Tinta Epóxi Bicomponente',
    description: 'Tinta epóxi de alta resistência para pisos industriais.',
    full_description: 'Tinta epóxi bicomponente de alta performance. Resistência extrema para ambientes industriais e de alto tráfego.',
    category: 'Tintas Especiais',
    finish: 'Brilhante',
    price: 98.90,
    technical_data: {
      coverage: '8-12 m²/L',
      drying_time: '4-6 horas ao toque, 24 horas para tráfego',
      application: 'Rolo, pincel',
      viscosity: '200-300 cP',
      solids: '75-85%',
      density: '1.40-1.60 g/cm³'
    },
    warranty: {
      period: '15 anos',
      conditions: 'Aplicação profissional recomendada'
    },
    badges: ['Industrial', 'Alta Resistência'],
    is_featured: true,
    rating: 4.9,
    reviews: 67
  },

  // VERNIZES
  {
    name: 'Verniz Acrílico Protetor',
    description: 'Verniz acrílico transparente com proteção UV.',
    full_description: 'Verniz acrílico transparente com filtros UV. Protege e realça a beleza natural das superfícies.',
    category: 'Vernizes',
    finish: 'Brilhante',
    price: 56.90,
    technical_data: {
      coverage: '16-20 m²/L',
      drying_time: '1 hora ao toque, 4 horas entre demãos',
      application: 'Pincel, rolo, pistola',
      viscosity: '60-80 KU',
      solids: '35-45%',
      density: '1.05-1.15 g/cm³'
    },
    warranty: {
      period: '5 anos',
      conditions: 'Proteção UV incluída'
    },
    badges: ['Proteção UV', 'Transparente'],
    is_featured: false,
    rating: 4.3,
    reviews: 88
  }
];

async function createSimpleProducts() {
  console.log('🏭 Criando produtos industriais...');
  
  try {
    // Primeiro, criar as categorias
    const categories = [...new Set(industrialProducts.map(p => p.category))];
    
    console.log('📂 Criando categorias...');
    for (const categoryName of categories) {
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      const { error } = await supabase
        .from('categories')
        .upsert({
          name: categoryName,
          slug: slug,
          description: `Categoria ${categoryName}`
        }, {
          onConflict: 'slug'
        });
        
      if (error) {
        console.error(`❌ Erro ao criar categoria ${categoryName}:`, error);
      } else {
        console.log(`✅ Categoria criada: ${categoryName}`);
      }
    }
    
    // Criar acabamentos
    const finishes = [...new Set(industrialProducts.map(p => p.finish))];
    
    console.log('🎨 Criando acabamentos...');
    for (const finishName of finishes) {
      const slug = finishName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      const { error } = await supabase
        .from('finishes')
        .upsert({
          name: finishName,
          slug: slug,
          description: `Acabamento ${finishName}`
        }, {
          onConflict: 'slug'
        });
        
      if (error) {
        console.error(`❌ Erro ao criar acabamento ${finishName}:`, error);
      } else {
        console.log(`✅ Acabamento criado: ${finishName}`);
      }
    }
    
    // Buscar IDs das categorias e acabamentos
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name');
    
    const { data: finishesData } = await supabase
      .from('finishes')
      .select('id, name');
    
    const categoryMap = new Map(categoriesData?.map(c => [c.name, c.id]) || []);
    const finishMap = new Map(finishesData?.map(f => [f.name, f.id]) || []);
    
    console.log('\n🎨 Criando produtos...');
    
    // Criar produtos
    for (const product of industrialProducts) {
      const categoryId = categoryMap.get(product.category);
      const finishId = finishMap.get(product.finish);
      const slug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      if (!categoryId) {
        console.error(`❌ Categoria não encontrada: ${product.category}`);
        continue;
      }
      
      if (!finishId) {
        console.error(`❌ Acabamento não encontrado: ${product.finish}`);
        continue;
      }
      
      const { error } = await supabase
        .from('products')
        .upsert({
          name: product.name,
          slug: slug,
          description: product.description,
          full_description: product.full_description,
          category_id: categoryId,
          finish_id: finishId,
          price: product.price,
          technical_data: product.technical_data,
          warranty: product.warranty,
          badges: product.badges,
          is_featured: product.is_featured,
          rating: product.rating,
          reviews: product.reviews,
          is_archived: false
        }, {
          onConflict: 'slug'
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
      .select('*, categories(name), finishes(name)');
      
    console.log(`\n🎉 ${finalProducts?.length || 0} produtos criados com sucesso!`);
    
    // Mostrar alguns produtos criados
    if (finalProducts && finalProducts.length > 0) {
      console.log('\n📋 Produtos criados:');
      finalProducts.forEach(p => {
        console.log(`- ${p.name} | ${p.categories?.name} | ${p.finishes?.name} | R$ ${p.price}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

createSimpleProducts();
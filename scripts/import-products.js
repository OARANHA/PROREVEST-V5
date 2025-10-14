import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

// Configuração do Supabase com SERVICE ROLE KEY para contornar RLS
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Categorias
const categories = [
  { name: 'Industrial', slug: 'industrial' },
  { name: 'Residencial', slug: 'residencial' },
  { name: 'Comercial', slug: 'comercial' },
  { name: 'Marítimo', slug: 'maritimo' },
  { name: 'Viário', slug: 'viario' },
  { name: 'Hospitalar', slug: 'hospitalar' }
];

// Acabamentos
const finishes = [
  { name: 'Fosco', slug: 'fosco' },
  { name: 'Acetinado', slug: 'acetinado' },
  { name: 'Semi-Brilho', slug: 'semi-brilho' },
  { name: 'Brilhante', slug: 'brilhante' },
  { name: 'Metálico', slug: 'metalico' },
  { name: 'Texturizado', slug: 'texturizado' }
];

// Dados dos produtos extraídos dos PDFs
const productsData = [
  // LINHA INDUSTRIAL (Catálogo 1)
  {
    name: "PRIMER SINTÉTICO",
    slug: "primer-sintetico",
    description: "Produto a base de resinas alquídicas especiais, proporcionando uma ótima aderência às superfícies.",
    fullDescription: "Indicado para aplicações de fins anticorrosivos em superfície ferrosas, sujeitas a exposição ao intemperismo. Classificado dentro da NORMA NBR 11702/92 TIPO 4.1.3",
    technical_data: {
      teor_solidos_peso: "60 +/- 5%",
      teor_solidos_volume: "40 +/- 5%",
      secagem_toque: "1h",
      secagem_total: "24h",
      rendimento: "8-10 m²/L",
      diluicao: "Thinner 10-15%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Industrial',
    finish: 'Fosco',
    is_featured: true,
    price: 89.90,
    rating: 4.5,
    reviews: 12,
    badges: ["NBR 11702/92"],
    warranty: "12 meses"
  },
  {
    name: "ESMALTE SINTÉTICO BRILHANTE",
    slug: "esmalte-sintetico-brilhante",
    description: "Esmalte sintético de alta qualidade com excelente brilho e durabilidade.",
    fullDescription: "Produto formulado com resinas alquídicas modificadas, proporcionando excelente acabamento e proteção. Ideal para superfícies metálicas e madeira.",
    technical_data: {
      teor_solidos_peso: "65 +/- 5%",
      teor_solidos_volume: "45 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "24h",
      rendimento: "10-12 m²/L",
      diluicao: "Thinner 5-10%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Industrial',
    finish: 'Brilhante',
    is_featured: true,
    price: 95.50,
    rating: 4.7,
    reviews: 18,
    badges: ["Alta Durabilidade"],
    warranty: "18 meses"
  },
  {
    name: "ESMALTE POLIURETANO ALIFÁTICO 4x1",
    slug: "esmalte-poliuretano-alifatico-4x1",
    description: "Esmalte poliuretano de alta performance com excelente resistência química.",
    fullDescription: "Sistema bicomponente de alta tecnologia, oferece máxima proteção contra intempéries e agentes químicos. Ideal para ambientes industriais severos.",
    technical_data: {
      teor_solidos_peso: "75 +/- 5%",
      teor_solidos_volume: "60 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "48h",
      rendimento: "12-15 m²/L",
      diluicao: "Diluente PU 5-10%",
      aplicacao: "Pistola airless, convencional"
    },
    category: 'Industrial',
    finish: 'Brilhante',
    is_featured: true,
    price: 185.90,
    rating: 4.8,
    reviews: 25,
    badges: ["Bicomponente", "Alta Performance"],
    warranty: "24 meses"
  },
  {
    name: "ESMALTE SINTÉTICO METÁLICO",
    slug: "esmalte-sintetico-metalico",
    description: "Esmalte com efeito metálico para acabamentos especiais.",
    fullDescription: "Formulado com pigmentos metálicos especiais, proporciona acabamento diferenciado com brilho metálico. Ideal para decoração e proteção.",
    technical_data: {
      teor_solidos_peso: "62 +/- 5%",
      teor_solidos_volume: "42 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "24h",
      rendimento: "8-10 m²/L",
      diluicao: "Thinner 10-15%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Industrial',
    finish: 'Metálico',
    is_featured: false,
    price: 125.90,
    rating: 4.3,
    reviews: 8,
    badges: ["Efeito Metálico"],
    warranty: "12 meses"
  },
  {
    name: "ESMALTE SINTÉTICO INDUSTRIAL SECAGEM RÁPIDA",
    slug: "esmalte-sintetico-industrial-secagem-rapida",
    description: "Esmalte de secagem rápida para aplicações industriais.",
    fullDescription: "Desenvolvido para aplicações que exigem rapidez na secagem sem comprometer a qualidade do acabamento. Ideal para linhas de produção.",
    technical_data: {
      teor_solidos_peso: "68 +/- 5%",
      teor_solidos_volume: "48 +/- 5%",
      secagem_toque: "30min",
      secagem_total: "4h",
      rendimento: "10-12 m²/L",
      diluicao: "Thinner 5-10%",
      aplicacao: "Pistola, rolo"
    },
    category: 'Industrial',
    finish: 'Semi-Brilho',
    is_featured: true,
    price: 110.90,
    rating: 4.6,
    reviews: 15,
    badges: ["Secagem Rápida"],
    warranty: "12 meses"
  },
  {
    name: "TINTA DEMARCAÇÃO VIÁRIA BASE SOLVENTE",
    slug: "tinta-demarcacao-viaria-base-solvente",
    description: "Tinta para demarcação viária de alta durabilidade.",
    fullDescription: "Especialmente desenvolvida para sinalização horizontal, oferece excelente aderência ao asfalto e concreto com alta resistência ao tráfego.",
    technical_data: {
      teor_solidos_peso: "70 +/- 5%",
      teor_solidos_volume: "50 +/- 5%",
      secagem_toque: "15min",
      secagem_total: "2h",
      rendimento: "4-6 m²/L",
      diluicao: "Thinner 0-5%",
      aplicacao: "Pistola airless"
    },
    category: 'Viário',
    finish: 'Fosco',
    is_featured: true,
    price: 75.90,
    rating: 4.4,
    reviews: 22,
    badges: ["Demarcação Viária"],
    warranty: "6 meses"
  },
  {
    name: "TINTA DEMARCAÇÃO VIÁRIA BASE ÁGUA",
    slug: "tinta-demarcacao-viaria-base-agua",
    description: "Tinta ecológica para demarcação viária base água.",
    fullDescription: "Formulação ecológica sem solventes, ideal para áreas urbanas e ambientes fechados. Mantém alta performance na demarcação viária.",
    technical_data: {
      teor_solidos_peso: "65 +/- 5%",
      teor_solidos_volume: "45 +/- 5%",
      secagem_toque: "20min",
      secagem_total: "1h",
      rendimento: "5-7 m²/L",
      diluicao: "Água 0-5%",
      aplicacao: "Pistola airless"
    },
    category: 'Viário',
    finish: 'Fosco',
    is_featured: false,
    price: 68.90,
    rating: 4.2,
    reviews: 18,
    badges: ["Ecológica", "Base Água"],
    warranty: "6 meses"
  },
  {
    name: "EPÓXI PISO AUTONIVELANTE 100% SÓLIDOS",
    slug: "epoxi-piso-autonivelante-100-solidos",
    description: "Revestimento epóxi autonivelante de alta resistência.",
    fullDescription: "Sistema epóxi 100% sólidos, sem solventes, ideal para pisos industriais que exigem máxima resistência química e mecânica.",
    technical_data: {
      teor_solidos_peso: "100%",
      teor_solidos_volume: "100%",
      secagem_toque: "8h",
      secagem_total: "72h",
      rendimento: "1-2 m²/kg",
      diluicao: "Não diluir",
      aplicacao: "Espátula, rodo"
    },
    category: 'Industrial',
    finish: 'Brilhante',
    is_featured: true,
    price: 285.90,
    rating: 4.9,
    reviews: 35,
    badges: ["100% Sólidos", "Autonivelante"],
    warranty: "60 meses"
  },
  {
    name: "EPOXI POLIMINA ALUMINIO",
    slug: "epoxi-polimina-aluminio",
    description: "Tinta epóxi com pigmento de alumínio para proteção térmica.",
    fullDescription: "Sistema epóxi com pigmento de alumínio, oferece excelente proteção contra radiação térmica e corrosão. Ideal para tanques e estruturas expostas.",
    technical_data: {
      teor_solidos_peso: "72 +/- 5%",
      teor_solidos_volume: "55 +/- 5%",
      secagem_toque: "6h",
      secagem_total: "48h",
      rendimento: "8-10 m²/L",
      diluicao: "Diluente Epóxi 5-10%",
      aplicacao: "Pistola, rolo"
    },
    category: 'Industrial',
    finish: 'Metálico',
    is_featured: true,
    price: 195.90,
    rating: 4.7,
    reviews: 28,
    badges: ["Proteção Térmica", "Alumínio"],
    warranty: "36 meses"
  },
  {
    name: "EPÓXI POLIAMIDA ALTA ESPESSURA",
    slug: "epoxi-poliamida-alta-espessura",
    description: "Tinta epóxi de alta espessura para proteção severa.",
    fullDescription: "Sistema epóxi poliamida de alta espessura, desenvolvido para ambientes com alta agressividade química e mecânica.",
    technical_data: {
      teor_solidos_peso: "78 +/- 5%",
      teor_solidos_volume: "62 +/- 5%",
      secagem_toque: "8h",
      secagem_total: "72h",
      rendimento: "4-6 m²/L",
      diluicao: "Diluente Epóxi 0-5%",
      aplicacao: "Pistola airless"
    },
    category: 'Industrial',
    finish: 'Semi-Brilho',
    is_featured: true,
    price: 225.90,
    rating: 4.8,
    reviews: 31,
    badges: ["Alta Espessura", "Proteção Severa"],
    warranty: "48 meses"
  },
  {
    name: "PRIMER EPÓXI ISOCIANATO",
    slug: "primer-epoxi-isocianato",
    description: "Primer epóxi de alta aderência com isocianato.",
    fullDescription: "Primer bicomponente de alta tecnologia, oferece máxima aderência em substratos metálicos e concreto. Base para sistemas de alta performance.",
    technical_data: {
      teor_solidos_peso: "75 +/- 5%",
      teor_solidos_volume: "58 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "24h",
      rendimento: "8-12 m²/L",
      diluicao: "Diluente Epóxi 5-10%",
      aplicacao: "Pistola, rolo"
    },
    category: 'Industrial',
    finish: 'Fosco',
    is_featured: false,
    price: 165.90,
    rating: 4.6,
    reviews: 19,
    badges: ["Bicomponente", "Alta Aderência"],
    warranty: "24 meses"
  },
  {
    name: "PU ACRILICO N 2677",
    slug: "pu-acrilico-n-2677",
    description: "Poliuretano acrílico de alta performance.",
    fullDescription: "Sistema poliuretano acrílico desenvolvido para máxima resistência aos raios UV e intempéries. Mantém cor e brilho por longos períodos.",
    technical_data: {
      teor_solidos_peso: "70 +/- 5%",
      teor_solidos_volume: "52 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "48h",
      rendimento: "10-14 m²/L",
      diluicao: "Diluente PU 5-10%",
      aplicacao: "Pistola, rolo"
    },
    category: 'Industrial',
    finish: 'Brilhante',
    is_featured: true,
    price: 205.90,
    rating: 4.7,
    reviews: 24,
    badges: ["Resistência UV", "Alta Performance"],
    warranty: "36 meses"
  },
  {
    name: "EPOXI ACABAMENTO ALTA ESPESSURA",
    slug: "epoxi-acabamento-alta-espessura",
    description: "Tinta epóxi de acabamento com alta espessura.",
    fullDescription: "Sistema epóxi de acabamento desenvolvido para aplicação em alta espessura, oferecendo excelente nivelamento e acabamento final.",
    technical_data: {
      teor_solidos_peso: "76 +/- 5%",
      teor_solidos_volume: "60 +/- 5%",
      secagem_toque: "6h",
      secagem_total: "48h",
      rendimento: "5-8 m²/L",
      diluicao: "Diluente Epóxi 0-5%",
      aplicacao: "Pistola airless, rolo"
    },
    category: 'Industrial',
    finish: 'Brilhante',
    is_featured: false,
    price: 215.90,
    rating: 4.5,
    reviews: 16,
    badges: ["Alta Espessura", "Acabamento"],
    warranty: "36 meses"
  },
  {
    name: "TINTA DEMARCAÇÃO VIÁRIA NBR 11.862",
    slug: "tinta-demarcacao-viaria-nbr-11862",
    description: "Tinta para demarcação viária conforme NBR 11.862.",
    fullDescription: "Tinta desenvolvida especificamente para atender às especificações da norma NBR 11.862, garantindo qualidade e durabilidade na sinalização horizontal.",
    technical_data: {
      teor_solidos_peso: "68 +/- 5%",
      teor_solidos_volume: "48 +/- 5%",
      secagem_toque: "15min",
      secagem_total: "2h",
      rendimento: "4-6 m²/L",
      diluicao: "Thinner 0-5%",
      aplicacao: "Pistola airless"
    },
    category: 'Viário',
    finish: 'Fosco',
    is_featured: true,
    price: 78.90,
    rating: 4.6,
    reviews: 27,
    badges: ["NBR 11.862", "Certificada"],
    warranty: "6 meses"
  },
  {
    name: "TINTA DEMARCAÇÃO VIÁRIA BASE ÁGUA NBR 13.699",
    slug: "tinta-demarcacao-viaria-base-agua-nbr-13699",
    description: "Tinta base água para demarcação conforme NBR 13.699.",
    fullDescription: "Formulação ecológica base água que atende às especificações da NBR 13.699, ideal para demarcação viária em áreas urbanas sensíveis.",
    technical_data: {
      teor_solidos_peso: "66 +/- 5%",
      teor_solidos_volume: "46 +/- 5%",
      secagem_toque: "20min",
      secagem_total: "1h",
      rendimento: "5-7 m²/L",
      diluicao: "Água 0-5%",
      aplicacao: "Pistola airless"
    },
    category: 'Viário',
    finish: 'Fosco',
    is_featured: false,
    price: 72.90,
    rating: 4.3,
    reviews: 21,
    badges: ["NBR 13.699", "Ecológica"],
    warranty: "6 meses"
  },

  // LINHA RESIDENCIAL/COMERCIAL (Catálogo 2)
  {
    name: "FUNDO PREPARADOR DE PAREDES",
    slug: "fundo-preparador-de-paredes",
    description: "Fundo preparador para uniformizar a absorção das paredes.",
    fullDescription: "Produto desenvolvido para preparar superfícies porosas, uniformizando a absorção e garantindo melhor aderência e acabamento das tintas de acabamento.",
    technical_data: {
      teor_solidos_peso: "45 +/- 5%",
      teor_solidos_volume: "30 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "4h",
      rendimento: "12-16 m²/L",
      diluicao: "Água 10-20%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: false,
    price: 45.90,
    rating: 4.2,
    reviews: 14,
    badges: ["Preparador"],
    warranty: "12 meses"
  },
  {
    name: "SELADOR ACRÍLICO PIGMENTADO",
    slug: "selador-acrilico-pigmentado",
    description: "Selador acrílico com pigmentação para melhor cobertura.",
    fullDescription: "Selador acrílico pigmentado que oferece excelente poder de cobertura e uniformização, reduzindo o número de demãos necessárias.",
    technical_data: {
      teor_solidos_peso: "48 +/- 5%",
      teor_solidos_volume: "32 +/- 5%",
      secagem_toque: "1h",
      secagem_total: "4h",
      rendimento: "10-14 m²/L",
      diluicao: "Água 10-15%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: false,
    price: 52.90,
    rating: 4.4,
    reviews: 18,
    badges: ["Pigmentado"],
    warranty: "12 meses"
  },
  {
    name: "TEXTURA LISA",
    slug: "textura-lisa",
    description: "Textura acrílica lisa para acabamentos decorativos.",
    fullDescription: "Revestimento texturizado acrílico de granulometria fina, ideal para criar acabamentos lisos e uniformes em paredes internas e externas.",
    technical_data: {
      teor_solidos_peso: "65 +/- 5%",
      teor_solidos_volume: "50 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "6h",
      rendimento: "2-4 m²/kg",
      diluicao: "Água 0-5%",
      aplicacao: "Desempenadeira, rolo"
    },
    category: 'Residencial',
    finish: 'Texturizado',
    is_featured: true,
    price: 85.90,
    rating: 4.6,
    reviews: 32,
    badges: ["Textura", "Decorativo"],
    warranty: "24 meses"
  },
  {
    name: "MASSA CORRIDA",
    slug: "massa-corrida",
    description: "Massa corrida para correção e nivelamento de paredes.",
    fullDescription: "Massa acrílica de alta qualidade para correção de imperfeições e nivelamento de superfícies, proporcionando acabamento liso e uniforme.",
    technical_data: {
      teor_solidos_peso: "70 +/- 5%",
      teor_solidos_volume: "55 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "24h",
      rendimento: "1-3 m²/kg",
      diluicao: "Água 0-5%",
      aplicacao: "Espátula, desempenadeira"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: true,
    price: 38.90,
    rating: 4.3,
    reviews: 45,
    badges: ["Correção", "Nivelamento"],
    warranty: "12 meses"
  },
  {
    name: "MASSA ACRÍLICA",
    slug: "massa-acrilica",
    description: "Massa acrílica para uso externo e interno.",
    fullDescription: "Massa acrílica de alta resistência, ideal para correção de imperfeições em superfícies internas e externas, com excelente aderência.",
    technical_data: {
      teor_solidos_peso: "72 +/- 5%",
      teor_solidos_volume: "58 +/- 5%",
      secagem_toque: "3h",
      secagem_total: "12h",
      rendimento: "1-2 m²/kg",
      diluicao: "Água 0-3%",
      aplicacao: "Espátula, desempenadeira"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: false,
    price: 42.90,
    rating: 4.4,
    reviews: 28,
    badges: ["Acrílica", "Resistente"],
    warranty: "18 meses"
  },
  {
    name: "TINTA PARA GESSO",
    slug: "tinta-para-gesso",
    description: "Tinta específica para superfícies de gesso.",
    fullDescription: "Tinta desenvolvida especialmente para aplicação em gesso, com formulação que não compromete a aderência e oferece excelente cobertura.",
    technical_data: {
      teor_solidos_peso: "42 +/- 5%",
      teor_solidos_volume: "28 +/- 5%",
      secagem_toque: "1h",
      secagem_total: "4h",
      rendimento: "12-16 m²/L",
      diluicao: "Água 5-10%",
      aplicacao: "Pincel, rolo"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: false,
    price: 48.90,
    rating: 4.1,
    reviews: 12,
    badges: ["Específica Gesso"],
    warranty: "12 meses"
  },
  {
    name: "TINTA ACRÍLICA PREMIUM",
    slug: "tinta-acrilica-premium",
    description: "Tinta acrílica de alta qualidade para acabamentos superiores.",
    fullDescription: "Tinta acrílica premium com excelente poder de cobertura, durabilidade e resistência ao desbotamento. Ideal para ambientes internos e externos.",
    technical_data: {
      teor_solidos_peso: "52 +/- 5%",
      teor_solidos_volume: "38 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "4h",
      rendimento: "12-16 m²/L",
      diluicao: "Água 10-20%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: true,
    price: 68.90,
    rating: 4.7,
    reviews: 56,
    badges: ["Premium", "Alta Cobertura"],
    warranty: "60 meses"
  },
  {
    name: "TINTA ACRÍLICA PREMIUM PRO",
    slug: "tinta-acrilica-premium-pro",
    description: "Tinta acrílica profissional de máxima qualidade.",
    fullDescription: "Linha profissional com tecnologia avançada, oferece máxima durabilidade, resistência e facilidade de aplicação. Para projetos exigentes.",
    technical_data: {
      teor_solidos_peso: "55 +/- 5%",
      teor_solidos_volume: "42 +/- 5%",
      secagem_toque: "1h",
      secagem_total: "4h",
      rendimento: "14-18 m²/L",
      diluicao: "Água 5-15%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Comercial',
    finish: 'Acetinado',
    is_featured: true,
    price: 89.90,
    rating: 4.8,
    reviews: 73,
    badges: ["Premium Pro", "Profissional"],
    warranty: "84 meses"
  },
  {
    name: "TINTA PISO/DEMARCAÇÃO (BASE AGUA/SOLVENTE)",
    slug: "tinta-piso-demarcacao-base-agua-solvente",
    description: "Tinta para pisos e demarcação disponível em base água e solvente.",
    fullDescription: "Tinta versátil para aplicação em pisos e demarcação, disponível nas versões base água (ecológica) e base solvente (alta resistência).",
    technical_data: {
      teor_solidos_peso: "60 +/- 5%",
      teor_solidos_volume: "45 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "8h",
      rendimento: "8-12 m²/L",
      diluicao: "Água ou Thinner 5-10%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Comercial',
    finish: 'Semi-Brilho',
    is_featured: false,
    price: 58.90,
    rating: 4.3,
    reviews: 19,
    badges: ["Versátil", "Dupla Base"],
    warranty: "24 meses"
  },
  {
    name: "TINTA EMBORRACHADA",
    slug: "tinta-emborrachada",
    description: "Tinta com propriedades elásticas para impermeabilização.",
    fullDescription: "Tinta com características emborrachadas, oferece excelente impermeabilização e flexibilidade, ideal para lajes e superfícies sujeitas a movimentação.",
    technical_data: {
      teor_solidos_peso: "58 +/- 5%",
      teor_solidos_volume: "45 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "24h",
      rendimento: "3-5 m²/L",
      diluicao: "Água 0-5%",
      aplicacao: "Pincel, rolo"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: true,
    price: 125.90,
    rating: 4.6,
    reviews: 34,
    badges: ["Impermeabilizante", "Elástica"],
    warranty: "60 meses"
  },
  {
    name: "ESMALTE PREMIUM BASE ÁGUA",
    slug: "esmalte-premium-base-agua",
    description: "Esmalte ecológico base água de alta qualidade.",
    fullDescription: "Esmalte base água com tecnologia avançada, oferece excelente acabamento sem odor forte, ideal para ambientes internos e sensíveis.",
    technical_data: {
      teor_solidos_peso: "48 +/- 5%",
      teor_solidos_volume: "35 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "6h",
      rendimento: "10-14 m²/L",
      diluicao: "Água 5-10%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Residencial',
    finish: 'Semi-Brilho',
    is_featured: true,
    price: 78.90,
    rating: 4.5,
    reviews: 41,
    badges: ["Base Água", "Sem Odor"],
    warranty: "36 meses"
  },
  {
    name: "FUNDO PARA GALVANIZADO",
    slug: "fundo-para-galvanizado",
    description: "Primer específico para superfícies galvanizadas.",
    fullDescription: "Primer desenvolvido especialmente para aderência em superfícies galvanizadas, zinco e metais não ferrosos, garantindo excelente ancoragem.",
    technical_data: {
      teor_solidos_peso: "55 +/- 5%",
      teor_solidos_volume: "40 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "8h",
      rendimento: "10-14 m²/L",
      diluicao: "Thinner 10-15%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Industrial',
    finish: 'Fosco',
    is_featured: false,
    price: 95.90,
    rating: 4.4,
    reviews: 16,
    badges: ["Galvanizado", "Aderência"],
    warranty: "24 meses"
  },
  {
    name: "FUNDO SINTÉTICO NIVELADOR",
    slug: "fundo-sintetico-nivelador",
    description: "Fundo sintético com propriedades niveladoras.",
    fullDescription: "Primer sintético com alta espessura e propriedades niveladoras, ideal para correção de pequenas imperfeições e preparação de superfícies.",
    technical_data: {
      teor_solidos_peso: "62 +/- 5%",
      teor_solidos_volume: "45 +/- 5%",
      secagem_toque: "3h",
      secagem_total: "12h",
      rendimento: "8-12 m²/L",
      diluicao: "Thinner 10-15%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Industrial',
    finish: 'Fosco',
    is_featured: false,
    price: 88.90,
    rating: 4.3,
    reviews: 13,
    badges: ["Nivelador", "Alta Espessura"],
    warranty: "18 meses"
  },
  {
    name: "ESMALTE SINTÉTICO",
    slug: "esmalte-sintetico",
    description: "Esmalte sintético tradicional de qualidade.",
    fullDescription: "Esmalte sintético de formulação tradicional, oferece bom acabamento e proteção para superfícies metálicas e madeira em ambientes internos.",
    technical_data: {
      teor_solidos_peso: "60 +/- 5%",
      teor_solidos_volume: "42 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "24h",
      rendimento: "10-14 m²/L",
      diluicao: "Thinner 10-20%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Residencial',
    finish: 'Brilhante',
    is_featured: false,
    price: 65.90,
    rating: 4.2,
    reviews: 29,
    badges: ["Tradicional"],
    warranty: "18 meses"
  },
  {
    name: "VERNIZ PU MARÍTIMO",
    slug: "verniz-pu-maritimo",
    description: "Verniz poliuretano para ambientes marítimos.",
    fullDescription: "Verniz poliuretano especialmente desenvolvido para resistir às condições severas do ambiente marítimo, com alta resistência à salinidade.",
    technical_data: {
      teor_solidos_peso: "65 +/- 5%",
      teor_solidos_volume: "50 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "48h",
      rendimento: "12-16 m²/L",
      diluicao: "Diluente PU 5-10%",
      aplicacao: "Pincel, rolo, pistola"
    },
    category: 'Marítimo',
    finish: 'Brilhante',
    is_featured: true,
    price: 145.90,
    rating: 4.7,
    reviews: 22,
    badges: ["Marítimo", "Resistente Sal"],
    warranty: "36 meses"
  },
  {
    name: "VERNIZ",
    slug: "verniz",
    description: "Verniz tradicional para proteção de madeiras.",
    fullDescription: "Verniz de formulação tradicional para proteção e realce da beleza natural da madeira, ideal para móveis e estruturas internas.",
    technical_data: {
      teor_solidos_peso: "55 +/- 5%",
      teor_solidos_volume: "40 +/- 5%",
      secagem_toque: "6h",
      secagem_total: "24h",
      rendimento: "14-18 m²/L",
      diluicao: "Thinner 10-20%",
      aplicacao: "Pincel, rolo"
    },
    category: 'Residencial',
    finish: 'Brilhante',
    is_featured: false,
    price: 58.90,
    rating: 4.1,
    reviews: 17,
    badges: ["Tradicional", "Madeira"],
    warranty: "12 meses"
  },
  {
    name: "VERNIZ BASE ÁGUA",
    slug: "verniz-base-agua",
    description: "Verniz ecológico base água para madeiras.",
    fullDescription: "Verniz base água sem odor forte, ideal para aplicação em ambientes internos e sensíveis, mantendo a proteção e beleza da madeira.",
    technical_data: {
      teor_solidos_peso: "45 +/- 5%",
      teor_solidos_volume: "32 +/- 5%",
      secagem_toque: "2h",
      secagem_total: "6h",
      rendimento: "12-16 m²/L",
      diluicao: "Água 5-10%",
      aplicacao: "Pincel, rolo"
    },
    category: 'Residencial',
    finish: 'Brilhante',
    is_featured: true,
    price: 68.90,
    rating: 4.4,
    reviews: 25,
    badges: ["Base Água", "Ecológico"],
    warranty: "24 meses"
  },
  {
    name: "RESINA BASE ÁGUA",
    slug: "resina-base-agua",
    description: "Resina acrílica base água para impermeabilização.",
    fullDescription: "Resina acrílica base água para impermeabilização de lajes, terraços e superfícies expostas, oferece excelente elasticidade e aderência.",
    technical_data: {
      teor_solidos_peso: "50 +/- 5%",
      teor_solidos_volume: "38 +/- 5%",
      secagem_toque: "4h",
      secagem_total: "24h",
      rendimento: "4-6 m²/L",
      diluicao: "Água 0-5%",
      aplicacao: "Pincel, rolo"
    },
    category: 'Residencial',
    finish: 'Fosco',
    is_featured: true,
    price: 95.90,
    rating: 4.5,
    reviews: 31,
    badges: ["Impermeabilizante", "Elástica"],
    warranty: "60 meses"
  }
];

async function importProducts() {
  try {
    console.log('Iniciando importação de produtos...');

    // Criar categorias
    console.log('Criando categorias...');
    for (const category of categories) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category.slug)
        .single();

      if (!existingCategory) {
        const { error } = await supabase
          .from('categories')
          .insert(category);
        
        if (error) {
          console.error('Erro ao criar categoria:', category.name, error);
        } else {
          console.log(`Categoria criada: ${category.name}`);
        }
      }
    }

    // Criar acabamentos
    console.log('Criando acabamentos...');
    for (const finish of finishes) {
      const { data: existingFinish } = await supabase
        .from('finishes')
        .select('id')
        .eq('slug', finish.slug)
        .single();

      if (!existingFinish) {
        const { error } = await supabase
          .from('finishes')
          .insert(finish);
        
        if (error) {
          console.error('Erro ao criar acabamento:', finish.name, error);
        } else {
          console.log(`Acabamento criado: ${finish.name}`);
        }
      }
    }

    // Buscar IDs das categorias e acabamentos
    const { data: categoriesData } = await supabase.from('categories').select('*');
    const { data: finishesData } = await supabase.from('finishes').select('*');

    const categoryMap = {};
    const finishMap = {};

    categoriesData.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    finishesData.forEach(fin => {
      finishMap[fin.name] = fin.id;
    });

    // Criar produtos
    console.log('Criando produtos...');
    let createdCount = 0;

    for (const product of productsData) {
      // Verificar se o produto já existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();

      if (!existingProduct) {
        const productData = {
          name: product.name,
          slug: product.slug,
          description: product.description,
          technical_data: product.technical_data,
          category_id: categoryMap[product.category],
          finish_id: finishMap[product.finish],
          is_featured: product.is_featured || false
        };

        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) {
          console.error('Erro ao criar produto:', product.name, error);
        } else {
          createdCount++;
          console.log(`Produto criado: ${product.name}`);
        }
      } else {
        console.log(`Produto já existe: ${product.name}`);
      }
    }

    console.log(`Importação concluída! ${createdCount} produtos criados de ${productsData.length} total.`);

    // Verificar total de produtos no banco
    const { data: totalProducts, error: countError } = await supabase
      .from('products')
      .select('id', { count: 'exact' });

    if (!countError) {
      console.log(`Total de produtos no banco de dados: ${totalProducts.length}`);
    }

  } catch (error) {
    console.error('Erro durante a importação:', error);
  }
}

// Executar a importação
importProducts();
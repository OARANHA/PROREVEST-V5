-- Criar tabela blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL DEFAULT 'ProRevest Team',
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Geral',
  views INTEGER DEFAULT 0
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Criar tabela project_cases
CREATE TABLE IF NOT EXISTS project_cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content TEXT,
  client TEXT,
  location TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Geral',
  views INTEGER DEFAULT 0,
  products_used TEXT[] DEFAULT '{}'
);

-- Criar índices para project_cases
CREATE INDEX IF NOT EXISTS idx_project_cases_status ON project_cases(status);
CREATE INDEX IF NOT EXISTS idx_project_cases_completed_at ON project_cases(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_cases_category ON project_cases(category);
CREATE INDEX IF NOT EXISTS idx_project_cases_slug ON project_cases(slug);

-- Habilitar RLS (Row Level Security)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_cases ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para blog_posts
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all blog posts" ON blog_posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update their own blog posts" ON blog_posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete blog posts" ON blog_posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas de RLS para project_cases
CREATE POLICY "Anyone can view published project cases" ON project_cases
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authenticated users can view all project cases" ON project_cases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert project cases" ON project_cases
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update their own project cases" ON project_cases
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete project cases" ON project_cases
  FOR DELETE USING (auth.role() = 'authenticated');

-- Inserir alguns posts de exemplo
INSERT INTO blog_posts (title, slug, excerpt, content, author, status, category, tags) VALUES
(
  'Como Escolher a Cor Perfeita para Sua Parede',
  'como-escolher-cor-perfeita-parede',
  'Descubra as melhores dicas para escolher a cor ideal que transformará seu ambiente.',
  '# Como Escolher a Cor Perfeita para Sua Parede\n\nEscolher a cor certa para suas paredes pode transformar completamente um ambiente. Neste guia completo, vamos mostrar as melhores técnicas e dicas para acertar na escolha.\n\n## 1. Considere a Iluminação\n\nA iluminação natural e artificial afeta como as cores são percebidas. Teste as cores em diferentes momentos do dia.\n\n## 2. Harmonia com os Móveis\n\nAs cores devem complementar seus móveis e decoração existente.\n\n## 3. Tamanho do Ambiente\n\nCores claras ampliam espaços pequenos, enquanto cores escuras criam aconchego em ambientes grandes.\n\n## Conclusão\n\nCom estas dicas, você está pronto para transformar seus ambientes!',
  'ProRevest Team',
  'published',
  'Decoração',
  ARRAY['cores', 'paredes', 'decoração', 'dicas']
),
(
  'Tintas Ecológicas: O Futuro da Pintura',
  'tintas-ecologicas-futuro-pintura',
  'Conheça as vantagens das tintas ecológicas e como elas estão revolucionando o mercado.',
  '# Tintas Ecológicas: O Futuro da Pintura\n\nAs tintas ecológicas estão ganhando espaço no mercado por seus benefícios ambientais e para a saúde.\n\n## Vantagens das Tintas Ecológicas\n\n- **Baixo VOC**: Menos compostos orgânicos voláteis\n- **Segurança**: Não tóxicas e seguras para crianças\n- **Sustentabilidade**: Produzidas com materiais renováveis\n- **Qualidade**: Excelente cobertura e durabilidade\n\n## Tipos de Tintas Ecológicas\n\n1. Tintas à base de água\n2. Tintas com pigmentos naturais\n3. Tintas minerais\n\n## Aplicação\n\nA aplicação segue os mesmos processos das tintas convencionais, com resultados iguais ou superiores.',
  'ProRevest Team',
  'published',
  'Sustentabilidade',
  ARRAY['ecológico', 'sustentável', 'meio ambiente', 'saúde']
),
(
  'Preparação de Superfícies: O Segredo da Qualidade',
  'preparacao-superficies-segredo-qualidade',
  'Uma preparação adequada é fundamental para um acabamento perfeito e duradouro.',
  '# Preparação de Superfícies: O Segredo da Qualidade\n\nA preparação correta das superfícies é o passo mais importante para garantir um resultado profissional e duradouro.\n\n## Passos Essenciais\n\n### 1. Limpeza\n\nRemova poeira, gordura e qualquer contaminante da superfície.\n\n### 2. Reparos\n\nPreencha trincas, buracos e imperfeições com massa corrida.\n\n### 3. Lixamento\n\nLixe a superfície para criar uma textura uniforme.\n\n### 4. Primer\n\nAplique uma camada de primer para melhorar a aderência.\n\n## Dicas Importantes\n\n- Trabalhe em ambiente bem ventilado\n- Use equipamentos de proteção\n- Respeite os tempos de secagem\n\nCom uma preparação adequada, seu trabalho terá acabamento profissional e maior durabilidade!',
  'ProRevest Team',
  'draft',
  'Técnicas',
  ARRAY['preparação', 'superfície', 'qualidade', 'profissional']
);

-- Inserir alguns projetos de exemplo
INSERT INTO project_cases (title, slug, description, client, location, completed_at, status, category, images, tags) VALUES
(
  'Projeto residencial moderno',
  'projeto-residencial-moderno',
  'Transformação completa de apartamento com cores modernas e acabamentos sofisticados.',
  'Silva Família',
  'São Paulo, SP',
  '2024-01-15',
  'published',
  'Residencial',
  ARRAY['https://images.unsplash.com/photo-1616486338812-3dadae4b4ace', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7'],
  ARRAY['moderno', 'residencial', 'sofisticado']
),
(
  'Reforma comercial corporativa',
  'reforma-comercial-corporativa',
  'Reforma completa de escritório corporativo com cores institucionais e acabamentos profissionais.',
  'Tech Solutions Ltda',
  'Campinas, SP',
  '2024-02-20',
  'published',
  'Comercial',
  ARRAY['https://images.unsplash.com/photo-1497366214043-946258f369fe', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'],
  ARRAY['comercial', 'corporativo', 'profissional']
);

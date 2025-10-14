import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTablesManually() {
  try {
    console.log('Criando tabelas manualmente...');
    
    // Criar tabela categories
    const { error: categoriesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          image_url TEXT,
          is_archived BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (categoriesError) {
      console.log('Erro ao criar tabela categories:', categoriesError.message);
    } else {
      console.log('Tabela categories criada com sucesso');
    }
    
    // Criar tabela finishes
    const { error: finishesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS finishes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          is_archived BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (finishesError) {
      console.log('Erro ao criar tabela finishes:', finishesError.message);
    } else {
      console.log('Tabela finishes criada com sucesso');
    }
    
    // Criar tabela textures
    const { error: texturesError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS textures (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          is_archived BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (texturesError) {
      console.log('Erro ao criar tabela textures:', texturesError.message);
    } else {
      console.log('Tabela textures criada com sucesso');
    }
    
    // Criar tabela colors
    const { error: colorsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS colors (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          hex_code TEXT,
          rgb TEXT,
          ral_code TEXT,
          pantone_code TEXT,
          ncs_code TEXT,
          category TEXT,
          is_archived BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (colorsError) {
      console.log('Erro ao criar tabela colors:', colorsError.message);
    } else {
      console.log('Tabela colors criada com sucesso');
    }
    
    // Criar tabela products
    const { error: productsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          full_description TEXT,
          category_id UUID REFERENCES categories(id),
          finish_id UUID REFERENCES finishes(id),
          price DECIMAL(10,2),
          technical_data JSONB,
          warranty JSONB,
          badges TEXT[],
          is_featured BOOLEAN DEFAULT FALSE,
          application_video_url TEXT,
          rating DECIMAL(3,2) DEFAULT 0,
          reviews INTEGER DEFAULT 0,
          is_archived BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (productsError) {
      console.log('Erro ao criar tabela products:', productsError.message);
    } else {
      console.log('Tabela products criada com sucesso');
    }
    
    // Criar tabela product_variants
    const { error: variantsError } = await supabase.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS product_variants (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          color_id UUID REFERENCES colors(id),
          texture_id UUID REFERENCES textures(id),
          sku TEXT UNIQUE NOT NULL,
          image_url TEXT,
          price_modifier DECIMAL(10,2) DEFAULT 0,
          is_available BOOLEAN DEFAULT TRUE,
          stock_quantity INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (variantsError) {
      console.log('Erro ao criar tabela product_variants:', variantsError.message);
    } else {
      console.log('Tabela product_variants criada com sucesso');
    }
    
    console.log('Todas as tabelas foram criadas!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

// Executar se chamado diretamente
createTablesManually();
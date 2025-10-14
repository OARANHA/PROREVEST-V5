import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://gtfvhktgxqtdrnaxizch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0ZnZoa3RneHF0ZHJuYXhpemNoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU2OTAyMCwiZXhwIjoyMDczMTQ1MDIwfQ.UAonJqdPyQFPyMrmllmNWa464g45D2eAfcW8_v-SrBM';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Criando tabelas...');
    
    // Criar tabela categories
    const { error: categoriesError } = await supabase.rpc('create_table', {
      table_name: 'categories',
      columns: [
        { name: 'id', type: 'uuid', is_primary_key: true, default_value: 'gen_random_uuid()' },
        { name: 'name', type: 'text', is_nullable: false },
        { name: 'slug', type: 'text', is_nullable: false, is_unique: true },
        { name: 'description', type: 'text' },
        { name: 'image_url', type: 'text' },
        { name: 'is_archived', type: 'boolean', default_value: 'false' },
        { name: 'created_at', type: 'timestamp with time zone', default_value: 'now()' },
        { name: 'updated_at', type: 'timestamp with time zone', default_value: 'now()' }
      ]
    });
    
    if (categoriesError) {
      console.log('Tabela categories já existe ou erro:', categoriesError.message);
    } else {
      console.log('Tabela categories criada com sucesso');
    }
    
    // Criar tabela finishes
    const { error: finishesError } = await supabase.rpc('create_table', {
      table_name: 'finishes',
      columns: [
        { name: 'id', type: 'uuid', is_primary_key: true, default_value: 'gen_random_uuid()' },
        { name: 'name', type: 'text', is_nullable: false },
        { name: 'slug', type: 'text', is_nullable: false, is_unique: true },
        { name: 'description', type: 'text' },
        { name: 'is_archived', type: 'boolean', default_value: 'false' },
        { name: 'created_at', type: 'timestamp with time zone', default_value: 'now()' },
        { name: 'updated_at', type: 'timestamp with time zone', default_value: 'now()' }
      ]
    });
    
    if (finishesError) {
      console.log('Tabela finishes já existe ou erro:', finishesError.message);
    } else {
      console.log('Tabela finishes criada com sucesso');
    }
    
    // Criar tabela textures
    const { error: texturesError } = await supabase.rpc('create_table', {
      table_name: 'textures',
      columns: [
        { name: 'id', type: 'uuid', is_primary_key: true, default_value: 'gen_random_uuid()' },
        { name: 'name', type: 'text', is_nullable: false },
        { name: 'slug', type: 'text', is_nullable: false, is_unique: true },
        { name: 'description', type: 'text' },
        { name: 'is_archived', type: 'boolean', default_value: 'false' },
        { name: 'created_at', type: 'timestamp with time zone', default_value: 'now()' },
        { name: 'updated_at', type: 'timestamp with time zone', default_value: 'now()' }
      ]
    });
    
    if (texturesError) {
      console.log('Tabela textures já existe ou erro:', texturesError.message);
    } else {
      console.log('Tabela textures criada com sucesso');
    }
    
    // Criar tabela colors
    const { error: colorsError } = await supabase.rpc('create_table', {
      table_name: 'colors',
      columns: [
        { name: 'id', type: 'uuid', is_primary_key: true, default_value: 'gen_random_uuid()' },
        { name: 'name', type: 'text', is_nullable: false },
        { name: 'hex_code', type: 'text' },
        { name: 'rgb', type: 'text' },
        { name: 'ral_code', type: 'text' },
        { name: 'pantone_code', type: 'text' },
        { name: 'ncs_code', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'is_archived', type: 'boolean', default_value: 'false' },
        { name: 'created_at', type: 'timestamp with time zone', default_value: 'now()' },
        { name: 'updated_at', type: 'timestamp with time zone', default_value: 'now()' }
      ]
    });
    
    if (colorsError) {
      console.log('Tabela colors já existe ou erro:', colorsError.message);
    } else {
      console.log('Tabela colors criada com sucesso');
    }
    
    // Criar tabela products
    const { error: productsError } = await supabase.rpc('create_table', {
      table_name: 'products',
      columns: [
        { name: 'id', type: 'uuid', is_primary_key: true, default_value: 'gen_random_uuid()' },
        { name: 'name', type: 'text', is_nullable: false },
        { name: 'slug', type: 'text', is_nullable: false, is_unique: true },
        { name: 'description', type: 'text' },
        { name: 'full_description', type: 'text' },
        { name: 'category_id', type: 'uuid', references: 'categories(id)' },
        { name: 'finish_id', type: 'uuid', references: 'finishes(id)' },
        { name: 'price', type: 'decimal(10,2)' },
        { name: 'technical_data', type: 'jsonb' },
        { name: 'warranty', type: 'jsonb' },
        { name: 'badges', type: 'text[]' },
        { name: 'is_featured', type: 'boolean', default_value: 'false' },
        { name: 'application_video_url', type: 'text' },
        { name: 'rating', type: 'decimal(3,2)', default_value: '0' },
        { name: 'reviews', type: 'integer', default_value: '0' },
        { name: 'is_archived', type: 'boolean', default_value: 'false' },
        { name: 'created_at', type: 'timestamp with time zone', default_value: 'now()' },
        { name: 'updated_at', type: 'timestamp with time zone', default_value: 'now()' }
      ]
    });
    
    if (productsError) {
      console.log('Tabela products já existe ou erro:', productsError.message);
    } else {
      console.log('Tabela products criada com sucesso');
    }
    
    // Criar tabela product_variants
    const { error: variantsError } = await supabase.rpc('create_table', {
      table_name: 'product_variants',
      columns: [
        { name: 'id', type: 'uuid', is_primary_key: true, default_value: 'gen_random_uuid()' },
        { name: 'product_id', type: 'uuid', references: 'products(id) ON DELETE CASCADE' },
        { name: 'color_id', type: 'uuid', references: 'colors(id)' },
        { name: 'texture_id', type: 'uuid', references: 'textures(id)' },
        { name: 'sku', type: 'text', is_nullable: false, is_unique: true },
        { name: 'image_url', type: 'text' },
        { name: 'price_modifier', type: 'decimal(10,2)', default_value: '0' },
        { name: 'is_available', type: 'boolean', default_value: 'true' },
        { name: 'stock_quantity', type: 'integer', default_value: '0' },
        { name: 'created_at', type: 'timestamp with time zone', default_value: 'now()' },
        { name: 'updated_at', type: 'timestamp with time zone', default_value: 'now()' }
      ]
    });
    
    if (variantsError) {
      console.log('Tabela product_variants já existe ou erro:', variantsError.message);
    } else {
      console.log('Tabela product_variants criada com sucesso');
    }
    
    console.log('Todas as tabelas foram criadas!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  }
}

// Executar se chamado diretamente
createTables();
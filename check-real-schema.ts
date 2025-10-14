import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function checkRealSchema() {
  console.log('🔍 Verificando estrutura real das tabelas...');

  const tables = ['categories', 'finishes', 'textures', 'colors', 'products', 'product_variants'];

  for (const table of tables) {
    console.log(`\n📋 Estrutura da tabela ${table}:`);
    
    try {
      // Tentar inserir um registro vazio para ver quais colunas são obrigatórias
      const { error } = await supabase
        .from(table)
        .insert({})
        .select();

      if (error) {
        console.log(`Erro (mostra colunas obrigatórias): ${error.message}`);
      }

      // Tentar buscar dados existentes para ver a estrutura
      const { data, error: selectError } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (selectError) {
        console.log(`❌ Erro ao buscar dados: ${selectError.message}`);
      } else if (data && data.length > 0) {
        console.log(`✅ Colunas encontradas:`, Object.keys(data[0]));
      } else {
        console.log(`📝 Tabela vazia, tentando inserir dados de teste...`);
        
        // Tentar inserir dados básicos para descobrir estrutura
        let testData: any = {};
        
        if (table === 'categories') {
          testData = { name: 'Teste' };
        } else if (table === 'finishes') {
          testData = { name: 'Teste' };
        } else if (table === 'textures') {
          testData = { name: 'Teste' };
        } else if (table === 'colors') {
          testData = { name: 'Teste', hex_code: '#FFFFFF' };
        } else if (table === 'products') {
          testData = { name: 'Teste' };
        } else if (table === 'product_variants') {
          testData = { sku: 'TEST-001' };
        }

        const { data: insertData, error: insertError } = await supabase
          .from(table)
          .insert(testData)
          .select()
          .single();

        if (insertError) {
          console.log(`❌ Erro ao inserir teste: ${insertError.message}`);
        } else {
          console.log(`✅ Estrutura descoberta:`, Object.keys(insertData));
          
          // Remover o registro de teste
          await supabase
            .from(table)
            .delete()
            .eq('id', insertData.id);
        }
      }
    } catch (err) {
      console.log(`❌ Erro geral: ${err}`);
    }
  }
}

checkRealSchema().catch(console.error);
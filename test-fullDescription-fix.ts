import { supabase } from './app/lib/supabaseClient';

async function testFullDescriptionFix() {
  console.log('🧪 Testando correção do campo full_description...');
  
  try {
    // Teste 1: Verificar se a coluna existe na tabela
    console.log('\n📋 Teste 1: Verificando estrutura da tabela products...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('products')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Erro ao acessar tabela products:', tableError);
      return;
    }
    
    if (tableInfo && tableInfo.length > 0) {
      const firstProduct = tableInfo[0];
      console.log('✅ Colunas encontradas no primeiro produto:', Object.keys(firstProduct));
      
      if ('full_description' in firstProduct) {
        console.log('✅ Coluna full_description existe na tabela');
      } else {
        console.log('❌ Coluna full_description não encontrada');
        return;
      }
    }
    
    // Teste 2: Tentar inserir um produto com full_description
    console.log('\n📝 Teste 2: Tentando inserir produto com full_description...');
    const testProduct = {
      name: 'Produto Teste',
      slug: 'produto-teste',
      description: 'Descrição curta teste',
      full_description: 'Descrição completa teste com campo correto',
      category_id: null,
      finish_id: null,
      is_featured: false
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('products')
      .insert(testProduct)
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir produto:', insertError);
      if (insertError.code === 'PGRST204') {
        console.log('❌ Erro PGRST204 ainda presente - campo não encontrado');
      }
      return;
    }
    
    console.log('✅ Produto inserido com sucesso:', insertData.id);
    
    // Teste 3: Tentar atualizar o produto
    console.log('\n🔄 Teste 3: Tentando atualizar produto...');
    const { data: updateData, error: updateError } = await supabase
      .from('products')
      .update({ 
        full_description: 'Descrição atualizada com sucesso',
        updated_at: new Date().toISOString()
      })
      .eq('id', insertData.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Erro ao atualizar produto:', updateError);
      return;
    }
    
    console.log('✅ Produto atualizado com sucesso');
    
    // Teste 4: Limpar - remover produto de teste
    console.log('\n🧹 Teste 4: Removendo produto de teste...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.error('❌ Erro ao remover produto:', deleteError);
    } else {
      console.log('✅ Produto de teste removido com sucesso');
    }
    
    console.log('\n🎉 Todos os testes passaram! O erro PGRST204 foi corrigido.');
    
  } catch (error) {
    console.error('❌ Erro inesperado durante os testes:', error);
  }
}

// Executar o teste
testFullDescriptionFix();

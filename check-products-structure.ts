import { supabase } from './app/lib/supabaseClient.js';

async function checkProductsTable() {
  try {
    console.log('Verificando estrutura da tabela products...');
    
    // Tentar inserir um registro de teste para ver as colunas
    const testData = {
      name: 'Teste Produto',
      slug: 'teste-produto',
      description: 'Descrição teste',
      image_url: 'https://example.com/test.jpg',
      category_id: 'test-cat',
      finish_id: 'test-fin',
      is_featured: false,
      technical_data: {},
      application_video_url: ''
    };
    
    const { data, error } = await supabase
      .from('products')
      .insert(testData)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao inserir teste:', error);
      console.log('Detalhes do erro:', error.message);
      return;
    }
    
    console.log('✅ Inserção bem-sucedida!');
    console.log('Colunas disponíveis:', Object.keys(data));
    
    // Limpar o registro de teste
    await supabase
      .from('products')
      .delete()
      .eq('id', data.id);
      
    console.log('✅ Teste limpo com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

checkProductsTable();

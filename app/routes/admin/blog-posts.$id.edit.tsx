import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, redirect, Form } from "react-router-dom";
import { Save, Eye, ArrowLeft, Upload, X, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { BlogService, type BlogPost } from "../../services/blogService";
import { Layout } from "../../components/Layout";
import { supabase } from "../../lib/supabaseClient";

export const meta: MetaFunction = ({ data }: any) => {
  return [
    { title: `Editar Post - ${data?.post?.title || 'Blog'} - ProRevest` },
    { name: "description", content: `Edite o post ${data?.post?.title || 'do blog'}` },
  ];
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response("Post ID is required", { status: 400 });
  }

  try {
    // Tentar obter o post pelo ID primeiro
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !post) {
      // Se não encontrar pelo ID, tentar pelo slug (compatibilidade)
      const postBySlug = await BlogService.getBlogPostBySlug(id);
      if (!postBySlug) {
        throw new Response("Post not found", { status: 404 });
      }
      
      const categories = await BlogService.getBlogCategories();
      return { post: postBySlug, categories };
    }

    const categories = await BlogService.getBlogCategories();
    
    return { post, categories };
  } catch (error) {
    console.error('Error loading blog post:', error);
    throw new Response("Error loading post", { status: 500 });
  }
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response("Post ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const intent = formData.get('intent');
  
  const postData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    excerpt: formData.get('excerpt') as string,
    content: formData.get('content') as string,
    author: formData.get('author') as string || 'ProRevest Team',
    author_id: '', // Será preenchido posteriormente
    status: formData.get('status') as 'draft' | 'published',
    category: formData.get('category') as string,
    featured_image: formData.get('featured_image') as string || null,
    tags: (formData.get('tags') as string || '').split(',').map(tag => tag.trim()).filter(Boolean),
    published_at: formData.get('status') === 'published' ? new Date().toISOString() : null,
  };

  try {
    // Primeiro, obter o post atual pelo slug para encontrar o ID real
    const currentPost = await BlogService.getBlogPostBySlug(id);
    
    if (!currentPost) {
      throw new Response("Post not found", { status: 404 });
    }

    if (intent === 'save') {
      const updatedPost = await BlogService.updateBlogPost(currentPost.id, postData);
      return redirect('/admin/blog-posts');
    } else if (intent === 'preview') {
      // Salvar como rascunho e redirecionar para preview
      postData.status = 'draft';
      const updatedPost = await BlogService.updateBlogPost(currentPost.id, postData);
      return redirect(`/blog/${updatedPost.slug}?preview=true`);
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { error: 'Erro ao atualizar post. Tente novamente.' };
  }

  return null;
}

export default function EditBlogPost() {
  const { post, categories } = useLoaderData() as { post: BlogPost; categories: string[] };
  const actionData = useActionData() as { error?: string } | undefined;

  const [formData, setFormData] = useState({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content,
    author: post.author,
    status: post.status as 'draft' | 'published',
    category: post.category,
    featured_image: post.featured_image || '',
    tags: post.tags ? post.tags.join(', ') : ''
  });

  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(post.featured_image || '');

  // Gerar slug automático a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));

    // Gerar slug automaticamente se ainda estiver vazio ou se for o slug original
    if (!formData.slug || formData.slug === post.slug || isGeneratingSlug) {
      setIsGeneratingSlug(true);
      const slug = generateSlug(title);
      setFormData(prev => ({ ...prev, slug }));
      setTimeout(() => setIsGeneratingSlug(false), 1000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para fazer upload de imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo do arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setIsUploading(true);
    
    // Criar preview imediato
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setImagePreview(previewUrl);
    };
    reader.readAsDataURL(file);

    try {
      // Criar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // Lista de buckets para tentar (em ordem de preferência)
      const buckets = ['blog-images', 'images', 'public', 'uploads'];
      let uploadSuccess = false;
      let publicUrl = '';

      for (const bucket of buckets) {
        try {
          console.log(`Tentando upload no bucket: ${bucket}`);
          
          // Upload para o Supabase Storage
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) {
            console.log(`Bucket ${bucket} falhou:`, error.message);
            continue; // Tentar próximo bucket
          }

          // Upload bem-sucedido, obter URL pública
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

          publicUrl = urlData.publicUrl;
          uploadSuccess = true;
          console.log(`Upload sucesso no bucket: ${bucket}, URL: ${publicUrl}`);
          break; // Sair do loop se sucesso
        } catch (bucketError) {
          console.log(`Erro no bucket ${bucket}:`, bucketError);
          continue; // Tentar próximo bucket
        }
      }

      if (uploadSuccess && publicUrl) {
        setFormData(prev => ({ ...prev, featured_image: publicUrl }));
        setImagePreview(publicUrl);
      } else {
        // Se todos os buckets falharem, usar base64 como fallback
        console.log('Todos os buckets falharam, usando base64 como fallback');
        const base64Url = imagePreview; // Já temos do FileReader
        setFormData(prev => ({ ...prev, featured_image: base64Url }));
        
        // Mostrar aviso em vez de erro
        alert('Upload para storage falhou, mas a imagem foi salva localmente. Você pode publicar assim mesmo ou tentar uma URL externa.');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      
      // Usar base64 como fallback final
      const base64Url = imagePreview;
      setFormData(prev => ({ ...prev, featured_image: base64Url }));
      
      alert('Upload falhou, mas a imagem foi salva localmente. Você pode publicar assim mesmo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para remover imagem
  const removeImage = () => {
    setFormData(prev => ({ ...prev, featured_image: '' }));
    setImagePreview('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => history.back()}
              className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
              Voltar
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white">Editar Post</h1>
              <p className="text-slate-400 text-lg">Edite o post "{post.title}"</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Form method="post">
              <input type="hidden" name="intent" value="preview" />
              {Object.entries(formData).map(([key, value]) => (
                <input key={key} type="hidden" name={key} value={value} />
              ))}
              <button
                type="submit"
                className="flex items-center gap-3 px-6 py-3 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Eye className="h-5 w-5" />
                Visualizar
              </button>
            </Form>

            <Form method="post">
              <input type="hidden" name="intent" value="save" />
              <button
                type="submit"
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                disabled={!formData.title || !formData.content}
              >
                <Save className="h-5 w-5" />
                Salvar Alterações
              </button>
            </Form>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {actionData?.error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-6 m-8">
          <p className="text-red-400 text-lg">{actionData.error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <Form method="post" className="space-y-6">
            <input type="hidden" name="intent" value="save" />

            {/* Layout Flex Principal */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Área de Conteúdo Principal */}
              <div className="xl:col-span-3 space-y-8 p-8 bg-slate-800/30 rounded-lg border border-slate-700/50">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Título do Post *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm focus:ring-offset-2"
                    placeholder="Digite um título atraente..."
                    required
                  />
                </div>

                {/* URL Amigável */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    URL Amigável (Slug)
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono shadow-sm"
                    placeholder="url-amigavel-do-post"
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    URL amigável para o post. Será gerada automaticamente a partir do título.
                  </p>
                </div>

                {/* Resumo */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Resumo
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none shadow-sm"
                    placeholder="Breve resumo do post (aparece na listagem)..."
                  />
                </div>

                {/* Conteúdo Principal */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Conteúdo *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono shadow-sm"
                    placeholder="Escreva o conteúdo do post em Markdown..."
                    required
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    Use Markdown para formatar o conteúdo. Títulos com ##, negrito com **texto**, etc.
                  </p>
                </div>
              </div>

              {/* Sidebar com Configurações */}
              <div className="space-y-8">
                {/* Upload de Imagem */}
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="font-medium text-slate-200 mb-6 flex items-center gap-3">
                    <ImageIcon className="h-6 w-6 text-blue-400" />
                    Imagem Destaque
                  </h3>

                  {/* Área de Upload */}
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 hover:border-slate-500 transition-colors bg-slate-700/30">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                        disabled={isUploading}
                      />
                      <label
                        htmlFor="image-upload"
                        className={`flex flex-col items-center gap-4 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-500">
                          {isUploading ? (
                            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"></div>
                          ) : (
                            <Upload className="h-8 w-8 text-slate-300" />
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-base text-slate-300 mb-1">
                            {isUploading ? 'Fazendo upload...' : 'Clique para fazer upload'}
                          </p>
                          <p className="text-sm text-slate-400">PNG, JPG até 5MB</p>
                        </div>
                      </label>
                    </div>

                    {/* Preview da Imagem */}
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    {/* URL Manual */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        Ou insira URL da imagem
                      </label>
                      <input
                        type="url"
                        name="featured_image"
                        value={formData.featured_image}
                        onChange={(e) => {
                          handleInputChange('featured_image', e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Status e Autor */}
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="font-medium text-slate-200 mb-4">Publicação</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Autor</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={(e) => handleInputChange('author', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Categoria */}
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="font-medium text-slate-200 mb-4">Categoria</h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                    >
                      <option value="">Selecione...</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="Nova Categoria">+ Nova Categoria</option>
                    </select>
                  </div>

                  {formData.category === 'Nova Categoria' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Nome da nova categoria"
                        className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="font-medium text-slate-200 mb-4">Tags</h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tags</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-sm text-slate-400 mt-2">
                      Separe as tags com vírgula.
                    </p>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                  <h3 className="font-medium text-slate-200 mb-4">Ações Rápidas</h3>

                  <div className="space-y-4">
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-5 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg transition-colors"
                      onClick={() => {
                        const markdown = `# ${formData.title}\n\n${formData.excerpt}\n\n<!-- Escreva seu conteúdo aqui -->`;
                        setFormData(prev => ({ ...prev, content: markdown }));
                      }}
                    >
                      <Plus className="h-5 w-5" />
                      Adicionar Template Básico
                    </button>

                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-5 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 rounded-lg transition-colors"
                      onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}>
                      <Save className="h-5 w-5" />
                      Salvar como Rascunho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

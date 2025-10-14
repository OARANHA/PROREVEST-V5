import type { MetaFunction, LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLoaderData, useActionData, redirect, Form } from "react-router-dom";
import { Save, Eye, ArrowLeft, Upload, X, Wand2, Loader2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { BlogService, type BlogPost } from "../../services/blogService";
import { ProRevestAIService } from "../../services/zaiService";
import { Layout } from "../../components/Layout";
import { supabase } from "../../lib/supabaseClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Novo Post - Blog - ProRevest" },
    { name: "description", content: "Crie um novo post para o blog da ProRevest" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  return { categories: await BlogService.getBlogCategories() };
}

export async function action({ request }: ActionFunctionArgs) {
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
    if (intent === 'save') {
      const newPost = await BlogService.createBlogPost(postData);
      return redirect('/admin/blog-posts');
    } else if (intent === 'preview') {
      // Salvar como rascunho e redirecionar para preview
      postData.status = 'draft';
      const newPost = await BlogService.createBlogPost(postData);
      return redirect(`/blog/${newPost.slug}?preview=true`);
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return { error: 'Erro ao criar post. Tente novamente.' };
  }

  return null;
}

export default function NewBlogPost() {
  const { categories } = useLoaderData() as { categories: string[] };
  const actionData = useActionData() as { error?: string } | undefined;
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'ProRevest Team',
    status: 'draft' as 'draft' | 'published',
    category: 'Geral',
    featured_image: '',
    tags: ''
  });

  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

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
    
    // Gerar slug automaticamente se ainda estiver vazio
    if (!formData.slug || isGeneratingSlug) {
      setIsGeneratingSlug(true);
      const slug = generateSlug(title);
      setFormData(prev => ({ ...prev, slug }));
      setTimeout(() => setIsGeneratingSlug(false), 1000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      alert('Por favor, digite um tópico para o post.');
      return;
    }

    setIsGeneratingWithAI(true);
    
    try {
      const generatedPost = await ProRevestAIService.generateBlogPostFromTopic(aiTopic, formData.category);
      
      setFormData(prev => ({
        ...prev,
        title: generatedPost.title,
        slug: generatedPost.slug,
        excerpt: generatedPost.excerpt,
        content: generatedPost.content,
        tags: generatedPost.tags.join(', ')
      }));

      setAiTopic('');
    } catch (error) {
      console.error('Erro ao gerar post com IA:', error);
      alert('Erro ao gerar post com IA. Verifique se a API key está configurada.');
    } finally {
      setIsGeneratingWithAI(false);
    }
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
    <Layout>
      <div className="p-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
                Voltar
              </button>
              <div>
                <h1 className="text-3xl font-cormorant font-bold">Novo Post</h1>
                <p className="text-muted-foreground">Crie um novo post para o blog</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Form method="post">
                <input type="hidden" name="intent" value="preview" />
                {Object.entries(formData).map(([key, value]) => (
                  <input key={key} type="hidden" name={key} value={value} />
                ))}
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted"
                >
                  <Eye className="h-4 w-4" />
                  Visualizar
                </button>
              </Form>
              
              <Form method="post">
                <input type="hidden" name="intent" value="save" />
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                  disabled={!formData.title || !formData.content}
                >
                  <Save className="h-4 w-4" />
                  Publicar
                </button>
              </Form>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {actionData?.error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive">{actionData.error}</p>
          </div>
        )}

        <Form method="post" className="space-y-6">
          <input type="hidden" name="intent" value="save" />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 xl:col-span-4 space-y-8 p-8 bg-slate-800/30 rounded-lg border border-slate-700/50">
              {/* AI Generation */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-8">
                <h3 className="font-medium mb-6 flex items-center gap-3 text-slate-200">
                  <Wand2 className="h-6 w-6 text-purple-400" />
                  Gerar Post com IA
                </h3>

                <div className="flex gap-4">
                  <input
                    type="text"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="flex-1 px-5 py-4 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
                    placeholder="Digite um tópico (ex: 'Cores para sala de estar')"
                    onKeyPress={(e) => e.key === 'Enter' && !isGeneratingWithAI && handleGenerateWithAI()}
                  />
                  <button
                    type="button"
                    onClick={handleGenerateWithAI}
                    disabled={isGeneratingWithAI || !aiTopic.trim()}
                    className="flex items-center gap-3 px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isGeneratingWithAI ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-5 w-5" />
                        Gerar
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-slate-300 mt-4">
                  A IA irá gerar um título, conteúdo, resumo e tags automaticamente com base no tópico.
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Título do Post *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-lg"
                  placeholder="Digite um título atraente..."
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  URL Amigável (Slug)
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 font-mono text-lg"
                  placeholder="url-amigavel-do-post"
                />
                <p className="text-sm text-slate-400 mt-3">
                  URL amigável para o post. Será gerada automaticamente a partir do título.
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Resumo
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  rows={5}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none text-lg"
                  placeholder="Breve resumo do post (aparece na listagem)..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                  Conteúdo *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={25}
                  className="w-full px-6 py-5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 resize-none font-mono text-lg"
                  placeholder="Escreva o conteúdo do post em Markdown..."
                  required
                />
                <p className="text-sm text-slate-400 mt-3">
                  Use Markdown para formatar o conteúdo. Títulos com ##, negrito com **texto**, etc.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Status */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-200">Publicação</h3>

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

              {/* Category */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-200">Categoria</h3>

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

              {/* Featured Image */}
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
                      id="image-upload-new"
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="image-upload-new"
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

              {/* Tags */}
              <div className="bg-slate-800/50 border border-slate-600 rounded-lg p-6">
                <h3 className="font-medium mb-4 text-slate-200">Tags</h3>

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
            </div>
          </div>
        </Form>
      </div>
    </Layout>
  );
}

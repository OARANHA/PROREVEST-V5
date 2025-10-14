import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Calendar, User, Tag, ArrowLeft, Share2, Eye } from "lucide-react";
import { BlogService, type BlogPost } from "../services/blogService";
import { Layout } from "../components/Layout";

export const meta: MetaFunction = ({ data }: { data: any }) => {
  if (!data || !data.post) return [];
  
  return [
    { title: `${data.post.title} - Blog ProRevest` },
    { name: "description", content: data.post.excerpt },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const { slug } = params;
    if (!slug) {
      throw new Error("Slug não fornecido");
    }
    
    const post = await BlogService.getBlogPostBySlug(slug);
    if (!post) {
      throw new Error("Post não encontrado");
    }
    
    // Incrementar visualizações
    await BlogService.incrementBlogPostViews(post.id);
    
    return { post };
  } catch (error) {
    console.error("Error loading blog post:", error);
    return { post: null, error: "Falha ao carregar o post" };
  }
}

export default function BlogPost() {
  const { post, error } = useLoaderData() as { post: BlogPost | null; error?: string };
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 pt-20">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-destructive mb-2">Erro</h2>
            <p className="text-destructive mb-4">{error || "Post não encontrado"}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 pt-20 max-w-4xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Voltar
        </button>
        
        <article className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {post.featured_image && (
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-64 md:h-96 object-cover"
            />
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
                {post.category}
              </span>
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-cormorant font-bold mb-4">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{new Date(post.published_at || post.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                <span>{post.views} visualizações</span>
              </div>
            </div>
            
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <Share2 className="h-5 w-5" />
                {copied ? 'Link copiado!' : 'Compartilhar'}
              </button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Última atualização:</span>
                <span>{new Date(post.updated_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </article>
        
        {/* Posts relacionados */}
        <div className="mt-12">
          <h2 className="text-2xl font-cormorant font-bold mb-6">Posts relacionados</h2>
          <p className="text-muted-foreground">Em breve mais conteúdos relacionados a este post.</p>
        </div>
      </div>
    </Layout>
  );
}

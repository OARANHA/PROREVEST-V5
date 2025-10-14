import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, Calendar, User } from "lucide-react";
import { BlogService, type BlogPost } from "../../services/blogService";
import { useNavigate } from "react-router-dom";

export const meta: MetaFunction = () => {
  return [
    { title: "Posts do Blog - ProRevest" },
    { name: "description", content: "Gerencie os posts do blog da ProRevest" },
  ];
}

export default function AdminBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  // Carregar posts do blog
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await BlogService.getBlogPosts();
        setPosts(postsData);
        setFilteredPosts(postsData);
      } catch (error) {
        console.error("Erro ao carregar posts do blog:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filtrar posts com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Publicado</span>;
      case "draft":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Rascunho</span>;
      case "archived":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Arquivado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;
    
    try {
      await BlogService.deleteBlogPost(postId);
      const updatedPosts = posts.filter(p => p.id !== postId);
      setPosts(updatedPosts);
      setFilteredPosts(updatedPosts);
    } catch (error) {
      console.error("Erro ao deletar post:", error);
      alert("Erro ao deletar post. Por favor, tente novamente.");
    }
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-cormorant font-bold text-slate-100 mb-2">Posts do Blog</h1>
            <p className="text-slate-300 text-lg">Gerencie os posts do blog da ProRevest</p>
          </div>
          <button
            onClick={() => navigate("/admin/blog-posts/new")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo Post
          </button>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
          <input
            type="text"
            placeholder="Buscar posts..."
            className="w-full pl-14 pr-6 py-4 border border-slate-600 rounded-lg bg-slate-700/50 text-slate-200 text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de posts */}
      <div className="bg-slate-800/50 border border-slate-600 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-600">
          <thead className="bg-slate-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Título
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Autor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-slate-300 uppercase tracking-wider">
                Visualizações
              </th>
              <th scope="col" className="px-6 py-3 text-right text-sm font-medium text-slate-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-800/50 divide-y divide-slate-600">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-8 text-center text-slate-400 text-lg">
                  Nenhum post encontrado
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-100 text-base mb-1">{post.title}</div>
                    <div className="text-sm text-slate-400 line-clamp-1">{post.excerpt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-slate-400" />
                      <span className="text-slate-200 text-sm">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-200 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-100">{post.views || 0}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewPost(post.slug)}
                      className="text-blue-400 hover:text-blue-300 mr-3 transition-colors inline-flex items-center justify-center"
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/admin/blog-posts/${post.id}/edit`)}
                      className="text-green-400 hover:text-green-300 mr-3 transition-colors inline-flex items-center justify-center"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-400 hover:text-red-300 transition-colors inline-flex items-center justify-center"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-lg text-slate-300">
          Mostrando 1 a {filteredPosts.length} de {filteredPosts.length} resultados
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 border border-slate-600 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700/50 transition-colors">
            Anterior
          </button>
          <button className="px-4 py-2 border border-slate-600 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-700/50 transition-colors">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}

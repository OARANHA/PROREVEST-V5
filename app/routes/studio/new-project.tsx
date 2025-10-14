import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Layout } from "../../components/Layout";
import { ArrowLeft, Upload, Palette, Check } from "lucide-react";

export default function NewStudioProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados para o formulário
  const [projectData, setProjectData] = useState({
    name: "",
    roomType: "",
    description: "",
    style: ""
  });
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar formato do arquivo
      const validFormats = ['image/png', 'image/jpeg', 'image/webp'];
      if (!validFormats.includes(file.type)) {
        alert('Formato de arquivo inválido. Por favor, envie apenas PNG, JPEG ou WebP.');
        e.target.value = '';
        return;
      }
      
      // Validar tamanho (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('Arquivo muito grande. Por favor, envie uma imagem com no máximo 10MB.');
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProject = async () => {
    if (!projectData.name || !uploadedImage) {
      alert("Por favor, preencha o nome do projeto e faça upload de uma imagem.");
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Criar objeto do projeto
      const newProject = {
        ...projectData,
        image: uploadedImage,
        user_id: user?.id,
        status: "draft",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Projeto criado:", newProject);
      
      // Criar slug único para o projeto
      const projectSlug = newProject.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiais
        .replace(/\s+/g, '-') // Substituir espaços por hífens
        .trim();
      
      // Salvar dados do projeto no localStorage para o editor
      localStorage.setItem('studioProject', JSON.stringify(newProject));
      localStorage.setItem('studioProjectImage', uploadedImage);
      
      // Simular delay para mostrar feedback
      setTimeout(() => {
        setIsCreating(false);
        
        // Navegar para o editor do projeto com o slug
        console.log("Navegando para editor com slug:", projectSlug);
        navigate(`/studio/editor/${projectSlug}`);
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      setIsCreating(false);
      alert("Ocorreu um erro ao criar o projeto. Tente novamente.");
    }
  };

  return (
    <Layout showHeaderFooter={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => navigate("/studio")}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Voltar para Studio
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Novo Projeto</h1>
                  <p className="text-sm text-gray-500">Studio ProRevest</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Novo Projeto</h2>
            
            {/* Nome do Projeto */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto</label>
              <input
                type="text"
                value={projectData.name}
                onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                placeholder="Ex: Minha Sala de Estar Moderna"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Upload da Imagem */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Ambiente</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {uploadedImage ? (
                  <div>
                    <img
                      src={uploadedImage}
                      alt="Preview do ambiente"
                      className="max-w-full h-64 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-sm text-green-600 font-medium">Imagem carregada com sucesso!</p>
                    <button
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="text-sm text-primary hover:text-primary/80 underline"
                    >
                      Trocar imagem
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Faça upload da imagem do ambiente atual</p>
                    <p className="text-xs text-gray-500 mb-4">Formatos aceitos: PNG, JPEG, WebP (máx. 10MB)</p>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="h-5 w-5 mr-2 inline" />
                      Carregar Imagem
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição (Opcional) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição (Opcional)</label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                placeholder="Descreva seus objetivos, preferências, ou qualquer detalhe importante para o projeto..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">Isso nos ajudará a sugerir as cores e materiais mais adequados</p>
            </div>

            {/* Botão Criar Projeto */}
            <div className="flex justify-center">
              <button
                onClick={handleCreateProject}
                disabled={!projectData.name || !uploadedImage || isCreating}
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white border-t-transparent mr-2"></div>
                    Criando...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Criar Projeto
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { SampleService } from "../services/sampleService";
import { ProductService, type ProductWithDetails } from "../services/productService";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";

export const meta: MetaFunction = () => {
  return [
    { title: "Solicitar Amostra Física - ProRevest" },
    { name: "description", content: "Solicite amostras físicas dos nossos produtos premium para testar as cores e texturas em seu ambiente." },
  ];
}

export default function SolicitarAmostra() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    cep: "",
    productIds: [] as string[],
    observations: ""
  });
  
  const [selectedProducts, setSelectedProducts] = useState<ProductWithDetails[]>([]);
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Carregar produtos
  useEffect(() => {
    fetchProducts();
    
    // Preencher dados do usuário logado
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || "",
        email: user.email || ""
      }));
    }
  }, [user]);
  
  const fetchProducts = async () => {
    try {
      const productsData = await ProductService.getProducts();
      setProducts(productsData);
      
      // Selecionar alguns produtos por padrão
      if (productsData.length > 0) {
        setSelectedProducts(productsData.slice(0, 2));
        setFormData(prev => ({
          ...prev,
          productIds: productsData.slice(0, 2).map(p => p.id)
        }));
      }
    } catch (err) {
      setError("Erro ao carregar produtos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Você precisa estar logado para solicitar amostras.");
      return;
    }
    
    if (selectedProducts.length === 0) {
      alert("Selecione pelo menos um produto para solicitar amostra.");
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      // Criar uma solicitação de amostra para cada produto selecionado
      const samplePromises = selectedProducts.map(product => {
        return SampleService.requestSample({
          user_id: user.id,
          project_id: "", // Em uma implementação real, isso viria de um projeto selecionado
          variant_id: product.product_variants[0]?.id || "", // Usar a primeira variante
          status: "requested",
          tracking_code: "",
          shipping_company: "",
          requested_at: new Date().toISOString(),
          shipped_at: null,
          delivered_at: null,
          feedback: null
        });
      });
      
      await Promise.all(samplePromises);
      
      // Redirecionar para a página de meus projetos
      navigate("/meus-projetos");
      alert("Solicitação de amostra enviada com sucesso! Você receberá um e-mail com as informações de rastreio.");
    } catch (err) {
      setError("Erro ao enviar solicitação de amostra. Por favor, tente novamente.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleProductSelection = (product: ProductWithDetails) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    
    if (isSelected) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
      setFormData(prev => ({
        ...prev,
        productIds: prev.productIds.filter(id => id !== product.id)
      }));
    } else {
      setSelectedProducts(prev => [...prev, product]);
      setFormData(prev => ({
        ...prev,
        productIds: [...prev.productIds, product.id]
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold mb-4">Solicitar Amostra Física</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Receba amostras físicas dos nossos produtos premium para testar as cores e texturas diretamente no seu ambiente.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Selected Products */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-cormorant font-bold mb-6">Produtos Selecionados</h2>
              
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <p className="text-muted-foreground">Nenhum produto selecionado</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center p-4 bg-muted/30 rounded-lg">
                      <div 
                        className="w-10 h-10 rounded-full border border-border mr-4" 
                        style={{ backgroundColor: product.product_colors[0]?.color?.hex_code || "#FFFFFF" }}
                      ></div>
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.product_colors[0]?.color?.name || "Cor não especificada"}</p>
                      </div>
                      <button 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleProductSelection(product)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-3">Processo de Entrega</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5">1</div>
                    <span>Confirmação da solicitação em até 1 dia útil</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5">2</div>
                    <span>Preparação da amostra em 2-3 dias úteis</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5">3</div>
                    <span>Entrega em 3-5 dias úteis (dependendo da região)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mr-3 mt-0.5">4</div>
                    <span>Código de rastreio enviado por e-mail</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-cormorant font-bold mb-6">Informações para Entrega</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">Nome Completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">Telefone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">Empresa (opcional)</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium mb-2">Endereço *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-2">Cidade *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-2">Estado *</label>
                    <select
                      id="state"
                      name="state"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Selecione um estado</option>
                      <option value="AC">Acre</option>
                      <option value="AL">Alagoas</option>
                      <option value="AP">Amapá</option>
                      <option value="AM">Amazonas</option>
                      <option value="BA">Bahia</option>
                      <option value="CE">Ceará</option>
                      <option value="DF">Distrito Federal</option>
                      <option value="ES">Espírito Santo</option>
                      <option value="GO">Goiás</option>
                      <option value="MA">Maranhão</option>
                      <option value="MT">Mato Grosso</option>
                      <option value="MS">Mato Grosso do Sul</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="PA">Pará</option>
                      <option value="PB">Paraíba</option>
                      <option value="PR">Paraná</option>
                      <option value="PE">Pernambuco</option>
                      <option value="PI">Piauí</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="RN">Rio Grande do Norte</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="RO">Rondônia</option>
                      <option value="RR">Roraima</option>
                      <option value="SC">Santa Catarina</option>
                      <option value="SP">São Paulo</option>
                      <option value="SE">Sergipe</option>
                      <option value="TO">Tocantins</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium mb-2">CEP *</label>
                    <input
                      type="text"
                      id="cep"
                      name="cep"
                      required
                      className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.cep}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mb-8">
                  <label htmlFor="observations" className="block text-sm font-medium mb-2">Observações (opcional)</label>
                  <textarea
                    id="observations"
                    name="observations"
                    rows={4}
                    className="w-full p-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    value={formData.observations}
                    onChange={handleChange}
                    placeholder="Informações adicionais sobre a entrega, preferência de horário, etc."
                  ></textarea>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {submitting ? "Enviando..." : "Solicitar Amostras"}
                  </button>
                  <Link 
                    to="/catalogo" 
                    className="flex-1 text-center bg-gradient-to-r from-accent to-secondary text-accent-foreground px-6 py-3 rounded-lg font-medium hover:from-accent/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg text-center"
                  >
                    Selecionar Mais Produtos
                  </Link>
                </div>
              </form>
            </div>
            
            {/* Tracking Information */}
            <div className="mt-8 bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-cormorant font-bold mb-4">Rastreio de Amostras</h2>
              <p className="text-muted-foreground mb-4">
                Após a confirmação da sua solicitação, você receberá um código de rastreio por e-mail.
              </p>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Digite o código de rastreio"
                  className="flex-1 p-3 rounded-l-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="bg-secondary text-secondary-foreground px-6 py-3 rounded-r-lg font-medium hover:bg-secondary/90 transition-colors">
                  Rastrear
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-2xl font-cormorant font-bold mb-6 text-center">Por que Solicitar Amostras?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Visualização Real</h3>
              <p className="text-muted-foreground">
                Veja como a cor e textura realmente ficam na sua iluminação e ambiente.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Decisão Confiante</h3>
              <p className="text-muted-foreground">
                Tome decisões de design com confiança após testar fisicamente os produtos.
              </p>
            </div>
            
            <div className="text-center p-6 bg-card border border-border rounded-xl">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Zero Risco</h3>
              <p className="text-muted-foreground">
                O serviço de amostra é gratuito. Experimente sem compromisso.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
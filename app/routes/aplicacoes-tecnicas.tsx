import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "react-router";
import { useState } from "react";
import { Search, Filter, CheckCircle, ArrowRight, Factory, Car, Building2, Home, Droplets, Wrench } from "lucide-react";
import { ProductService } from "../services/productService";
import { SiteFooter } from "../components/SiteFooter";

// Dados das aplicações técnicas baseados nos PDFs
const technicalApplicationsData = [
  {
    id: "industrial",
    title: "Aplicações Industriais",
    iconName: "Factory",
    description: "Soluções para ambientes industriais com alta resistência",
    color: "bg-blue-500",
    applications: [
      {
        name: "Estruturas Metálicas",
        products: ["PRIMER EPÓXI ISOCIANATO", "ESMALTE POLIURETANO ALIFÁTICO 4x1"],
        description: "Proteção anticorrosiva para estruturas expostas",
        specifications: {
          durability: "15-20 anos",
          temperature: "-20°C a +120°C",
          humidity: "Até 95%",
          coating_system: "3 demãos"
        }
      },
      {
        name: "Pisos Industriais",
        products: ["EPÓXI PISO AUTONIVELANTE 100% SÓLIDOS", "EPÓXI POLIAMIDA ALTA ESPESSURA"],
        description: "Revestimentos de alta resistência para tráfego pesado",
        specifications: {
          durability: "10-15 anos",
          abrasion_resistance: "Classe AR1",
          chemical_resistance: "Excelente",
          thickness: "2-5mm"
        }
      },
      {
        name: "Tanques e Reservatórios",
        products: ["EPÓXI NOVOLAC 100% SÓLIDOS", "PRIMER EPÓXI RICO EM ZINCO"],
        description: "Proteção interna para armazenamento de produtos químicos",
        specifications: {
          durability: "20+ anos",
          chemical_resistance: "Ácidos e bases",
          temperature: "Até +80°C",
          immersion: "Contínua"
        }
      }
    ]
  },
  {
    id: "automotive",
    title: "Setor Automotivo",
    iconName: "Car",
    description: "Tintas especializadas para veículos e componentes",
    color: "bg-red-500",
    applications: [
      {
        name: "Carrocerias",
        products: ["PRIMER PU ALTA ESPESSURA", "ESMALTE PU BICOMPONENTE"],
        description: "Acabamento automotivo profissional",
        specifications: {
          durability: "8-12 anos",
          uv_resistance: "Excelente",
          gloss_retention: "95% após 5 anos",
          color_matching: "Disponível"
        }
      },
      {
        name: "Chassis e Componentes",
        products: ["PRIMER EPÓXI FOSFATIZANTE", "ESMALTE ALQUÍDICO MODIFICADO"],
        description: "Proteção anticorrosiva para componentes estruturais",
        specifications: {
          durability: "5-8 anos",
          salt_spray: "500+ horas",
          adhesion: "Excelente",
          flexibility: "Alta"
        }
      }
    ]
  },
  {
    id: "construction",
    title: "Construção Civil",
    iconName: "Building2",
    description: "Soluções completas para obras residenciais e comerciais",
    color: "bg-green-500",
    applications: [
      {
        name: "Fachadas",
        products: ["TINTA ACRÍLICA FACHADA", "TEXTURA ACRÍLICA RÚSTICA"],
        description: "Proteção e embelezamento de superfícies externas",
        specifications: {
          durability: "8-12 anos",
          weather_resistance: "Excelente",
          breathability: "Alta",
          washability: "Classe 2"
        }
      },
      {
        name: "Estruturas de Concreto",
        products: ["PRIMER EPÓXI PENETRANTE", "TINTA EPÓXI PISO"],
        description: "Proteção e impermeabilização de concreto",
        specifications: {
          durability: "10-15 anos",
          carbonation_protection: "Sim",
          chloride_resistance: "Alta",
          adhesion: "Excelente"
        }
      },
      {
        name: "Coberturas Metálicas",
        products: ["PRIMER ANTICORROSIVO", "ESMALTE SINTÉTICO BRILHANTE"],
        description: "Proteção para telhas e estruturas metálicas",
        specifications: {
          durability: "6-10 anos",
          thermal_reflection: "Disponível",
          corrosion_protection: "Excelente",
          flexibility: "Boa"
        }
      }
    ]
  },
  {
    id: "residential",
    title: "Residencial",
    iconName: "Home",
    description: "Tintas para ambientes domésticos",
    color: "bg-purple-500",
    applications: [
      {
        name: "Ambientes Internos",
        products: ["TINTA LÁTEX PVA", "TINTA ACRÍLICA PREMIUM"],
        description: "Acabamento para paredes e tetos internos",
        specifications: {
          durability: "5-8 anos",
          washability: "Classe 1-3",
          coverage: "12-16 m²/L",
          drying_time: "2-4 horas"
        }
      },
      {
        name: "Áreas Úmidas",
        products: ["TINTA EPÓXI BICOMPONENTE", "ESMALTE SINTÉTICO"],
        description: "Proteção para banheiros e cozinhas",
        specifications: {
          durability: "6-10 anos",
          moisture_resistance: "Excelente",
          mold_resistance: "Sim",
          easy_cleaning: "Sim"
        }
      }
    ]
  },
  {
    id: "marine",
    title: "Náutico/Marítimo",
    iconName: "Droplets",
    description: "Proteção contra ambiente marinho",
    color: "bg-cyan-500",
    applications: [
      {
        name: "Cascos de Embarcações",
        products: ["PRIMER EPÓXI MARINHO", "TINTA ANTIVEGETATIVA"],
        description: "Proteção completa para embarcações",
        specifications: {
          durability: "3-5 anos",
          antifouling: "Sim",
          salt_water_resistance: "Excelente",
          immersion: "Contínua"
        }
      }
    ]
  },
  {
    id: "special",
    title: "Aplicações Especiais",
    iconName: "Wrench",
    description: "Soluções para necessidades específicas",
    color: "bg-orange-500",
    applications: [
      {
        name: "Altas Temperaturas",
        products: ["TINTA ALTA TEMPERATURA 600°C", "PRIMER SILICONE ZINCO"],
        description: "Proteção para equipamentos de alta temperatura",
        specifications: {
          temperature: "Até 600°C",
          thermal_shock: "Resistente",
          oxidation_resistance: "Excelente",
          durability: "2-5 anos"
        }
      }
    ]
  }
];

// Função para renderizar ícones
const renderIcon = (iconName: string) => {
  const iconProps = { className: "h-8 w-8" };
  
  switch (iconName) {
    case "Factory":
      return <Factory {...iconProps} />;
    case "Car":
      return <Car {...iconProps} />;
    case "Building2":
      return <Building2 {...iconProps} />;
    case "Home":
      return <Home {...iconProps} />;
    case "Droplets":
      return <Droplets {...iconProps} />;
    case "Wrench":
      return <Wrench {...iconProps} />;
    default:
      return <Factory {...iconProps} />;
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log("🔄 Loader aplicacoes-tecnicas iniciado");
    console.log("📊 technicalApplications length:", technicalApplicationsData.length);
    
    console.log("🔍 Chamando ProductService.getAllProducts");
    const products = await ProductService.getAllProducts();
    console.log("✅ Produtos carregados:", products.length);
    
    const result = {
      technicalApplications: technicalApplicationsData,
      products
    };
    
    console.log("📤 Retornando resultado do loader");
    return json(result);
  } catch (error) {
    console.error("❌ Erro no loader aplicacoes-tecnicas:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
    throw error;
  }
}

export default function AplicacoesTecnicas() {
  const { technicalApplications: applications, products } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredApplications = applications.filter(app => {
    if (selectedCategory && app.id !== selectedCategory) return false;
    if (searchTerm) {
      return app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             app.applications.some(application => 
               application.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               application.products.some(product => 
                 product.toLowerCase().includes(searchTerm.toLowerCase())
               )
             );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Paint Theme */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-blue-300 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 left-1/3 w-40 h-40 bg-blue-200 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Aplicações Técnicas
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Soluções especializadas para cada segmento e necessidade específica
            </p>
            
            {/* Paint Drops Visual Elements */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-100"></div>
              <div className="w-4 h-4 bg-white rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-blue-200 rounded-full animate-pulse delay-300"></div>
              <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse delay-400"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar aplicações, produtos ou especificações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-semibold mb-3">Filtrar por Categoria:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white hover:bg-gray-100 border border-gray-300'
                }`}
              >
                Todas
              </button>
              {applications.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedCategory(app.id)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === app.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {app.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Applications Grid - Redesigned Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApplications.map((category) => (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              {/* Compact Category Header */}
              <div className={`${category.color} text-white p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {renderIcon(category.iconName)}
                  </div>
                  <h2 className="text-lg font-bold">{category.title}</h2>
                </div>
                <p className="text-sm opacity-90 line-clamp-2">{category.description}</p>
              </div>

              {/* Compact Applications List */}
              <div className="p-4 space-y-4">
                {category.applications.slice(0, 2).map((application, index) => (
                  <div key={index} className="border-l-3 border-blue-200 pl-3">
                    <h3 className="text-base font-semibold mb-1 text-gray-900">{application.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{application.description}</p>
                    
                    {/* Compact Products */}
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {application.products.slice(0, 3).map((product, productIndex) => (
                          <span
                            key={productIndex}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200"
                          >
                            {product}
                          </span>
                        ))}
                        {application.products.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{application.products.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Key Specifications */}
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {Object.entries(application.specifications).slice(0, 2).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span className="text-gray-500 capitalize">
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Show more applications indicator */}
                {category.applications.length > 2 && (
                  <div className="text-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      +{category.applications.length - 2} aplicações adicionais
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h2 className="text-xl font-bold mb-3 text-gray-900">
              Precisa de uma Solução Personalizada?
            </h2>
            <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
              Nossa equipe técnica pode desenvolver soluções específicas para suas necessidades.
              Entre em contato para uma consultoria especializada.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contato-consultor"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Falar com Especialista
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Ver Catálogo Completo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
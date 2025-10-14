import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  ExternalLink,
  Search,
  Filter,
  BookOpen,
  Award,
  Clipboard,
  Target
} from "lucide-react";
import { ProductService } from "~/services/productService";

// Normas técnicas brasileiras relacionadas aos produtos
const technicalStandards = [
  {
    id: "nbr-11862",
    number: "NBR 11.862",
    title: "Tinta de demarcação viária refletiva",
    category: "Demarcação Viária",
    status: "vigente",
    year: "2019",
    description: "Especifica os requisitos para tintas de demarcação viária refletiva aplicadas a frio, destinadas à sinalização horizontal de pavimentos rodoviários.",
    scope: "Tintas para demarcação viária com microesferas de vidro",
    relatedProducts: [
      "TINTA DEMARCAÇÃO VIÁRIA NBR 11.862",
      "TINTA DEMARCAÇÃO VIÁRIA BASE SOLVENTE"
    ],
    requirements: {
      "Viscosidade": "70-85 KU",
      "Tempo de secagem": "≤ 30 min",
      "Retrorefletância inicial": "≥ 300 mcd/m²/lux",
      "Retrorefletância após 180 dias": "≥ 150 mcd/m²/lux",
      "Resistência à abrasão": "≥ 500 ciclos",
      "Aderência": "Grau 0 (ABNT NBR 11003)"
    },
    testMethods: [
      "ABNT NBR 14942 - Viscosidade",
      "ABNT NBR 14943 - Tempo de secagem",
      "ABNT NBR 14944 - Retrorefletância",
      "ABNT NBR 11003 - Aderência"
    ]
  },
  {
    id: "nbr-13699",
    number: "NBR 13.699",
    title: "Tinta de demarcação viária à base de água",
    category: "Demarcação Viária",
    status: "vigente",
    year: "2018",
    description: "Estabelece os requisitos para tintas de demarcação viária à base de água, aplicadas a frio para sinalização horizontal.",
    scope: "Tintas aquosas para demarcação viária",
    relatedProducts: [
      "TINTA DEMARCAÇÃO VIÁRIA BASE ÁGUA NBR 13.699",
      "TINTA DEMARCAÇÃO VIÁRIA BASE ÁGUA"
    ],
    requirements: {
      "Viscosidade": "65-80 KU",
      "Tempo de secagem": "≤ 15 min",
      "Retrorefletância inicial": "≥ 250 mcd/m²/lux",
      "Retrorefletância após 180 dias": "≥ 125 mcd/m²/lux",
      "Resistência à água": "Sem alteração",
      "COV": "≤ 150 g/L"
    },
    testMethods: [
      "ABNT NBR 14942 - Viscosidade",
      "ABNT NBR 14943 - Tempo de secagem",
      "ABNT NBR 14944 - Retrorefletância",
      "ABNT NBR 15156 - COV"
    ]
  },
  {
    id: "nbr-11003",
    number: "NBR 11.003",
    title: "Tintas - Determinação da aderência",
    category: "Ensaios Gerais",
    status: "vigente",
    year: "2009",
    description: "Prescreve o método para determinação da aderência de tintas e vernizes aplicados sobre substratos.",
    scope: "Método de ensaio para aderência de tintas",
    relatedProducts: [
      "PRIMER SINTÉTICO",
      "PRIMER EPÓXI ISOCIANATO",
      "FUNDO PARA GALVANIZADO",
      "ESMALTE SINTÉTICO"
    ],
    requirements: {
      "Grau 0": "Nenhum destacamento",
      "Grau 1": "Destacamento ≤ 5%",
      "Grau 2": "Destacamento 5-15%",
      "Grau 3": "Destacamento 15-35%",
      "Grau 4": "Destacamento 35-65%",
      "Grau 5": "Destacamento > 65%"
    },
    testMethods: [
      "Corte em grade",
      "Aplicação de fita adesiva",
      "Remoção e avaliação"
    ]
  },
  {
    id: "nbr-15079",
    number: "NBR 15.079",
    title: "Tintas para construção civil",
    category: "Construção Civil",
    status: "vigente",
    year: "2011",
    description: "Especifica os requisitos para tintas à base de resinas sintéticas, em emulsão aquosa, para aplicação em alvenaria, reboco, concreto e outros substratos minerais.",
    scope: "Tintas acrílicas para construção civil",
    relatedProducts: [
      "TINTA ACRÍLICA PREMIUM",
      "TINTA ACRÍLICA PREMIUM PRO",
      "FUNDO PREPARADOR DE PAREDES",
      "SELADOR ACRÍLICO PIGMENTADO"
    ],
    requirements: {
      "Viscosidade": "70-120 KU",
      "Tempo de secagem": "≤ 4h",
      "Poder de cobertura": "≥ 94%",
      "Resistência à abrasão úmida": "Classe I: ≥ 40 ciclos",
      "Permeabilidade ao vapor": "≤ 300 g/m²·dia",
      "Aderência": "Grau 0"
    },
    testMethods: [
      "ABNT NBR 14942 - Viscosidade",
      "ABNT NBR 9117 - Secagem",
      "ABNT NBR 14943 - Poder de cobertura",
      "ABNT NBR 15079 - Abrasão úmida"
    ]
  },
  {
    id: "nbr-15494",
    number: "NBR 15.494",
    title: "Tinta à base de cal para caiação",
    category: "Construção Civil",
    status: "vigente",
    year: "2007",
    description: "Estabelece os requisitos para tintas à base de cal hidratada para aplicação em alvenaria e outros substratos minerais.",
    scope: "Tintas minerais à base de cal",
    relatedProducts: [
      "TINTA PARA GESSO"
    ],
    requirements: {
      "Finura": "≥ 95% passante #200",
      "Tempo de pega": "2-24h",
      "Estabilidade": "Sem sedimentação",
      "Poder de cobertura": "≥ 90%",
      "Aderência": "Grau 0-1"
    },
    testMethods: [
      "ABNT NBR 7175 - Cal hidratada",
      "ABNT NBR 9289 - Finura",
      "ABNT NBR 14943 - Poder de cobertura"
    ]
  },
  {
    id: "nbr-15348",
    number: "NBR 15.348",
    title: "Vernizes - Classificação e requisitos",
    category: "Vernizes",
    status: "vigente",
    year: "2006",
    description: "Classifica e estabelece os requisitos para vernizes destinados à proteção e decoração de superfícies de madeira.",
    scope: "Vernizes para madeira",
    relatedProducts: [
      "VERNIZ",
      "VERNIZ BASE ÁGUA",
      "VERNIZ PU MARÍTIMO"
    ],
    requirements: {
      "Viscosidade": "60-100 s (Ford 4)",
      "Tempo de secagem": "≤ 8h",
      "Dureza": "≥ 80 (Persoz)",
      "Brilho": "≥ 85% (60°)",
      "Aderência": "Grau 0",
      "Resistência à água": "48h sem alteração"
    },
    testMethods: [
      "ABNT NBR 5847 - Viscosidade",
      "ABNT NBR 9117 - Secagem",
      "ABNT NBR 14555 - Dureza",
      "ABNT NBR 15299 - Brilho"
    ]
  },
  {
    id: "nbr-15156",
    number: "NBR 15.156",
    title: "Tinta para edificações não industriais - Determinação do teor de compostos orgânicos voláteis (COV)",
    category: "Meio Ambiente",
    status: "vigente",
    year: "2004",
    description: "Prescreve o método para determinação do teor de compostos orgânicos voláteis em tintas para edificações não industriais.",
    scope: "Determinação de COV em tintas",
    relatedProducts: [
      "TINTA ACRÍLICA PREMIUM",
      "TINTA ACRÍLICA PREMIUM PRO",
      "VERNIZ BASE ÁGUA",
      "ESMALTE PREMIUM BASE ÁGUA"
    ],
    requirements: {
      "Tintas à base de água": "≤ 30 g/L",
      "Tintas à base de solvente": "≤ 400 g/L",
      "Vernizes à base de água": "≤ 130 g/L",
      "Vernizes à base de solvente": "≤ 500 g/L"
    },
    testMethods: [
      "Cromatografia gasosa",
      "Espectrometria de massa",
      "Cálculo por diferença"
    ]
  }
];

const complianceCategories = [
  {
    id: "safety",
    title: "Segurança e Saúde",
    icon: <Shield className="h-6 w-6" />,
    color: "text-red-600",
    standards: ["NBR 15.156", "NBR 14.725"],
    description: "Normas relacionadas à segurança do trabalhador e meio ambiente"
  },
  {
    id: "quality",
    title: "Qualidade e Performance",
    icon: <Award className="h-6 w-6" />,
    color: "text-blue-600",
    standards: ["NBR 11.003", "NBR 15.079", "NBR 15.348"],
    description: "Requisitos de qualidade e desempenho dos produtos"
  },
  {
    id: "application",
    title: "Aplicação Específica",
    icon: <Target className="h-6 w-6" />,
    color: "text-green-600",
    standards: ["NBR 11.862", "NBR 13.699", "NBR 15.494"],
    description: "Normas para aplicações específicas e especializadas"
  }
];

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    console.log('🔍 Carregando dados da página normas técnicas...');
    const products = await ProductService.getAllProducts();
    console.log('✅ Produtos carregados:', products?.length || 0);
    
    return json({
      technicalStandards,
      complianceCategories,
      products: products || []
    });
  } catch (error) {
    console.error('❌ Erro ao carregar dados:', error);
    return json({
      technicalStandards,
      complianceCategories,
      products: []
    }, { status: 500 });
  }
}

export default function NormasTecnicas() {
  const { technicalStandards: standards, complianceCategories, products } = useLoaderData<typeof loader>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const filteredStandards = standards.filter(standard => {
    if (selectedCategory && standard.category !== selectedCategory) return false;
    if (searchTerm) {
      return standard.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
             standard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             standard.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
             standard.relatedProducts.some(product => 
               product.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  const categories = [...new Set(standards.map(s => s.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Normas Técnicas (NBR)
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Conformidade com as normas brasileiras para garantia de qualidade e segurança
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {complianceCategories.map((category) => (
            <div key={category.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={category.color}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-semibold">{category.title}</h3>
              </div>
              <p className="text-muted-foreground mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2">
                {category.standards.map((std) => (
                  <span key={std} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                    {std}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar normas, produtos ou requisitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>

        {/* Category Filter */}
        {showFilters && (
          <div className="mb-8 p-4 border border-border rounded-lg bg-muted/20">
            <h3 className="font-semibold mb-3">Filtrar por Categoria:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Todas
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Standards List */}
        <div className="space-y-6">
          {filteredStandards.map((standard) => (
            <div key={standard.id} className="border border-border rounded-xl overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-muted/20 transition-colors"
                onClick={() => setSelectedStandard(
                  selectedStandard === standard.id ? null : standard.id
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {standard.number}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        standard.status === 'vigente' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {standard.status}
                      </span>
                      <span className="text-muted-foreground text-sm">{standard.year}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{standard.title}</h3>
                    <p className="text-muted-foreground mb-3">{standard.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clipboard className="h-4 w-4" />
                      <span>{standard.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedStandard === standard.id && (
                <div className="border-t border-border p-6 bg-muted/10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Requisitos Principais
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(standard.requirements).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center p-3 bg-background rounded-lg">
                            <span className="font-medium">{key}:</span>
                            <span className="text-muted-foreground">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Test Methods & Related Products */}
                    <div className="space-y-6">
                      {/* Test Methods */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          Métodos de Ensaio
                        </h4>
                        <div className="space-y-2">
                          {standard.testMethods.map((method, index) => (
                            <div key={index} className="p-2 bg-background rounded text-sm">
                              {method}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Related Products */}
                      <div>
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5 text-purple-600" />
                          Produtos Relacionados
                        </h4>
                        <div className="space-y-2">
                          {standard.relatedProducts.map((product, index) => (
                            <Link
                              key={index}
                              to={`/catalogo?search=${encodeURIComponent(product)}`}
                              className="block p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <span className="font-medium">{product}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scope */}
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
                      Escopo da Norma
                    </h4>
                    <p className="text-blue-700 dark:text-blue-300">{standard.scope}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">
              Certificações e Laudos Técnicos
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Todos os nossos produtos são testados e certificados conforme as normas técnicas brasileiras.
              Solicite laudos técnicos e certificados de conformidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contato-consultor"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Solicitar Laudo Técnico
                <FileText className="h-4 w-4" />
              </Link>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                Ver Produtos Certificados
                <Award className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
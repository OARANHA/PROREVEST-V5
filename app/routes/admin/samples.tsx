import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Truck, CheckCircle } from "lucide-react";
import { SampleService, type SampleWithDetails } from "../../services/sampleService";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Amostras - ProRevest" },
    { name: "description", content: "Gerencie as amostras solicitadas na ProRevest" },
  ];
}

export default function AdminSamples() {
  const [samples, setSamples] = useState<SampleWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSamples, setFilteredSamples] = useState<SampleWithDetails[]>([]);

  // Carregar amostras
  useEffect(() => {
    const loadSamples = async () => {
      try {
        // Em uma implementação real, buscaríamos todas as amostras do sistema
        // Por enquanto, vamos usar dados simulados pois não temos um método para buscar todas
        const mockSamples: SampleWithDetails[] = [
          {
            id: "1",
            user_id: "user1",
            project_id: "project1",
            variant_id: "variant1",
            status: "shipped",
            tracking_code: "BR123456789CD",
            shipping_company: "Correios",
            requested_at: "2023-06-15T10:30:00Z",
            shipped_at: "2023-06-16T14:20:00Z",
            delivered_at: null,
            feedback: null,
            created_at: "2023-06-15T10:30:00Z",
            updated_at: "2023-06-16T14:20:00Z",
            project: {
              name: "Reforma da Sala"
            },
            product_variant: {
              sku: "LPAC-1L",
              product: {
                name: "Látex Premium Acetinado",
                slug: "latex-premium-acetinado"
              },
              color: {
                name: "Branco Neve",
                hex_code: "#FFFFFF"
              },
              texture: {
                name: "Liso"
              }
            }
          },
          {
            id: "2",
            user_id: "user2",
            project_id: "project2",
            variant_id: "variant2",
            status: "in_production",
            tracking_code: "",
            shipping_company: "",
            requested_at: "2023-06-14T09:15:00Z",
            shipped_at: null,
            delivered_at: null,
            feedback: null,
            created_at: "2023-06-14T09:15:00Z",
            updated_at: "2023-06-14T09:15:00Z",
            project: {
              name: "Pintura Externa"
            },
            product_variant: {
              sku: "ESBR-900ML",
              product: {
                name: "Esmalte Sintético Brilhante",
                slug: "esmalte-sintetico-brilhante"
              },
              color: {
                name: "Vermelho Tijolo",
                hex_code: "#8B4513"
              },
              texture: {
                name: "Liso"
              }
            }
          }
        ];
        
        setSamples(mockSamples);
        setFilteredSamples(mockSamples);
      } catch (error) {
        console.error("Erro ao carregar amostras:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSamples();
  }, []);

  // Filtrar amostras com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSamples(samples);
    } else {
      const filtered = samples.filter(sample => 
        sample.product_variant.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.product_variant.color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.tracking_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSamples(filtered);
    }
  }, [searchTerm, samples]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Solicitada</span>;
      case "in_production":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Em Produção</span>;
      case "shipped":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Enviada</span>;
      case "delivered":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Entregue</span>;
      case "feedback_received":
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Feedback Recebido</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const updateSampleStatus = async (id: string, newStatus: string) => {
    try {
      await SampleService.updateSampleStatus(id, newStatus as any);
      // Atualizar localmente após sucesso
      setSamples(samples.map(sample => 
        sample.id === id ? {...sample, status: newStatus as any} : sample
      ));
      setFilteredSamples(filteredSamples.map(sample => 
        sample.id === id ? {...sample, status: newStatus as any} : sample
      ));
    } catch (error) {
      console.error("Erro ao atualizar status da amostra:", error);
    }
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
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-cormorant font-bold">Gestão de Amostras</h1>
            <p className="text-muted-foreground">Gerencie as amostras solicitadas na ProRevest</p>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar amostras..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de amostras */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Produto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Projeto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Código de Rastreio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data de Solicitação
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredSamples.map((sample) => (
              <tr key={sample.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{sample.product_variant.product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {sample.product_variant.color.name} - {sample.product_variant.texture.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.project.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(sample.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.tracking_code || "Aguardando envio"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {new Date(sample.requested_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {sample.status === "requested" && (
                    <button 
                      onClick={() => updateSampleStatus(sample.id, "in_production")}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <Truck className="h-5 w-5" />
                    </button>
                  )}
                  {sample.status === "in_production" && (
                    <button 
                      onClick={() => updateSampleStatus(sample.id, "shipped")}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <Truck className="h-5 w-5" />
                    </button>
                  )}
                  {sample.status === "shipped" && (
                    <button 
                      onClick={() => updateSampleStatus(sample.id, "delivered")}
                      className="text-primary hover:text-primary/80 mr-3"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1 a {filteredSamples.length} de {filteredSamples.length} resultados
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50">
            Anterior
          </button>
          <button className="px-3 py-1 border border-border rounded-md text-sm font-medium hover:bg-muted/50">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
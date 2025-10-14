import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, QrCode, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Printer } from "lucide-react";
import { SampleService, type Sample } from "../../services/sampleService";

export const meta: MetaFunction = () => {
  return [
    { title: "Rastreabilidade de Amostras - ProRevest" },
    { name: "description", content: "Rastreie amostras físicas com código QR e status atualizado" },
  ];
}

export default function SampleTracking() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);

  // Carregar amostras
  useEffect(() => {
    const loadSamples = async () => {
      try {
        // Em uma implementação real, aqui buscaríamos as amostras do banco de dados
        const samplesData: Sample[] = [
          {
            id: "sample-001",
            user_id: "user-123",
            project_id: "proj-abc",
            variant_id: "variant-456",
            status: "shipped",
            tracking_code: "TRK00123456789",
            shipping_company: "Correios",
            requested_at: "2023-06-15T10:30:00Z",
            shipped_at: "2023-06-16T14:20:00Z",
            delivered_at: null,
            feedback: null,
            created_at: "2023-06-15T10:30:00Z",
            updated_at: "2023-06-16T14:20:00Z"
          },
          {
            id: "sample-002",
            user_id: "user-456",
            project_id: "proj-def",
            variant_id: "variant-789",
            status: "delivered",
            tracking_code: "TRK00987654321",
            shipping_company: "FedEx",
            requested_at: "2023-06-10T09:15:00Z",
            shipped_at: "2023-06-11T10:00:00Z",
            delivered_at: "2023-06-12T11:30:00Z",
            feedback: "A cor é ótima!",
            created_at: "2023-06-10T09:15:00Z",
            updated_at: "2023-06-12T11:30:00Z"
          },
          {
            id: "sample-003",
            user_id: "user-789",
            project_id: "proj-ghi",
            variant_id: "variant-123",
            status: "requested",
            tracking_code: "",
            shipping_company: "",
            requested_at: "2023-06-18T16:45:00Z",
            shipped_at: null,
            delivered_at: null,
            feedback: null,
            created_at: "2023-06-18T16:45:00Z",
            updated_at: "2023-06-18T16:45:00Z"
          }
        ];
        
        setSamples(samplesData);
        setFilteredSamples(samplesData);
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
        sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.tracking_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.shipping_company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSamples(filtered);
    }
  }, [searchTerm, samples]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "requested":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "in_production":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "shipped":
        return <MapPin className="h-5 w-5 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "feedback_received":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "requested":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Solicitada</span>;
      case "in_production":
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Em Produção</span>;
      case "shipped":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Enviada</span>;
      case "delivered":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Entregue</span>;
      case "feedback_received":
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Feedback Recebido</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
    }
  };

  const handlePrintQRCode = (sample: Sample) => {
    // Em uma implementação real, aqui geraríamos e imprimiríamos o código QR
    alert(`Imprimindo código QR para a amostra ${sample.id}`);
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
            <h1 className="text-3xl font-cormorant font-bold">Rastreabilidade de Amostras</h1>
            <p className="text-muted-foreground">Rastreie amostras físicas com código QR e status atualizado</p>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar amostras por ID, código de rastreio ou endereço..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <QrCode className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Total de Amostras</p>
              <p className="text-2xl font-bold">{samples.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold">{samples.filter(s => s.status === "requested" || s.status === "in_production").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Entregues</p>
              <p className="text-2xl font-bold">{samples.filter(s => s.status === "delivered").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Enviadas</p>
              <p className="text-2xl font-bold">{samples.filter(s => s.status === "shipped").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de amostras */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ID da Amostra
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Código de Rastreio
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Endereço de Entrega
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Data de Criação
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
                  <div className="font-medium">{sample.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {sample.tracking_code || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                  {sample.shipping_company || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(sample.status)}
                    <div className="ml-2">
                      {getStatusBadge(sample.status)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {new Date(sample.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handlePrintQRCode(sample)}
                    className="text-primary hover:text-primary/80 mr-3"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedSample(sample)}
                    className="text-foreground hover:text-foreground/80"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSamples.length === 0 && (
        <div className="text-center py-12">
          <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium">Nenhuma amostra encontrada</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Não há amostras registradas com os critérios de busca informados.
          </p>
        </div>
      )}

      {/* Modal de detalhes da amostra */}
      {selectedSample && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Detalhes da Amostra</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="bg-muted p-4 rounded-lg">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">ID da Amostra</label>
                  <p className="mt-1">{selectedSample.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1 flex items-center">
                    {getStatusIcon(selectedSample.status)}
                    <span className="ml-2">{getStatusBadge(selectedSample.status)}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Código de Rastreio</label>
                  <p className="mt-1">{selectedSample.tracking_code || "N/A"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Transportadora</label>
                  <p className="mt-1">{selectedSample.shipping_company || "N/A"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Data de Criação</label>
                  <p className="mt-1">{new Date(selectedSample.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Última Atualização</label>
                  <p className="mt-1">{new Date(selectedSample.updated_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button
                onClick={() => setSelectedSample(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

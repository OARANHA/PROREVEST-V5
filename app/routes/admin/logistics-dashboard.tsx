import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapPin, Truck, Clock, CheckCircle, XCircle, AlertCircle, Package, TrendingUp } from "lucide-react";
import { SampleService, type Sample } from "../../services/sampleService";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard de Logística - ProRevest" },
    { name: "description", content: "Visão geral da logística de amostras solicitadas" },
  ];
}

export default function LogisticsDashboard() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

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
          },
          {
            id: "sample-004",
            user_id: "user-101",
            project_id: "proj-jkl",
            variant_id: "variant-321",
            status: "in_production",
            tracking_code: "",
            shipping_company: "",
            requested_at: "2023-06-17T11:20:00Z",
            shipped_at: null,
            delivered_at: null,
            feedback: null,
            created_at: "2023-06-17T11:20:00Z",
            updated_at: "2023-06-18T09:15:00Z"
          },
          {
            id: "sample-005",
            user_id: "user-202",
            project_id: "proj-mno",
            variant_id: "variant-654",
            status: "feedback_received",
            tracking_code: "TRK00564738291",
            shipping_company: "DHL",
            requested_at: "2023-06-12T14:30:00Z",
            shipped_at: "2023-06-13T15:00:00Z",
            delivered_at: "2023-06-14T10:45:00Z",
            feedback: "A textura é um pouco diferente do esperado.",
            created_at: "2023-06-12T14:30:00Z",
            updated_at: "2023-06-14T10:45:00Z"
          }
        ];
        
        setSamples(samplesData);
      } catch (error) {
        console.error("Erro ao carregar amostras:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSamples();
  }, []);

  // Filtrar amostras por data
  const filteredSamples = samples.filter(sample => {
    const sampleDate = new Date(sample.created_at);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    endDate.setHours(23, 59, 59, 999); // Incluir o dia inteiro
    return sampleDate >= startDate && sampleDate <= endDate;
  });

  // Calcular estatísticas
  const totalSamples = filteredSamples.length;
  const pendingSamples = filteredSamples.filter(s => s.status === "requested" || s.status === "in_production").length;
  const shippedSamples = filteredSamples.filter(s => s.status === "shipped").length;
  const deliveredSamples = filteredSamples.filter(s => s.status === "delivered" || s.status === "feedback_received").length;
  const cancelledSamples = 0; // Adicionar lógica se houver status de cancelado

  // Calcular amostras por região (simulação)
  const samplesByRegion = [
    { region: "São Paulo", count: 3, percentage: 60 },
    { region: "Rio de Janeiro", count: 1, percentage: 20 },
    { region: "Belo Horizonte", count: 1, percentage: 20 }
  ];

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
            <h1 className="text-3xl font-cormorant font-bold">Dashboard de Logística</h1>
            <p className="text-muted-foreground">Visão geral da logística de amostras solicitadas</p>
          </div>
        </div>
      </div>

      {/* Filtros de data */}
      <div className="mb-6 bg-card border border-border rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">Período:</span>
          </div>
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-muted-foreground mb-1">De</label>
            <input
              type="date"
              id="start-date"
              className="border border-border rounded-md px-3 py-2 bg-background"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-muted-foreground mb-1">Até</label>
            <input
              type="date"
              id="end-date"
              className="border border-border rounded-md px-3 py-2 bg-background"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Total de Amostras</p>
              <p className="text-2xl font-bold">{totalSamples}</p>
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
              <p className="text-2xl font-bold">{pendingSamples}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Truck className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Enviadas</p>
              <p className="text-2xl font-bold">{shippedSamples}</p>
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
              <p className="text-2xl font-bold">{deliveredSamples}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-muted-foreground">Canceladas</p>
              <p className="text-2xl font-bold">{cancelledSamples}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Distribuição por status */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Distribuição por Status</h2>
          <div className="flex items-end justify-center h-64 space-x-4">
            {totalSamples > 0 && (
              <>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-yellow-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(pendingSamples / totalSamples) * 200}px` }}
                  ></div>
                  <p className="mt-2 text-sm">Pendentes</p>
                  <p className="text-xs text-muted-foreground">{pendingSamples}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-blue-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(shippedSamples / totalSamples) * 200}px` }}
                  ></div>
                  <p className="mt-2 text-sm">Enviadas</p>
                  <p className="text-xs text-muted-foreground">{shippedSamples}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-green-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(deliveredSamples / totalSamples) * 200}px` }}
                  ></div>
                  <p className="mt-2 text-sm">Entregues</p>
                  <p className="text-xs text-muted-foreground">{deliveredSamples}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div 
                    className="w-16 bg-red-500 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(cancelledSamples / totalSamples) * 200}px` }}
                  ></div>
                  <p className="mt-2 text-sm">Canceladas</p>
                  <p className="text-xs text-muted-foreground">{cancelledSamples}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Distribuição por região */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Distribuição por Região</h2>
          <div className="space-y-4">
            {samplesByRegion.map((region, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{region.region}</span>
                  <span className="text-sm text-muted-foreground">{region.count} ({region.percentage}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${region.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de amostras recentes */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Amostras Recentes</h2>
        </div>
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
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredSamples.slice(0, 5).map((sample) => (
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
                    {sample.status === "requested" && <Clock className="h-5 w-5 text-yellow-500 mr-2" />}
                    {sample.status === "in_production" && <Clock className="h-5 w-5 text-orange-500 mr-2" />}
                    {sample.status === "shipped" && <Truck className="h-5 w-5 text-blue-500 mr-2" />}
                    {sample.status === "delivered" && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                    {sample.status === "feedback_received" && <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />}
                    <span className="capitalize">
                      {sample.status.replace('_', ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  {new Date(sample.created_at).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSamples.length === 0 && (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium">Nenhuma amostra encontrada</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Não há amostras registradas no período selecionado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

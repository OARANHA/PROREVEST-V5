import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';

export default function MeusProjetos() {
  const [activeTab, setActiveTab] = useState('projects');
  
  // Mock data for projects
  const projects = [
    {
      id: '1',
      name: 'Sala de Estar Moderna',
      description: 'Renovação completa da sala de estar com cores neutras e texturas sofisticadas',
      created_at: '2023-05-15',
      updated_at: '2023-05-20'
    },
    {
      id: '2',
      name: 'Cozinha Industrial',
      description: 'Projeto de cozinha com acabamento industrial e tons de cinza',
      created_at: '2023-04-10',
      updated_at: '2023-04-15'
    }
  ];
  
  // Mock data for quotes
  const quotes = [
    {
      id: 'quote-1',
      status: 'sent',
      created_at: '2023-05-18'
    },
    {
      id: 'quote-2',
      status: 'approved',
      created_at: '2023-05-10'
    }
  ];
  
  // Mock data for samples
  const samples = [
    {
      id: 'sample-1',
      status: 'shipped',
      requested_at: '2023-05-15',
      tracking_code: 'TRK123456789',
      product_variant: {
        color: {
          name: 'Marfim',
          hex_code: '#FFFFF0'
        },
        texture: {
          name: 'Acarpetado'
        },
        product: {
          name: 'Tinta Acrílica Premium'
        }
      },
      project: {
        name: 'Sala de Estar Moderna'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-cormorant font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie seus projetos, orçamentos e amostras solicitadas
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "projects"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
              onClick={() => setActiveTab("projects")}
            >
              Projetos
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "quotes"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
              onClick={() => setActiveTab("quotes")}
            >
              Orçamentos
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "samples"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
              }`}
              onClick={() => setActiveTab("samples")}
            >
              Amostras
            </button>
          </nav>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cormorant font-bold">Projetos Recentes</h2>
              <Link 
                to="/novo-projeto" 
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Novo Projeto
              </Link>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhum projeto encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Comece criando seu primeiro projeto
                </p>
                <Link 
                  to="/novo-projeto" 
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Criar Projeto
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-cormorant font-bold">{project.name}</h3>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                          Em andamento
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Criado em: {new Date(project.created_at).toLocaleDateString('pt-BR')}</span>
                        <span>Atualizado: {new Date(project.updated_at).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="bg-muted/30 px-6 py-4 flex justify-between">
                      <Link 
                        to={`/projeto/${project.id}`} 
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Ver detalhes
                      </Link>
                      <button className="text-muted-foreground hover:text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === "quotes" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cormorant font-bold">Orçamentos</h2>
              <Link 
                to="/orcamento" 
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Novo Orçamento
              </Link>
            </div>
            
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhum orçamento encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Solicite um orçamento para seus projetos
                </p>
                <Link 
                  to="/orcamento" 
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Solicitar Orçamento
                </Link>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/30">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Número
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Data
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {quotes.map((quote) => (
                      <tr key={quote.id} className="hover:bg-muted/10">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {quote.id.substring(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            quote.status === "signed" 
                              ? "bg-green-100 text-green-800" 
                              : quote.status === "sent" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {quote.status === "draft" && "Rascunho"}
                            {quote.status === "sent" && "Enviado"}
                            {quote.status === "approved" && "Aprovado"}
                            {quote.status === "signed" && "Assinado"}
                            {quote.status === "archived" && "Arquivado"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {new Date(quote.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/assinatura-orcamento/${quote.id}`} className="text-primary hover:text-primary/80 mr-4">
                            Ver
                          </Link>
                          <button className="text-muted-foreground hover:text-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "samples" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-cormorant font-bold">Amostras Solicitadas</h2>
              <Link 
                to="/solicitar-amostra" 
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Solicitar Amostra
              </Link>
            </div>
            
            {samples.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-medium mb-2">Nenhuma amostra solicitada</h3>
                <p className="text-muted-foreground mb-6">
                  Solicite amostras para testar cores e texturas
                </p>
                <Link 
                  to="/solicitar-amostra" 
                  className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Solicitar Amostra
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {samples.map((sample) => (
                  <div key={sample.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-cormorant font-bold">{sample.product_variant.product.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sample.status === "delivered" 
                            ? "bg-green-100 text-green-800" 
                            : sample.status === "shipped" 
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {sample.status === "requested" && "Solicitada"}
                          {sample.status === "in_production" && "Em Produção"}
                          {sample.status === "shipped" && "Enviada"}
                          {sample.status === "delivered" && "Entregue"}
                          {sample.status === "feedback_received" && "Feedback Recebido"}
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-6 h-6 rounded-full border border-border mr-2"
                          style={{ backgroundColor: sample.product_variant.color.hex_code }}
                        />
                        <span className="text-sm">{sample.product_variant.color.name} - {sample.product_variant.texture.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Projeto: {sample.project.name}</p>
                      <p className="text-sm text-muted-foreground">Código de rastreio: {sample.tracking_code || "Aguardando envio"}</p>
                    </div>
                    <div className="bg-muted/30 px-6 py-4 flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Solicitada em: {new Date(sample.requested_at).toLocaleDateString('pt-BR')}
                      </span>
                      <button className="text-primary hover:text-primary/80 text-sm font-medium">
                        Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
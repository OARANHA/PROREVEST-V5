import type { MetaFunction, LoaderFunctionArgs } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, User, Mail, Calendar, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { UserService } from "../../services/userService";

export const meta: MetaFunction = () => {
  return [
    { title: "Gestão de Usuários - ProRevest" },
    { name: "description", content: "Gerencie os usuários da ProRevest" },
  ];
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  // Carregar usuários
  useEffect(() => {
    const loadUsers = async () => {
      try {
        // Em uma implementação real, isso viria do serviço de usuários
        // Por enquanto, vamos continuar usando dados simulados
        const mockUsers = [
          {
            id: "1",
            name: "João Silva",
            email: "joao.silva@example.com",
            role: "customer",
            created_at: "2023-01-15T10:30:00Z",
            last_login: "2023-06-15T14:20:00Z"
          },
          {
            id: "2",
            name: "Maria Oliveira",
            email: "maria.oliveira@example.com",
            role: "professional",
            created_at: "2023-02-20T09:15:00Z",
            last_login: "2023-06-14T09:15:00Z"
          },
          {
            id: "3",
            name: "Carlos Souza",
            email: "carlos.souza@example.com",
            role: "admin",
            created_at: "2022-12-01T16:45:00Z",
            last_login: "2023-06-15T11:30:00Z"
          }
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Filtrar usuários com base no termo de busca
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Administrador</span>;
      case "professional":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Profissional</span>;
      case "customer":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Cliente</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Desconhecido</span>;
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
            <h1 className="text-3xl font-cormorant font-bold">Gestão de Usuários</h1>
            <p className="text-muted-foreground">Gerencie os usuários da ProRevest</p>
          </div>
        </div>
      </div>

      {/* Barra de busca */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar usuários..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de usuários */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Função
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Criado em
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Último Login
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/10">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    {user.last_login ? new Date(user.last_login).toLocaleDateString('pt-BR') : "Nunca"}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando 1 a {filteredUsers.length} de {filteredUsers.length} resultados
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
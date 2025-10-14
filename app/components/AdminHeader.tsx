import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, BellIcon, CogIcon } from '@heroicons/react/24/outline';

export const AdminHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const getUserName = () => {
    if (!user) return 'Administrador';
    if (user.user_metadata && user.user_metadata.full_name) {
      return user.user_metadata.full_name;
    }
    return user.email || 'Administrador';
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
          <span className="text-sm text-gray-400">Prorevest</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Notificações (placeholder para futuro) */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors relative">
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Configurações (placeholder para futuro) */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <CogIcon className="h-5 w-5" />
          </button>
          
          {/* Info do usuário */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-700">
            <div className="text-right">
              <p className="text-sm font-medium text-white">{getUserName()}</p>
              <p className="text-xs text-gray-400">Administrador</p>
            </div>
            
            {/* Avatar placeholder */}
            <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {getUserName().charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
              title="Sair"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

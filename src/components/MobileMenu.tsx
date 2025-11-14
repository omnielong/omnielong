import React from 'react';
import { X, Package, Users, Tag, BarChart3, Clock, Settings, LogOut, RotateCcw, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  currentOperator?: { name: string } | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onLogout, currentOperator }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-b from-blue-600 to-blue-700 shadow-2xl flex flex-col animate-slide-left">
        {/* Header */}
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {currentOperator && (
            <div className="bg-blue-500 rounded-lg p-3">
              <p className="text-xs text-blue-200">Operatore</p>
              <p className="text-white font-semibold">{currentOperator.name}</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button
            onClick={() => handleNavigate('/pos')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Package className="w-6 h-6 mr-4" />
            <span className="font-semibold">Punto Vendita</span>
          </button>

          <button
            onClick={() => handleNavigate('/products')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Package className="w-6 h-6 mr-4" />
            <span className="font-semibold">Gestione Prodotti</span>
          </button>

          <button
            onClick={() => handleNavigate('/customers')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Users className="w-6 h-6 mr-4" />
            <span className="font-semibold">Clienti</span>
          </button>

          <button
            onClick={() => handleNavigate('/promotions')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Tag className="w-6 h-6 mr-4" />
            <span className="font-semibold">Promozioni</span>
          </button>

          <button
            onClick={() => handleNavigate('/returns')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <RotateCcw className="w-6 h-6 mr-4" />
            <span className="font-semibold">Resi e Rimborsi</span>
          </button>

          <button
            onClick={() => handleNavigate('/dashboard')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <BarChart3 className="w-6 h-6 mr-4" />
            <span className="font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigate('/shift')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Clock className="w-6 h-6 mr-4" />
            <span className="font-semibold">Gestione Turno</span>
          </button>

          <button
            onClick={() => handleNavigate('/operators')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <UserCog className="w-6 h-6 mr-4" />
            <span className="font-semibold">Gestione Operatori</span>
          </button>

          <button
            onClick={() => handleNavigate('/settings')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Settings className="w-6 h-6 mr-4" />
            <span className="font-semibold">Impostazioni</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-500">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full flex items-center justify-center p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-white font-semibold"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Esci
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

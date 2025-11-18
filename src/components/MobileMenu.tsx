import React from 'react';
import {
  X,
  Package,
  Users,
  Tag,
  BarChart3,
  Clock,
  Settings,
  LogOut,
  RotateCcw,
  UserCog,
  ClipboardCheck,
  Database,
  ShoppingCart,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Operator } from '../types';
import { getAccessibleMenuItems, ROLE_LABELS } from '../utils/permissions';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  currentOperator?: Operator | null;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onLogout, currentOperator }) => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  // Ottieni i menu items accessibili in base ai permessi
  const accessibleMenuItems = currentOperator ? getAccessibleMenuItems(currentOperator) : [];

  // Mappa delle icone
  const iconMap: { [key: string]: React.ReactNode } = {
    ShoppingCart: <ShoppingCart className="w-6 h-6 mr-4" />,
    BarChart3: <BarChart3 className="w-6 h-6 mr-4" />,
    Package: <Package className="w-6 h-6 mr-4" />,
    Users: <Users className="w-6 h-6 mr-4" />,
    Tag: <Tag className="w-6 h-6 mr-4" />,
    RotateCcw: <RotateCcw className="w-6 h-6 mr-4" />,
    UserCog: <UserCog className="w-6 h-6 mr-4" />,
    FileText: <ClipboardCheck className="w-6 h-6 mr-4" />,
    Settings: <Settings className="w-6 h-6 mr-4" />,
    Database: <Database className="w-6 h-6 mr-4" />,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

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
              <p className="text-xs text-blue-200">{ROLE_LABELS[currentOperator.role].label}</p>
              <p className="text-white font-semibold">{currentOperator.name}</p>
              <p className="text-xs text-blue-200 mt-1">
                {ROLE_LABELS[currentOperator.role].description}
              </p>
            </div>
          )}
        </div>

        {/* Menu Items - Dinamici basati sui permessi */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Sempre mostra Gestione Turno */}
          <button
            onClick={() => handleNavigate('/shift')}
            className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
          >
            <Clock className="w-6 h-6 mr-4" />
            <span className="font-semibold">Gestione Turno</span>
          </button>

          {/* Menu items basati sui permessi */}
          {accessibleMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className="w-full flex items-center p-4 hover:bg-blue-500 rounded-lg transition-colors text-white"
            >
              {iconMap[item.icon]}
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Clock, User, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const ShiftPage: React.FC = () => {
  const [openingBalance, setOpeningBalance] = useState('100.00');
  const navigate = useNavigate();
  const { currentOperator, openShift, logout } = useStore();

  const handleOpenShift = () => {
    if (currentOperator) {
      openShift(currentOperator, parseFloat(openingBalance));
      navigate('/pos');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Clock className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Apertura Turno
          </h1>
          <p className="text-gray-600">Configura il tuo turno di cassa</p>
        </div>

        {/* Operator Info */}
        <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-200">
          <div className="flex items-center">
            <User className="w-10 h-10 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-700 font-semibold">
                Operatore
              </p>
              <p className="text-lg font-bold text-green-900">
                {currentOperator?.name}
              </p>
              <p className="text-sm text-green-600">
                {currentOperator?.role === 'admin' && 'Amministratore'}
                {currentOperator?.role === 'cashier' && 'Cassiere'}
                {currentOperator?.role === 'manager' && 'Manager'}
              </p>
            </div>
          </div>
        </div>

        {/* Opening Balance */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fondo Cassa Iniziale
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              step="0.01"
              min="0"
              className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-xl font-semibold text-gray-500">€</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleOpenShift}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl touch-manipulation active:scale-98"
          >
            Apri Turno e Inizia
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center touch-manipulation"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Esci
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Suggerimento:</strong> Il fondo cassa iniziale dovrebbe
            corrispondere al contante presente in cassa all'inizio del turno.
            Verrà utilizzato per il conteggio finale.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShiftPage;

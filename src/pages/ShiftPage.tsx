import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Clock, LogOut, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Apertura Turno</h1>
              <p className="text-green-100">Configura il tuo turno di cassa</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-sm text-green-100">Operatore</p>
            <p className="font-bold">{currentOperator?.name}</p>
            <p className="text-xs text-green-100">
              {currentOperator?.role === 'admin' && 'Amministratore'}
              {currentOperator?.role === 'cashier' && 'Cassiere'}
              {currentOperator?.role === 'manager' && 'Manager'}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-green-100 text-sm mb-1">Stato Turno</p>
            <p className="text-2xl font-bold">Non Aperto</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-green-100 text-sm mb-1">Fondo Iniziale</p>
            <p className="text-2xl font-bold">€ {openingBalance}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">

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
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Clock className="w-5 h-5 inline-block mr-2" />
              Apri Turno e Inizia
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center"
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
    </div>
  );
};

export default ShiftPage;

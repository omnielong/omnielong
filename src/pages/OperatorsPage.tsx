import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Edit, Trash2, X, User, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import type { Operator } from '../types';

const OperatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { operators, setOperators, currentOperator } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'cashier' as 'admin' | 'cashier' | 'manager',
    pin: '',
    active: true,
  });

  // Only admin can access this page
  if (currentOperator?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso Negato</h2>
          <p className="text-gray-600 mb-6">
            Solo gli amministratori possono gestire gli operatori
          </p>
          <button
            onClick={() => navigate('/pos')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Torna al POS
          </button>
        </div>
      </div>
    );
  }

  const handleOpenModal = (operator?: Operator) => {
    if (operator) {
      setEditingOperator(operator);
      setFormData({
        name: operator.name,
        email: operator.email,
        role: operator.role,
        pin: operator.pin,
        active: operator.active,
      });
    } else {
      setEditingOperator(null);
      setFormData({
        name: '',
        email: '',
        role: 'cashier',
        pin: '',
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingOperator(null);
    setFormData({
      name: '',
      email: '',
      role: 'cashier',
      pin: '',
      active: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert('Inserisci il nome');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Inserisci un\'email valida');
      return;
    }
    if (!formData.pin.trim() || formData.pin.length < 4) {
      alert('Il PIN deve essere di almeno 4 caratteri');
      return;
    }

    if (editingOperator) {
      // Update existing operator
      const updated: Operator = {
        ...editingOperator,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        pin: formData.pin,
        active: formData.active,
      };
      setOperators(operators.map((op) => (op.id === editingOperator.id ? updated : op)));
    } else {
      // Create new operator
      const newOperator: Operator = {
        id: `op-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        pin: formData.pin,
        active: formData.active,
        createdAt: new Date(),
      };
      setOperators([...operators, newOperator]);
    }

    handleCloseModal();
  };

  const handleDelete = (operator: Operator) => {
    if (operator.id === currentOperator?.id) {
      alert('Non puoi eliminare il tuo account mentre sei loggato');
      return;
    }

    if (!confirm(`Sei sicuro di voler eliminare l'operatore ${operator.name}?`)) {
      return;
    }

    setOperators(operators.filter((op) => op.id !== operator.id));
  };

  const handleToggleActive = (operator: Operator) => {
    if (operator.id === currentOperator?.id) {
      alert('Non puoi disattivare il tuo account mentre sei loggato');
      return;
    }

    const updated: Operator = {
      ...operator,
      active: !operator.active,
    };
    setOperators(operators.map((op) => (op.id === operator.id ? updated : op)));
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Amministratore',
      manager: 'Manager',
      cashier: 'Cassiere',
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800 border-purple-300',
      manager: 'bg-blue-100 text-blue-800 border-blue-300',
      cashier: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/pos')}
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Gestione Operatori</h1>
              <p className="text-purple-100">Amministra utenti del sistema</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Nuovo Operatore
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Totale Operatori</p>
            <p className="text-3xl font-bold">{operators.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Attivi</p>
            <p className="text-3xl font-bold">
              {operators.filter((op) => op.active).length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-purple-100 text-sm mb-1">Amministratori</p>
            <p className="text-3xl font-bold">
              {operators.filter((op) => op.role === 'admin').length}
            </p>
          </div>
        </div>
      </div>

      {/* Operators List */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((operator) => (
            <div
              key={operator.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                !operator.active ? 'opacity-60' : ''
              }`}
            >
              {/* Card Header */}
              <div
                className={`p-4 ${
                  operator.role === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                    : operator.role === 'manager'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}
              >
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                      {operator.role === 'admin' ? (
                        <Shield className="w-6 h-6" />
                      ) : (
                        <User className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{operator.name}</h3>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getRoleBadgeColor(
                          operator.role
                        )} bg-white`}
                      >
                        {getRoleLabel(operator.role)}
                      </span>
                    </div>
                  </div>
                  {operator.id === currentOperator?.id && (
                    <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                      TU
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-semibold mr-2">Email:</span>
                    <span>{operator.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-semibold mr-2">PIN:</span>
                    <span className="font-mono">{'•'.repeat(operator.pin.length)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-semibold mr-2">Stato:</span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                        operator.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {operator.active ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Attivo
                        </>
                      ) : (
                        'Disattivato'
                      )}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(operator)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Modifica
                  </button>
                  <button
                    onClick={() => handleToggleActive(operator)}
                    disabled={operator.id === currentOperator?.id}
                    className={`flex-1 ${
                      operator.active
                        ? 'bg-orange-600 hover:bg-orange-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors`}
                  >
                    {operator.active ? 'Disattiva' : 'Attiva'}
                  </button>
                  <button
                    onClick={() => handleDelete(operator)}
                    disabled={operator.id === currentOperator?.id}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {operators.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nessun Operatore
            </h3>
            <p className="text-gray-600 mb-6">
              Inizia creando il primo operatore per il tuo sistema
            </p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Crea Operatore
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingOperator ? 'Modifica Operatore' : 'Nuovo Operatore'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mario Rossi"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mario.rossi@esempio.it"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ruolo *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as 'admin' | 'cashier' | 'manager',
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="cashier">Cassiere</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Amministratore</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Gli amministratori hanno accesso completo al sistema
                </p>
              </div>

              {/* PIN */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PIN (min 4 caratteri) *
                </label>
                <input
                  type="text"
                  value={formData.pin}
                  onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="1234"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
                  minLength={4}
                  required
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="active" className="text-sm font-semibold text-gray-700">
                  Operatore attivo
                </label>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg"
                >
                  {editingOperator ? 'Salva Modifiche' : 'Crea Operatore'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorsPage;

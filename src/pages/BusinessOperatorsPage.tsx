import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Users,
  Store as StoreIcon,
  Shield,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { Operator } from '../types';

const BusinessOperatorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { operators, stores, currentUser, setOperators } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Filtra gli operatori del business corrente
  const businessOperators = useMemo(() => {
    if (currentUser?.type !== 'business') return [];
    return operators.filter((op) => op.businessId === currentUser.data.id);
  }, [operators, currentUser]);

  // Filtra gli store del business corrente
  const businessStores = useMemo(() => {
    if (currentUser?.type !== 'business') return [];
    return stores.filter((s) => s.businessId === currentUser.data.id);
  }, [stores, currentUser]);

  const filteredOperators = useMemo(() => {
    return businessOperators.filter((operator) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          operator.name.toLowerCase().includes(query) ||
          operator.email.toLowerCase().includes(query) ||
          operator.pin.includes(query);
        if (!matchesSearch) return false;
      }

      // Store filter
      if (filterStore !== 'all' && operator.storeId !== filterStore) {
        return false;
      }

      // Role filter
      if (filterRole !== 'all' && operator.role !== filterRole) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !operator.active) return false;
        if (filterStatus === 'inactive' && operator.active) return false;
      }

      return true;
    });
  }, [businessOperators, searchQuery, filterStore, filterRole, filterStatus]);

  const getRoleBadge = (role: Operator['role']) => {
    const badges = {
      business_admin: { class: 'bg-purple-100 text-purple-800', label: 'Business Admin' },
      store_admin: { class: 'bg-blue-100 text-blue-800', label: 'Store Admin' },
      manager: { class: 'bg-green-100 text-green-800', label: 'Manager' },
      cashier: { class: 'bg-gray-100 text-gray-800', label: 'Cassiere' },
    };
    return badges[role];
  };

  const getStoreName = (storeId: string) => {
    const store = businessStores.find((s) => s.id === storeId);
    return store ? store.name : 'Store non trovato';
  };

  const handleDelete = (operatorId: string) => {
    const operator = businessOperators.find((o) => o.id === operatorId);
    if (!operator) {
      alert('Operatore non trovato');
      return;
    }

    if (
      confirm(
        `Sei sicuro di voler eliminare l'operatore "${operator.name}"?\n\nQuesta azione non può essere annullata.`
      )
    ) {
      const updatedOperators = operators.filter((o) => o.id !== operatorId);
      setOperators(updatedOperators);
      alert(`Operatore "${operator.name}" eliminato con successo`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/business')}
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Gestione Operatori</h1>
              <p className="text-blue-100">Gestisci gli operatori dei tuoi punti vendita</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/business/operators/new')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Nuovo Operatore
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Operatori Totali</p>
            <p className="text-2xl font-bold">{businessOperators.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Attivi</p>
            <p className="text-2xl font-bold text-green-200">
              {businessOperators.filter((o) => o.active).length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Manager</p>
            <p className="text-2xl font-bold">
              {businessOperators.filter((o) => o.role === 'manager').length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Cassieri</p>
            <p className="text-2xl font-bold">
              {businessOperators.filter((o) => o.role === 'cashier').length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per nome, email o PIN..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
          >
            <option value="all">Tutti i punti vendita</option>
            {businessStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
          >
            <option value="all">Tutti i ruoli</option>
            <option value="store_admin">Admin Store</option>
            <option value="manager">Manager</option>
            <option value="cashier">Cassiere</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
          >
            <option value="all">Tutti gli stati</option>
            <option value="active">Attivi</option>
            <option value="inactive">Inattivi</option>
          </select>
        </div>

        {/* Operators Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Operatore
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Punto Vendita
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ruolo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PIN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stato
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOperators.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Nessun operatore trovato</p>
                      {searchQuery || filterStore !== 'all' || filterRole !== 'all' ? (
                        <p className="text-sm text-gray-400 mt-1">Prova a modificare i filtri</p>
                      ) : (
                        <button
                          onClick={() => navigate('/business/operators/new')}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Crea il tuo primo operatore
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredOperators.map((operator) => {
                    const roleBadge = getRoleBadge(operator.role);
                    return (
                      <tr key={operator.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {operator.name}
                              </div>
                              <div className="text-sm text-gray-500">{operator.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <StoreIcon className="w-4 h-4 mr-2 text-gray-400" />
                            {getStoreName(operator.storeId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleBadge.class}`}
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {operator.pin}
                          </code>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {operator.active ? (
                            <span className="inline-flex items-center text-green-700 text-sm font-semibold">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Attivo
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-700 text-sm font-semibold">
                              <XCircle className="w-4 h-4 mr-1" />
                              Inattivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => navigate(`/business/operators/${operator.id}/edit`)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Modifica"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(operator.id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Elimina"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredOperators.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Visualizzati {filteredOperators.length} di {businessOperators.length} operatori totali
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOperatorsPage;

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store as StoreIcon,
  Plus,
  Search,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShoppingBag,
  Calendar,
  LogOut,
  Users,
} from 'lucide-react';
import type { Store, BusinessStats } from '../types';
import useStore from '../store/useStore';
import { mockStores } from '../utils/storeMockData';

const BusinessDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stores, setStores, logoutUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [initialized, setInitialized] = useState(false);

  // Inizializza lo store con i mock data se vuoto
  useEffect(() => {
    if (!initialized && stores.length === 0) {
      setStores(mockStores);
      setInitialized(true);
    }
  }, [stores.length, setStores, initialized]);

  const stats: BusinessStats = useMemo(() => {
    return {
      totalStores: stores.length,
      activeStores: stores.filter(s => s.active).length,
      totalOperators: 25, // Mock
      totalSales: 1534,
      totalRevenue: 125340.50,
      totalCustomers: 856,
    };
  }, [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          store.name.toLowerCase().includes(query) ||
          store.code.toLowerCase().includes(query) ||
          store.city.toLowerCase().includes(query) ||
          store.address.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !store.active) return false;
        if (filterStatus === 'inactive' && store.active) return false;
      }

      return true;
    });
  }, [stores, searchQuery, filterStatus]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const getSectorLabel = (sector: Store['sector']) => {
    const labels = {
      fashion: 'Moda',
      bar: 'Bar & Tabacchi',
      restaurant: 'Ristorante',
      generic: 'Generico',
    };
    return labels[sector];
  };

  const getSectorColor = (sector: Store['sector']) => {
    const colors = {
      fashion: 'bg-pink-100 text-pink-800',
      bar: 'bg-orange-100 text-orange-800',
      restaurant: 'bg-green-100 text-green-800',
      generic: 'bg-gray-100 text-gray-800',
    };
    return colors[sector];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Business</h1>
            <p className="text-blue-100">Gestisci i tuoi punti vendita</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/business/operators')}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
              title="Gestisci Operatori"
            >
              <Users className="w-5 h-5 mr-2" />
              Operatori
            </button>
            <button
              onClick={() => navigate('/business/stores/new')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuovo Punto Vendita
            </button>
            <button
              onClick={() => {
                logoutUser();
                navigate('/admin-login');
              }}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Punti Vendita</p>
            <p className="text-2xl font-bold">{stats.totalStores}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Attivi</p>
            <p className="text-2xl font-bold text-green-200">{stats.activeStores}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Operatori Tot.</p>
            <p className="text-2xl font-bold">{stats.totalOperators}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Vendite</p>
            <p className="text-2xl font-bold">{stats.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Fatturato</p>
            <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-1">Clienti</p>
            <p className="text-2xl font-bold">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca per nome, codice, città o indirizzo..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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

        {/* Stores Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                store.active
                  ? 'border-blue-200 hover:border-blue-400'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                    <StoreIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{store.name}</h3>
                    <p className="text-sm text-gray-600 font-mono">{store.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {store.active ? (
                    <span title="Attivo">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </span>
                  ) : (
                    <span title="Inattivo">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </span>
                  )}
                </div>
              </div>

              {/* Sector Badge */}
              <div className="mb-4">
                <span className={`${getSectorColor(store.sector)} px-3 py-1 rounded-full text-xs font-bold`}>
                  {getSectorLabel(store.sector)}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{store.address}, {store.city} ({store.province})</span>
                </div>
                {store.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {store.phone}
                  </div>
                )}
                {store.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {store.email}
                  </div>
                )}
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  Creato: {new Date(store.createdAt).toLocaleDateString('it-IT')}
                </div>
              </div>

              {/* Opening Hours */}
              {store.openingHours && (
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-xs text-blue-800 mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="font-semibold">Orari</span>
                  </div>
                  <div className="text-xs text-blue-900">
                    {store.openingHours.monday?.closed ? (
                      <p>Lun-Dom: Orari personalizzati</p>
                    ) : (
                      <p>
                        Lun-Sab: {store.openingHours.monday?.open}-{store.openingHours.monday?.close}
                        {store.openingHours.sunday?.closed ? ' • Dom: Chiuso' : ''}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Mock Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-green-600">Vendite</p>
                  <p className="text-lg font-bold text-green-900">342</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-600">Operatori</p>
                  <p className="text-lg font-bold text-blue-900">8</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-purple-600">Prodotti</p>
                  <p className="text-lg font-bold text-purple-900">456</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/store/${store.id}/pos`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <ShoppingBag className="w-4 h-4 mr-1" />
                  Apri POS
                </button>
                <button
                  onClick={() => navigate(`/business/stores/${store.id}`)}
                  className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  title="Dettagli"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate(`/business/stores/${store.id}/edit`)}
                  className="px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  title="Modifica"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStores.length === 0 && (
          <div className="text-center py-12">
            <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all'
                ? 'Nessun punto vendita trovato'
                : 'Nessun punto vendita'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all'
                ? 'Prova con criteri di ricerca diversi'
                : 'Crea il tuo primo punto vendita per iniziare'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/business/stores/new')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crea Punto Vendita
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;

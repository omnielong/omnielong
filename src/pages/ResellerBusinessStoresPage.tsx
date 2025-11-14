import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Store as StoreIcon,
  Search,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Eye,
} from 'lucide-react';
import type { Store } from '../types';
import useStore from '../store/useStore';
import { mockStores } from '../utils/storeMockData';

const ResellerBusinessStoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { businesses, stores, setStores } = useStore();
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

  // Trova il business corrente
  const business = businesses.find(b => b.id === id);

  // Filtra gli stores per questo business
  const businessStores = useMemo(() => {
    return stores.filter(store => store.businessId === id);
  }, [stores, id]);

  const filteredStores = useMemo(() => {
    return businessStores.filter((store) => {
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
  }, [businessStores, searchQuery, filterStatus]);

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

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Business non trovato</h2>
          <button
            onClick={() => navigate('/reseller')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Torna alla Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/reseller')}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg mr-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Punti Vendita - {business.companyName}</h1>
              <p className="text-indigo-100">Visualizza i punti vendita del cliente</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Punti Vendita Totali</p>
            <p className="text-2xl font-bold">{businessStores.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Attivi</p>
            <p className="text-2xl font-bold text-green-200">
              {businessStores.filter(s => s.active).length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Inattivi</p>
            <p className="text-2xl font-bold text-red-200">
              {businessStores.filter(s => !s.active).length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Max Consentiti</p>
            <p className="text-2xl font-bold text-yellow-200">{business.maxStores}</p>
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[140px]"
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
                  ? 'border-indigo-200 hover:border-indigo-400'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
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
                <div className="bg-indigo-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center text-xs text-indigo-800 mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="font-semibold">Orari</span>
                  </div>
                  <div className="text-xs text-indigo-900">
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

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => navigate(`/business/stores/${store.id}`)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizza Dettagli
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
                : 'Questo cliente non ha ancora punti vendita configurati'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellerBusinessStoresPage;

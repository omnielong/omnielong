import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Plus,
  Search,
  Store as StoreIcon,
  Edit2,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  LogOut,
} from 'lucide-react';
import type { Business, ResellerStats } from '../types';
import useStore from '../store/useStore';
import { mockBusinesses } from '../utils/businessMockData';

const ResellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { businesses, setBusinesses, logoutUser } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<'all' | 'free' | 'basic' | 'professional' | 'enterprise'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [initialized, setInitialized] = useState(false);

  // Inizializza lo store con i mock data se vuoto
  useEffect(() => {
    if (!initialized && businesses.length === 0) {
      setBusinesses(mockBusinesses);
      setInitialized(true);
    }
  }, [businesses.length, setBusinesses, initialized]);

  const stats: ResellerStats = useMemo(() => {
    return {
      totalBusinesses: businesses.length,
      activeBusinesses: businesses.filter(b => b.active).length,
      totalStores: businesses.reduce((sum, b) => sum + (b.maxStores > 0 ? 1 : 0), 0), // Mock
      totalRevenue: 125340.50,
      monthlyRecurringRevenue: 8450.00,
      totalTransactions: 15234,
      avgTransactionValue: 45.80,
    };
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          business.companyName.toLowerCase().includes(query) ||
          business.email.toLowerCase().includes(query) ||
          business.vatNumber?.toLowerCase().includes(query) ||
          business.adminName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Plan filter
      if (filterPlan !== 'all' && business.subscriptionPlan !== filterPlan) {
        return false;
      }

      // Status filter
      if (filterStatus !== 'all') {
        if (filterStatus === 'active' && !business.active) return false;
        if (filterStatus === 'inactive' && business.active) return false;
      }

      return true;
    });
  }, [businesses, searchQuery, filterPlan, filterStatus]);

  const getPlanBadge = (plan: Business['subscriptionPlan']) => {
    const badges = {
      free: 'bg-gray-100 text-gray-800',
      basic: 'bg-blue-100 text-blue-800',
      professional: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-orange-100 text-orange-800',
    };
    const labels = {
      free: 'Free',
      basic: 'Basic',
      professional: 'Professional',
      enterprise: 'Enterprise',
    };
    return { class: badges[plan], label: labels[plan] };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Rivenditore</h1>
            <p className="text-indigo-100">Gestisci i tuoi clienti e monitora le performance</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/reseller/businesses/new')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuovo Cliente
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Clienti Totali</p>
            <p className="text-2xl font-bold">{stats.totalBusinesses}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Clienti Attivi</p>
            <p className="text-2xl font-bold text-green-200">{stats.activeBusinesses}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Punti Vendita</p>
            <p className="text-2xl font-bold">{stats.totalStores}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">MRR</p>
            <p className="text-xl font-bold">{formatCurrency(stats.monthlyRecurringRevenue)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Fatturato Tot.</p>
            <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Transazioni</p>
            <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-indigo-100 text-xs mb-1">Valore Medio</p>
            <p className="text-xl font-bold">{formatCurrency(stats.avgTransactionValue)}</p>
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
              placeholder="Cerca per nome, email, P.IVA o amministratore..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value as any)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[160px]"
          >
            <option value="all">Tutti i piani</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
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

        {/* Businesses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBusinesses.map((business) => {
            const planBadge = getPlanBadge(business.subscriptionPlan);
            const daysUntilExpiry = business.subscriptionEndDate
              ? Math.ceil((business.subscriptionEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;
            const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
            const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

            return (
              <div
                key={business.id}
                className={`bg-white rounded-xl border-2 p-6 transition-all hover:shadow-lg ${
                  business.active
                    ? 'border-indigo-200 hover:border-indigo-400'
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{business.companyName}</h3>
                      <p className="text-sm text-gray-600">{business.adminName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {business.active ? (
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

                {/* Plan and Status */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className={`${planBadge.class} px-3 py-1 rounded-full text-xs font-bold`}>
                    {planBadge.label}
                  </span>
                  {isExpiringSoon && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                      Scade tra {daysUntilExpiry} giorni
                    </span>
                  )}
                  {isExpired && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">
                      Scaduto
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm mb-4">
                  {business.vatNumber && (
                    <div className="flex items-center text-gray-700">
                      <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                      P.IVA: {business.vatNumber}
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {business.email}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {business.phone}
                  </div>
                  {business.address && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      {business.address}
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Creato: {business.createdAt.toLocaleDateString('it-IT')}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-indigo-600 mb-1">Max Negozi</p>
                    <p className="text-lg font-bold text-indigo-900">{business.maxStores}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-purple-600 mb-1">Max Operatori</p>
                    <p className="text-lg font-bold text-purple-900">{business.maxOperatorsPerStore}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-blue-600 mb-1">Pagamento</p>
                    <p className="text-xs font-bold text-blue-900">
                      {business.paymentMethod === 'credit_card' && 'Carta'}
                      {business.paymentMethod === 'bank_transfer' && 'Bonifico'}
                      {business.paymentMethod === 'paypal' && 'PayPal'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/reseller/businesses/${business.id}`)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Dettagli
                  </button>
                  <button
                    onClick={() => navigate(`/reseller/businesses/${business.id}/edit`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifica
                  </button>
                  <button
                    onClick={() => navigate(`/reseller/businesses/${business.id}/stores`)}
                    className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <StoreIcon className="w-4 h-4 mr-2" />
                    Negozi
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBusinesses.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery || filterPlan !== 'all' || filterStatus !== 'all'
                ? 'Nessun cliente trovato'
                : 'Nessun cliente'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterPlan !== 'all' || filterStatus !== 'all'
                ? 'Prova con criteri di ricerca diversi'
                : 'Crea il tuo primo cliente per iniziare'}
            </p>
            {!searchQuery && filterPlan === 'all' && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/reseller/businesses/new')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crea Cliente
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellerDashboard;

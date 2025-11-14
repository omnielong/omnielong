import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Store as StoreIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Users,
  Package,
  Settings,
  LogIn,
} from 'lucide-react';
import type { Business, Store } from '../types';
import useStore from '../store/useStore';

const BusinessDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { businesses, stores, setCurrentStore, login } = useStore();

  const business = useMemo(() => {
    return businesses.find((b) => b.id === id);
  }, [businesses, id]);

  const businessStores = useMemo(() => {
    return stores.filter((s) => s.businessId === id);
  }, [stores, id]);

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cliente non trovato</h3>
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

  const handleEnterStore = (store: Store) => {
    // Simula il login come assistenza tecnica per questo negozio
    // Crea un operatore temporaneo per l'assistenza
    const assistanceOperator = {
      id: `assistance-${Date.now()}`,
      storeId: store.id,
      businessId: store.businessId,
      name: 'Assistenza Reseller',
      email: 'assistenza@techpos.it',
      role: 'store_admin' as const,
      pin: '0000',
      active: true,
      createdAt: new Date(),
    };

    setCurrentStore(store);
    login(assistanceOperator);
    navigate('/shift');
  };

  const planBadge = getPlanBadge(business.subscriptionPlan);
  const endDate = business.subscriptionEndDate ? new Date(business.subscriptionEndDate) : null;
  const daysUntilExpiry = endDate
    ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <button
          onClick={() => navigate('/reseller')}
          className="mb-4 flex items-center text-indigo-100 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Torna ai Clienti
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">{business.companyName}</h1>
              <p className="text-indigo-100">{business.adminName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {business.active ? (
              <span className="bg-green-500/20 text-green-100 px-4 py-2 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Attivo
              </span>
            ) : (
              <span className="bg-red-500/20 text-red-100 px-4 py-2 rounded-lg flex items-center">
                <XCircle className="w-5 h-5 mr-2" />
                Inattivo
              </span>
            )}
          </div>
        </div>

        {/* Plan and Expiry */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className={`${planBadge.class} px-4 py-2 rounded-full text-sm font-bold`}>
            Piano {planBadge.label}
          </span>
          {isExpiringSoon && (
            <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">
              Scade tra {daysUntilExpiry} giorni
            </span>
          )}
          {isExpired && (
            <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold">
              Abbonamento Scaduto
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Business Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Informazioni Cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {business.vatNumber && (
              <div className="flex items-center text-gray-700">
                <CreditCard className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">P.IVA</p>
                  <p className="font-semibold">{business.vatNumber}</p>
                </div>
              </div>
            )}
            <div className="flex items-center text-gray-700">
              <Mail className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-semibold">{business.email}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Telefono</p>
                <p className="font-semibold">{business.phone}</p>
              </div>
            </div>
            {business.address && (
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Indirizzo</p>
                  <p className="font-semibold">{business.address}</p>
                </div>
              </div>
            )}
            <div className="flex items-center text-gray-700">
              <Calendar className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Creato il</p>
                <p className="font-semibold">{new Date(business.createdAt).toLocaleDateString('it-IT')}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-700">
              <Settings className="w-5 h-5 mr-3 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Pagamento</p>
                <p className="font-semibold">
                  {business.paymentMethod === 'credit_card' && 'Carta di Credito'}
                  {business.paymentMethod === 'bank_transfer' && 'Bonifico Bancario'}
                  {business.paymentMethod === 'paypal' && 'PayPal'}
                </p>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Max Negozi</p>
              <p className="text-2xl font-bold text-indigo-600">{business.maxStores}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Negozi Attivi</p>
              <p className="text-2xl font-bold text-green-600">{businessStores.filter(s => s.active).length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Max Operatori/Negozio</p>
              <p className="text-2xl font-bold text-purple-600">{business.maxOperatorsPerStore}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Totale Negozi</p>
              <p className="text-2xl font-bold text-blue-600">{businessStores.length}</p>
            </div>
          </div>
        </div>

        {/* Stores Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Punti Vendita</h2>
            <span className="text-sm text-gray-600">{businessStores.length} negozi</span>
          </div>

          {businessStores.length === 0 ? (
            <div className="text-center py-12">
              <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun punto vendita</h3>
              <p className="text-gray-600">Questo cliente non ha ancora creato nessun negozio</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {businessStores.map((store) => (
                <div
                  key={store.id}
                  className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                    store.active
                      ? 'border-blue-200 hover:border-blue-400'
                      : 'border-gray-200 opacity-60'
                  }`}
                >
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                        <StoreIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{store.name}</h3>
                        <p className="text-xs text-gray-600 font-mono">{store.code}</p>
                      </div>
                    </div>
                    {store.active ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>

                  {/* Sector Badge */}
                  <div className="mb-3">
                    <span className={`${getSectorColor(store.sector)} px-3 py-1 rounded-full text-xs font-bold`}>
                      {getSectorLabel(store.sector)}
                    </span>
                  </div>

                  {/* Store Info */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{store.city} ({store.province})</span>
                    </div>
                    {store.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        {store.phone}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEnterStore(store)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center text-sm"
                      title="Entra come assistenza tecnica"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Entra (Assistenza)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  Edit2,
  Store as StoreIcon,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Users,
  ShoppingBag,
  Key,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import type { Business } from '../types';
import useStore from '../store/useStore';

const ResellerBusinessDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { businesses, updateBusiness } = useStore();
  const [showPassword, setShowPassword] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Trova il business corrente
  const business = businesses.find(b => b.id === id);

  const handleCopyPassword = async () => {
    if (business?.adminPassword) {
      await navigator.clipboard.writeText(business.adminPassword);
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  const handleSavePassword = () => {
    if (business && newPassword.trim().length >= 6) {
      updateBusiness({ ...business, adminPassword: newPassword });
      setIsEditingPassword(false);
      setNewPassword('');
    }
  };

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

  const planBadge = getPlanBadge(business.subscriptionPlan);
  const endDate = business.subscriptionEndDate
    ? new Date(business.subscriptionEndDate)
    : null;
  const daysUntilExpiry = endDate
    ? Math.ceil((endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  const isExpired = daysUntilExpiry !== null && daysUntilExpiry < 0;

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
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{business.companyName}</h1>
                <p className="text-indigo-100">Dettagli cliente</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/reseller/businesses/${business.id}/edit`)}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Modifica
            </button>
            <button
              onClick={() => navigate(`/reseller/businesses/${business.id}/stores`)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            >
              <StoreIcon className="w-5 h-5 mr-2" />
              Negozi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Status e Piano */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-indigo-600" />
            Stato e Sottoscrizione
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Stato Account</p>
              <div className="flex items-center">
                {business.active ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-lg font-semibold text-green-600">Attivo</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-lg font-semibold text-red-600">Inattivo</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Piano Sottoscrizione</p>
              <span className={`${planBadge.class} px-4 py-2 rounded-full text-sm font-bold inline-block`}>
                {planBadge.label}
              </span>
            </div>
            {endDate && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Scadenza Sottoscrizione</p>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-lg font-semibold text-gray-900">
                    {endDate.toLocaleDateString('it-IT')}
                  </span>
                </div>
                {isExpiringSoon && (
                  <p className="text-sm text-yellow-600 mt-1">⚠️ Scade tra {daysUntilExpiry} giorni</p>
                )}
                {isExpired && (
                  <p className="text-sm text-red-600 mt-1">⚠️ Scaduto</p>
                )}
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-2">Metodo di Pagamento</p>
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">
                  {business.paymentMethod === 'credit_card' && 'Carta di Credito'}
                  {business.paymentMethod === 'bank_transfer' && 'Bonifico Bancario'}
                  {business.paymentMethod === 'paypal' && 'PayPal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informazioni Azienda */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-indigo-600" />
            Informazioni Azienda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ragione Sociale</p>
              <p className="text-lg font-semibold text-gray-900">{business.companyName}</p>
            </div>
            {business.vatNumber && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Partita IVA</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">{business.vatNumber}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Amministratore</p>
              <p className="text-lg font-semibold text-gray-900">{business.adminName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <a href={`mailto:${business.email}`} className="text-lg text-indigo-600 hover:underline">
                  {business.email}
                </a>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Telefono</p>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <a href={`tel:${business.phone}`} className="text-lg text-indigo-600 hover:underline">
                  {business.phone}
                </a>
              </div>
            </div>
            {business.address && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Indirizzo</p>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <p className="text-lg text-gray-900">{business.address}</p>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 mb-1">Data Creazione</p>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <p className="text-lg text-gray-900">
                  {new Date(business.createdAt).toLocaleDateString('it-IT')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Credenziali di Accesso */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Key className="w-6 h-6 mr-2 text-indigo-600" />
            Credenziali di Accesso
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Email di Login</p>
              <div className="flex items-center bg-gray-50 rounded-lg p-3">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-lg font-mono text-gray-900">{business.email}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Password</p>
              {!isEditingPassword ? (
                <div className="space-y-3">
                  <div className="flex items-center bg-gray-50 rounded-lg p-3">
                    <Key className="w-5 h-5 text-gray-500 mr-3" />
                    <span className="text-lg font-mono text-gray-900 flex-1">
                      {showPassword ? business.adminPassword || '(non impostata)' : '••••••••'}
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors mr-2"
                      title={showPassword ? 'Nascondi password' : 'Mostra password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={handleCopyPassword}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Copia password"
                      disabled={!business.adminPassword}
                    >
                      {copiedPassword ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Modifica Password
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nuova password (minimo 6 caratteri)"
                    className="w-full px-4 py-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSavePassword}
                      disabled={newPassword.trim().length < 6}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Salva
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setNewPassword('');
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>Nota:</strong> Comunica queste credenziali al cliente. Potrà modificare la password dopo il primo accesso.
              </p>
            </div>
          </div>
        </div>

        {/* Limiti e Risorse */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <ShoppingBag className="w-6 h-6 mr-2 text-indigo-600" />
            Limiti Piano
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <StoreIcon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-indigo-600 mb-1">Massimo Punti Vendita</p>
              <p className="text-3xl font-bold text-indigo-900">{business.maxStores}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-600 mb-1">Operatori per Store</p>
              <p className="text-3xl font-bold text-purple-900">{business.maxOperatorsPerStore}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResellerBusinessDetailsPage;

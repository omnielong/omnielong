import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Store as StoreIcon,
  Edit2,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  Calendar,
  Hash,
  Building2,
} from 'lucide-react';
import type { Store } from '../types';
import useStore from '../store/useStore';

const StoreDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { stores, currentUser } = useStore();

  // Trova lo store corrente
  const store = stores.find(s => s.id === id);

  // Determina il percorso di ritorno in base al tipo di utente
  const getBackPath = () => {
    if (currentUser?.type === 'reseller' && store) {
      return `/reseller/businesses/${store.businessId}/stores`;
    }
    return '/business';
  };

  const isReseller = currentUser?.type === 'reseller';

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

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: 'Lunedì',
      tuesday: 'Martedì',
      wednesday: 'Mercoledì',
      thursday: 'Giovedì',
      friday: 'Venerdì',
      saturday: 'Sabato',
      sunday: 'Domenica',
    };
    return days[day] || day;
  };

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Punto vendita non trovato</h2>
          <button
            onClick={() => navigate(currentUser?.type === 'reseller' ? '/reseller' : '/business')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(getBackPath())}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg mr-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <StoreIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{store.name}</h1>
                <p className="text-blue-100 font-mono">{store.code}</p>
              </div>
            </div>
          </div>
          {!isReseller && (
            <button
              onClick={() => navigate(`/business/stores/${store.id}/edit`)}
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            >
              <Edit2 className="w-5 h-5 mr-2" />
              Modifica
            </button>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stato e Settore */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
            Stato e Configurazione
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Stato Punto Vendita</p>
              <div className="flex items-center">
                {store.active ? (
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
              <p className="text-sm text-gray-600 mb-2">Settore</p>
              <span className={`${getSectorColor(store.sector)} px-4 py-2 rounded-full text-sm font-bold inline-block`}>
                {getSectorLabel(store.sector)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Codice Punto Vendita</p>
              <div className="flex items-center">
                <Hash className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900 font-mono">{store.code}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Data Creazione</p>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-lg font-semibold text-gray-900">
                  {new Date(store.createdAt).toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informazioni Punto Vendita */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-600" />
            Informazioni Generali
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Nome Punto Vendita</p>
              <p className="text-lg font-semibold text-gray-900">{store.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Città</p>
              <p className="text-lg font-semibold text-gray-900">{store.city} ({store.province})</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Indirizzo Completo</p>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <p className="text-lg text-gray-900">{store.address}, {store.postalCode} {store.city} ({store.province})</p>
              </div>
            </div>
            {store.phone && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Telefono</p>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-2" />
                  <a href={`tel:${store.phone}`} className="text-lg text-blue-600 hover:underline">
                    {store.phone}
                  </a>
                </div>
              </div>
            )}
            {store.email && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-2" />
                  <a href={`mailto:${store.email}`} className="text-lg text-blue-600 hover:underline">
                    {store.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orari di Apertura */}
        {store.openingHours && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Orari di Apertura
            </h2>
            <div className="space-y-3">
              {Object.entries(store.openingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="font-semibold text-gray-900 w-32">{getDayName(day)}</span>
                  {hours.closed ? (
                    <span className="text-red-600 font-medium">Chiuso</span>
                  ) : (
                    <span className="text-gray-700 font-mono">
                      {hours.open} - {hours.close}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurazione Fiscale */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Hash className="w-6 h-6 mr-2 text-blue-600" />
            Configurazione Fiscale
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {store.cashRegisterCode && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Codice Registratore di Cassa</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">{store.cashRegisterCode}</p>
              </div>
            )}
            {store.fiscalPrinterSerial && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Seriale Stampante Fiscale</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">{store.fiscalPrinterSerial}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsPage;

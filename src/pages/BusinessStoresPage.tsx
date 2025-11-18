import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Store as StoreIcon,
  Plus,
  Edit2,
  MapPin,
  Phone,
  User,
  Calendar,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { Business, Store } from '../types';

const BusinessStoresPage: React.FC = () => {
  const navigate = useNavigate();
  const { id: businessId } = useParams<{ id: string }>();
  const { businesses } = useStore();
  const [business, setBusiness] = useState<Business | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const foundBusiness = businesses.find((b) => b.id === businessId);
    if (foundBusiness) {
      setBusiness(foundBusiness);
      // Mock stores - in produzione verrebbero dal backend
      setStores([
        {
          id: `store-${businessId}-1`,
          businessId: businessId!,
          name: 'Negozio Centro',
          address: 'Via Roma 123, Milano',
          phone: '+39 02 1234567',
          managerName: 'Giuseppe Verdi',
          active: true,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: `store-${businessId}-2`,
          businessId: businessId!,
          name: 'Negozio Periferia',
          address: 'Via Garibaldi 45, Milano',
          phone: '+39 02 7654321',
          managerName: 'Maria Bianchi',
          active: true,
          createdAt: new Date('2024-03-20'),
        },
      ]);
    }
  }, [businessId, businesses]);

  if (!business) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Cliente non trovato</p>
          <button
            onClick={() => navigate('/reseller')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
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
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Negozi di {business.companyName}</h1>
              <p className="text-indigo-100">
                {stores.length} / {business.maxStores} negozi attivi
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              navigate(`/reseller/businesses/${businessId}/stores/new`)
            }
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            disabled={stores.length >= business.maxStores}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuovo Negozio
          </button>
        </div>

        {/* Business Info */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-indigo-100 mb-1">Amministratore</p>
              <p className="font-semibold">{business.adminName}</p>
            </div>
            <div>
              <p className="text-indigo-100 mb-1">Email</p>
              <p className="font-semibold">{business.email}</p>
            </div>
            <div>
              <p className="text-indigo-100 mb-1">Piano</p>
              <p className="font-semibold uppercase">{business.subscriptionPlan}</p>
            </div>
            <div>
              <p className="text-indigo-100 mb-1">Max Operatori/Negozio</p>
              <p className="font-semibold">{business.maxOperatorsPerStore}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Stores Grid */}
        {stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl shadow-sm border-2 border-indigo-200 p-6 hover:shadow-lg transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                      <StoreIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{store.name}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          store.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {store.active ? 'Attivo' : 'Inattivo'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {store.address}
                  </div>
                  {store.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      {store.phone}
                    </div>
                  )}
                  {store.managerName && (
                    <div className="flex items-center text-gray-700">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      Manager: {store.managerName}
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    {new Date(store.createdAt).toLocaleDateString('it-IT')}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      navigate(`/reseller/businesses/${businessId}/stores/${store.id}/edit`)
                    }
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifica
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <StoreIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun negozio</h3>
            <p className="text-gray-600 mb-4">
              Questo cliente non ha ancora negozi configurati
            </p>
            <button
              onClick={() =>
                navigate(`/reseller/businesses/${businessId}/stores/new`)
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              disabled={stores.length >= business.maxStores}
            >
              <Plus className="w-5 h-5 mr-2" />
              Crea Primo Negozio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessStoresPage;

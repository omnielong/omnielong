import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Shirt,
  Coffee,
  UtensilsCrossed,
  Package,
  ArrowRight,
  Building,
  Mail,
  Phone,
  Hash,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { BusinessSector } from '../types';

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSectorConfig } = useStore();

  const [step, setStep] = useState(1);
  const [selectedSector, setSelectedSector] = useState<BusinessSector | null>(null);
  const [storeName, setStoreName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const sectors = [
    {
      id: 'fashion' as BusinessSector,
      name: 'Moda',
      icon: Shirt,
      description: 'Abbigliamento, scarpe, accessori con taglie e colori',
      color: 'from-pink-500 to-purple-600',
      features: ['Taglie e colori', 'Stagionalità', 'Brand e collezioni', 'Varianti prodotto']
    },
    {
      id: 'bar' as BusinessSector,
      name: 'Bar e Tabacchi',
      icon: Coffee,
      description: 'Vendita veloce con pulsanti rapidi per caffetteria',
      color: 'from-orange-500 to-amber-600',
      features: ['Pulsanti rapidi', 'Gratta e vinci', 'Ricariche', 'Vendita al volo']
    },
    {
      id: 'restaurant' as BusinessSector,
      name: 'Ristorante',
      icon: UtensilsCrossed,
      description: 'Gestione tavoli, comande, modificatori e menu',
      color: 'from-green-500 to-emerald-600',
      features: ['Gestione tavoli', 'Comande cucina/bar', 'Modificatori', 'Coperti']
    },
    {
      id: 'generic' as BusinessSector,
      name: 'Generico',
      icon: Package,
      description: 'Punto vendita flessibile per qualsiasi settore',
      color: 'from-blue-500 to-indigo-600',
      features: ['Massima flessibilità', 'Personalizzabile', 'Multi-categoria', 'Universale']
    },
  ];

  const handleSectorSelect = (sector: BusinessSector) => {
    setSelectedSector(sector);
    setStep(2);
  };

  const handleComplete = () => {
    if (!selectedSector || !storeName) {
      alert('Completa tutti i campi obbligatori');
      return;
    }

    setSectorConfig({
      sector: selectedSector,
      storeName,
      vatNumber: vatNumber || undefined,
      address: address || undefined,
      phone: phone || undefined,
      email: email || undefined,
      configured: true,
    });

    navigate('/');
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Configurazione Iniziale
            </h1>
            <p className="text-xl text-gray-600">
              Scegli il settore del tuo punto vendita
            </p>
          </div>

          {/* Sectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  onClick={() => handleSectorSelect(sector.id)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${sector.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {sector.name}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {sector.description}
                  </p>

                  <div className="space-y-2">
                    {sector.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                    Seleziona
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Dettagli negozio
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${sectors.find(s => s.id === selectedSector)?.color} rounded-xl mb-4`}>
            {React.createElement(sectors.find(s => s.id === selectedSector)?.icon || Store, { className: 'w-8 h-8 text-white' })}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Dati del Negozio
          </h2>
          <p className="text-gray-600">
            Settore: <strong>{sectors.find(s => s.id === selectedSector)?.name}</strong>
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nome Negozio <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Es. Boutique Eleganza"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Partita IVA
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="IT12345678901"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Indirizzo
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Via Roma 123, Milano"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 02 1234567"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@negozio.it"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => setStep(1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            Indietro
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            Completa Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;

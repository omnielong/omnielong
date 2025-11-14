import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Users,
  Store,
  AlertCircle,
  ShoppingBag,
  Coffee,
  Utensils,
  Package,
} from 'lucide-react';
import type { Business } from '../types';

const BusinessForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    fiscalCode: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    businessSector: 'generic' as 'fashion' | 'bar' | 'restaurant' | 'generic',
    adminEmail: '',
    adminName: '',
    subscriptionPlan: 'basic' as 'free' | 'basic' | 'professional' | 'enterprise',
    maxStores: 2,
    maxOperatorsPerStore: 5,
    billingEmail: '',
    paymentMethod: 'bank_transfer' as 'credit_card' | 'bank_transfer' | 'paypal',
    active: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const plans = [
    {
      id: 'free',
      name: 'Free',
      maxStores: 1,
      maxOperatorsPerStore: 2,
      price: '€0/mese',
      features: ['1 punto vendita', 'Max 2 operatori', 'Funzionalità base'],
    },
    {
      id: 'basic',
      name: 'Basic',
      maxStores: 2,
      maxOperatorsPerStore: 5,
      price: '€49/mese',
      features: ['2 punti vendita', 'Max 5 operatori per store', 'Report base', 'Supporto email'],
    },
    {
      id: 'professional',
      name: 'Professional',
      maxStores: 5,
      maxOperatorsPerStore: 10,
      price: '€99/mese',
      features: ['5 punti vendita', 'Max 10 operatori per store', 'Report avanzati', 'API Access', 'Supporto prioritario'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      maxStores: 999,
      maxOperatorsPerStore: 50,
      price: 'Personalizzato',
      features: ['Punti vendita illimitati', 'Max 50 operatori per store', 'Tutte le funzionalità', 'API completa', 'Custom branding', 'Supporto dedicato'],
    },
  ];

  const handlePlanChange = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      setFormData({
        ...formData,
        subscriptionPlan: planId as any,
        maxStores: plan.maxStores,
        maxOperatorsPerStore: plan.maxOperatorsPerStore,
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nome azienda obbligatorio';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Email valida obbligatoria';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefono obbligatorio';
    }
    if (!formData.adminName.trim()) {
      newErrors.adminName = 'Nome amministratore obbligatorio';
    }
    if (!formData.adminEmail.trim() || !formData.adminEmail.includes('@')) {
      newErrors.adminEmail = 'Email amministratore valida obbligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // In produzione: chiamata API per salvare
    const newBusiness: Business = {
      id: isEditing ? id! : `bus-${Date.now()}`,
      resellerId: 'res-1', // Mock - verrebbe dal contesto
      companyName: formData.companyName,
      vatNumber: formData.vatNumber || undefined,
      fiscalCode: formData.fiscalCode || undefined,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
      website: formData.website || undefined,
      active: formData.active,
      createdAt: new Date(),
      subscriptionPlan: formData.subscriptionPlan,
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 anno
      adminEmail: formData.adminEmail,
      adminName: formData.adminName,
      maxStores: formData.maxStores,
      maxOperatorsPerStore: formData.maxOperatorsPerStore,
      billingEmail: formData.billingEmail || undefined,
      paymentMethod: formData.paymentMethod,
    };

    console.log('Saving business:', newBusiness);
    alert(`Cliente ${isEditing ? 'aggiornato' : 'creato'} con successo!`);
    navigate('/reseller');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/reseller')}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Modifica Cliente' : 'Nuovo Cliente'}
            </h1>
            <p className="text-indigo-100">
              {isEditing ? 'Aggiorna i dati del business' : 'Crea un nuovo business cliente'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Dati Azienda */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Building2 className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Dati Azienda</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ragione Sociale *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.companyName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="es. Boutique Fashion S.r.l."
                />
                {errors.companyName && (
                  <p className="text-red-600 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Partita IVA
                </label>
                <input
                  type="text"
                  value={formData.vatNumber}
                  onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="IT12345678901"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Codice Fiscale
                </label>
                <input
                  type="text"
                  value={formData.fiscalCode}
                  onChange={(e) => setFormData({ ...formData, fiscalCode: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="RSSMRA80A01H501A"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="info@azienda.it"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefono *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+39 02 12345678"
                  />
                </div>
                {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Indirizzo
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Via Roma 1, 20100 Milano"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sito Web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="https://www.azienda.it"
                />
              </div>
            </div>
          </div>

          {/* Settore Business */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Store className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Settore di Attività</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Seleziona il settore principale dell'attività. Questo configurerà automaticamente
              l'ambiente POS per il cliente con le funzionalità più adatte.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'fashion', name: 'Moda', icon: ShoppingBag, color: 'pink' },
                { id: 'bar', name: 'Bar & Tabacchi', icon: Coffee, color: 'orange' },
                { id: 'restaurant', name: 'Ristorante', icon: Utensils, color: 'red' },
                { id: 'generic', name: 'Generico', icon: Package, color: 'gray' },
              ].map((sector) => {
                const Icon = sector.icon;
                const isSelected = formData.businessSector === sector.id;
                return (
                  <button
                    key={sector.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, businessSector: sector.id as any })}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center space-y-2 ${
                      isSelected
                        ? `border-${sector.color}-500 bg-${sector.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                        isSelected ? `bg-${sector.color}-100` : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          isSelected ? `text-${sector.color}-600` : 'text-gray-600'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{sector.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amministratore */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Amministratore Business</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.adminName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mario Rossi"
                />
                {errors.adminName && (
                  <p className="text-red-600 text-sm mt-1">{errors.adminName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Admin *
                </label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.adminEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="admin@azienda.it"
                />
                {errors.adminEmail && (
                  <p className="text-red-600 text-sm mt-1">{errors.adminEmail}</p>
                )}
              </div>
            </div>
          </div>

          {/* Piano Abbonamento */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Store className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Piano Abbonamento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanChange(plan.id)}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    formData.subscriptionPlan === plan.id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-3">{plan.price}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-green-600 mr-1">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Punti Vendita
                </label>
                <input
                  type="number"
                  value={formData.maxStores}
                  onChange={(e) => setFormData({ ...formData, maxStores: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Operatori per Store
                </label>
                <input
                  type="number"
                  value={formData.maxOperatorsPerStore}
                  onChange={(e) => setFormData({ ...formData, maxOperatorsPerStore: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Fatturazione */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Fatturazione e Pagamento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Fatturazione
                </label>
                <input
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="billing@azienda.it"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Metodo Pagamento
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bank_transfer">Bonifico Bancario</option>
                  <option value="credit_card">Carta di Credito</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stato */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-indigo-600 mr-3" />
                <div>
                  <h3 className="font-bold text-gray-900">Stato Account</h3>
                  <p className="text-sm text-gray-600">Attiva o disattiva l'accesso al sistema</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, active: !formData.active })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  formData.active ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    formData.active ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/reseller')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? 'Salva Modifiche' : 'Crea Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessForm;

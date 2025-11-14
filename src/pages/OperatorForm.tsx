import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Lock,
  Store as StoreIcon,
  Shield,
  AlertCircle,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { Operator } from '../types';

const OperatorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { operators, stores, currentUser, setOperators } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pin: '',
    role: 'cashier' as Operator['role'],
    storeId: '',
    active: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Filtra gli store del business corrente
  const businessStores = currentUser?.type === 'business'
    ? stores.filter((s) => s.businessId === currentUser.data.id)
    : [];

  // Carica i dati dell'operatore in modalità edit
  useEffect(() => {
    if (isEditing && id) {
      const operator = operators.find((o) => o.id === id);
      if (operator) {
        setFormData({
          name: operator.name,
          email: operator.email,
          pin: operator.pin,
          role: operator.role,
          storeId: operator.storeId,
          active: operator.active,
        });
      }
    } else if (businessStores.length === 1) {
      // Auto-seleziona lo store se ce n'è solo uno
      setFormData((prev) => ({ ...prev, storeId: businessStores[0].id }));
    }
  }, [id, isEditing, operators, businessStores]);

  const roles = [
    {
      id: 'cashier',
      name: 'Cassiere',
      description: 'Accesso base al POS, può vendere e gestire clienti',
      icon: '💵',
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Gestisce operazioni dello store, report e turni',
      icon: '📊',
    },
    {
      id: 'store_admin',
      name: 'Admin Store',
      description: 'Controllo completo dello store, prodotti e operatori',
      icon: '👑',
    },
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome obbligatorio';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Email valida obbligatoria';
    }
    if (!formData.pin.trim()) {
      newErrors.pin = 'PIN obbligatorio';
    } else if (formData.pin.length !== 4 || !/^\d{4}$/.test(formData.pin)) {
      newErrors.pin = 'Il PIN deve essere di 4 cifre';
    } else {
      // Verifica PIN duplicato (escludi l'operatore corrente se in modifica)
      const duplicatePin = operators.find(
        (o) => o.pin === formData.pin && (!isEditing || o.id !== id)
      );
      if (duplicatePin) {
        newErrors.pin = 'PIN già utilizzato da un altro operatore';
      }
    }
    if (!formData.storeId) {
      newErrors.storeId = 'Seleziona un punto vendita';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (currentUser?.type !== 'business') {
      alert('Errore: utente non autorizzato');
      return;
    }

    const existingOperator = isEditing && id ? operators.find((o) => o.id === id) : null;

    const operatorData: Operator = {
      id: isEditing ? id! : `op-${Date.now()}`,
      businessId: currentUser.data.id,
      storeId: formData.storeId,
      name: formData.name,
      email: formData.email,
      pin: formData.pin,
      role: formData.role,
      active: formData.active,
      createdAt: existingOperator?.createdAt || new Date(),
    };

    if (isEditing) {
      // Update existing operator
      const updatedOperators = operators.map((o) =>
        o.id === id ? operatorData : o
      );
      setOperators(updatedOperators);
    } else {
      // Add new operator
      setOperators([...operators, operatorData]);
    }

    alert(`Operatore ${isEditing ? 'aggiornato' : 'creato'} con successo!`);
    navigate('/business/operators');
  };

  const generateRandomPin = () => {
    let pin: string;
    do {
      pin = Math.floor(1000 + Math.random() * 9000).toString();
    } while (operators.some((o) => o.pin === pin && (!isEditing || o.id !== id)));
    setFormData({ ...formData, pin });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/business/operators')}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Modifica Operatore' : 'Nuovo Operatore'}
            </h1>
            <p className="text-blue-100">
              {isEditing ? 'Aggiorna i dati dell\'operatore' : 'Crea un nuovo operatore per i tuoi store'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Dati Personali */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Dati Personali</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="es. Mario Rossi"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
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
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="mario.rossi@store.it"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PIN (4 cifre) *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.pin}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setFormData({ ...formData, pin: value });
                      }}
                      maxLength={4}
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg ${
                        errors.pin ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={generateRandomPin}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors whitespace-nowrap"
                  >
                    Genera PIN
                  </button>
                </div>
                {errors.pin && <p className="text-red-600 text-sm mt-1">{errors.pin}</p>}
              </div>
            </div>
          </div>

          {/* Punto Vendita */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <StoreIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Punto Vendita</h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Negozio di Appartenenza *
              </label>
              <select
                value={formData.storeId}
                onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.storeId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleziona un punto vendita</option>
                {businessStores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} ({store.code})
                  </option>
                ))}
              </select>
              {errors.storeId && <p className="text-red-600 text-sm mt-1">{errors.storeId}</p>}
              {businessStores.length === 0 && (
                <p className="text-amber-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Devi creare almeno un punto vendita prima di creare operatori
                </p>
              )}
            </div>
          </div>

          {/* Ruolo */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Ruolo e Permessi</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => {
                const isSelected = formData.role === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.id as Operator['role'] })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{role.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stato */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-bold text-gray-900">Stato Operatore</h3>
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
              onClick={() => navigate('/business/operators')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={businessStores.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? 'Salva Modifiche' : 'Crea Operatore'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperatorForm;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Store as StoreIcon,
  MapPin,
  Phone,
  Clock,
  AlertCircle,
  ShoppingBag,
  Coffee,
  Utensils,
  Package,
} from 'lucide-react';
import type { Store, BusinessSector } from '../types';
import useStore from '../store/useStore';

const StoreForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const { stores, addStore, updateStore } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
    sector: 'generic' as BusinessSector,
    active: true,
    cashRegisterCode: '',
    fiscalPrinterSerial: '',
    // Orari
    mondayOpen: '09:00',
    mondayClose: '20:00',
    mondayClosed: false,
    tuesdayOpen: '09:00',
    tuesdayClose: '20:00',
    tuesdayClosed: false,
    wednesdayOpen: '09:00',
    wednesdayClose: '20:00',
    wednesdayClosed: false,
    thursdayOpen: '09:00',
    thursdayClose: '20:00',
    thursdayClosed: false,
    fridayOpen: '09:00',
    fridayClose: '20:00',
    fridayClosed: false,
    saturdayOpen: '09:00',
    saturdayClose: '20:00',
    saturdayClosed: false,
    sundayOpen: '10:00',
    sundayClose: '19:00',
    sundayClosed: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Carica i dati dello store in modalità edit
  useEffect(() => {
    if (isEditing && id) {
      const store = stores.find((s) => s.id === id);
      if (store) {
        setFormData({
          name: store.name,
          code: store.code,
          address: store.address,
          city: store.city,
          province: store.province,
          postalCode: store.postalCode,
          phone: store.phone || '',
          email: store.email || '',
          sector: store.sector,
          active: store.active,
          cashRegisterCode: store.cashRegisterCode || '',
          fiscalPrinterSerial: store.fiscalPrinterSerial || '',
          // Carica orari se presenti
          mondayOpen: store.openingHours?.monday?.open || '09:00',
          mondayClose: store.openingHours?.monday?.close || '20:00',
          mondayClosed: store.openingHours?.monday?.closed || false,
          tuesdayOpen: store.openingHours?.tuesday?.open || '09:00',
          tuesdayClose: store.openingHours?.tuesday?.close || '20:00',
          tuesdayClosed: store.openingHours?.tuesday?.closed || false,
          wednesdayOpen: store.openingHours?.wednesday?.open || '09:00',
          wednesdayClose: store.openingHours?.wednesday?.close || '20:00',
          wednesdayClosed: store.openingHours?.wednesday?.closed || false,
          thursdayOpen: store.openingHours?.thursday?.open || '09:00',
          thursdayClose: store.openingHours?.thursday?.close || '20:00',
          thursdayClosed: store.openingHours?.thursday?.closed || false,
          fridayOpen: store.openingHours?.friday?.open || '09:00',
          fridayClose: store.openingHours?.friday?.close || '20:00',
          fridayClosed: store.openingHours?.friday?.closed || false,
          saturdayOpen: store.openingHours?.saturday?.open || '09:00',
          saturdayClose: store.openingHours?.saturday?.close || '20:00',
          saturdayClosed: store.openingHours?.saturday?.closed || false,
          sundayOpen: store.openingHours?.sunday?.open || '10:00',
          sundayClose: store.openingHours?.sunday?.close || '19:00',
          sundayClosed: store.openingHours?.sunday?.closed || false,
        });
      }
    }
  }, [id, isEditing, stores]);

  const sectors = [
    {
      id: 'fashion',
      name: 'Moda',
      icon: ShoppingBag,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    },
    {
      id: 'bar',
      name: 'Bar & Tabacchi',
      icon: Coffee,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 'restaurant',
      name: 'Ristorante',
      icon: Utensils,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 'generic',
      name: 'Generico',
      icon: Package,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ];

  const provinces = [
    'AG', 'AL', 'AN', 'AO', 'AR', 'AP', 'AT', 'AV', 'BA', 'BT', 'BL', 'BN', 'BG', 'BI', 'BO',
    'BZ', 'BS', 'BR', 'CA', 'CL', 'CB', 'CI', 'CE', 'CT', 'CZ', 'CH', 'CO', 'CS', 'CR', 'KR',
    'CN', 'EN', 'FM', 'FE', 'FI', 'FG', 'FC', 'FR', 'GE', 'GO', 'GR', 'IM', 'IS', 'SP', 'AQ',
    'LT', 'LE', 'LC', 'LI', 'LO', 'LU', 'MC', 'MN', 'MS', 'MT', 'VS', 'ME', 'MI', 'MO', 'MB',
    'NA', 'NO', 'NU', 'OG', 'OT', 'OR', 'PD', 'PA', 'PR', 'PV', 'PG', 'PU', 'PE', 'PC', 'PI',
    'PT', 'PN', 'PZ', 'PO', 'RG', 'RA', 'RC', 'RE', 'RI', 'RN', 'RM', 'RO', 'SA', 'SS', 'SV',
    'SI', 'SR', 'SO', 'TA', 'TE', 'TR', 'TO', 'TP', 'TN', 'TV', 'TS', 'UD', 'VA', 'VE', 'VB',
    'VC', 'VR', 'VV', 'VI', 'VT',
  ];

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome punto vendita obbligatorio';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Codice obbligatorio';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Indirizzo obbligatorio';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'Città obbligatoria';
    }
    if (!formData.province.trim()) {
      newErrors.province = 'Provincia obbligatoria';
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'CAP obbligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Trova lo store esistente per preservare date
    const existingStore = isEditing && id ? stores.find((s) => s.id === id) : null;

    const storeData: Store = {
      id: isEditing ? id! : `store-${Date.now()}`,
      businessId: existingStore?.businessId || 'bus-1', // Mock - verrebbe dal contesto
      name: formData.name,
      code: formData.code,
      address: formData.address,
      city: formData.city,
      province: formData.province,
      postalCode: formData.postalCode,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      sector: formData.sector,
      active: formData.active,
      createdAt: existingStore?.createdAt || new Date(),
      openingHours: {
        monday: { open: formData.mondayOpen, close: formData.mondayClose, closed: formData.mondayClosed },
        tuesday: { open: formData.tuesdayOpen, close: formData.tuesdayClose, closed: formData.tuesdayClosed },
        wednesday: { open: formData.wednesdayOpen, close: formData.wednesdayClose, closed: formData.wednesdayClosed },
        thursday: { open: formData.thursdayOpen, close: formData.thursdayClose, closed: formData.thursdayClosed },
        friday: { open: formData.fridayOpen, close: formData.fridayClose, closed: formData.fridayClosed },
        saturday: { open: formData.saturdayOpen, close: formData.saturdayClose, closed: formData.saturdayClosed },
        sunday: { open: formData.sundayOpen, close: formData.sundayClose, closed: formData.sundayClosed },
      },
      cashRegisterCode: formData.cashRegisterCode || undefined,
      fiscalPrinterSerial: formData.fiscalPrinterSerial || undefined,
    };

    // Salva nel store
    if (isEditing) {
      updateStore(storeData);
    } else {
      addStore(storeData);
    }

    alert(`Punto vendita ${isEditing ? 'aggiornato' : 'creato'} con successo!`);
    navigate('/business');
  };

  const copyHours = (sourceDay: string) => {
    const open = formData[`${sourceDay}Open` as keyof typeof formData] as string;
    const close = formData[`${sourceDay}Close` as keyof typeof formData] as string;
    const closed = formData[`${sourceDay}Closed` as keyof typeof formData] as boolean;

    setFormData({
      ...formData,
      mondayOpen: open,
      mondayClose: close,
      mondayClosed: closed,
      tuesdayOpen: open,
      tuesdayClose: close,
      tuesdayClosed: closed,
      wednesdayOpen: open,
      wednesdayClose: close,
      wednesdayClosed: closed,
      thursdayOpen: open,
      thursdayClose: close,
      thursdayClosed: closed,
      fridayOpen: open,
      fridayClose: close,
      fridayClosed: closed,
      saturdayOpen: open,
      saturdayClose: close,
      saturdayClosed: closed,
      sundayOpen: open,
      sundayClose: close,
      sundayClosed: closed,
    });
  };

  const days = [
    { key: 'monday', label: 'Lunedì' },
    { key: 'tuesday', label: 'Martedì' },
    { key: 'wednesday', label: 'Mercoledì' },
    { key: 'thursday', label: 'Giovedì' },
    { key: 'friday', label: 'Venerdì' },
    { key: 'saturday', label: 'Sabato' },
    { key: 'sunday', label: 'Domenica' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/business')}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">
              {isEditing ? 'Modifica Punto Vendita' : 'Nuovo Punto Vendita'}
            </h1>
            <p className="text-blue-100">
              {isEditing ? 'Aggiorna i dati del negozio' : 'Crea un nuovo punto vendita'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          {/* Dati Generali */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <StoreIcon className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Dati Generali</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Punto Vendita *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Milano Centro"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Codice *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
                    errors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="MI-001"
                />
                {errors.code && <p className="text-red-600 text-sm mt-1">{errors.code}</p>}
              </div>
            </div>
          </div>

          {/* Settore Merceologico */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <ShoppingBag className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Settore Merceologico</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sectors.map((sector) => {
                const Icon = sector.icon;
                return (
                  <div
                    key={sector.id}
                    onClick={() => setFormData({ ...formData, sector: sector.id as BusinessSector })}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all text-center ${
                      formData.sector === sector.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <div className={`w-12 h-12 ${sector.bgColor} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <Icon className={`w-6 h-6 ${sector.color}`} />
                    </div>
                    <p className="font-semibold text-sm">{sector.name}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Indirizzo */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Indirizzo</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Via/Piazza *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Via Montenapoleone 1"
                />
                {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Città *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Milano"
                  />
                  {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Provincia *
                  </label>
                  <select
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.province ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Seleziona</option>
                    {provinces.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                  {errors.province && <p className="text-red-600 text-sm mt-1">{errors.province}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CAP *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    maxLength={5}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="20121"
                  />
                  {errors.postalCode && (
                    <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contatti */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <Phone className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Contatti</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+39 02 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="milano@negozio.it"
                />
              </div>
            </div>
          </div>

          {/* Orari di Apertura */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Orari di Apertura</h2>
              </div>
              <button
                type="button"
                onClick={() => copyHours('monday')}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
              >
                Copia Lunedì a tutti
              </button>
            </div>

            <div className="space-y-3">
              {days.map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-24 font-semibold text-gray-700">{day.label}</div>
                  <input
                    type="checkbox"
                    checked={!formData[`${day.key}Closed` as keyof typeof formData] as boolean}
                    onChange={(e) =>
                      setFormData({ ...formData, [`${day.key}Closed`]: !e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-600">Aperto</span>
                  <input
                    type="time"
                    value={formData[`${day.key}Open` as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [`${day.key}Open`]: e.target.value })}
                    disabled={formData[`${day.key}Closed` as keyof typeof formData] as boolean}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="time"
                    value={formData[`${day.key}Close` as keyof typeof formData] as string}
                    onChange={(e) => setFormData({ ...formData, [`${day.key}Close`]: e.target.value })}
                    disabled={formData[`${day.key}Closed` as keyof typeof formData] as boolean}
                    className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dati Fiscali */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <AlertCircle className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Dati Fiscali (Opzionali)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Codice Registratore di Cassa
                </label>
                <input
                  type="text"
                  value={formData.cashRegisterCode}
                  onChange={(e) => setFormData({ ...formData, cashRegisterCode: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="CR-MI-001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Matricola Stampante Fiscale
                </label>
                <input
                  type="text"
                  value={formData.fiscalPrinterSerial}
                  onChange={(e) => setFormData({ ...formData, fiscalPrinterSerial: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="FP12345678"
                />
              </div>
            </div>
          </div>

          {/* Stato */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Stato Punto Vendita</h3>
                <p className="text-sm text-gray-600">Attiva o disattiva il punto vendita</p>
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
              onClick={() => navigate('/business')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-lg transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center"
            >
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? 'Salva Modifiche' : 'Crea Punto Vendita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;

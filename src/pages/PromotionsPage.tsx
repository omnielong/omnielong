import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Save,
  X,
  Percent,
  Euro,
  Calendar,
  Gift,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { Discount } from '../types';

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { discounts, setDiscounts } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Discount | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'percentage' as 'percentage' | 'fixed' | 'coupon',
    value: 0,
    description: '',
    couponCode: '',
    validFrom: '',
    validUntil: '',
    minPurchase: 0,
    maxUses: undefined as number | undefined,
    active: true,
  });

  const filteredPromotions = discounts.filter((promo) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      promo.name.toLowerCase().includes(query) ||
      promo.description?.toLowerCase().includes(query) ||
      promo.couponCode?.toLowerCase().includes(query)
    );
  });

  const handleOpenModal = (promotion?: Discount) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        name: promotion.name,
        type: promotion.type,
        value: promotion.value,
        description: promotion.description || '',
        couponCode: promotion.couponCode || '',
        validFrom: promotion.validFrom ? new Date(promotion.validFrom).toISOString().split('T')[0] : '',
        validUntil: promotion.validUntil ? new Date(promotion.validUntil).toISOString().split('T')[0] : '',
        minPurchase: promotion.minPurchase || 0,
        maxUses: promotion.maxUses,
        active: promotion.active !== false,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        name: '',
        type: 'percentage',
        value: 0,
        description: '',
        couponCode: '',
        validFrom: '',
        validUntil: '',
        minPurchase: 0,
        maxUses: undefined,
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPromotion(null);
  };

  const handleSave = () => {
    const newPromotion: Discount = {
      id: editingPromotion?.id || `promo-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      value: formData.value,
      description: formData.description || undefined,
      couponCode: formData.couponCode || undefined,
      validFrom: formData.validFrom ? new Date(formData.validFrom) : undefined,
      validUntil: formData.validUntil ? new Date(formData.validUntil) : undefined,
      minPurchase: formData.minPurchase || undefined,
      maxUses: formData.maxUses,
      usedCount: editingPromotion?.usedCount || 0,
      active: formData.active,
    };

    if (editingPromotion) {
      setDiscounts(discounts.map((d) => (d.id === editingPromotion.id ? newPromotion : d)));
    } else {
      setDiscounts([...discounts, newPromotion]);
    }

    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Sei sicuro di voler eliminare questa promozione?')) {
      setDiscounts(discounts.filter((d) => d.id !== id));
    }
  };

  const handleToggleActive = (promotion: Discount) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === promotion.id ? { ...d, active: !d.active } : d
      )
    );
  };

  const getTypeIcon = (type: Discount['type']) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed':
        return <Euro className="w-4 h-4" />;
      case 'coupon':
        return <Gift className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: Discount['type']) => {
    switch (type) {
      case 'percentage':
        return 'Percentuale';
      case 'fixed':
        return 'Sconto Fisso';
      case 'coupon':
        return 'Coupon';
    }
  };

  const getTypeColor = (type: Discount['type']) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      case 'coupon':
        return 'bg-purple-100 text-purple-800';
    }
  };

  const isExpired = (promo: Discount) => {
    if (!promo.validUntil) return false;
    return new Date(promo.validUntil) < new Date();
  };

  const isMaxUsesReached = (promo: Discount) => {
    if (!promo.maxUses) return false;
    return (promo.usedCount || 0) >= promo.maxUses;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/pos')}
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Promozioni e Sconti</h1>
              <p className="text-yellow-100">Gestisci sconti, coupon e promozioni</p>
            </div>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-white text-yellow-600 hover:bg-yellow-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuova Promozione
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-yellow-100 text-sm mb-1">Totale Promozioni</p>
            <p className="text-3xl font-bold">{discounts.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-yellow-100 text-sm mb-1">Attive</p>
            <p className="text-3xl font-bold">
              {discounts.filter(d => d.active && !isExpired(d)).length}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-yellow-100 text-sm mb-1">Scadute</p>
            <p className="text-3xl font-bold">
              {discounts.filter(d => isExpired(d)).length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca promozioni per nome, descrizione o codice coupon..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPromotions.map((promo) => {
            const expired = isExpired(promo);
            const maxUsed = isMaxUsesReached(promo);
            const inactive = !promo.active || expired || maxUsed;

            return (
              <div
                key={promo.id}
                className={`bg-white rounded-xl border-2 p-5 transition-all ${
                  inactive
                    ? 'border-gray-200 opacity-60'
                    : 'border-blue-200 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`${getTypeColor(promo.type)} px-3 py-1 rounded-full text-xs font-bold flex items-center`}>
                        {getTypeIcon(promo.type)}
                        <span className="ml-1">{getTypeLabel(promo.type)}</span>
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{promo.name}</h3>
                    {promo.description && (
                      <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                    )}
                  </div>
                </div>

                {/* Value */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {promo.type === 'percentage' ? `${promo.value}%` : `€${promo.value.toFixed(2)}`}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {promo.type === 'percentage' ? 'di sconto' : 'sconto fisso'}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-4">
                  {promo.couponCode && (
                    <div className="flex items-center text-gray-700">
                      <Gift className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="font-mono font-bold">{promo.couponCode}</span>
                    </div>
                  )}
                  {promo.minPurchase && (
                    <div className="flex items-center text-gray-700">
                      <Euro className="w-4 h-4 mr-2 text-green-600" />
                      Min. acquisto: €{promo.minPurchase.toFixed(2)}
                    </div>
                  )}
                  {promo.validFrom && (
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Da: {new Date(promo.validFrom).toLocaleDateString('it-IT')}
                    </div>
                  )}
                  {promo.validUntil && (
                    <div className={`flex items-center ${expired ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Fino: {new Date(promo.validUntil).toLocaleDateString('it-IT')}
                      {expired && <span className="ml-2 text-xs">(Scaduto)</span>}
                    </div>
                  )}
                  {promo.maxUses && (
                    <div className={`flex items-center ${maxUsed ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                      <Tag className="w-4 h-4 mr-2" />
                      Utilizzi: {promo.usedCount || 0} / {promo.maxUses}
                      {maxUsed && <span className="ml-2 text-xs">(Esaurito)</span>}
                    </div>
                  )}
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggleActive(promo)}
                      disabled={expired || maxUsed}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        promo.active && !expired && !maxUsed ? 'bg-blue-600' : 'bg-gray-300'
                      } ${expired || maxUsed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          promo.active && !expired && !maxUsed ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-2 text-xs font-semibold text-gray-600">
                      {inactive ? 'Inattiva' : 'Attiva'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(promo)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifica"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'Nessuna promozione trovata' : 'Nessuna promozione'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Prova con termini di ricerca diversi'
                : 'Crea la tua prima promozione per iniziare'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crea Promozione
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingPromotion ? 'Modifica Promozione' : 'Nuova Promozione'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Promozione *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="es. Sconto Black Friday"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Tipo e Valore */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo Sconto *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="percentage">Percentuale (%)</option>
                    <option value="fixed">Sconto Fisso (€)</option>
                    <option value="coupon">Coupon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valore *
                  </label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                    placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    min="0"
                    max={formData.type === 'percentage' ? '100' : undefined}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Descrizione */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrizione
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrizione della promozione..."
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Codice Coupon */}
              {formData.type === 'coupon' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Codice Coupon *
                  </label>
                  <input
                    type="text"
                    value={formData.couponCode}
                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value.toUpperCase() })}
                    placeholder="SUMMER2024"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                    required
                  />
                </div>
              )}

              {/* Validità */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valido Da
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valido Fino
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Minimo e Massimo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Acquisto Minimo (€)
                  </label>
                  <input
                    type="number"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Utilizzi Massimi
                  </label>
                  <input
                    type="number"
                    value={formData.maxUses || ''}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Illimitati"
                    min="1"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Attiva */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-semibold text-gray-700">
                  Promozione attiva
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name || formData.value <= 0 || (formData.type === 'coupon' && !formData.couponCode)}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {editingPromotion ? 'Salva Modifiche' : 'Crea Promozione'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;

import React, { useState, useMemo } from 'react';
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
  Package,
  Clock,
  ShoppingCart,
  TrendingUp,
  Users,
  Star,
  Layers,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { Discount, DiscountType } from '../types';

const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { discounts, setDiscounts, categories, products } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<DiscountType | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Discount | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Discount>>({
    name: '',
    type: 'percentage',
    value: 0,
    description: '',
    couponCode: '',
    validFrom: undefined,
    validUntil: undefined,
    minPurchase: 0,
    maxUses: undefined,
    active: true,
    buyQuantity: 3,
    getQuantity: 1,
    bundleProductIds: [],
    bundlePrice: 0,
    progressiveTiers: [],
    secondItemDiscount: 50,
    categoryIds: [],
    timeRanges: [],
    validDays: [],
    minQuantity: 1,
    productIds: [],
    excludeProductIds: [],
    excludeCategoryIds: [],
    loyaltyOnly: false,
    minLoyaltyLevel: undefined,
    combinable: false,
    priority: 0,
  });

  const filteredPromotions = useMemo(() => {
    return discounts.filter((promo) => {
      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          promo.name.toLowerCase().includes(query) ||
          promo.description?.toLowerCase().includes(query) ||
          promo.couponCode?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Filter by type
      if (filterType !== 'all' && promo.type !== filterType) {
        return false;
      }

      return true;
    });
  }, [discounts, searchQuery, filterType]);

  const handleOpenModal = (promotion?: Discount) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        ...promotion,
        validFrom: promotion.validFrom,
        validUntil: promotion.validUntil,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        name: '',
        type: 'percentage',
        value: 0,
        description: '',
        couponCode: '',
        validFrom: undefined,
        validUntil: undefined,
        minPurchase: 0,
        maxUses: undefined,
        active: true,
        buyQuantity: 3,
        getQuantity: 1,
        bundleProductIds: [],
        bundlePrice: 0,
        progressiveTiers: [],
        secondItemDiscount: 50,
        categoryIds: [],
        timeRanges: [],
        validDays: [],
        minQuantity: 1,
        productIds: [],
        excludeProductIds: [],
        excludeCategoryIds: [],
        loyaltyOnly: false,
        minLoyaltyLevel: undefined,
        combinable: false,
        priority: 0,
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
      name: formData.name!,
      type: formData.type!,
      value: formData.value!,
      description: formData.description,
      couponCode: formData.couponCode,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      minPurchase: formData.minPurchase,
      maxUses: formData.maxUses,
      usedCount: editingPromotion?.usedCount || 0,
      active: formData.active,
      buyQuantity: formData.buyQuantity,
      getQuantity: formData.getQuantity,
      bundleProductIds: formData.bundleProductIds,
      bundlePrice: formData.bundlePrice,
      progressiveTiers: formData.progressiveTiers,
      secondItemDiscount: formData.secondItemDiscount,
      categoryIds: formData.categoryIds,
      timeRanges: formData.timeRanges,
      validDays: formData.validDays,
      minQuantity: formData.minQuantity,
      productIds: formData.productIds,
      excludeProductIds: formData.excludeProductIds,
      excludeCategoryIds: formData.excludeCategoryIds,
      loyaltyOnly: formData.loyaltyOnly,
      minLoyaltyLevel: formData.minLoyaltyLevel,
      combinable: formData.combinable,
      priority: formData.priority,
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
    const expired = isExpired(promotion);
    const maxUsed = isMaxUsesReached(promotion);
    if (expired || maxUsed) return;

    setDiscounts(
      discounts.map((d) =>
        d.id === promotion.id ? { ...d, active: !d.active } : d
      )
    );
  };

  const getTypeIcon = (type: DiscountType) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed':
        return <Euro className="w-4 h-4" />;
      case 'coupon':
        return <Gift className="w-4 h-4" />;
      case 'buy_x_get_y':
        return <Package className="w-4 h-4" />;
      case 'bundle':
        return <Layers className="w-4 h-4" />;
      case 'progressive':
        return <TrendingUp className="w-4 h-4" />;
      case 'second_item':
        return <ShoppingCart className="w-4 h-4" />;
      case 'category':
        return <Tag className="w-4 h-4" />;
      case 'happy_hour':
        return <Clock className="w-4 h-4" />;
      case 'quantity':
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: DiscountType) => {
    switch (type) {
      case 'percentage':
        return 'Percentuale';
      case 'fixed':
        return 'Sconto Fisso';
      case 'coupon':
        return 'Coupon';
      case 'buy_x_get_y':
        return '3x2 / NxM';
      case 'bundle':
        return 'Bundle';
      case 'progressive':
        return 'Progressivo';
      case 'second_item':
        return '2ª Unità';
      case 'category':
        return 'Categoria';
      case 'happy_hour':
        return 'Happy Hour';
      case 'quantity':
        return 'Quantità';
    }
  };

  const getTypeColor = (type: DiscountType) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'fixed':
        return 'bg-green-100 text-green-800';
      case 'coupon':
        return 'bg-purple-100 text-purple-800';
      case 'buy_x_get_y':
        return 'bg-orange-100 text-orange-800';
      case 'bundle':
        return 'bg-pink-100 text-pink-800';
      case 'progressive':
        return 'bg-indigo-100 text-indigo-800';
      case 'second_item':
        return 'bg-teal-100 text-teal-800';
      case 'category':
        return 'bg-yellow-100 text-yellow-800';
      case 'happy_hour':
        return 'bg-cyan-100 text-cyan-800';
      case 'quantity':
        return 'bg-red-100 text-red-800';
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

  const getPromotionDescription = (promo: Discount) => {
    switch (promo.type) {
      case 'percentage':
        return `${promo.value}% di sconto`;
      case 'fixed':
        return `€${promo.value.toFixed(2)} di sconto`;
      case 'buy_x_get_y':
        return `Compra ${promo.buyQuantity} e prendi ${promo.getQuantity} gratis`;
      case 'bundle':
        return `Bundle ${promo.bundleProductIds?.length || 0} prodotti a €${promo.bundlePrice?.toFixed(2)}`;
      case 'progressive':
        return `Sconti progressivi per fasce di spesa`;
      case 'second_item':
        return `Seconda unità -${promo.secondItemDiscount}%`;
      case 'category':
        return `${promo.value}% su categorie selezionate`;
      case 'happy_hour':
        return `${promo.value}% nelle fasce orarie`;
      case 'quantity':
        return `${promo.value}% comprando min. ${promo.minQuantity} articoli`;
      case 'coupon':
        return `Codice: ${promo.couponCode}`;
      default:
        return promo.description || '';
    }
  };

  const stats = useMemo(() => {
    const active = discounts.filter(d => d.active && !isExpired(d) && !isMaxUsesReached(d)).length;
    const expired = discounts.filter(d => isExpired(d)).length;
    const maxUsed = discounts.filter(d => isMaxUsesReached(d)).length;
    const inactive = discounts.filter(d => !d.active && !isExpired(d) && !isMaxUsesReached(d)).length;
    const combinable = discounts.filter(d => d.combinable).length;
    const loyaltyOnly = discounts.filter(d => d.loyaltyOnly).length;

    return { active, expired, maxUsed, inactive, combinable, loyaltyOnly };
  }, [discounts]);

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

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
              <h1 className="text-2xl font-bold">Promozioni Avanzate</h1>
              <p className="text-yellow-100">Gestisci sconti, 3x2, bundle, happy hour e altro</p>
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-yellow-100 text-xs mb-1">Totale</p>
            <p className="text-2xl font-bold">{discounts.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-yellow-100 text-xs mb-1">Attive</p>
            <p className="text-2xl font-bold text-green-200">{stats.active}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-yellow-100 text-xs mb-1">Scadute</p>
            <p className="text-2xl font-bold text-red-200">{stats.expired}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-yellow-100 text-xs mb-1">Esaurite</p>
            <p className="text-2xl font-bold text-red-200">{stats.maxUsed}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-yellow-100 text-xs mb-1">Combinabili</p>
            <p className="text-2xl font-bold">{stats.combinable}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
            <p className="text-yellow-100 text-xs mb-1">Solo VIP</p>
            <p className="text-2xl font-bold">{stats.loyaltyOnly}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca promozioni per nome, descrizione o codice..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as DiscountType | 'all')}
            className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-w-[200px]"
          >
            <option value="all">Tutti i tipi</option>
            <option value="percentage">Percentuale</option>
            <option value="fixed">Sconto Fisso</option>
            <option value="coupon">Coupon</option>
            <option value="buy_x_get_y">3x2 / NxM</option>
            <option value="bundle">Bundle</option>
            <option value="progressive">Progressivo</option>
            <option value="second_item">2ª Unità</option>
            <option value="category">Categoria</option>
            <option value="happy_hour">Happy Hour</option>
            <option value="quantity">Quantità</option>
          </select>
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
                    : 'border-yellow-200 hover:border-yellow-400 hover:shadow-lg'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`${getTypeColor(promo.type)} px-3 py-1 rounded-full text-xs font-bold flex items-center`}>
                        {getTypeIcon(promo.type)}
                        <span className="ml-1">{getTypeLabel(promo.type)}</span>
                      </span>
                      {promo.combinable && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-bold">
                          Combinabile
                        </span>
                      )}
                      {promo.loyaltyOnly && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          VIP
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{promo.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{getPromotionDescription(promo)}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 mb-3">
                  <div className="space-y-1 text-xs text-gray-700">
                    {promo.minPurchase && promo.minPurchase > 0 && (
                      <div className="flex items-center">
                        <Euro className="w-3 h-3 mr-1 text-green-600" />
                        Min. acquisto: €{promo.minPurchase.toFixed(2)}
                      </div>
                    )}
                    {promo.minQuantity && promo.minQuantity > 1 && (
                      <div className="flex items-center">
                        <ShoppingCart className="w-3 h-3 mr-1 text-blue-600" />
                        Min. quantità: {promo.minQuantity}
                      </div>
                    )}
                    {promo.validDays && promo.validDays.length > 0 && (
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-purple-600" />
                        {promo.validDays.map(d => dayNames[d]).join(', ')}
                      </div>
                    )}
                    {promo.timeRanges && promo.timeRanges.length > 0 && (
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-cyan-600" />
                        {promo.timeRanges.map(tr => `${tr.startTime}-${tr.endTime}`).join(', ')}
                      </div>
                    )}
                    {promo.categoryIds && promo.categoryIds.length > 0 && (
                      <div className="flex items-center">
                        <Tag className="w-3 h-3 mr-1 text-yellow-600" />
                        {promo.categoryIds.length} categorie
                      </div>
                    )}
                    {promo.productIds && promo.productIds.length > 0 && (
                      <div className="flex items-center">
                        <Package className="w-3 h-3 mr-1 text-pink-600" />
                        {promo.productIds.length} prodotti
                      </div>
                    )}
                    {promo.priority !== undefined && promo.priority > 0 && (
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-indigo-600" />
                        Priorità: {promo.priority}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dates and Uses */}
                <div className="space-y-1 text-xs mb-3">
                  {promo.validFrom && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-3 h-3 mr-1" />
                      Da: {new Date(promo.validFrom).toLocaleDateString('it-IT')}
                    </div>
                  )}
                  {promo.validUntil && (
                    <div className={`flex items-center ${expired ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      Fino: {new Date(promo.validUntil).toLocaleDateString('it-IT')}
                      {expired && <span className="ml-1">(Scaduto)</span>}
                    </div>
                  )}
                  {promo.maxUses && (
                    <div className={`flex items-center ${maxUsed ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      <Users className="w-3 h-3 mr-1" />
                      Utilizzi: {promo.usedCount || 0} / {promo.maxUses}
                      {maxUsed && <span className="ml-1">(Esaurito)</span>}
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
                        promo.active && !expired && !maxUsed ? 'bg-green-600' : 'bg-gray-300'
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
                      className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                      title="Modifica"
                    >
                      <Edit2 className="w-4 h-4 text-yellow-600" />
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
              {searchQuery || filterType !== 'all' ? 'Nessuna promozione trovata' : 'Nessuna promozione'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterType !== 'all'
                ? 'Prova con altri criteri di ricerca'
                : 'Crea la tua prima promozione per iniziare'}
            </p>
            {!searchQuery && filterType === 'all' && (
              <button
                onClick={() => handleOpenModal()}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center transition-colors"
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
        <PromotionModal
          editing={editingPromotion}
          formData={formData}
          setFormData={setFormData}
          onClose={handleCloseModal}
          onSave={handleSave}
          categories={categories}
          products={products}
        />
      )}
    </div>
  );
};

// Componente Modal separato per gestire il form complesso
interface PromotionModalProps {
  editing: Discount | null;
  formData: Partial<Discount>;
  setFormData: (data: Partial<Discount>) => void;
  onClose: () => void;
  onSave: () => void;
  categories: any[];
  products: any[];
}

const PromotionModal: React.FC<PromotionModalProps> = ({
  editing,
  formData,
  setFormData,
  onClose,
  onSave,
  categories,
  // products, // Per futura selezione prodotti nel bundle
}) => {
  const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

  const toggleDay = (day: number) => {
    const days = formData.validDays || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day].sort((a, b) => a - b);
    setFormData({ ...formData, validDays: newDays });
  };

  const addTimeRange = () => {
    const ranges = formData.timeRanges || [];
    setFormData({
      ...formData,
      timeRanges: [...ranges, { startTime: '09:00', endTime: '18:00' }]
    });
  };

  const removeTimeRange = (index: number) => {
    const ranges = formData.timeRanges || [];
    setFormData({
      ...formData,
      timeRanges: ranges.filter((_, i) => i !== index)
    });
  };

  const updateTimeRange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const ranges = formData.timeRanges || [];
    const newRanges = [...ranges];
    newRanges[index] = { ...newRanges[index], [field]: value };
    setFormData({ ...formData, timeRanges: newRanges });
  };

  const addProgressiveTier = () => {
    const tiers = formData.progressiveTiers || [];
    setFormData({
      ...formData,
      progressiveTiers: [...tiers, { minSpend: 0, discount: 0 }]
    });
  };

  const removeProgressiveTier = (index: number) => {
    const tiers = formData.progressiveTiers || [];
    setFormData({
      ...formData,
      progressiveTiers: tiers.filter((_, i) => i !== index)
    });
  };

  const updateProgressiveTier = (index: number, field: 'minSpend' | 'discount', value: number) => {
    const tiers = formData.progressiveTiers || [];
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setFormData({ ...formData, progressiveTiers: newTiers });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl my-8 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {editing ? 'Modifica Promozione' : 'Nuova Promozione'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Nome e Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Promozione *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="es. Black Friday 2024"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo Promozione *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DiscountType })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="percentage">Sconto Percentuale</option>
                <option value="fixed">Sconto Fisso (€)</option>
                <option value="coupon">Coupon/Codice</option>
                <option value="buy_x_get_y">3x2 / Compra N Prendi M</option>
                <option value="bundle">Bundle Prodotti</option>
                <option value="progressive">Sconti Progressivi</option>
                <option value="second_item">Seconda Unità Scontata</option>
                <option value="category">Sconto per Categoria</option>
                <option value="happy_hour">Happy Hour (Fasce Orarie)</option>
                <option value="quantity">Sconto per Quantità</option>
              </select>
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
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Campi specifici per tipo */}
          {(formData.type === 'percentage' || formData.type === 'fixed' || formData.type === 'coupon' || formData.type === 'category' || formData.type === 'happy_hour' || formData.type === 'quantity') && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valore Sconto * {formData.type === 'percentage' || formData.type === 'category' || formData.type === 'happy_hour' || formData.type === 'quantity' ? '(%)' : '(€)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                placeholder={formData.type === 'percentage' || formData.type === 'category' || formData.type === 'happy_hour' || formData.type === 'quantity' ? '10' : '5.00'}
                step={formData.type === 'percentage' || formData.type === 'category' || formData.type === 'happy_hour' || formData.type === 'quantity' ? '1' : '0.01'}
                min="0"
                max={formData.type === 'percentage' || formData.type === 'category' || formData.type === 'happy_hour' || formData.type === 'quantity' ? '100' : undefined}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
          )}

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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 font-mono font-bold"
                required
              />
            </div>
          )}

          {/* 3x2 / NxM */}
          {formData.type === 'buy_x_get_y' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Compra (N) *
                </label>
                <input
                  type="number"
                  value={formData.buyQuantity}
                  onChange={(e) => setFormData({ ...formData, buyQuantity: parseInt(e.target.value) || 3 })}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prendi Gratis (M) *
                </label>
                <input
                  type="number"
                  value={formData.getQuantity}
                  onChange={(e) => setFormData({ ...formData, getQuantity: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          )}

          {/* Bundle */}
          {formData.type === 'bundle' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prezzo Bundle (€) *
              </label>
              <input
                type="number"
                value={formData.bundlePrice}
                onChange={(e) => setFormData({ ...formData, bundlePrice: parseFloat(e.target.value) || 0 })}
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">Seleziona i prodotti del bundle nella sezione "Prodotti Specifici" sotto</p>
            </div>
          )}

          {/* Sconti Progressivi */}
          {formData.type === 'progressive' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fasce di Spesa
              </label>
              {formData.progressiveTiers && formData.progressiveTiers.map((tier, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="number"
                    value={tier.minSpend}
                    onChange={(e) => updateProgressiveTier(index, 'minSpend', parseFloat(e.target.value) || 0)}
                    placeholder="Min. spesa (€)"
                    step="0.01"
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    value={tier.discount}
                    onChange={(e) => updateProgressiveTier(index, 'discount', parseFloat(e.target.value) || 0)}
                    placeholder="Sconto (%)"
                    max="100"
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={() => removeProgressiveTier(index)}
                    className="px-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addProgressiveTier}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                + Aggiungi Fascia
              </button>
            </div>
          )}

          {/* Seconda Unità */}
          {formData.type === 'second_item' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sconto 2ª Unità (%) *
              </label>
              <input
                type="number"
                value={formData.secondItemDiscount}
                onChange={(e) => setFormData({ ...formData, secondItemDiscount: parseFloat(e.target.value) || 50 })}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          )}

          {/* Happy Hour - Fasce Orarie */}
          {formData.type === 'happy_hour' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fasce Orarie
              </label>
              {formData.timeRanges && formData.timeRanges.map((range, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="time"
                    value={range.startTime}
                    onChange={(e) => updateTimeRange(index, 'startTime', e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <span className="flex items-center text-gray-500">-</span>
                  <input
                    type="time"
                    value={range.endTime}
                    onChange={(e) => updateTimeRange(index, 'endTime', e.target.value)}
                    className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={() => removeTimeRange(index)}
                    className="px-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={addTimeRange}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-semibold"
              >
                + Aggiungi Fascia Oraria
              </button>
            </div>
          )}

          {/* Quantità Minima */}
          {formData.type === 'quantity' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantità Minima *
              </label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) || 1 })}
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          )}

          {/* Categorie (per tipo category o filtri) */}
          {(formData.type === 'category' || true) && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categorie {formData.type === 'category' ? '(richiesto)' : '(opzionale)'}
              </label>
              <select
                multiple
                value={formData.categoryIds || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, categoryIds: selected });
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                size={4}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Tieni premuto Ctrl/Cmd per selezionare multiple</p>
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
                value={formData.validFrom ? new Date(formData.validFrom).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Valido Fino
              </label>
              <input
                type="date"
                value={formData.validUntil ? new Date(formData.validUntil).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value ? new Date(e.target.value) : undefined })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Giorni della Settimana */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Giorni Validi (opzionale)
            </label>
            <div className="flex flex-wrap gap-2">
              {dayNames.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    formData.validDays?.includes(index)
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>

          {/* Opzioni Avanzate */}
          <div className="space-y-3 border-t pt-4">
            <h4 className="font-bold text-gray-900">Opzioni Avanzate</h4>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.loyaltyOnly}
                onChange={(e) => setFormData({ ...formData, loyaltyOnly: e.target.checked })}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label className="ml-2 text-sm font-semibold text-gray-700">
                Solo per clienti con Carta Fedeltà
              </label>
            </div>

            {formData.loyaltyOnly && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Livello Minimo Richiesto
                </label>
                <select
                  value={formData.minLoyaltyLevel || ''}
                  onChange={(e) => setFormData({ ...formData, minLoyaltyLevel: e.target.value as any || undefined })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Qualsiasi</option>
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.combinable}
                onChange={(e) => setFormData({ ...formData, combinable: e.target.checked })}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label className="ml-2 text-sm font-semibold text-gray-700">
                Combinabile con altre promozioni
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priorità (0-100)
              </label>
              <input
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                min="0"
                max="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-xs text-gray-500 mt-1">Priorità più alta viene applicata per prima</p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label className="ml-2 text-sm font-semibold text-gray-700">
                Promozione attiva
              </label>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={onSave}
            disabled={!formData.name || (formData.type === 'coupon' && !formData.couponCode)}
            className="flex-1 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
          >
            <Save className="w-5 h-5 mr-2" />
            {editing ? 'Salva Modifiche' : 'Crea Promozione'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;

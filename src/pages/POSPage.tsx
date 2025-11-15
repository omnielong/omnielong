import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Search,
  Package,
  LogOut,
  User,
  BarChart3,
  Clock,
  Settings,
  Users as CustomersIcon,
  Coffee,
  Grid3x3,
  Tag,
  Menu,
  RotateCcw,
  UserCog,
  ClipboardCheck,
  Database,
  Eye,
  AlertCircle,
} from 'lucide-react';
import useStore from '../store/useStore';
import { mockProducts, mockCategories, mockDiscounts, mockLoyaltyCards } from '../utils/mockData';
import { barProducts, quickButtons as barQuickButtons } from '../utils/barMockData';
import { fashionProducts } from '../utils/fashionMockData';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import CartModal from '../components/CartModal';
import MobileMenu from '../components/MobileMenu';
import Checkout from '../components/Checkout';
import BarQuickButtons from '../components/BarQuickButtons';
import RestaurantTables from '../components/RestaurantTables';
import { getAccessibleMenuItems, hasPermission } from '../utils/permissions';

const POSPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentOperator,
    currentStore,
    currentShift,
    cart,
    sectorConfig,
    products,
    setProducts,
    setCategories,
    setDiscounts,
    setLoyaltyCards,
    setQuickButtons,
    logout,
  } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [barViewMode, setBarViewMode] = useState<'quick' | 'all'>('quick');

  // Ottieni i menu accessibili basati sui permessi dell'operatore
  const accessibleMenuItems = currentOperator ? getAccessibleMenuItems(currentOperator) : [];

  // Verifica se l'operatore può vendere (non è un viewer)
  const canSell = currentOperator ? hasPermission(currentOperator, 'canSell') : false;
  const isViewer = currentOperator && (currentOperator.role === 'reseller_viewer' || currentOperator.role === 'business_viewer');

  useEffect(() => {
    if (!currentOperator) {
      navigate('/');
      return;
    }

    if (!currentShift || currentShift.status === 'closed') {
      navigate('/shift');
      return;
    }

    // Initialize data based on sector
    if (products.length === 0) {
      if (sectorConfig?.sector === 'bar') {
        // Initialize bar products and quick buttons
        setProducts([...mockProducts, ...barProducts]);
        setQuickButtons(barQuickButtons);
      } else if (sectorConfig?.sector === 'fashion') {
        // Initialize fashion products with variants
        setProducts([...mockProducts, ...fashionProducts]);
      } else {
        // Initialize generic products
        setProducts(mockProducts);
      }
    }

    setCategories(mockCategories);
    setDiscounts(mockDiscounts);
    setLoyaltyCards(mockLoyaltyCards);
  }, [currentOperator, currentShift, navigate, sectorConfig, products.length, setProducts, setCategories, setDiscounts, setLoyaltyCards, setQuickButtons]);

  const handleLogout = () => {
    if (cart.length > 0) {
      if (!confirm('Hai articoli nel carrello. Vuoi davvero uscire?')) {
        return;
      }
    }
    logout();
    navigate('/');
  };

  const handleCheckout = () => {
    if (!canSell) {
      alert('Non hai i permessi per effettuare vendite. Stai visualizzando il negozio in modalità sola lettura.');
      return;
    }
    if (cart.length === 0) {
      alert('Il carrello è vuoto');
      return;
    }
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckout(false);
  };

  // Mappa delle icone per la sidebar
  const iconComponentMap: { [key: string]: React.ReactNode } = {
    ShoppingCart: <ShoppingCart className="w-6 h-6" />,
    BarChart3: <BarChart3 className="w-6 h-6" />,
    Package: <Package className="w-6 h-6" />,
    Users: <CustomersIcon className="w-6 h-6" />,
    Tag: <Tag className="w-6 h-6" />,
    RotateCcw: <RotateCcw className="w-6 h-6" />,
    UserCog: <UserCog className="w-6 h-6" />,
    FileText: <ClipboardCheck className="w-6 h-6" />,
    Settings: <Settings className="w-6 h-6" />,
    Database: <Database className="w-6 h-6" />,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Dinamica basata sui permessi */}
      <div className="hidden lg:flex lg:flex-col w-20 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="flex-1 flex flex-col items-center py-3 space-y-2 overflow-y-auto">
          {/* Sempre mostra Turno */}
          <button
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors flex-shrink-0"
            onClick={() => navigate('/shift')}
            title="Turno"
          >
            <Clock className="w-6 h-6" />
          </button>

          {/* Menu items basati sui permessi */}
          {accessibleMenuItems.map((item) => (
            <button
              key={item.path}
              className="p-2 hover:bg-blue-500 rounded-lg transition-colors flex-shrink-0"
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              {iconComponentMap[item.icon]}
            </button>
          ))}
        </div>
        <div className="pb-8 flex flex-col items-center space-y-4">
          <div className="p-3 bg-blue-500 rounded-lg" title={currentOperator?.name}>
            <User className="w-6 h-6" />
          </div>
          <button
            onClick={handleLogout}
            className="p-3 hover:bg-red-500 rounded-lg transition-colors"
            title="Esci"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Content Section - Conditional based on sector */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Restaurant Tables View */}
          {sectorConfig?.sector === 'restaurant' ? (
            <RestaurantTables />
          ) : (
            <>
              {/* Header */}
              <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {sectorConfig?.sector === 'bar' ? 'BAR' : 'POS'}
                        </h1>
                        {sectorConfig?.sector && (
                          <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${
                            sectorConfig.sector === 'fashion' ? 'bg-purple-100 text-purple-700' :
                            sectorConfig.sector === 'bar' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {sectorConfig.sector === 'fashion' && '👗 MODA'}
                            {sectorConfig.sector === 'bar' && '☕ BAR'}
                            {sectorConfig.sector === 'generic' && '🏪 GENERICO'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {currentStore && (
                          <span className="font-semibold text-blue-600">
                            {currentStore.name}
                          </span>
                        )}
                        {currentStore && ' • '}
                        {currentOperator?.name} - Turno aperto
                      </p>
                    </div>
                  </div>
                  <div className="lg:hidden flex items-center space-x-2">
                    <button
                      onClick={() => setShowMobileMenu(true)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Menu"
                    >
                      <Menu className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Esci"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cerca prodotti per nome o barcode..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Read-Only Banner for Viewers */}
              {isViewer && (
                <div className="bg-orange-50 border-b-2 border-orange-200 px-4 py-3">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-900 text-sm">
                        {currentOperator.role === 'reseller_viewer'
                          ? 'Modalità Visualizzazione Reseller'
                          : 'Modalità Visualizzazione Business Admin'}
                      </h3>
                      <p className="text-xs text-orange-700">
                        Puoi visualizzare prodotti, clienti e impostazioni, ma non puoi effettuare vendite.
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-orange-600 ml-3 flex-shrink-0" />
                  </div>
                </div>
              )}

              {/* Bar: Toggle between Quick Buttons and All Products */}
              {sectorConfig?.sector === 'bar' && (
                <div className="bg-white border-b border-gray-200 px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setBarViewMode('quick')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors touch-manipulation flex items-center justify-center ${
                        barViewMode === 'quick'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Coffee className="w-4 h-4 mr-2" />
                      Pulsanti Rapidi
                    </button>
                    <button
                      onClick={() => setBarViewMode('all')}
                      className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-colors touch-manipulation flex items-center justify-center ${
                        barViewMode === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      Tutti i Prodotti
                    </button>
                  </div>
                </div>
              )}

              {/* Categories - Only show for non-bar or when in 'all' mode */}
              {(sectorConfig?.sector !== 'bar' || barViewMode === 'all') && (
                <div className="bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors touch-manipulation ${
                        selectedCategory === null
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Tutti
                    </button>
                    {mockCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-colors touch-manipulation ${
                          selectedCategory === category.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Area */}
              <div className="flex-1 overflow-auto p-4 lg:p-6">
                {sectorConfig?.sector === 'bar' && barViewMode === 'quick' ? (
                  <BarQuickButtons />
                ) : (
                  <ProductGrid
                    categoryFilter={selectedCategory}
                    searchQuery={searchQuery}
                  />
                )}
              </div>

              {/* Mobile Cart Button */}
              <div className="lg:hidden bg-white border-t border-gray-200 p-4">
                <button
                  onClick={() => setShowCartModal(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center touch-manipulation"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Carrello ({cart.length})
                </button>
              </div>
            </>
          )}
        </div>

        {/* Cart Section - Desktop (hidden for restaurant) */}
        {sectorConfig?.sector !== 'restaurant' && (
          <div className="hidden lg:flex lg:flex-col w-96 xl:w-[450px] bg-white border-l border-gray-200">
            <Cart onCheckout={handleCheckout} readOnly={!canSell} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        onLogout={handleLogout}
        currentOperator={currentOperator}
      />

      {/* Cart Modal - Mobile */}
      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onCheckout={handleCheckout}
        readOnly={!canSell}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <Checkout onClose={handleCloseCheckout} />
      )}
    </div>
  );
};

export default POSPage;

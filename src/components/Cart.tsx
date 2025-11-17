import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Tag, CreditCard, Percent } from 'lucide-react';
import useStore from '../store/useStore';
import CustomerSearch from './CustomerSearch';
import { mockCustomers } from '../utils/customerMockData';

interface CartProps {
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ onCheckout }) => {
  const {
    cart,
    selectedCustomer,
    setSelectedCustomer,
    removeFromCart,
    updateQuantity,
    applyDiscountToItem,
    globalDiscount,
    applyGlobalDiscount,
    removeGlobalDiscount,
    activeLoyaltyCard,
    applyLoyaltyCard,
    removeLoyaltyCard,
    discounts,
    loyaltyCards,
    getCartSubtotal,
    getTotalDiscount,
    getCartTotal,
  } = useStore();

  const [showDiscountMenu, setShowDiscountMenu] = useState(false);
  const [showLoyaltyMenu, setShowLoyaltyMenu] = useState(false);
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState<string | null>(null);

  const subtotal = getCartSubtotal();
  const totalDiscount = getTotalDiscount();
  const total = getCartTotal();

  const handleApplyItemDiscount = (productId: string, discountId: string) => {
    const discount = discounts.find((d) => d.id === discountId);
    if (discount) {
      applyDiscountToItem(productId, discount);
      setShowDiscountMenu(false);
      setSelectedItemForDiscount(null);
    }
  };

  const handleApplyGlobalDiscount = (discountId: string) => {
    const discount = discounts.find((d) => d.id === discountId);
    if (discount) {
      applyGlobalDiscount(discount);
      setShowDiscountMenu(false);
    }
  };

  const handleApplyLoyaltyCard = (cardNumber: string) => {
    const card = loyaltyCards.find((c) => c.cardNumber === cardNumber);
    if (card) {
      applyLoyaltyCard(card);
      setShowLoyaltyMenu(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 space-y-3">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Carrello
          </h2>
          {/* Ricerca Cliente */}
          <CustomerSearch
            customers={mockCustomers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
          <ShoppingCart className="w-16 h-16 mb-4" />
          <p className="text-lg font-semibold">Carrello vuoto</p>
          <p className="text-sm text-center">Aggiungi prodotti per iniziare una vendita</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <h2 className="text-xl font-bold text-gray-900 flex items-center justify-between">
          <span className="flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Carrello
          </span>
          <span className="text-sm font-normal text-gray-600">
            {cart.length} {cart.length === 1 ? 'articolo' : 'articoli'}
          </span>
        </h2>
        {/* Ricerca Cliente */}
        <CustomerSearch
          customers={mockCustomers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={setSelectedCustomer}
        />
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map((item) => (
          <div key={item.product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.product.name}</h3>
                <p className="text-sm text-gray-600">€{item.product.price.toFixed(2)} cad.</p>
              </div>
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-red-500 hover:text-red-700 p-1 touch-manipulation"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="p-2 hover:bg-gray-100 rounded-l-lg touch-manipulation"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="p-2 hover:bg-gray-100 rounded-r-lg touch-manipulation"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                {item.discount && (
                  <p className="text-xs text-green-600 line-through">€{item.subtotal.toFixed(2)}</p>
                )}
                <p className="text-lg font-bold text-gray-900">
                  €
                  {(
                    item.subtotal -
                    (item.discount
                      ? item.discount.type === 'percentage'
                        ? (item.subtotal * item.discount.value) / 100
                        : item.discount.value
                      : 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>

            {item.discount && (
              <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                <Tag className="w-3 h-3 mr-1" />
                {item.discount.description}
              </div>
            )}

            <button
              onClick={() => {
                setSelectedItemForDiscount(item.product.id);
                setShowDiscountMenu(true);
              }}
              className="mt-2 w-full text-xs text-blue-600 hover:text-blue-700 font-semibold py-1 touch-manipulation"
            >
              <Tag className="w-3 h-3 inline mr-1" />
              Applica sconto
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t border-gray-200 p-4 space-y-3 bg-white">
        {/* Loyalty Card */}
        {activeLoyaltyCard ? (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 text-yellow-700 mr-2" />
                <div>
                  <p className="text-xs font-semibold text-yellow-900">
                    {activeLoyaltyCard.customerName}
                  </p>
                  <p className="text-xs text-yellow-700">
                    {activeLoyaltyCard.cardNumber} - Sconto {activeLoyaltyCard.discount}%
                  </p>
                </div>
              </div>
              <button
                onClick={removeLoyaltyCard}
                className="text-yellow-700 hover:text-yellow-900 touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLoyaltyMenu(true)}
            className="w-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-300 text-yellow-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center touch-manipulation"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Carta Fedeltà
          </button>
        )}

        {/* Global Discount */}
        {globalDiscount ? (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-300 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Percent className="w-4 h-4 text-green-700 mr-2" />
                <div>
                  <p className="text-xs font-semibold text-green-900">
                    {globalDiscount.description}
                  </p>
                  <p className="text-xs text-green-700">
                    {globalDiscount.type === 'percentage'
                      ? `${globalDiscount.value}%`
                      : `€${globalDiscount.value.toFixed(2)}`}
                  </p>
                </div>
              </div>
              <button
                onClick={removeGlobalDiscount}
                className="text-green-700 hover:text-green-900 touch-manipulation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setSelectedItemForDiscount(null);
              setShowDiscountMenu(true);
            }}
            className="w-full bg-green-50 hover:bg-green-100 border border-green-300 text-green-700 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center touch-manipulation"
          >
            <Percent className="w-4 h-4 mr-2" />
            Sconto Globale
          </button>
        )}

        {/* Totals */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotale</span>
            <span className="font-semibold">€{subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Sconto</span>
              <span className="font-semibold">-€{totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
            <span>Totale</span>
            <span className="text-blue-600">€{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl touch-manipulation active:scale-98"
        >
          Procedi al Pagamento
        </button>
      </div>

      {/* Discount Menu Modal */}
      {showDiscountMenu && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end lg:items-center lg:justify-center z-50">
          <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full lg:max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedItemForDiscount ? 'Sconto Articolo' : 'Sconto Globale'}
              </h3>
            </div>
            <div className="p-4 space-y-2">
              {discounts
                .filter((d) => d.active && d.type !== 'coupon')
                .map((discount) => (
                  <button
                    key={discount.id}
                    onClick={() =>
                      selectedItemForDiscount
                        ? handleApplyItemDiscount(selectedItemForDiscount, discount.id)
                        : handleApplyGlobalDiscount(discount.id)
                    }
                    className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors touch-manipulation"
                  >
                    <p className="font-semibold text-gray-900">{discount.description}</p>
                    <p className="text-sm text-gray-600">
                      {discount.type === 'percentage'
                        ? `${discount.value}% di sconto`
                        : `€${discount.value.toFixed(2)} di sconto`}
                    </p>
                  </button>
                ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDiscountMenu(false);
                  setSelectedItemForDiscount(null);
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors touch-manipulation"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loyalty Card Menu Modal */}
      {showLoyaltyMenu && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end lg:items-center lg:justify-center z-50">
          <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full lg:max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Carte Fedeltà</h3>
            </div>
            <div className="p-4 space-y-2">
              {loyaltyCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleApplyLoyaltyCard(card.cardNumber)}
                  className="w-full bg-gradient-to-r from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 border border-yellow-300 rounded-lg p-4 text-left transition-colors touch-manipulation"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{card.customerName}</p>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-semibold">
                      {card.level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{card.cardNumber}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Punti: {card.points}</span>
                    <span className="text-green-600 font-semibold">Sconto {card.discount}%</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowLoyaltyMenu(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-colors touch-manipulation"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

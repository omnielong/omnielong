import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  Receipt as ReceiptIcon,
} from 'lucide-react';
import useStore from '../store/useStore';
import type { PaymentMethod, Sale } from '../types';
import Receipt from './Receipt';

interface CheckoutProps {
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
  const {
    cart,
    currentOperator,
    activeLoyaltyCard,
    globalDiscount,
    getCartSubtotal,
    getTotalDiscount,
    getCartTotal,
    getTaxAmount,
    addSale,
    clearCart,
    updateLoyaltyCard,
  } = useStore();

  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [selectedPaymentType, setSelectedPaymentType] = useState<
    'cash' | 'card' | 'digital' | null
  >(null);
  const [cashAmount, setCashAmount] = useState('');
  const [completed, setCompleted] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const total = getCartTotal();
  const paidAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = Math.max(0, total - paidAmount);
  const change = Math.max(0, paidAmount - total);

  const handleAddPayment = (type: 'cash' | 'card' | 'digital', amount?: number) => {
    const paymentAmount = amount || remainingAmount;

    if (paymentAmount <= 0) return;

    setPayments([...payments, { type, amount: paymentAmount }]);
    setSelectedPaymentType(null);
    setCashAmount('');
  };

  const handleCashPayment = () => {
    const amount = parseFloat(cashAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Inserisci un importo valido');
      return;
    }
    handleAddPayment('cash', amount);
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleCompleteSale = () => {
    if (remainingAmount > 0) {
      alert('Pagamento incompleto');
      return;
    }

    if (!currentOperator) return;

    // Create sale
    const sale: Sale = {
      id: `sale-${Date.now()}`,
      date: new Date(),
      items: cart,
      subtotal: getCartSubtotal(),
      discounts: globalDiscount ? [globalDiscount] : [],
      totalDiscount: getTotalDiscount(),
      taxAmount: getTaxAmount(),
      total,
      payments,
      operator: currentOperator,
      loyaltyCard: activeLoyaltyCard || undefined,
      status: 'completed',
    };

    // Update loyalty card points
    if (activeLoyaltyCard) {
      const pointsEarned = Math.floor(total / 10); // 1 punto ogni 10€
      updateLoyaltyCard({
        ...activeLoyaltyCard,
        points: activeLoyaltyCard.points + pointsEarned,
        lastUsed: new Date(),
      });
    }

    addSale(sale);
    setCompletedSale(sale);
    setCompleted(true);
    setShowReceipt(true); // Show receipt automatically after sale
  };

  const quickAmounts = [5, 10, 20, 50, 100, 200];

  if (completed && !showReceipt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <Check className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vendita Completata!
          </h2>
          <p className="text-gray-600 mb-6">
            Transazione registrata con successo
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Totale</p>
            <p className="text-3xl font-bold text-green-600">
              €{total.toFixed(2)}
            </p>
            {change > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Resto</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{change.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          {activeLoyaltyCard && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm mb-4">
              <p className="text-yellow-800">
                <strong>{Math.floor(total / 10)} punti</strong> aggiunti alla
                carta fedeltà
              </p>
            </div>
          )}
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setShowReceipt(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              <ReceiptIcon className="w-5 h-5 mr-2" />
              Visualizza e Stampa Scontrino
            </button>
            <button
              onClick={() => {
                clearCart();
                onClose();
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end lg:items-center lg:justify-center z-50">
      <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Pagamento</h2>
            <p className="text-sm text-gray-600">
              Completa la transazione
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-semibold">Totale da pagare</span>
              <span className="text-4xl font-bold text-blue-600">
                €{total.toFixed(2)}
              </span>
            </div>

            {paidAmount > 0 && (
              <div className="space-y-2 pt-4 border-t border-blue-300">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Pagato</span>
                  <span className="font-semibold text-green-600">
                    €{paidAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Rimanente</span>
                  <span className="font-semibold text-orange-600">
                    €{remainingAmount.toFixed(2)}
                  </span>
                </div>
                {change > 0 && (
                  <div className="flex justify-between text-lg pt-2 border-t border-blue-300">
                    <span className="font-bold text-gray-900">Resto</span>
                    <span className="font-bold text-blue-600">
                      €{change.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payments Made */}
          {payments.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">
                Pagamenti Registrati
              </h3>
              {payments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center">
                    {payment.type === 'cash' && (
                      <Banknote className="w-5 h-5 text-green-600 mr-3" />
                    )}
                    {payment.type === 'card' && (
                      <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                    )}
                    {payment.type === 'digital' && (
                      <Smartphone className="w-5 h-5 text-purple-600 mr-3" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {payment.type === 'cash' && 'Contanti'}
                        {payment.type === 'card' && 'Carta'}
                        {payment.type === 'digital' && 'Digitale'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gray-900">
                      €{payment.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemovePayment(index)}
                      className="text-red-500 hover:text-red-700 p-1 touch-manipulation"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Methods */}
          {remainingAmount > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                Metodo di Pagamento
              </h3>

              {!selectedPaymentType ? (
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedPaymentType('cash')}
                    className="bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-300 rounded-xl p-6 transition-all touch-manipulation active:scale-95"
                  >
                    <Banknote className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Contanti</p>
                  </button>

                  <button
                    onClick={() => handleAddPayment('card')}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-300 rounded-xl p-6 transition-all touch-manipulation active:scale-95"
                  >
                    <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Carta</p>
                  </button>

                  <button
                    onClick={() => handleAddPayment('digital')}
                    className="bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-300 rounded-xl p-6 transition-all touch-manipulation active:scale-95"
                  >
                    <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-semibold text-gray-900">Digitale</p>
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Importo Contanti
                    </label>
                    <input
                      type="number"
                      value={cashAmount}
                      onChange={(e) => setCashAmount(e.target.value)}
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-4 py-3 text-2xl font-bold text-gray-900 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {quickAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setCashAmount(amount.toString())}
                        className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg py-3 font-semibold text-gray-900 transition-colors touch-manipulation"
                      >
                        €{amount}
                      </button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handleCashPayment}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors touch-manipulation"
                    >
                      Conferma
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPaymentType(null);
                        setCashAmount('');
                      }}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors touch-manipulation"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Complete Button */}
          {remainingAmount === 0 && (
            <button
              onClick={handleCompleteSale}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center touch-manipulation active:scale-98"
            >
              <ReceiptIcon className="w-6 h-6 mr-2" />
              Completa Vendita
            </button>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && completedSale && (
        <Receipt
          sale={completedSale}
          onClose={() => {
            setShowReceipt(false);
            clearCart();
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default Checkout;

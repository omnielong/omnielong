import React, { useState } from 'react';
import { ArrowLeft, Search, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import useStore from '../store/useStore';
import type { Sale, ReturnItem, Return, ReturnReason, PaymentMethod } from '../types';

const ReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const { sales, returns, addReturn, updateSale, currentOperator } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundPayments, setRefundPayments] = useState<PaymentMethod[]>([]);
  const [returnCompleted, setReturnCompleted] = useState(false);

  // Filter sales - only completed ones
  const completedSales = sales.filter((sale) => sale.status === 'completed');

  // Search sales
  const filteredSales = completedSales.filter((sale) => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    return (
      sale.id.toLowerCase().includes(query) ||
      format(new Date(sale.date), 'dd/MM/yyyy').includes(query) ||
      sale.loyaltyCard?.customerName.toLowerCase().includes(query)
    );
  });

  const handleSelectSale = (sale: Sale) => {
    setSelectedSale(sale);
    setSearchQuery('');
    // Initialize return items with all items from sale
    const initialReturnItems: ReturnItem[] = sale.items.map((item) => ({
      cartItem: item,
      quantityToReturn: 0,
      reason: 'customer_changed_mind' as ReturnReason,
      refundAmount: 0,
    }));
    setReturnItems(initialReturnItems);
  };

  const handleUpdateReturnItem = (
    index: number,
    field: keyof ReturnItem,
    value: number | string
  ) => {
    const updated = [...returnItems];
    if (field === 'quantityToReturn' && typeof value === 'number') {
      const maxQty = updated[index].cartItem.quantity;
      updated[index].quantityToReturn = Math.min(value, maxQty);
      // Calculate refund amount proportionally
      const unitPrice = updated[index].cartItem.subtotal / updated[index].cartItem.quantity;
      updated[index].refundAmount = updated[index].quantityToReturn * unitPrice;
    } else if (field === 'reason' && typeof value === 'string') {
      updated[index].reason = value as ReturnReason;
    } else if (field === 'notes' && typeof value === 'string') {
      updated[index].notes = value;
    }
    setReturnItems(updated);
  };

  const itemsToReturn = returnItems.filter((item) => item.quantityToReturn > 0);
  const totalRefund = itemsToReturn.reduce((sum, item) => sum + item.refundAmount, 0);

  const handleProceedToRefund = () => {
    if (itemsToReturn.length === 0) {
      alert('Seleziona almeno un articolo da rendere');
      return;
    }
    setShowRefundModal(true);
  };

  const handleAddRefundPayment = (type: 'cash' | 'card' | 'digital') => {
    const paidAmount = refundPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = totalRefund - paidAmount;

    if (remaining <= 0) return;

    setRefundPayments([...refundPayments, { type, amount: remaining }]);
  };

  const handleCompleteReturn = () => {
    if (!selectedSale || !currentOperator) return;

    const paidAmount = refundPayments.reduce((sum, p) => sum + p.amount, 0);
    if (paidAmount < totalRefund) {
      alert('Rimborso incompleto');
      return;
    }

    // Create return transaction
    const returnTransaction: Return = {
      id: `return-${Date.now()}`,
      date: new Date(),
      originalSale: selectedSale,
      returnItems: itemsToReturn,
      totalRefund,
      refundPayments,
      operator: currentOperator,
      status: 'completed',
    };

    // Add return to store
    addReturn(returnTransaction);

    // Update original sale status to 'refunded'
    const isFullRefund = itemsToReturn.every((item, idx) => {
      const originalItem = selectedSale.items[idx];
      return item.quantityToReturn === originalItem.quantity;
    });

    updateSale({
      ...selectedSale,
      status: isFullRefund ? 'refunded' : 'completed',
    });

    setReturnCompleted(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSelectedSale(null);
      setReturnItems([]);
      setRefundPayments([]);
      setShowRefundModal(false);
      setReturnCompleted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/pos')}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Resi e Rimborsi</h1>
            <p className="text-orange-100">Gestione resi prodotti</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 mb-1">Resi Totali</p>
            <p className="text-2xl font-bold text-orange-600">{returns.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 mb-1">Rimborsi Totali</p>
            <p className="text-2xl font-bold text-red-600">
              €{returns.reduce((sum, r) => sum + r.totalRefund, 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-600 mb-1">Vendite Completate</p>
            <p className="text-2xl font-bold text-green-600">{completedSales.length}</p>
          </div>
        </div>

        {!selectedSale ? (
          /* Search for Sale */
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cerca Vendita da Rendere</h2>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca per numero scontrino, data, o nome cliente..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredSales.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nessuna vendita trovata</p>
                  </div>
                ) : (
                  filteredSales.map((sale) => (
                    <button
                      key={sale.id}
                      onClick={() => handleSelectSale(sale)}
                      className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-4 text-left transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{sale.id}</span>
                        <span className="text-sm text-gray-600">
                          {format(new Date(sale.date), 'dd MMM yyyy HH:mm', { locale: it })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {sale.items.length} articoli • {sale.operator.name}
                        </span>
                        <span className="font-bold text-green-600">€{sale.total.toFixed(2)}</span>
                      </div>
                      {sale.loyaltyCard && (
                        <p className="text-xs text-gray-500 mt-1">
                          Cliente: {sale.loyaltyCard.customerName}
                        </p>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          /* Return Items Selection */
          <div className="space-y-6">
            {/* Sale Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Dettagli Vendita</h2>
                <button
                  onClick={() => setSelectedSale(null)}
                  className="text-gray-600 hover:text-gray-800 font-semibold"
                >
                  Cambia Vendita
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Scontrino N°</p>
                  <p className="font-bold">{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-bold">
                    {format(new Date(selectedSale.date), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Totale</p>
                  <p className="font-bold text-green-600">€{selectedSale.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Operatore</p>
                  <p className="font-bold">{selectedSale.operator.name}</p>
                </div>
              </div>
            </div>

            {/* Return Items */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Seleziona Articoli da Rendere
              </h3>

              <div className="space-y-4">
                {returnItems.map((item, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Package className="w-10 h-10 text-gray-400" />
                        <div>
                          <p className="font-bold text-gray-900">{item.cartItem.product.name}</p>
                          <p className="text-sm text-gray-600">
                            Qtà originale: {item.cartItem.quantity} • €
                            {item.cartItem.product.price.toFixed(2)} cad.
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-lg">
                        €{item.cartItem.subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Quantity to return */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Quantità da rendere
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={item.cartItem.quantity}
                          value={item.quantityToReturn}
                          onChange={(e) =>
                            handleUpdateReturnItem(
                              index,
                              'quantityToReturn',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      {/* Reason */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Motivo
                        </label>
                        <select
                          value={item.reason}
                          onChange={(e) => handleUpdateReturnItem(index, 'reason', e.target.value)}
                          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="customer_changed_mind">Cliente ha cambiato idea</option>
                          <option value="defective">Prodotto difettoso</option>
                          <option value="wrong_size">Taglia/misura sbagliata</option>
                          <option value="wrong_item">Articolo sbagliato</option>
                          <option value="not_as_described">Non conforme</option>
                          <option value="duplicate">Duplicato</option>
                          <option value="other">Altro</option>
                        </select>
                      </div>

                      {/* Refund Amount */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Rimborso
                        </label>
                        <div className="px-3 py-2 bg-green-50 border-2 border-green-300 rounded-lg font-bold text-green-700 text-center">
                          €{item.refundAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Refund */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">Totale Rimborso:</span>
                  <span className="text-3xl font-bold text-red-600">€{totalRefund.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleProceedToRefund}
                  disabled={itemsToReturn.length === 0}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg disabled:cursor-not-allowed"
                >
                  Procedi al Rimborso
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refund Payment Modal */}
      {showRefundModal && !returnCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Metodo di Rimborso</h2>

            {/* Total */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Totale da rimborsare</p>
              <p className="text-3xl font-bold text-red-600">€{totalRefund.toFixed(2)}</p>
            </div>

            {/* Refund Payments */}
            {refundPayments.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Rimborsi Registrati</h3>
                {refundPayments.map((payment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 mb-2 flex justify-between">
                    <span className="capitalize">
                      {payment.type === 'cash' && 'Contanti'}
                      {payment.type === 'card' && 'Carta'}
                      {payment.type === 'digital' && 'Digitale'}
                    </span>
                    <span className="font-bold">€{payment.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Payment Method Buttons */}
            {refundPayments.reduce((sum, p) => sum + p.amount, 0) < totalRefund && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => handleAddRefundPayment('cash')}
                  className="bg-green-100 hover:bg-green-200 border-2 border-green-300 rounded-lg p-4 font-semibold transition-colors"
                >
                  Contanti
                </button>
                <button
                  onClick={() => handleAddRefundPayment('card')}
                  className="bg-blue-100 hover:bg-blue-200 border-2 border-blue-300 rounded-lg p-4 font-semibold transition-colors"
                >
                  Carta
                </button>
                <button
                  onClick={() => handleAddRefundPayment('digital')}
                  className="bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 rounded-lg p-4 font-semibold transition-colors"
                >
                  Digitale
                </button>
              </div>
            )}

            {/* Complete Button */}
            <div className="flex space-x-3">
              <button
                onClick={handleCompleteReturn}
                disabled={refundPayments.reduce((sum, p) => sum + p.amount, 0) < totalRefund}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 rounded-lg transition-all disabled:cursor-not-allowed"
              >
                Completa Reso
              </button>
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setRefundPayments([]);
                }}
                className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {returnCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Reso Completato!</h2>
            <p className="text-gray-600 mb-6">Il rimborso è stato registrato con successo</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Totale Rimborsato</p>
              <p className="text-3xl font-bold text-red-600">€{totalRefund.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsPage;

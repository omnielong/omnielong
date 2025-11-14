import React, { useState, useMemo } from 'react';
import { ArrowLeft, FileText, Download, CheckCircle, TrendingUp, CreditCard, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, startOfDay, endOfDay, isToday } from 'date-fns';
import { it } from 'date-fns/locale';
import useStore from '../store/useStore';
import type { FiscalClosure } from '../types';
import AccessDenied from '../components/AccessDenied';

const FiscalClosurePage: React.FC = () => {
  const navigate = useNavigate();
  const { sales, returns, currentOperator, fiscalClosures, addFiscalClosure } = useStore();

  const [showClosureModal, setShowClosureModal] = useState(false);
  const [closureNotes, setClosureNotes] = useState('');
  const [closureCompleted, setClosureCompleted] = useState(false);

  // Only admin can access this page
  if (currentOperator?.role !== 'store_admin' && currentOperator?.role !== 'business_admin') {
    return <AccessDenied message="Solo gli amministratori possono gestire le chiusure fiscali" />;
  }

  // Calculate today's statistics
  const todayStats = useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Filter today's sales
    const todaySales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return saleDate >= todayStart && saleDate <= todayEnd && sale.status === 'completed';
    });

    // Filter today's returns
    const todayReturns = returns.filter((ret) => {
      const retDate = new Date(ret.date);
      return retDate >= todayStart && retDate <= todayEnd;
    });

    // Calculate totals
    const salesAmount = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    const returnsAmount = todayReturns.reduce((sum, ret) => sum + ret.totalRefund, 0);
    const totalDiscounts = todaySales.reduce((sum, sale) => sum + sale.totalDiscount, 0);
    const totalTax = todaySales.reduce((sum, sale) => sum + sale.taxAmount, 0);

    // Payment breakdown
    const paymentBreakdown = {
      cash: 0,
      card: 0,
      digital: 0,
      voucher: 0,
    };

    todaySales.forEach((sale) => {
      sale.payments.forEach((payment) => {
        if (payment.type in paymentBreakdown) {
          paymentBreakdown[payment.type as keyof typeof paymentBreakdown] += payment.amount;
        }
      });
    });

    // Top products
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();

    todaySales.forEach((sale) => {
      sale.items.forEach((item) => {
        const existing = productMap.get(item.product.id);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.subtotal;
        } else {
          productMap.set(item.product.id, {
            name: item.product.name,
            quantity: item.quantity,
            revenue: item.subtotal,
          });
        }
      });
    });

    const topProducts = Array.from(productMap.entries())
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        quantity: data.quantity,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      salesCount: todaySales.length,
      salesAmount,
      returnsCount: todayReturns.length,
      returnsAmount,
      totalDiscounts,
      totalTax,
      netAmount: salesAmount - returnsAmount,
      paymentBreakdown,
      topProducts,
    };
  }, [sales, returns]);

  // Check if today already has a closure
  const todayHasClosure = fiscalClosures.some((closure) =>
    isToday(new Date(closure.date))
  );

  const handleCreateClosure = () => {
    if (todayHasClosure) {
      alert('La chiusura fiscale per oggi è già stata effettuata');
      return;
    }

    if (todayStats.salesCount === 0) {
      if (!confirm('Non ci sono vendite oggi. Vuoi comunque creare la chiusura?')) {
        return;
      }
    }

    setShowClosureModal(true);
  };

  const handleConfirmClosure = () => {
    if (!currentOperator) return;

    const today = new Date();
    const closure: FiscalClosure = {
      id: `closure-${Date.now()}`,
      date: today,
      startDate: startOfDay(today),
      endDate: endOfDay(today),
      operator: currentOperator,
      totalSales: todayStats.salesCount,
      salesCount: todayStats.salesCount,
      salesAmount: todayStats.salesAmount,
      returnsCount: todayStats.returnsCount,
      returnsAmount: todayStats.returnsAmount,
      paymentBreakdown: todayStats.paymentBreakdown,
      totalDiscounts: todayStats.totalDiscounts,
      totalTax: todayStats.totalTax,
      netAmount: todayStats.netAmount,
      topProducts: todayStats.topProducts,
      notes: closureNotes,
    };

    addFiscalClosure(closure);
    setClosureCompleted(true);

    setTimeout(() => {
      setShowClosureModal(false);
      setClosureCompleted(false);
      setClosureNotes('');
    }, 2000);
  };

  const handleExportClosure = (closure: FiscalClosure) => {
    const data = {
      ...closure,
      exportDate: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chiusura-fiscale-${format(new Date(closure.date), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/pos')}
              className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Chiusura Fiscale</h1>
              <p className="text-indigo-100">Report e chiusure giornaliere</p>
            </div>
          </div>
          {!todayHasClosure && (
            <button
              onClick={handleCreateClosure}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold py-3 px-6 rounded-lg flex items-center transition-colors shadow-lg"
            >
              <FileText className="w-5 h-5 mr-2" />
              Chiudi Giornata
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Today's Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Statistiche di Oggi
              {todayHasClosure && (
                <span className="ml-3 text-sm font-normal text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  Chiusura effettuata
                </span>
              )}
            </h2>
            <p className="text-gray-600">{format(new Date(), 'dd MMMM yyyy', { locale: it })}</p>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4">
              <p className="text-sm text-green-700 mb-1">Vendite</p>
              <p className="text-3xl font-bold text-green-800">{todayStats.salesCount}</p>
              <p className="text-sm text-green-600 mt-1">€{todayStats.salesAmount.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4">
              <p className="text-sm text-red-700 mb-1">Resi</p>
              <p className="text-3xl font-bold text-red-800">{todayStats.returnsCount}</p>
              <p className="text-sm text-red-600 mt-1">€{todayStats.returnsAmount.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4">
              <p className="text-sm text-orange-700 mb-1">Sconti</p>
              <p className="text-3xl font-bold text-orange-800">
                €{todayStats.totalDiscounts.toFixed(2)}
              </p>
              <p className="text-xs text-orange-600 mt-1">Totale sconti applicati</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4">
              <p className="text-sm text-blue-700 mb-1">Netto</p>
              <p className="text-3xl font-bold text-blue-800">€{todayStats.netAmount.toFixed(2)}</p>
              <p className="text-xs text-blue-600 mt-1">Vendite - Resi</p>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Dettaglio Pagamenti
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Contanti</p>
                <p className="text-2xl font-bold text-green-600">
                  €{todayStats.paymentBreakdown.cash.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Carta</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{todayStats.paymentBreakdown.card.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Digitale</p>
                <p className="text-2xl font-bold text-purple-600">
                  €{todayStats.paymentBreakdown.digital.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Buoni</p>
                <p className="text-2xl font-bold text-orange-600">
                  €{todayStats.paymentBreakdown.voucher.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          {todayStats.topProducts.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Top 5 Prodotti
              </h3>
              <div className="space-y-3">
                {todayStats.topProducts.map((product, index) => (
                  <div
                    key={product.productId}
                    className="bg-white rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{product.productName}</p>
                        <p className="text-sm text-gray-600">{product.quantity} venduti</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-purple-600">
                      €{product.revenue.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Closure History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Storico Chiusure
          </h2>

          {fiscalClosures.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Nessuna chiusura effettuata</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...fiscalClosures].reverse().map((closure) => (
                <div
                  key={closure.id}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {format(new Date(closure.date), 'dd MMMM yyyy', { locale: it })}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Chiusura effettuata da {closure.operator.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExportClosure(closure)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Esporta
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Vendite</p>
                      <p className="text-lg font-bold text-gray-900">{closure.salesCount}</p>
                      <p className="text-xs text-green-600">€{closure.salesAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Resi</p>
                      <p className="text-lg font-bold text-gray-900">{closure.returnsCount}</p>
                      <p className="text-xs text-red-600">€{closure.returnsAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Sconti</p>
                      <p className="text-lg font-bold text-orange-600">
                        €{closure.totalDiscounts.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">IVA</p>
                      <p className="text-lg font-bold text-gray-600">
                        €{closure.totalTax.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border-2 border-blue-300">
                      <p className="text-xs text-blue-700 mb-1">Netto</p>
                      <p className="text-lg font-bold text-blue-800">
                        €{closure.netAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {closure.notes && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Note:</strong> {closure.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Closure Modal */}
      {showClosureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {closureCompleted ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Chiusura Completata!
                </h2>
                <p className="text-gray-600">La chiusura fiscale è stata registrata con successo</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
                  <h2 className="text-2xl font-bold">Conferma Chiusura Fiscale</h2>
                  <p className="text-indigo-100 mt-1">
                    {format(new Date(), 'dd MMMM yyyy', { locale: it })}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Summary */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Riepilogo Giornata</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Vendite</p>
                        <p className="text-2xl font-bold text-gray-900">{todayStats.salesCount}</p>
                        <p className="text-sm text-green-600">€{todayStats.salesAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Resi</p>
                        <p className="text-2xl font-bold text-gray-900">{todayStats.returnsCount}</p>
                        <p className="text-sm text-red-600">€{todayStats.returnsAmount.toFixed(2)}</p>
                      </div>
                      <div className="col-span-2 pt-4 border-t-2 border-blue-300">
                        <p className="text-sm text-gray-600">Incasso Netto</p>
                        <p className="text-3xl font-bold text-blue-600">
                          €{todayStats.netAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Note (opzionale)
                    </label>
                    <textarea
                      value={closureNotes}
                      onChange={(e) => setClosureNotes(e.target.value)}
                      placeholder="Aggiungi eventuali note sulla giornata..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Attenzione:</strong> La chiusura fiscale è un'operazione irreversibile.
                      Verifica attentamente i dati prima di procedere.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={handleConfirmClosure}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-lg transition-all shadow-lg"
                    >
                      Conferma Chiusura
                    </button>
                    <button
                      onClick={() => {
                        setShowClosureModal(false);
                        setClosureNotes('');
                      }}
                      className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 rounded-lg transition-colors"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FiscalClosurePage;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Euro,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import useStore from '../store/useStore';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { sales, currentShift, currentOperator } = useStore();

  // Calculate statistics
  const todaySales = sales.filter(
    (sale) =>
      format(new Date(sale.date), 'yyyy-MM-dd') ===
      format(new Date(), 'yyyy-MM-dd') && sale.status === 'completed'
  );

  const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = todaySales.length;
  const averageTransaction =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const cashPayments = todaySales.reduce((sum, sale) => {
    const cash = sale.payments
      .filter((p) => p.type === 'cash')
      .reduce((s, p) => s + p.amount, 0);
    return sum + cash;
  }, 0);

  const cardPayments = todaySales.reduce((sum, sale) => {
    const card = sale.payments
      .filter((p) => p.type === 'card')
      .reduce((s, p) => s + p.amount, 0);
    return sum + card;
  }, 0);

  const digitalPayments = todaySales.reduce((sum, sale) => {
    const digital = sale.payments
      .filter((p) => p.type === 'digital')
      .reduce((s, p) => s + p.amount, 0);
    return sum + digital;
  }, 0);

  // Top products
  const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
  todaySales.forEach((sale) => {
    sale.items.forEach((item) => {
      const existing = productSales.get(item.product.id);
      if (existing) {
        existing.quantity += item.quantity;
        existing.revenue += item.subtotal;
      } else {
        productSales.set(item.product.id, {
          name: item.product.name,
          quantity: item.quantity,
          revenue: item.subtotal,
        });
      }
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/pos')}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {format(new Date(), 'EEEE, d MMMM yyyy', { locale: it })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Operatore</p>
              <p className="font-semibold text-gray-900">{currentOperator?.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Incasso Totale</p>
            <p className="text-3xl font-bold text-gray-900">
              €{totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Transazioni</p>
            <p className="text-3xl font-bold text-gray-900">
              {totalTransactions}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Scontrino Medio</p>
            <p className="text-3xl font-bold text-gray-900">
              €{averageTransaction.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Turno Aperto</p>
            <p className="text-xl font-bold text-gray-900">
              {currentShift?.openedAt
                ? format(new Date(currentShift.openedAt), 'HH:mm')
                : '--:--'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Metodi di Pagamento
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Contanti</span>
                  <span className="text-sm font-bold text-gray-900">
                    €{cashPayments.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${totalRevenue > 0 ? (cashPayments / totalRevenue) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Carta</span>
                  <span className="text-sm font-bold text-gray-900">
                    €{cardPayments.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${totalRevenue > 0 ? (cardPayments / totalRevenue) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Digitale</span>
                  <span className="text-sm font-bold text-gray-900">
                    €{digitalPayments.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${totalRevenue > 0 ? (digitalPayments / totalRevenue) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Prodotti più Venduti
            </h2>
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {product.quantity} unità vendute
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">
                        €{product.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nessuna vendita oggi</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Ultime Transazioni
          </h2>
          {todaySales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                      ORA
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                      ARTICOLI
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">
                      PAGAMENTO
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600">
                      TOTALE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todaySales.slice(0, 10).map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {format(new Date(sale.date), 'HH:mm')}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)}{' '}
                        articoli
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {sale.payments.map((p) => p.type).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-gray-900 text-right">
                        €{sale.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nessuna transazione da visualizzare</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

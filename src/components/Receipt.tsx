import React, { useRef } from 'react';
import { X, Printer, Download } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { Sale } from '../types';
import useStore from '../store/useStore';

interface ReceiptProps {
  sale: Sale;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ sale, onClose }) => {
  const { sectorConfig } = useStore();
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In produzione, si userebbe una libreria come jsPDF o html2pdf
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header - Non stampabile */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between print:hidden">
          <h2 className="text-xl font-bold text-gray-900">Scontrino/Ricevuta</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Stampa
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Receipt Content - Stampabile */}
        <div ref={receiptRef} className="p-8 font-mono text-sm">
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold mb-2">{sectorConfig?.storeName || 'POS SYSTEM'}</h1>
            {sectorConfig?.address && <p className="text-xs">{sectorConfig.address}</p>}
            {sectorConfig?.phone && <p className="text-xs">Tel: {sectorConfig.phone}</p>}
            {sectorConfig?.email && <p className="text-xs">{sectorConfig.email}</p>}
            {sectorConfig?.vatNumber && (
              <p className="text-xs font-bold mt-2">P.IVA: {sectorConfig.vatNumber}</p>
            )}
          </div>

          {/* Sale Info */}
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span>Data:</span>
              <span>{format(new Date(sale.date), 'dd/MM/yyyy HH:mm', { locale: it })}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Scontrino N°:</span>
              <span className="font-bold">{sale.id}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Operatore:</span>
              <span>{sale.operator.name}</span>
            </div>
            {sale.loyaltyCard && (
              <div className="flex justify-between">
                <span>Carta Fedeltà:</span>
                <span>{sale.loyaltyCard.cardNumber}</span>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-t-2 border-black pt-4 mb-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-2">Articolo</th>
                  <th className="text-right">Q.tà</th>
                  <th className="text-right">Prezzo</th>
                  <th className="text-right">Totale</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-gray-300">
                      <td className="py-2">{item.product.name}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">€{item.product.price.toFixed(2)}</td>
                      <td className="text-right font-bold">€{item.subtotal.toFixed(2)}</td>
                    </tr>
                    {item.discount && (
                      <tr>
                        <td colSpan={3} className="text-xs text-gray-600 pl-4">
                          Sconto: {item.discount.description}
                        </td>
                        <td className="text-right text-xs text-green-600">
                          -€{(
                            item.discount.type === 'percentage'
                              ? (item.subtotal * item.discount.value) / 100
                              : item.discount.value
                          ).toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-black pt-4 space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotale:</span>
              <span>€{sale.subtotal.toFixed(2)}</span>
            </div>

            {sale.totalDiscount > 0 && (
              <>
                <div className="flex justify-between text-green-600">
                  <span>Sconti applicati:</span>
                  <span>-€{sale.totalDiscount.toFixed(2)}</span>
                </div>
                {sale.discounts.map((discount, index) => (
                  <div key={index} className="flex justify-between text-xs text-gray-600 pl-4">
                    <span>{discount.description}</span>
                    <span>
                      {discount.type === 'percentage'
                        ? `${discount.value}%`
                        : `€${discount.value}`}
                    </span>
                  </div>
                ))}
              </>
            )}

            {sale.loyaltyCard && (
              <div className="flex justify-between text-xs text-yellow-700">
                <span>Sconto Carta Fedeltà:</span>
                <span>{sale.loyaltyCard.discount}%</span>
              </div>
            )}

            <div className="flex justify-between text-xs text-gray-600">
              <span>di cui IVA:</span>
              <span>€{sale.taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-2xl font-bold border-t-2 border-black pt-4 mt-4">
              <span>TOTALE:</span>
              <span>€{sale.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-300 mt-6 pt-4">
            <p className="font-bold mb-2">MODALITÀ DI PAGAMENTO:</p>
            {sale.payments.map((payment, index) => (
              <div key={index} className="flex justify-between">
                <span className="capitalize">
                  {payment.type === 'cash' && 'Contanti'}
                  {payment.type === 'card' && 'Carta'}
                  {payment.type === 'digital' && 'Digitale'}
                  {payment.type === 'voucher' && 'Buono'}
                </span>
                <span className="font-bold">€{payment.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          {sale.notes && (
            <div className="mt-6 pt-4 border-t border-gray-300">
              <p className="text-xs">Note: {sale.notes}</p>
            </div>
          )}

          {/* Loyalty Points */}
          {sale.loyaltyCard && (
            <div className="mt-6 pt-4 border-t border-gray-300 bg-yellow-50 p-3 rounded">
              <p className="font-bold mb-1">PUNTI FEDELTÀ:</p>
              <div className="flex justify-between text-sm">
                <span>Punti guadagnati:</span>
                <span className="font-bold text-yellow-700">
                  +{Math.floor(sale.total / 10)} punti
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>Totale punti:</span>
                <span>{sale.loyaltyCard.points + Math.floor(sale.total / 10)}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t-2 border-black text-xs">
            <p className="font-bold mb-2">Grazie per il tuo acquisto!</p>
            <p>Conservare lo scontrino per eventuali resi</p>
            <p className="mt-2">Documento non fiscale</p>
            <p className="mt-4">
              {format(new Date(), 'dd/MM/yyyy HH:mm:ss', { locale: it })}
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${receiptRef.current ? `
            [ref="receiptRef"], [ref="receiptRef"] * {
              visibility: visible;
            }
            [ref="receiptRef"] {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          ` : ''}
        }
      `}</style>
    </div>
  );
};

export default Receipt;

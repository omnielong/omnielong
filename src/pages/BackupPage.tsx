import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Upload,
  Database,
  FileJson,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import useStore from '../store/useStore';
import AccessDenied from '../components/AccessDenied';

const BackupPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    categories,
    sales,
    returns,
    discounts,
    loyaltyCards,
    operators,
    sectorConfig,
    tables,
    quickButtons,
    fiscalClosures,
    currentOperator,
  } = useStore();

  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Only admin can access this page
  if (currentOperator?.role !== 'store_admin' && currentOperator?.role !== 'business_admin') {
    return <AccessDenied message="Solo gli amministratori possono gestire backup e export" />;
  }

  const handleFullBackup = () => {
    const backup = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        products,
        categories,
        sales,
        returns,
        discounts,
        loyaltyCards,
        operators,
        sectorConfig,
        tables,
        quickButtons,
        fiscalClosures,
      },
    };

    const json = JSON.stringify(backup, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-completo-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExportSales = () => {
    const data = {
      exportDate: new Date().toISOString(),
      sales,
      returns,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendite-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExportProducts = () => {
    const data = {
      exportDate: new Date().toISOString(),
      products,
      categories,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prodotti-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExportCustomers = () => {
    const data = {
      exportDate: new Date().toISOString(),
      loyaltyCards,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `clienti-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExportFiscalClosures = () => {
    const data = {
      exportDate: new Date().toISOString(),
      fiscalClosures,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chiusure-fiscali-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    // Export sales as CSV
    const headers = ['Data', 'ID', 'Operatore', 'Articoli', 'Totale', 'Metodo Pagamento', 'Stato'];
    const rows = sales.map((sale) => [
      format(new Date(sale.date), 'dd/MM/yyyy HH:mm'),
      sale.id,
      sale.operator.name,
      sale.items.length,
      `€${sale.total.toFixed(2)}`,
      sale.payments.map((p) => p.type).join(', '),
      sale.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vendite-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate backup structure
        if (!data.data || typeof data.data !== 'object') {
          throw new Error('Formato file non valido');
        }

        // Show confirmation
        if (
          !confirm("ATTENZIONE: L'importazione sovrascriverà tutti i dati esistenti. Continuare?")
        ) {
          return;
        }

        // Import data using store actions
        const store = useStore.getState();

        // Import each data type if present
        if (data.data.products) store.setProducts(data.data.products);
        if (data.data.categories) store.setCategories(data.data.categories);
        if (data.data.discounts) store.setDiscounts(data.data.discounts);
        if (data.data.loyaltyCards) store.setLoyaltyCards(data.data.loyaltyCards);
        if (data.data.operators) store.setOperators(data.data.operators);

        // Import other data types via direct state update
        if (
          data.data.sales ||
          data.data.returns ||
          data.data.sectorConfig ||
          data.data.tables ||
          data.data.quickButtons ||
          data.data.fiscalClosures
        ) {
          useStore.setState({
            sales: data.data.sales || [],
            returns: data.data.returns || [],
            sectorConfig: data.data.sectorConfig || null,
            tables: data.data.tables || [],
            quickButtons: data.data.quickButtons || [],
            fiscalClosures: data.data.fiscalClosures || [],
          });
        }

        setImportError(null);
        setImportSuccess(true);
        setTimeout(() => setImportSuccess(false), 5000);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : "Errore durante l'importazione");
        setTimeout(() => setImportError(null), 5000);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const dataStats = {
    sales: sales.length,
    products: products.length,
    customers: loyaltyCards.length,
    operators: operators.length,
    returns: returns.length,
    fiscalClosures: fiscalClosures.length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/pos')}
            className="mr-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Backup e Export Dati</h1>
            <p className="text-cyan-100">Gestione backup e esportazione dati</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Success/Error Messages */}
        {exportSuccess && (
          <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-xl flex items-center animate-slide-up">
            <CheckCircle className="w-5 h-5 mr-3" />
            <span className="font-semibold">Export completato con successo!</span>
          </div>
        )}

        {importSuccess && (
          <div className="bg-green-100 border-2 border-green-400 text-green-800 px-4 py-3 rounded-xl flex items-center animate-slide-up">
            <CheckCircle className="w-5 h-5 mr-3" />
            <span className="font-semibold">Import completato con successo!</span>
          </div>
        )}

        {importError && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 px-4 py-3 rounded-xl flex items-center animate-slide-up">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span className="font-semibold">{importError}</span>
          </div>
        )}

        {/* Data Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Database className="w-6 h-6 mr-2" />
            Dati Presenti nel Sistema
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
              <p className="text-sm text-green-700 mb-1">Vendite</p>
              <p className="text-3xl font-bold text-green-800">{dataStats.sales}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-700 mb-1">Prodotti</p>
              <p className="text-3xl font-bold text-blue-800">{dataStats.products}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4 text-center">
              <p className="text-sm text-purple-700 mb-1">Clienti</p>
              <p className="text-3xl font-bold text-purple-800">{dataStats.customers}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-4 text-center">
              <p className="text-sm text-orange-700 mb-1">Operatori</p>
              <p className="text-3xl font-bold text-orange-800">{dataStats.operators}</p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-4 text-center">
              <p className="text-sm text-red-700 mb-1">Resi</p>
              <p className="text-3xl font-bold text-red-800">{dataStats.returns}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-300 rounded-xl p-4 text-center">
              <p className="text-sm text-indigo-700 mb-1">Chiusure</p>
              <p className="text-3xl font-bold text-indigo-800">{dataStats.fiscalClosures}</p>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Download className="w-6 h-6 mr-2" />
            Esporta Dati
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Backup */}
            <button
              onClick={handleFullBackup}
              className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl"
            >
              <Database className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Backup Completo</h3>
              <p className="text-cyan-100 text-sm">
                Esporta tutti i dati del sistema in un unico file JSON
              </p>
            </button>

            {/* Sales Export */}
            <button
              onClick={handleExportSales}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl"
            >
              <FileJson className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Vendite e Resi</h3>
              <p className="text-green-100 text-sm">
                Esporta solo le transazioni di vendita e resi
              </p>
            </button>

            {/* Products Export */}
            <button
              onClick={handleExportProducts}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl"
            >
              <FileJson className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Prodotti</h3>
              <p className="text-blue-100 text-sm">Esporta catalogo prodotti e categorie</p>
            </button>

            {/* Customers Export */}
            <button
              onClick={handleExportCustomers}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl"
            >
              <FileJson className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Clienti</h3>
              <p className="text-purple-100 text-sm">Esporta anagrafica clienti e carte fedeltà</p>
            </button>

            {/* Fiscal Closures Export */}
            <button
              onClick={handleExportFiscalClosures}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl"
            >
              <FileJson className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">Chiusure Fiscali</h3>
              <p className="text-indigo-100 text-sm">Esporta storico chiusure fiscali</p>
            </button>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl p-6 text-left transition-all shadow-lg hover:shadow-xl"
            >
              <FileText className="w-8 h-8 mb-3" />
              <h3 className="text-xl font-bold mb-2">CSV Vendite</h3>
              <p className="text-orange-100 text-sm">Esporta vendite in formato CSV per Excel</p>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Upload className="w-6 h-6 mr-2" />
            Importa Dati
          </h2>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Attenzione</h3>
                <p className="text-sm text-yellow-800 mb-2">
                  L'importazione di dati sovrascriverà completamente i dati esistenti.
                </p>
                <p className="text-sm text-yellow-800">
                  Si consiglia di effettuare un backup completo prima di procedere.
                </p>
              </div>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Importa File di Backup</h3>
            <p className="text-gray-600 mb-4">Carica un file JSON di backup precedente</p>
            <label className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition-colors">
              Seleziona File
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">Informazioni</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-cyan-600 mr-2">•</span>
              <span>I file di backup includono tutti i dati del sistema in formato JSON</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-600 mr-2">•</span>
              <span>
                Gli export selettivi permettono di esportare solo specifiche categorie di dati
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-600 mr-2">•</span>
              <span>Il formato CSV è compatibile con Excel e altri fogli di calcolo</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-600 mr-2">•</span>
              <span>Conserva i backup in un luogo sicuro per prevenire perdite di dati</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-600 mr-2">•</span>
              <span>Si consiglia di effettuare backup regolari, almeno una volta al giorno</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BackupPage;

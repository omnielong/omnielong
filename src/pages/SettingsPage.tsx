import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Settings,
  Database,
  RefreshCw,
  CheckCircle,
  XCircle,
  Save,
} from 'lucide-react';
import { useAPI } from '../services/api';
import useStore from '../store/useStore';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const api = useAPI();
  const { setProducts, setLoyaltyCards, setOperators } = useStore();

  const [apiConfig, setApiConfig] = useState({
    baseUrl: 'https://api.zucchetti.it',
    apiKey: '',
    username: '',
    password: '',
  });

  const [connectionStatus, setConnectionStatus] = useState<
    'idle' | 'testing' | 'success' | 'error'
  >('idle');

  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>('');

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    api.configure(apiConfig);

    const isConnected = await api.testConnection();

    if (isConnected) {
      setConnectionStatus('success');
      setTimeout(() => setConnectionStatus('idle'), 3000);
    } else {
      setConnectionStatus('error');
      setTimeout(() => setConnectionStatus('idle'), 3000);
    }
  };

  const handleSyncData = async () => {
    setSyncing(true);
    setSyncStatus('Sincronizzazione in corso...');

    try {
      // Sync products
      setSyncStatus('Sincronizzazione prodotti...');
      const products = await api.syncProducts();
      setProducts(products);

      // Sync loyalty cards
      setSyncStatus('Sincronizzazione carte fedeltà...');
      const cards = await api.syncLoyaltyCards();
      setLoyaltyCards(cards);

      // Sync operators
      setSyncStatus('Sincronizzazione operatori...');
      const operators = await api.syncOperators();
      setOperators(operators);

      setSyncStatus('Sincronizzazione completata!');
      setTimeout(() => {
        setSyncStatus('');
        setSyncing(false);
      }, 2000);
    } catch (error) {
      setSyncStatus('Errore durante la sincronizzazione');
      setTimeout(() => {
        setSyncStatus('');
        setSyncing(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/pos')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center">
              <Settings className="w-6 h-6 mr-3 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
                <p className="text-sm text-gray-600">
                  Configura l'integrazione con sistemi esterni
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Integration Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Integrazione Database Esterno
              </h2>
              <p className="text-sm text-gray-600">
                Connetti il POS a Zucchetti o altri sistemi gestionali
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Base API
              </label>
              <input
                type="url"
                value={apiConfig.baseUrl}
                onChange={(e) =>
                  setApiConfig({ ...apiConfig, baseUrl: e.target.value })
                }
                placeholder="https://api.zucchetti.it"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                API Key (opzionale)
              </label>
              <input
                type="password"
                value={apiConfig.apiKey}
                onChange={(e) =>
                  setApiConfig({ ...apiConfig, apiKey: e.target.value })
                }
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={apiConfig.username}
                  onChange={(e) =>
                    setApiConfig({ ...apiConfig, username: e.target.value })
                  }
                  placeholder="username"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={apiConfig.password}
                  onChange={(e) =>
                    setApiConfig({ ...apiConfig, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
              >
                {connectionStatus === 'testing' ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Test in corso...
                  </>
                ) : connectionStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Connessione OK
                  </>
                ) : connectionStatus === 'error' ? (
                  <>
                    <XCircle className="w-5 h-5 mr-2" />
                    Errore connessione
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Testa Connessione
                  </>
                )}
              </button>

              <button
                className="px-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Salva
              </button>
            </div>
          </div>
        </div>

        {/* Sync Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <RefreshCw className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Sincronizzazione Dati
              </h2>
              <p className="text-sm text-gray-600">
                Sincronizza prodotti, carte fedeltà e operatori dal sistema esterno
              </p>
            </div>
          </div>

          {syncStatus && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                syncStatus.includes('Errore')
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : syncStatus.includes('completata')
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              <p className="text-sm font-semibold flex items-center">
                {syncing && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                {syncStatus}
              </p>
            </div>
          )}

          <button
            onClick={handleSyncData}
            disabled={syncing}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center"
          >
            <RefreshCw
              className={`w-5 h-5 mr-2 ${syncing ? 'animate-spin' : ''}`}
            />
            {syncing ? 'Sincronizzazione...' : 'Sincronizza Dati'}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-blue-900 mb-2">
            ℹ️ Come funziona l'integrazione
          </h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              • <strong>Zucchetti:</strong> Il sistema si connette alle API REST
              di Zucchetti per sincronizzare i dati
            </li>
            <li>
              • <strong>Prodotti:</strong> I prodotti vengono scaricati dal
              gestionale e aggiornati nel POS
            </li>
            <li>
              • <strong>Vendite:</strong> Le transazioni vengono inviate
              automaticamente al gestionale
            </li>
            <li>
              • <strong>Carte Fedeltà:</strong> I punti e i dati delle carte
              vengono sincronizzati bidirezionalmente
            </li>
            <li>
              • <strong>Sicurezza:</strong> Tutte le comunicazioni sono
              crittografate con HTTPS
            </li>
          </ul>
        </div>

        {/* API Documentation */}
        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            📚 Documentazione API richiesta
          </h3>
          <div className="text-xs text-gray-700 space-y-2">
            <p>
              Per integrare il POS con il tuo sistema, assicurati che le seguenti
              API REST siano disponibili:
            </p>
            <code className="block bg-white p-2 rounded border border-gray-300 overflow-x-auto">
              GET /api/v1/health - Test connessione
              <br />
              GET /api/v1/products - Elenco prodotti
              <br />
              POST /api/v1/sales - Invio vendita
              <br />
              GET /api/v1/loyalty-cards - Elenco carte fedeltà
              <br />
              PUT /api/v1/loyalty-cards/:id/points - Aggiorna punti
              <br />
              GET /api/v1/operators - Elenco operatori
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

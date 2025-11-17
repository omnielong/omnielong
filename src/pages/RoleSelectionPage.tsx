import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Store as StoreIcon,
  Users,
  ArrowRight,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Layers,
} from 'lucide-react';

const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'reseller',
      title: 'Reseller',
      subtitle: 'Gestisci i tuoi clienti Business',
      description:
        'Accedi alla dashboard reseller per gestire i tuoi clienti, monitorare le sottoscrizioni e visualizzare statistiche aggregate.',
      icon: Building2,
      gradient: 'from-indigo-600 to-purple-600',
      bgGradient: 'from-indigo-50 to-purple-50',
      iconBg: 'from-indigo-500 to-purple-500',
      path: '/reseller',
      features: [
        { icon: Users, text: 'Gestione clienti' },
        { icon: TrendingUp, text: 'Statistiche vendite' },
        { icon: BarChart3, text: 'Report globali' },
      ],
    },
    {
      id: 'business',
      title: 'Business Admin',
      subtitle: 'Gestisci i tuoi punti vendita',
      description:
        'Accedi alla dashboard business per gestire i tuoi negozi, configurare operatori e monitorare le performance.',
      icon: StoreIcon,
      gradient: 'from-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-500 to-cyan-500',
      path: '/business',
      features: [
        { icon: StoreIcon, text: 'Punti vendita' },
        { icon: Users, text: 'Gestione operatori' },
        { icon: BarChart3, text: 'Analytics business' },
      ],
    },
    {
      id: 'store',
      title: 'Store Operator',
      subtitle: 'Accedi al POS del negozio',
      description:
        'Accedi come operatore di cassa per gestire vendite, clienti e operazioni quotidiane del punto vendita.',
      icon: ShoppingBag,
      gradient: 'from-green-600 to-teal-600',
      bgGradient: 'from-green-50 to-teal-50',
      iconBg: 'from-green-500 to-teal-500',
      path: '/shift',
      features: [
        { icon: ShoppingBag, text: 'POS vendite' },
        { icon: Users, text: 'Gestione clienti' },
        { icon: Layers, text: 'Inventario' },
      ],
    },
  ];

  const handleRoleSelect = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Omnie POS</h1>
          <p className="text-gray-300 text-lg">Seleziona il tipo di accesso al sistema</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Benvenuto nel Sistema Multi-Tenant
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Scegli il ruolo appropriato per accedere alle funzionalità dedicate. Ogni ruolo ha
            accesso a strumenti specifici per le proprie esigenze.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`bg-gradient-to-br ${role.bgGradient} rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-opacity-50`}
                onClick={() => handleRoleSelect(role.path)}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${role.gradient} p-6 text-white`}>
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${role.iconBg} rounded-xl flex items-center justify-center mr-4 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{role.title}</h3>
                      <p className="text-sm opacity-90">{role.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-gray-700 mb-6 leading-relaxed">{role.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {role.features.map((feature, index) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div key={index} className="flex items-center text-gray-700">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3 shadow-sm">
                            <FeatureIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-medium">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.path);
                    }}
                    className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center group shadow-lg`}
                  >
                    Accedi come {role.title}
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Architettura Multi-Tenant</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-bold text-indigo-600 mb-2">🏢 Reseller</h4>
              <p>
                I reseller gestiscono più aziende clienti, configurano le sottoscrizioni e
                monitorano le performance globali della rete di vendita.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-blue-600 mb-2">🏪 Business</h4>
              <p>
                Le aziende gestiscono i propri punti vendita, configurano prodotti, operatori e
                monitorano le vendite aggregate dei loro negozi.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-green-600 mb-2">💼 Store</h4>
              <p>
                Gli operatori di negozio utilizzano il POS per gestire vendite quotidiane, clienti,
                inventario e chiusure fiscali del punto vendita.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            ← Torna al Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;

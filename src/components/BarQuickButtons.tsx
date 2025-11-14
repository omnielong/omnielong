import React, { useEffect } from 'react';
import { Coffee, Settings } from 'lucide-react';
import useStore from '../store/useStore';
import { quickButtons as defaultQuickButtons } from '../utils/barMockData';

const BarQuickButtons: React.FC = () => {
  const { products, quickButtons, setQuickButtons, addToCart } = useStore();

  useEffect(() => {
    // Inizializza pulsanti rapidi se vuoti
    if (quickButtons.length === 0) {
      setQuickButtons(defaultQuickButtons);
    }
  }, [quickButtons.length, setQuickButtons]);

  const handleQuickAdd = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      addToCart(product, 1);
    }
  };

  if (quickButtons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
        <Coffee className="w-16 h-16 mb-4" />
        <p className="text-lg font-semibold mb-2">Pulsanti Rapidi Non Configurati</p>
        <p className="text-sm text-center mb-4">
          Configura i pulsanti rapidi per una vendita velocissima
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center transition-colors">
          <Settings className="w-5 h-5 mr-2" />
          Configura Pulsanti
        </button>
      </div>
    );
  }

  // Raggruppa pulsanti per categoria per layout migliore
  const buttonsByCategory = quickButtons.reduce((acc, btn) => {
    const cat = btn.category || 'default';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(btn);
    return acc;
  }, {} as Record<string, typeof quickButtons>);

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Intestazione */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-900 flex items-center">
          <Coffee className="w-5 h-5 mr-2 text-amber-600" />
          Vendita Veloce
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center">
          <Settings className="w-4 h-4 mr-1" />
          Personalizza
        </button>
      </div>

      {/* Griglia pulsanti rapidi */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {quickButtons
          .sort((a, b) => a.position - b.position)
          .map((button) => {
            const product = products.find((p) => p.id === button.productId);
            if (!product) return null;

            return (
              <button
                key={button.id}
                onClick={() => handleQuickAdd(button.productId)}
                className={`${button.color} text-white font-bold rounded-xl p-4 h-24 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all active:scale-95 touch-manipulation`}
              >
                <span className="text-sm text-center leading-tight mb-1">
                  {button.label}
                </span>
                <span className="text-lg font-bold">
                  €{product.price.toFixed(2)}
                </span>
              </button>
            );
          })}
      </div>

      {/* Categorie */}
      <div className="space-y-3 pt-4">
        {Object.entries(buttonsByCategory).map(([category, buttons]) => (
          <div key={category} className="bg-white rounded-lg p-3 border border-gray-200">
            <h4 className="text-xs font-bold text-gray-700 uppercase mb-2 px-1">
              {category === 'caffe' && '☕ Caffetteria'}
              {category === 'bibite' && '🥤 Bibite'}
              {category === 'cornetti' && '🥐 Cornetteria'}
              {category === 'tabacchi' && '🚬 Tabacchi'}
              {category === 'lotterie' && '🎲 Lotterie'}
              {category === 'default' && '📦 Altro'}
            </h4>
            <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-6 gap-2">
              {buttons.map((button) => {
                const product = products.find((p) => p.id === button.productId);
                if (!product) return null;

                return (
                  <button
                    key={button.id}
                    onClick={() => handleQuickAdd(button.productId)}
                    className="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg p-2 text-center transition-colors touch-manipulation active:scale-95"
                  >
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {button.label}
                    </p>
                    <p className="text-sm font-bold text-blue-600 mt-1">
                      €{product.price.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-blue-800">
          💡 <strong>Suggerimento:</strong> Tap veloce sui pulsanti colorati per vendita express.
          I pulsanti sono personalizzabili in base alle tue esigenze.
        </p>
      </div>
    </div>
  );
};

export default BarQuickButtons;

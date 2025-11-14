import React, { useState } from 'react';
import { X, Check, ShoppingCart } from 'lucide-react';
import type { FashionProduct, ProductVariant } from '../types';

interface FashionVariantSelectorProps {
  product: FashionProduct;
  onClose: () => void;
  onAddToCart: (variant: ProductVariant, quantity: number) => void;
}

const FashionVariantSelector: React.FC<FashionVariantSelectorProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Estrai taglie e colori unici dalle varianti
  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants?.map((v) => v.color).filter(Boolean))];

  // Trova la variante selezionata
  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  // Filtra colori disponibili per la taglia selezionata
  const availableColors = selectedSize
    ? [...new Set(
        product.variants
          ?.filter((v) => v.size === selectedSize)
          .map((v) => v.color)
          .filter(Boolean)
      )]
    : colors;

  // Filtra taglie disponibili per il colore selezionato
  const availableSizes = selectedColor
    ? [...new Set(
        product.variants
          ?.filter((v) => v.color === selectedColor)
          .map((v) => v.size)
          .filter(Boolean)
      )]
    : sizes;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Seleziona taglia e colore');
      return;
    }

    if (selectedVariant.stock < quantity) {
      alert(`Stock insufficiente. Disponibili: ${selectedVariant.stock}`);
      return;
    }

    onAddToCart(selectedVariant, quantity);
    onClose();
  };

  const finalPrice = selectedVariant
    ? product.price + (selectedVariant.priceAdjustment || 0)
    : product.price;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end lg:items-center lg:justify-center z-50">
      <div className="bg-white rounded-t-2xl lg:rounded-2xl w-full lg:max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>
            {product.brand && (
              <p className="text-sm text-gray-500 mt-1">
                Brand: <strong>{product.brand}</strong>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 mb-1">Prezzo base</p>
                <p className="text-4xl font-bold text-blue-600">
                  €{finalPrice.toFixed(2)}
                </p>
                {selectedVariant?.priceAdjustment && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedVariant.priceAdjustment > 0 ? '+' : ''}
                    €{selectedVariant.priceAdjustment.toFixed(2)} rispetto al prezzo base
                  </p>
                )}
              </div>
              {selectedVariant && (
                <div className="text-right">
                  <p className="text-sm text-gray-700 mb-1">Disponibilità</p>
                  <p
                    className={`text-2xl font-bold ${
                      selectedVariant.stock > 10
                        ? 'text-green-600'
                        : selectedVariant.stock > 0
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}
                  >
                    {selectedVariant.stock} pz
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Seleziona Taglia
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {availableSizes.map((size) => {
                  const isAvailable = product.variants?.some(
                    (v) =>
                      v.size === size &&
                      (!selectedColor || v.color === selectedColor) &&
                      v.stock > 0
                  );
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size!)}
                      disabled={!isAvailable}
                      className={`relative py-4 px-2 rounded-lg font-semibold text-sm transition-all touch-manipulation ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                          : isAvailable
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {size}
                      {selectedSize === size && (
                        <Check className="absolute top-1 right-1 w-4 h-4" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Seleziona Colore
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableColors.map((color) => {
                  const isAvailable = product.variants?.some(
                    (v) =>
                      v.color === color &&
                      (!selectedSize || v.size === selectedSize) &&
                      v.stock > 0
                  );
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color!)}
                      disabled={!isAvailable}
                      className={`relative py-4 px-4 rounded-lg font-semibold text-sm transition-all touch-manipulation ${
                        selectedColor === color
                          ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2'
                          : isAvailable
                          ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {color}
                      {selectedColor === color && (
                        <Check className="absolute top-1 right-1 w-4 h-4" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Variant Info */}
          {selectedVariant && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 font-semibold mb-1">
                    Variante selezionata
                  </p>
                  <p className="text-gray-900">
                    {selectedVariant.size && <span>Taglia {selectedVariant.size}</span>}
                    {selectedVariant.size && selectedVariant.color && <span> • </span>}
                    {selectedVariant.color && <span>Colore {selectedVariant.color}</span>}
                  </p>
                  {selectedVariant.sku && (
                    <p className="text-xs text-gray-600 mt-1">SKU: {selectedVariant.sku}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    €{finalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Quantità</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors touch-manipulation"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={selectedVariant?.stock || 999}
                className="w-20 text-center text-2xl font-bold py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() =>
                  setQuantity(
                    Math.min(selectedVariant?.stock || 999, quantity + 1)
                  )
                }
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors touch-manipulation"
              >
                +
              </button>
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-600">Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  €{(finalPrice * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedVariant}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center touch-manipulation"
          >
            <ShoppingCart className="w-6 h-6 mr-2" />
            {selectedVariant ? 'Aggiungi al Carrello' : 'Seleziona taglia e colore'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FashionVariantSelector;

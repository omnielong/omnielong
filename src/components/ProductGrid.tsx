import React, { useState } from 'react';
import { Plus, Package, Shirt } from 'lucide-react';
import useStore from '../store/useStore';
import FashionVariantSelector from './FashionVariantSelector';
import type { Product, FashionProduct, ProductVariant } from '../types';

interface ProductGridProps {
  categoryFilter: string | null;
  searchQuery: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoryFilter, searchQuery }) => {
  const { products, addToCart, sectorConfig } = useStore();
  const [selectedFashionProduct, setSelectedFashionProduct] = useState<FashionProduct | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery);

    return matchesCategory && matchesSearch && product.active;
  });

  const handleProductClick = (product: Product) => {
    // Se è un prodotto moda con varianti, apri il modal
    if (sectorConfig?.sector === 'fashion') {
      const fashionProduct = product as FashionProduct;
      if (fashionProduct.variants && fashionProduct.variants.length > 0) {
        setSelectedFashionProduct(fashionProduct);
        return;
      }
    }

    // Altrimenti aggiungi direttamente al carrello
    addToCart(product);
  };

  const handleAddVariantToCart = (variant: ProductVariant, quantity: number) => {
    if (!selectedFashionProduct) return;

    // Crea un prodotto temporaneo con il prezzo della variante
    const productWithVariant: Product = {
      ...selectedFashionProduct,
      price: selectedFashionProduct.price + (variant.priceAdjustment || 0),
      stock: variant.stock,
      barcode: variant.barcode || selectedFashionProduct.barcode,
      name: `${selectedFashionProduct.name} - ${variant.size || ''} ${variant.color || ''}`.trim(),
    };

    addToCart(productWithVariant, quantity);
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Package className="w-16 h-16 mb-4" />
        <p className="text-lg font-semibold">Nessun prodotto trovato</p>
        <p className="text-sm">Prova a modificare i filtri di ricerca</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
        {filteredProducts.map((product) => {
          const fashionProduct = product as FashionProduct;
          const hasVariants = fashionProduct.variants && fashionProduct.variants.length > 0;

          return (
            <button
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all p-4 text-left group touch-manipulation active:scale-95"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package className="w-12 h-12 text-gray-400" />
                )}
                <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <Plus className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Badge varianti per moda */}
                {sectorConfig?.sector === 'fashion' && hasVariants && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Shirt className="w-3 h-3 mr-1" />
                    {fashionProduct.variants?.length || 0}
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 h-10">
                {product.name}
              </h3>

              {/* Info settore specifiche */}
              {sectorConfig?.sector === 'fashion' && fashionProduct.brand && (
                <p className="text-xs text-gray-500 mb-1">{fashionProduct.brand}</p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">
                  €{product.price.toFixed(2)}
                  {hasVariants && <span className="text-xs text-gray-500 ml-1">+</span>}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    product.stock > 10
                      ? 'bg-green-100 text-green-700'
                      : product.stock > 0
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  {product.stock}
                </span>
              </div>

              {hasVariants && (
                <p className="text-xs text-purple-600 font-semibold mt-2">Tap per varianti</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Fashion Variant Selector Modal */}
      {selectedFashionProduct && (
        <FashionVariantSelector
          product={selectedFashionProduct}
          onClose={() => setSelectedFashionProduct(null)}
          onAddToCart={handleAddVariantToCart}
        />
      )}
    </>
  );
};

export default ProductGrid;

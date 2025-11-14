import React from 'react';
import { Plus, Package } from 'lucide-react';
import useStore from '../store/useStore';

interface ProductGridProps {
  categoryFilter: string | null;
  searchQuery: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  categoryFilter,
  searchQuery,
}) => {
  const { products, addToCart } = useStore();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery);

    return matchesCategory && matchesSearch && product.active;
  });

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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
      {filteredProducts.map((product) => (
        <button
          key={product.id}
          onClick={() => addToCart(product)}
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
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 h-10">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">
              €{product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Stock: {product.stock}
            </span>
          </div>

          {product.barcode && (
            <p className="text-xs text-gray-400 mt-2">{product.barcode}</p>
          )}
        </button>
      ))}
    </div>
  );
};

export default ProductGrid;

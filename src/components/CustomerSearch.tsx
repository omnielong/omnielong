import React, { useState, useRef, useEffect } from 'react';
import { Search, X, User, Phone, Mail, CreditCard, Award, Tag } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  loyaltyCardId?: string;
  createdAt: Date;
  totalSpent: number;
  visitCount: number;
  points?: number;
}

interface CustomerSearchProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chiudi dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtra clienti in base alla query
  const filteredCustomers = customers.filter((customer) => {
    if (!searchQuery.trim()) return false;

    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email?.toLowerCase().includes(query) ||
      customer.phone?.includes(query) ||
      customer.loyaltyCardId?.toLowerCase().includes(query)
    );
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(value.trim().length > 0);
  };

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleClearCustomer = () => {
    onSelectCustomer(null);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cliente Selezionato */}
      {selectedCustomer ? (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start flex-1">
              <div className="bg-blue-600 text-white rounded-full p-2 mr-3">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <h4 className="font-bold text-gray-900 text-sm truncate">
                    {selectedCustomer.name}
                  </h4>
                  {selectedCustomer.loyaltyCardId && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      VIP
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 text-xs text-gray-600">
                  {selectedCustomer.phone && (
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {selectedCustomer.phone}
                    </div>
                  )}
                  {selectedCustomer.email && (
                    <div className="flex items-center truncate">
                      <Mail className="w-3 h-3 mr-1" />
                      {selectedCustomer.email}
                    </div>
                  )}
                  {selectedCustomer.loyaltyCardId && (
                    <div className="flex items-center">
                      <CreditCard className="w-3 h-3 mr-1" />
                      {selectedCustomer.loyaltyCardId}
                    </div>
                  )}
                  {selectedCustomer.points !== undefined && (
                    <div className="flex items-center font-semibold text-blue-700">
                      <Tag className="w-3 h-3 mr-1" />
                      {selectedCustomer.points} punti disponibili
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleClearCustomer}
              className="ml-2 p-1 hover:bg-blue-200 rounded-lg transition-colors"
              title="Rimuovi cliente"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Campo Ricerca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="Cerca cliente per nome, email, telefono o carta..."
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Dropdown Risultati */}
          {showDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
              {filteredCustomers.length > 0 ? (
                <div className="py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    {filteredCustomers.length} {filteredCustomers.length === 1 ? 'risultato' : 'risultati'}
                  </div>
                  {filteredCustomers.map((customer) => (
                    <button
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      className="w-full px-3 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start">
                        <div className="bg-gray-200 text-gray-600 rounded-full p-2 mr-3">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-1">
                            <h5 className="font-semibold text-gray-900 text-sm truncate">
                              {customer.name}
                            </h5>
                            {customer.loyaltyCardId && (
                              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-1.5 py-0.5 rounded">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs text-gray-600">
                            {customer.phone && (
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {customer.phone}
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center truncate">
                                <Mail className="w-3 h-3 mr-1" />
                                {customer.email}
                              </div>
                            )}
                            {customer.loyaltyCardId && (
                              <div className="flex items-center text-blue-600 font-medium">
                                <CreditCard className="w-3 h-3 mr-1" />
                                {customer.loyaltyCardId}
                              </div>
                            )}
                          </div>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <span className="mr-3">
                              💰 €{customer.totalSpent.toFixed(2)}
                            </span>
                            <span>
                              🛍️ {customer.visitCount} visite
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Nessun cliente trovato
                  </p>
                  <p className="text-xs text-gray-500">
                    Prova con un altro termine di ricerca
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerSearch;

import React, { useEffect } from 'react';
import { UtensilsCrossed, Plus, Users, Clock, Euro } from 'lucide-react';
import useStore from '../store/useStore';
import type { Table } from '../types';

const RestaurantTables: React.FC = () => {
  const { tables, setTables } = useStore();

  // Mock tables - in produzione saranno configurabili
  const mockTables: Table[] = [
    { id: 't1', number: 1, seats: 2, status: 'free', section: 'Sala Principale' },
    { id: 't2', number: 2, seats: 4, status: 'occupied', section: 'Sala Principale' },
    { id: 't3', number: 3, seats: 4, status: 'free', section: 'Sala Principale' },
    { id: 't4', number: 4, seats: 6, status: 'occupied', section: 'Sala Principale' },
    { id: 't5', number: 5, seats: 2, status: 'free', section: 'Veranda' },
    { id: 't6', number: 6, seats: 4, status: 'reserved', section: 'Veranda' },
    { id: 't7', number: 7, seats: 8, status: 'free', section: 'Sala VIP' },
    { id: 't8', number: 8, seats: 4, status: 'billed', section: 'Sala Principale' },
    { id: 't9', number: 9, seats: 2, status: 'free', section: 'Giardino' },
    { id: 't10', number: 10, seats: 6, status: 'occupied', section: 'Giardino' },
  ];

  useEffect(() => {
    if (tables.length === 0) {
      setTables(mockTables);
    }
  }, []);

  const handleTableClick = (table: Table) => {
    // TODO: Apri comanda tavolo
    console.log('Open table:', table);
  };

  // Raggruppa tavoli per sezione
  const tablesBySection = tables.reduce((acc, table) => {
    const section = table.section || 'Default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(table);
    return acc;
  }, {} as Record<string, Table[]>);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'free':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'occupied':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'billed':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusLabel = (status: Table['status']) => {
    switch (status) {
      case 'free':
        return 'Libero';
      case 'occupied':
        return 'Occupato';
      case 'reserved':
        return 'Riservato';
      case 'billed':
        return 'Da Incassare';
      default:
        return 'Sconosciuto';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'free':
        return '✓';
      case 'occupied':
        return '👥';
      case 'reserved':
        return '📅';
      case 'billed':
        return '💰';
      default:
        return '?';
    }
  };

  // Statistiche tavoli
  const stats = {
    total: tables.length,
    free: tables.filter((t) => t.status === 'free').length,
    occupied: tables.filter((t) => t.status === 'occupied').length,
    reserved: tables.filter((t) => t.status === 'reserved').length,
    billed: tables.filter((t) => t.status === 'billed').length,
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header con statistiche */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <UtensilsCrossed className="w-5 h-5 mr-2 text-orange-600" />
              Gestione Tavoli
            </h3>
            <span className="ml-3 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
              🍽️ RISTORANTE
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center text-sm transition-colors">
            <Plus className="w-4 h-4 mr-1" />
            Nuovo Tavolo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-600 mb-1">Totale</p>
            <p className="text-lg font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className="text-xs text-green-700 mb-1">Liberi</p>
            <p className="text-lg font-bold text-green-700">{stats.free}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-2 text-center">
            <p className="text-xs text-red-700 mb-1">Occupati</p>
            <p className="text-lg font-bold text-red-700">{stats.occupied}</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 text-center">
            <p className="text-xs text-yellow-700 mb-1">Riservati</p>
            <p className="text-lg font-bold text-yellow-700">{stats.reserved}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-700 mb-1">Da Inc.</p>
            <p className="text-lg font-bold text-blue-700">{stats.billed}</p>
          </div>
        </div>
      </div>

      {/* Tavoli per sezione */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(tablesBySection).map(([section, sectionTables]) => (
          <div key={section}>
            <h4 className="text-sm font-bold text-gray-700 uppercase mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              {section}
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sectionTables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={`${getStatusColor(
                    table.status
                  )} border-2 rounded-xl p-4 text-left transition-all hover:shadow-lg active:scale-95 touch-manipulation relative overflow-hidden`}
                >
                  {/* Status badge */}
                  <div className="absolute top-2 right-2 text-2xl">
                    {getStatusIcon(table.status)}
                  </div>

                  {/* Table number */}
                  <div className="text-3xl font-bold mb-2">
                    {table.number}
                  </div>

                  {/* Seats */}
                  <div className="flex items-center text-sm mb-2">
                    <Users className="w-4 h-4 mr-1" />
                    {table.seats} posti
                  </div>

                  {/* Status */}
                  <div className="text-xs font-semibold uppercase">
                    {getStatusLabel(table.status)}
                  </div>

                  {/* Order info se occupato */}
                  {table.status === 'occupied' && table.currentOrder && (
                    <div className="mt-3 pt-3 border-t border-current space-y-1">
                      <div className="flex items-center text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(table.currentOrder.openedAt).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex items-center text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {table.currentOrder.covers} coperti
                      </div>
                      <div className="flex items-center text-xs font-bold">
                        <Euro className="w-3 h-3 mr-1" />
                        {table.currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span>Libero</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
            <span>Occupato</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
            <span>Riservato</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
            <span>Da Incassare</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTables;

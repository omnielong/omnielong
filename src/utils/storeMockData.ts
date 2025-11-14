import type { Store } from '../types';

// Mock data - in produzione verrebbe da API
export const mockStores: Store[] = [
  {
    id: 'store-1',
    businessId: 'bus-1',
    name: 'Milano Centro',
    code: 'MI-001',
    address: 'Via Montenapoleone 1',
    city: 'Milano',
    province: 'MI',
    postalCode: '20121',
    phone: '+39 02 1234567',
    email: 'milano@boutique.it',
    sector: 'fashion',
    active: true,
    createdAt: new Date('2024-01-15'),
    openingHours: {
      monday: { open: '09:00', close: '20:00', closed: false },
      tuesday: { open: '09:00', close: '20:00', closed: false },
      wednesday: { open: '09:00', close: '20:00', closed: false },
      thursday: { open: '09:00', close: '20:00', closed: false },
      friday: { open: '09:00', close: '20:00', closed: false },
      saturday: { open: '09:00', close: '20:00', closed: false },
      sunday: { open: '10:00', close: '19:00', closed: false },
    },
    cashRegisterCode: 'CR-MI-001',
  },
  {
    id: 'store-2',
    businessId: 'bus-1',
    name: 'Roma Prati',
    code: 'RM-001',
    address: 'Via Cola di Rienzo 234',
    city: 'Roma',
    province: 'RM',
    postalCode: '00192',
    phone: '+39 06 9876543',
    email: 'roma@boutique.it',
    sector: 'fashion',
    active: true,
    createdAt: new Date('2024-03-01'),
    openingHours: {
      monday: { open: '09:30', close: '19:30', closed: false },
      tuesday: { open: '09:30', close: '19:30', closed: false },
      wednesday: { open: '09:30', close: '19:30', closed: false },
      thursday: { open: '09:30', close: '19:30', closed: false },
      friday: { open: '09:30', close: '19:30', closed: false },
      saturday: { open: '09:30', close: '19:30', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
  },
  {
    id: 'store-3',
    businessId: 'bus-1',
    name: 'Firenze Centro',
    code: 'FI-001',
    address: 'Via de Tornabuoni 15',
    city: 'Firenze',
    province: 'FI',
    postalCode: '50123',
    phone: '+39 055 1122334',
    email: 'firenze@boutique.it',
    sector: 'fashion',
    active: false,
    createdAt: new Date('2024-05-10'),
  },
];

// Funzione helper per trovare uno store per ID
export const getStoreById = (id: string): Store | undefined => {
  return mockStores.find((s) => s.id === id);
};

import type { Operator } from '../types';

// Permessi predefiniti per ogni ruolo
export const ROLE_PERMISSIONS = {
  business_admin: {
    canAccessReports: true,
    canManageProducts: true,
    canManageCustomers: true,
    canManagePromotions: true,
    canManageOperators: true,
    canViewSensitiveData: true,
    canProcessRefunds: true,
    canOpenCloseCashRegister: true,
    canAccessAllStores: true, // Vede tutti i negozi del business
    canAccessSettings: true,
    canAccessBackup: true,
    canAccessFiscalClosure: true,
  },
  store_admin: {
    canAccessReports: true,
    canManageProducts: true,
    canManageCustomers: true,
    canManagePromotions: true,
    canManageOperators: true,
    canViewSensitiveData: true,
    canProcessRefunds: true,
    canOpenCloseCashRegister: true,
    canAccessAllStores: false, // Solo il suo negozio
    canAccessSettings: true,
    canAccessBackup: true,
    canAccessFiscalClosure: true,
  },
  manager: {
    canAccessReports: true,
    canManageProducts: true,
    canManageCustomers: true,
    canManagePromotions: true,
    canManageOperators: false, // Manager non può gestire operatori
    canViewSensitiveData: true,
    canProcessRefunds: true,
    canOpenCloseCashRegister: true,
    canAccessAllStores: false,
    canAccessSettings: false,
    canAccessBackup: false,
    canAccessFiscalClosure: true,
  },
  cashier: {
    canAccessReports: false,
    canManageProducts: false,
    canManageCustomers: true, // Può vedere e creare clienti per la vendita
    canManagePromotions: false,
    canManageOperators: false,
    canViewSensitiveData: false,
    canProcessRefunds: false, // Cassiere non può fare resi
    canOpenCloseCashRegister: true, // Solo aprire/chiudere il proprio turno
    canAccessAllStores: false,
    canAccessSettings: false,
    canAccessBackup: false,
    canAccessFiscalClosure: false,
  },
};

// Ottieni i permessi per un operatore
export const getOperatorPermissions = (operator: Operator) => {
  // Se l'operatore ha già permessi custom, usa quelli
  if (operator.permissions) {
    return {
      ...ROLE_PERMISSIONS[operator.role],
      ...operator.permissions,
    };
  }
  // Altrimenti usa i permessi predefiniti del ruolo
  return ROLE_PERMISSIONS[operator.role];
};

// Helper per verificare un singolo permesso
export const hasPermission = (
  operator: Operator | null,
  permission: keyof typeof ROLE_PERMISSIONS.business_admin
): boolean => {
  if (!operator) return false;
  const permissions = getOperatorPermissions(operator);
  return permissions[permission] ?? false;
};

// Menu items con permessi richiesti
export interface MenuItem {
  path: string;
  label: string;
  icon: string;
  requiredPermission?: keyof typeof ROLE_PERMISSIONS.business_admin;
  requiredRole?: Operator['role'][];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    path: '/pos',
    label: 'POS',
    icon: 'ShoppingCart',
    // Tutti possono accedere al POS
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'BarChart3',
    requiredPermission: 'canAccessReports',
  },
  {
    path: '/products',
    label: 'Prodotti',
    icon: 'Package',
    requiredPermission: 'canManageProducts',
  },
  {
    path: '/customers',
    label: 'Clienti',
    icon: 'Users',
    requiredPermission: 'canManageCustomers',
  },
  {
    path: '/promotions',
    label: 'Promozioni',
    icon: 'Tag',
    requiredPermission: 'canManagePromotions',
  },
  {
    path: '/returns',
    label: 'Resi',
    icon: 'RotateCcw',
    requiredPermission: 'canProcessRefunds',
  },
  {
    path: '/operators',
    label: 'Operatori',
    icon: 'UserCog',
    requiredPermission: 'canManageOperators',
  },
  {
    path: '/fiscal-closure',
    label: 'Chiusura Fiscale',
    icon: 'FileText',
    requiredPermission: 'canAccessFiscalClosure',
  },
  {
    path: '/settings',
    label: 'Impostazioni',
    icon: 'Settings',
    requiredPermission: 'canAccessSettings',
  },
  {
    path: '/backup',
    label: 'Backup',
    icon: 'Database',
    requiredPermission: 'canAccessBackup',
  },
];

// Filtra i menu items basati sui permessi dell'operatore
export const getAccessibleMenuItems = (operator: Operator | null): MenuItem[] => {
  if (!operator) return [];

  const permissions = getOperatorPermissions(operator);

  return MENU_ITEMS.filter((item) => {
    // Se non ha requisiti di permesso, è accessibile a tutti
    if (!item.requiredPermission) return true;

    // Controlla se l'operatore ha il permesso richiesto
    return permissions[item.requiredPermission] ?? false;
  });
};

// Descrizioni ruoli per UI
export const ROLE_LABELS = {
  business_admin: {
    label: 'Amministratore Business',
    description: 'Accesso completo a tutti i negozi e funzionalità del business',
    color: 'purple',
  },
  store_admin: {
    label: 'Amministratore Negozio',
    description: 'Gestione completa del proprio punto vendita',
    color: 'blue',
  },
  manager: {
    label: 'Manager',
    description: 'Gestione operativa del punto vendita',
    color: 'green',
  },
  cashier: {
    label: 'Cassiere',
    description: 'Operazioni di cassa e vendita',
    color: 'gray',
  },
};

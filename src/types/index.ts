// Operatore
export interface Operator {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'manager';
  pin: string;
  avatar?: string;
  active: boolean;
  createdAt: Date;
}

// Prodotto
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  barcode?: string;
  stock: number;
  taxRate: number; // percentuale IVA
  active: boolean;
}

// Categoria
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

// Item nel carrello
export interface CartItem {
  product: Product;
  quantity: number;
  discount?: Discount;
  subtotal: number;
}

// Sconto
export interface Discount {
  id: string;
  type: 'percentage' | 'fixed' | 'coupon';
  value: number; // percentuale o importo fisso
  code?: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
  validFrom?: Date;
  validTo?: Date;
  active: boolean;
}

// Carta fedeltà
export interface LoyaltyCard {
  id: string;
  cardNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  discount: number; // percentuale sconto
  createdAt: Date;
  lastUsed?: Date;
}

// Metodo di pagamento
export interface PaymentMethod {
  type: 'cash' | 'card' | 'digital' | 'voucher';
  amount: number;
  reference?: string;
}

// Transazione/Vendita
export interface Sale {
  id: string;
  date: Date;
  items: CartItem[];
  subtotal: number;
  discounts: Discount[];
  totalDiscount: number;
  taxAmount: number;
  total: number;
  payments: PaymentMethod[];
  operator: Operator;
  loyaltyCard?: LoyaltyCard;
  notes?: string;
  status: 'completed' | 'cancelled' | 'refunded';
}

// Turno di cassa
export interface CashRegisterShift {
  id: string;
  operator: Operator;
  openedAt: Date;
  closedAt?: Date;
  openingBalance: number;
  expectedBalance: number;
  actualBalance?: number;
  difference?: number;
  sales: Sale[];
  status: 'open' | 'closed';
  notes?: string;
}

// Stats dashboard
export interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  averageTransaction: number;
  topProducts: Array<{ product: Product; quantity: number; revenue: number }>;
  salesByHour: Array<{ hour: number; amount: number }>;
  paymentMethodsBreakdown: Array<{ method: string; amount: number; count: number }>;
}

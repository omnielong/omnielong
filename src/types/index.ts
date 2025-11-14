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
  name: string;
  type: 'percentage' | 'fixed' | 'coupon';
  value: number; // percentuale o importo fisso
  description?: string;
  code?: string; // Alias per couponCode (deprecated)
  couponCode?: string;
  minAmount?: number; // Alias per minPurchase (deprecated)
  minPurchase?: number;
  maxAmount?: number;
  validFrom?: Date;
  validTo?: Date; // Alias per validUntil (deprecated)
  validUntil?: Date;
  maxUses?: number;
  usedCount?: number;
  active?: boolean;
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

// ===== CONFIGURAZIONE SETTORE MERCEOLOGICO =====

export type BusinessSector = 'fashion' | 'bar' | 'restaurant' | 'generic';

export interface SectorConfig {
  sector: BusinessSector;
  storeName: string;
  vatNumber?: string;
  address?: string;
  phone?: string;
  email?: string;
  configured: boolean;
}

// ===== MODA - Varianti Prodotto =====

export interface ProductVariant {
  id: string;
  size?: string; // XS, S, M, L, XL, XXL, 38, 40, 42, etc.
  color?: string; // Rosso, Blu, Verde, etc.
  barcode?: string; // Codice EAN specifico per variante
  sku?: string; // Codice SKU
  stock: number;
  priceAdjustment?: number; // +/- rispetto al prezzo base
  image?: string; // Immagine specifica per colore
}

export interface FashionProduct extends Product {
  variants?: ProductVariant[];
  season?: 'PE' | 'AI'; // Primavera/Estate, Autunno/Inverno
  brand?: string;
  gender?: 'uomo' | 'donna' | 'unisex' | 'bambino';
  composition?: string; // es. "100% cotone"
}

// ===== RISTORANTE - Tavoli e Comande =====

export interface Table {
  id: string;
  number: number;
  seats: number;
  status: 'free' | 'occupied' | 'reserved' | 'billed';
  currentOrder?: RestaurantOrder;
  section?: string; // Sala, Giardino, Veranda, etc.
}

export interface OrderModifier {
  id: string;
  name: string;
  type: 'add' | 'remove' | 'note';
  price?: number; // Costo aggiuntivo se type = 'add'
  description: string;
}

export interface RestaurantOrderItem extends CartItem {
  modifiers?: OrderModifier[];
  notes?: string; // Note cucina
  destination?: 'kitchen' | 'bar'; // Dove va la comanda
  status?: 'pending' | 'preparing' | 'ready' | 'served';
}

export interface RestaurantOrder {
  id: string;
  tableId: string;
  covers: number; // Numero coperti
  items: RestaurantOrderItem[];
  openedAt: Date;
  status: 'open' | 'closed';
}

// ===== BAR - Pulsanti Rapidi =====

export interface QuickButton {
  id: string;
  productId: string;
  label: string;
  color: string;
  position: number; // Per ordinamento
  category?: string;
}

// ===== ITEM CARRELLO ESTESO =====

// Estende CartItem per supportare varianti e modificatori
export interface ExtendedCartItem extends CartItem {
  variant?: ProductVariant; // Per Moda
  modifiers?: OrderModifier[]; // Per Ristorante
  itemNotes?: string; // Note specifiche item
}

// ===== RESI E RIMBORSI =====

export type ReturnReason =
  | 'defective' // Prodotto difettoso
  | 'wrong_size' // Taglia/misura sbagliata
  | 'wrong_item' // Articolo sbagliato
  | 'not_as_described' // Non conforme alla descrizione
  | 'customer_changed_mind' // Cliente ha cambiato idea
  | 'duplicate' // Duplicato
  | 'other'; // Altro

export interface ReturnItem {
  cartItem: CartItem; // Item originale dalla vendita
  quantityToReturn: number; // Quantità da rendere (può essere parziale)
  reason: ReturnReason;
  notes?: string;
  refundAmount: number; // Importo rimborsato per questo item
}

export interface Return {
  id: string;
  date: Date;
  originalSale: Sale; // Vendita originale
  returnItems: ReturnItem[]; // Items restituiti
  totalRefund: number; // Totale rimborso
  refundPayments: PaymentMethod[]; // Come viene rimborsato
  operator: Operator;
  notes?: string;
  status: 'completed' | 'partial' | 'cancelled';
}

// ===== CHIUSURA FISCALE =====

export interface FiscalClosure {
  id: string;
  date: Date;
  startDate: Date; // Inizio periodo (es. 00:00 del giorno)
  endDate: Date; // Fine periodo (es. 23:59 del giorno)
  operator: Operator;

  // Vendite
  totalSales: number;
  salesCount: number;
  salesAmount: number;

  // Resi
  returnsCount: number;
  returnsAmount: number;

  // Pagamenti
  paymentBreakdown: {
    cash: number;
    card: number;
    digital: number;
    voucher: number;
  };

  // Sconti
  totalDiscounts: number;

  // IVA
  totalTax: number;

  // Netto
  netAmount: number;

  // Top prodotti
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;

  notes?: string;
}

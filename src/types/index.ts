// ===== ARCHITETTURA MULTI-TENANT =====

// Rivenditore - Chi vende il sistema POS
export interface Reseller {
  id: string;
  companyName: string;
  vatNumber: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  logo?: string;
  active: boolean;
  createdAt: Date;
  // Commissione sulle vendite
  commissionRate?: number; // Percentuale
  // Limiti
  maxBusinesses?: number; // Max clienti
  // Credenziali admin rivenditore
  adminEmail: string;
  adminName: string;
}

// Cliente/Business - Azienda che usa il POS
export interface Business {
  id: string;
  resellerId: string; // A quale rivenditore appartiene
  companyName: string;
  vatNumber?: string;
  fiscalCode?: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  logo?: string;
  active: boolean;
  createdAt: Date;
  // Settore di attività
  businessSector?: BusinessSector; // Settore principale dell'attività
  // Abbonamento
  subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  subscriptionStartDate: Date;
  subscriptionEndDate?: Date;
  // Credenziali admin business
  adminEmail: string;
  adminName: string;
  password?: string; // Password per accesso dashboard (gestita dal reseller)
  // Limiti piano
  maxStores: number; // Max punti vendita
  maxOperatorsPerStore: number; // Max operatori per store
  // Fatturazione
  billingEmail?: string;
  paymentMethod?: 'credit_card' | 'bank_transfer' | 'paypal';
}

// Punto Vendita - Negozio fisico
export interface Store {
  id: string;
  businessId: string; // A quale business appartiene
  name: string;
  code: string; // Codice univoco (es. "STORE-001")
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone?: string;
  email?: string;
  // Configurazione settore
  sector: BusinessSector;
  // Stato
  active: boolean;
  createdAt: Date;
  // Orari di apertura
  openingHours?: {
    [key: string]: { // 'monday', 'tuesday', etc.
      open: string; // "09:00"
      close: string; // "20:00"
      closed: boolean;
    };
  };
  // Informazioni fiscali specifiche del punto vendita
  cashRegisterCode?: string; // Codice registratore di cassa
  fiscalPrinterSerial?: string;
}

// Operatore (modificato per multi-tenant)
export interface Operator {
  id: string;
  storeId: string; // A quale punto vendita appartiene
  businessId: string; // A quale business appartiene
  name: string;
  email: string;
  role: 'business_admin' | 'store_admin' | 'manager' | 'cashier' | 'reseller_viewer' | 'business_viewer';
  pin: string;
  avatar?: string;
  active: boolean;
  createdAt: Date;
  // Permessi specifici
  permissions?: {
    canAccessReports: boolean;
    canManageProducts: boolean;
    canManageCustomers: boolean;
    canManagePromotions: boolean;
    canManageOperators: boolean;
    canViewSensitiveData: boolean;
    canProcessRefunds: boolean;
    canOpenCloseCashRegister: boolean;
    canSell: boolean; // Permesso di vendere (false per viewer)
  };
}

// Ruoli sistema
export type SystemRole =
  | 'reseller'         // Rivenditore (super admin)
  | 'business_admin'   // Admin del business (gestisce tutti i punti vendita)
  | 'store_admin'      // Admin del punto vendita (può tutto nel suo store)
  | 'manager'          // Manager (gestione avanzata)
  | 'cashier'          // Cassiere (solo vendite)
  | 'reseller_viewer'  // Reseller in modalità visualizzazione negozio (no vendite)
  | 'business_viewer'; // Business admin in modalità visualizzazione negozio (no vendite)

// Piano abbonamento
export interface SubscriptionPlan {
  id: string;
  name: string;
  level: 'free' | 'basic' | 'professional' | 'enterprise';
  monthlyPrice: number;
  yearlyPrice: number;
  features: {
    maxStores: number;
    maxOperatorsPerStore: number;
    maxProducts: number;
    advancedReports: boolean;
    multiCurrency: boolean;
    apiAccess: boolean;
    customBranding: boolean;
    prioritySupport: boolean;
    onPremise: boolean;
  };
}

// Statistiche Rivenditore
export interface ResellerStats {
  totalBusinesses: number;
  activeBusinesses: number;
  totalStores: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  totalTransactions: number;
  avgTransactionValue: number;
}

// Statistiche Business
export interface BusinessStats {
  totalStores: number;
  activeStores: number;
  totalOperators: number;
  totalSales: number;
  totalRevenue: number;
  totalCustomers: number;
  topSellingStore?: Store;
}

// ===== FINE ARCHITETTURA MULTI-TENANT =====

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

// Tipi di promozione avanzati
export type DiscountType =
  | 'percentage'        // Sconto percentuale semplice
  | 'fixed'             // Sconto fisso in euro
  | 'coupon'            // Codice coupon
  | 'buy_x_get_y'       // 3x2, compra N prendi M gratis
  | 'bundle'            // Bundle di prodotti
  | 'progressive'       // Sconti progressivi per fasce di spesa
  | 'second_item'       // Seconda unità scontata
  | 'category'          // Sconto per categoria
  | 'happy_hour'        // Sconto per fascia oraria
  | 'quantity';         // Sconto per quantità minima

// Sconto
export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
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

  // ===== NUOVI CAMPI PER PROMOZIONI AVANZATE =====

  // 3x2, NxM - compra N prendi M gratis
  buyQuantity?: number;      // Es. compra 3
  getQuantity?: number;      // Es. prendi 1 gratis (totale 4 prodotti)

  // Bundle - pacchetti di prodotti
  bundleProductIds?: string[];  // Lista IDs prodotti nel bundle
  bundlePrice?: number;         // Prezzo speciale del bundle

  // Sconti progressivi per fasce di spesa
  progressiveTiers?: Array<{
    minSpend: number;      // Soglia minima di spesa
    discount: number;      // Sconto (percentuale o fisso a seconda del type)
  }>;

  // Seconda unità scontata
  secondItemDiscount?: number;  // Percentuale sconto sulla seconda unità

  // Sconto per categoria
  categoryIds?: string[];       // IDs categorie a cui si applica

  // Happy Hour - fasce orarie
  timeRanges?: Array<{
    startTime: string;    // Es. "17:00"
    endTime: string;      // Es. "19:00"
  }>;

  // Giorni della settimana (0=Domenica, 1=Lunedì, ..., 6=Sabato)
  validDays?: number[];   // Es. [1, 2, 3] = Lun, Mar, Mer

  // Quantità minima richiesta
  minQuantity?: number;   // Es. compra almeno 3 articoli

  // Applicazione specifica
  productIds?: string[];  // IDs prodotti specifici (se vuoto = tutti)

  // Esclusioni
  excludeProductIds?: string[];     // Prodotti esclusi
  excludeCategoryIds?: string[];    // Categorie escluse

  // Solo per clienti con carta fedeltà
  loyaltyOnly?: boolean;
  minLoyaltyLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';

  // Combinabilità con altre promozioni
  combinable?: boolean;   // Default false = non combinabile
  priority?: number;      // Priorità applicazione (più alto = prima)
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

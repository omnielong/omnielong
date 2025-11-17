import { z } from 'zod';

/**
 * Schema validazione per Operator
 */
export const OperatorSchema = z.object({
  id: z.string().min(1, 'ID operatore richiesto'),
  name: z.string().min(2, 'Nome deve contenere almeno 2 caratteri').max(100),
  pin: z.string().regex(/^\d{4,6}$/, 'PIN deve essere 4-6 cifre numeriche'),
  role: z.enum(['reseller_admin', 'business_admin', 'pos_manager', 'pos_operator']),
  businessId: z.string().min(1, 'Business ID richiesto'),
  storeId: z.string().min(1, 'Store ID richiesto'),
  createdAt: z.date(),
});

/**
 * Schema validazione per Product
 */
export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Nome prodotto richiesto').max(200),
  price: z.number().positive('Prezzo deve essere maggiore di zero'),
  category: z.string().min(1, 'Categoria richiesta'),
  image: z.string().url('URL immagine non valido').optional(),
  barcode: z.string().optional(),
  stock: z.number().int().nonnegative('Scorte non possono essere negative').optional(),
  description: z.string().max(500).optional(),
});

/**
 * Schema validazione per Sale
 */
export const SaleSchema = z.object({
  id: z.string().min(1),
  items: z.array(
    z.object({
      product: ProductSchema,
      quantity: z.number().int().positive('Quantità deve essere almeno 1'),
      discount: z
        .object({
          id: z.string(),
          name: z.string(),
          type: z.enum(['percentage', 'fixed', 'coupon']),
          value: z.number().positive(),
        })
        .optional(),
    })
  ),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  total: z.number().positive('Totale deve essere maggiore di zero'),
  paymentMethod: z.enum(['cash', 'card', 'digital']),
  operatorId: z.string().min(1),
  customerId: z.string().optional(),
  loyaltyCardId: z.string().optional(),
  timestamp: z.date(),
  shiftId: z.string().optional(),
});

/**
 * Schema validazione per Customer
 */
export const CustomerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, 'Nome deve contenere almeno 2 caratteri').max(100),
  email: z.string().email('Email non valida').optional(),
  phone: z
    .string()
    .regex(/^[\d\s+()-]{10,20}$/, 'Numero di telefono non valido')
    .optional(),
  fiscalCode: z.string().length(16, 'Codice fiscale deve essere 16 caratteri').optional(),
  vatNumber: z
    .string()
    .regex(/^\d{11}$/, 'Partita IVA deve essere 11 cifre')
    .optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  postalCode: z.string().max(10).optional(),
  loyaltyCardId: z.string().optional(),
});

/**
 * Schema validazione per API Configuration
 */
export const APIConfigSchema = z.object({
  baseUrl: z.string().url('URL base non valido'),
  apiKey: z.string().min(1, 'API Key richiesta').optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  timeout: z.number().int().positive().max(60000, 'Timeout massimo: 60 secondi').optional(),
});

/**
 * Schema validazione per Cash Register Shift
 */
export const ShiftSchema = z.object({
  id: z.string().min(1),
  operatorId: z.string().min(1),
  openingBalance: z.number().nonnegative('Fondo cassa non può essere negativo'),
  closingBalance: z.number().nonnegative().optional(),
  expectedBalance: z.number().nonnegative().optional(),
  difference: z.number().optional(),
  openedAt: z.date(),
  closedAt: z.date().optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Schema validazione per Login
 */
export const LoginSchema = z.object({
  pin: z.string().regex(/^\d{4,6}$/, 'PIN deve essere 4-6 cifre numeriche'),
});

/**
 * Schema validazione per Discount
 */
export const DiscountSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Nome sconto richiesto').max(100),
  type: z.enum(['percentage', 'fixed', 'coupon']),
  value: z.number().positive('Valore sconto deve essere positivo'),
  code: z.string().optional(),
  minPurchase: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  validFrom: z.date().optional(),
  validUntil: z.date().optional(),
});

/**
 * Schema validazione per Loyalty Card
 */
export const LoyaltyCardSchema = z.object({
  id: z.string().min(1),
  cardNumber: z.string().min(5, 'Numero carta troppo corto'),
  customerName: z.string().min(2).max(100),
  points: z.number().int().nonnegative('Punti non possono essere negativi'),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum']),
  discount: z.number().min(0).max(100, 'Sconto massimo: 100%'),
  createdAt: z.date(),
  lastUsed: z.date().optional(),
});

/**
 * Schema validazione per Business
 */
export const BusinessSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, 'Nome business richiesto').max(200),
  vatNumber: z
    .string()
    .regex(/^\d{11}$/, 'Partita IVA deve essere 11 cifre')
    .optional(),
  email: z.string().email('Email non valida'),
  phone: z.string().regex(/^[\d\s+()-]{10,20}$/, 'Numero di telefono non valido'),
  address: z.string().min(5, 'Indirizzo richiesto').max(200),
  resellerId: z.string().min(1, 'Reseller ID richiesto'),
  subscriptionTier: z.enum(['basic', 'professional', 'enterprise']),
  subscriptionExpiresAt: z.date(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

/**
 * Schema validazione per Store
 */
export const StoreSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, 'Nome store richiesto').max(200),
  businessId: z.string().min(1, 'Business ID richiesto'),
  address: z.string().min(5, 'Indirizzo richiesto').max(200),
  phone: z.string().regex(/^[\d\s+()-]{10,20}$/, 'Numero di telefono non valido'),
  isActive: z.boolean(),
  createdAt: z.date(),
});

/**
 * Helper: valida dati con schema e restituisce errori formattati
 */
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return { valid: false, errors };
  }

  return { valid: true, data: result.data, errors: [] };
};

/**
 * Type exports per inferenza TypeScript dai Zod schemas
 */
export type ValidatedOperator = z.infer<typeof OperatorSchema>;
export type ValidatedProduct = z.infer<typeof ProductSchema>;
export type ValidatedSale = z.infer<typeof SaleSchema>;
export type ValidatedCustomer = z.infer<typeof CustomerSchema>;
export type ValidatedAPIConfig = z.infer<typeof APIConfigSchema>;
export type ValidatedShift = z.infer<typeof ShiftSchema>;
export type ValidatedDiscount = z.infer<typeof DiscountSchema>;
export type ValidatedLoyaltyCard = z.infer<typeof LoyaltyCardSchema>;
export type ValidatedBusiness = z.infer<typeof BusinessSchema>;
export type ValidatedStore = z.infer<typeof StoreSchema>;

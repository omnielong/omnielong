import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Operator,
  Product,
  CartItem,
  Discount,
  LoyaltyCard,
  Sale,
  CashRegisterShift,
  Category,
} from '../types';

interface AppState {
  // Auth
  currentOperator: Operator | null;
  login: (operator: Operator) => void;
  logout: () => void;

  // Cash Register Shift
  currentShift: CashRegisterShift | null;
  openShift: (operator: Operator, openingBalance: number) => void;
  closeShift: (actualBalance: number, notes?: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyDiscountToItem: (productId: string, discount: Discount) => void;
  clearCart: () => void;

  // Global discount
  globalDiscount: Discount | null;
  applyGlobalDiscount: (discount: Discount) => void;
  removeGlobalDiscount: () => void;

  // Loyalty card
  activeLoyaltyCard: LoyaltyCard | null;
  applyLoyaltyCard: (card: LoyaltyCard) => void;
  removeLoyaltyCard: () => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;

  // Sales
  sales: Sale[];
  addSale: (sale: Sale) => void;

  // Discounts
  discounts: Discount[];
  setDiscounts: (discounts: Discount[]) => void;

  // Loyalty Cards
  loyaltyCards: LoyaltyCard[];
  setLoyaltyCards: (cards: LoyaltyCard[]) => void;
  addLoyaltyCard: (card: LoyaltyCard) => void;
  updateLoyaltyCard: (card: LoyaltyCard) => void;

  // Operators
  operators: Operator[];
  setOperators: (operators: Operator[]) => void;

  // Calculations
  getCartSubtotal: () => number;
  getCartTotal: () => number;
  getTotalDiscount: () => number;
  getTaxAmount: () => number;
}

const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentOperator: null,
      currentShift: null,
      cart: [],
      globalDiscount: null,
      activeLoyaltyCard: null,
      products: [],
      categories: [],
      sales: [],
      discounts: [],
      loyaltyCards: [],
      operators: [],

      // Auth actions
      login: (operator) => set({ currentOperator: operator }),
      logout: () =>
        set({
          currentOperator: null,
          cart: [],
          globalDiscount: null,
          activeLoyaltyCard: null,
        }),

      // Cash Register Shift
      openShift: (operator, openingBalance) => {
        const shift: CashRegisterShift = {
          id: `shift-${Date.now()}`,
          operator,
          openedAt: new Date(),
          openingBalance,
          expectedBalance: openingBalance,
          sales: [],
          status: 'open',
        };
        set({ currentShift: shift });
      },

      closeShift: (actualBalance, notes) => {
        const { currentShift, sales } = get();
        if (currentShift) {
          const shiftSales = sales.filter(
            (sale) =>
              new Date(sale.date) >= currentShift.openedAt &&
              sale.status === 'completed'
          );

          const totalCash = shiftSales.reduce((sum, sale) => {
            const cashPayments = sale.payments
              .filter((p) => p.type === 'cash')
              .reduce((s, p) => s + p.amount, 0);
            return sum + cashPayments;
          }, 0);

          const expectedBalance = currentShift.openingBalance + totalCash;
          const difference = actualBalance - expectedBalance;

          set({
            currentShift: {
              ...currentShift,
              closedAt: new Date(),
              actualBalance,
              expectedBalance,
              difference,
              sales: shiftSales,
              status: 'closed',
              notes,
            },
          });
        }
      },

      // Cart actions
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + quantity,
                    subtotal: (item.quantity + quantity) * item.product.price,
                  }
                : item
            ),
          });
        } else {
          set({
            cart: [
              ...cart,
              {
                product,
                quantity,
                subtotal: product.price * quantity,
              },
            ],
          });
        }
      },

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId
              ? {
                  ...item,
                  quantity,
                  subtotal: quantity * item.product.price,
                }
              : item
          ),
        }));
      },

      applyDiscountToItem: (productId, discount) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, discount } : item
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
          globalDiscount: null,
          activeLoyaltyCard: null,
        }),

      // Global discount
      applyGlobalDiscount: (discount) => set({ globalDiscount: discount }),
      removeGlobalDiscount: () => set({ globalDiscount: null }),

      // Loyalty card
      applyLoyaltyCard: (card) => set({ activeLoyaltyCard: card }),
      removeLoyaltyCard: () => set({ activeLoyaltyCard: null }),

      // Products & Categories
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),

      // Sales
      addSale: (sale) =>
        set((state) => ({
          sales: [...state.sales, sale],
        })),

      // Discounts
      setDiscounts: (discounts) => set({ discounts }),

      // Loyalty Cards
      setLoyaltyCards: (cards) => set({ loyaltyCards: cards }),
      addLoyaltyCard: (card) =>
        set((state) => ({
          loyaltyCards: [...state.loyaltyCards, card],
        })),
      updateLoyaltyCard: (card) =>
        set((state) => ({
          loyaltyCards: state.loyaltyCards.map((c) =>
            c.id === card.id ? card : c
          ),
        })),

      // Operators
      setOperators: (operators) => set({ operators }),

      // Calculations
      getCartSubtotal: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => {
          let itemTotal = item.subtotal;

          // Apply item-specific discount
          if (item.discount) {
            if (item.discount.type === 'percentage') {
              itemTotal -= (itemTotal * item.discount.value) / 100;
            } else if (item.discount.type === 'fixed') {
              itemTotal -= item.discount.value;
            }
          }

          return sum + itemTotal;
        }, 0);
      },

      getTotalDiscount: () => {
        const { cart, globalDiscount, activeLoyaltyCard } = get();
        let discount = 0;

        // Item-specific discounts
        cart.forEach((item) => {
          if (item.discount) {
            if (item.discount.type === 'percentage') {
              discount += (item.subtotal * item.discount.value) / 100;
            } else if (item.discount.type === 'fixed') {
              discount += item.discount.value;
            }
          }
        });

        const subtotal = get().getCartSubtotal();

        // Global discount
        if (globalDiscount) {
          if (globalDiscount.type === 'percentage') {
            discount += (subtotal * globalDiscount.value) / 100;
          } else if (globalDiscount.type === 'fixed') {
            discount += globalDiscount.value;
          }
        }

        // Loyalty card discount
        if (activeLoyaltyCard) {
          discount += (subtotal * activeLoyaltyCard.discount) / 100;
        }

        return discount;
      },

      getTaxAmount: () => {
        const { cart } = get();
        return cart.reduce((sum, item) => {
          const itemPrice = item.product.price * item.quantity;
          const tax = (itemPrice * item.product.taxRate) / 100;
          return sum + tax;
        }, 0);
      },

      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getTotalDiscount();
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: 'pos-storage',
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        sales: state.sales,
        discounts: state.discounts,
        loyaltyCards: state.loyaltyCards,
        operators: state.operators,
      }),
    }
  )
);

export default useStore;

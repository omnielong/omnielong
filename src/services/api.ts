/**
 * API Service per integrazione con sistemi esterni (es. Zucchetti)
 *
 * Questo modulo fornisce un'interfaccia per sincronizzare i dati
 * del POS con sistemi gestionali esterni come Zucchetti.
 */

import type { Product, Sale, Operator, LoyaltyCard } from '../types';

interface APIConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
}

class APIService {
  private config: APIConfig | null = null;
  private isConnected: boolean = false;

  /**
   * Configura la connessione al sistema esterno
   */
  configure(config: APIConfig) {
    this.config = config;
    this.isConnected = false;
  }

  /**
   * Testa la connessione al sistema esterno
   */
  async testConnection(): Promise<boolean> {
    if (!this.config) {
      throw new Error('API non configurata');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/health`, {
        headers: this.getHeaders(),
      });

      this.isConnected = response.ok;
      return response.ok;
    } catch (error) {
      console.error('Errore connessione API:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Sincronizza i prodotti dal sistema esterno
   */
  async syncProducts(): Promise<Product[]> {
    if (!this.config) {
      throw new Error('API non configurata');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/products`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Errore sync prodotti: ${response.statusText}`);
      }

      const data = await response.json();
      return this.mapProductsFromExternal(data);
    } catch (error) {
      console.error('Errore sync prodotti:', error);
      throw error;
    }
  }

  /**
   * Invia una vendita al sistema esterno
   */
  async sendSale(sale: Sale): Promise<{ success: boolean; externalId?: string }> {
    if (!this.config) {
      throw new Error('API non configurata');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/sales`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(this.mapSaleToExternal(sale)),
      });

      if (!response.ok) {
        throw new Error(`Errore invio vendita: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        externalId: data.id || data.externalId,
      };
    } catch (error) {
      console.error('Errore invio vendita:', error);
      return { success: false };
    }
  }

  /**
   * Sincronizza le carte fedeltà
   */
  async syncLoyaltyCards(): Promise<LoyaltyCard[]> {
    if (!this.config) {
      throw new Error('API non configurata');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/loyalty-cards`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Errore sync carte fedeltà: ${response.statusText}`);
      }

      const data = await response.json();
      return this.mapLoyaltyCardsFromExternal(data);
    } catch (error) {
      console.error('Errore sync carte fedeltà:', error);
      throw error;
    }
  }

  /**
   * Aggiorna i punti di una carta fedeltà
   */
  async updateLoyaltyCardPoints(cardNumber: string, points: number): Promise<boolean> {
    if (!this.config) {
      throw new Error('API non configurata');
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/api/v1/loyalty-cards/${cardNumber}/points`,
        {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify({ points }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Errore aggiornamento punti:', error);
      return false;
    }
  }

  /**
   * Sincronizza gli operatori
   */
  async syncOperators(): Promise<Operator[]> {
    if (!this.config) {
      throw new Error('API non configurata');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/operators`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Errore sync operatori: ${response.statusText}`);
      }

      const data = await response.json();
      return this.mapOperatorsFromExternal(data);
    } catch (error) {
      console.error('Errore sync operatori:', error);
      throw error;
    }
  }

  /**
   * Ottiene lo stato della sincronizzazione
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // ===== METODI PRIVATI =====

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config?.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    } else if (this.config?.username && this.config?.password) {
      const auth = btoa(`${this.config.username}:${this.config.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }

  /**
   * Mappa i prodotti dal formato esterno al formato interno
   */
  private mapProductsFromExternal(externalProducts: any[]): Product[] {
    return externalProducts.map((p) => ({
      id: p.id || p.code,
      name: p.name || p.description,
      description: p.description || p.longDescription || '',
      price: parseFloat(p.price || p.unitPrice || 0),
      category: p.category || p.categoryId || 'uncategorized',
      barcode: p.barcode || p.ean || p.code,
      stock: parseInt(p.stock || p.quantity || 0),
      taxRate: parseFloat(p.taxRate || p.vat || 22),
      active: p.active !== false,
      image: p.image || p.imageUrl,
    }));
  }

  /**
   * Mappa una vendita dal formato interno al formato esterno
   */
  private mapSaleToExternal(sale: Sale): any {
    return {
      id: sale.id,
      date: sale.date.toISOString(),
      operatorId: sale.operator.id,
      items: sale.items.map((item) => ({
        productId: item.product.id,
        productCode: item.product.barcode,
        quantity: item.quantity,
        unitPrice: item.product.price,
        subtotal: item.subtotal,
        taxRate: item.product.taxRate,
      })),
      subtotal: sale.subtotal,
      discounts: sale.discounts.map((d) => ({
        type: d.type,
        value: d.value,
        code: d.code,
        description: d.description,
      })),
      totalDiscount: sale.totalDiscount,
      taxAmount: sale.taxAmount,
      total: sale.total,
      payments: sale.payments.map((p) => ({
        type: p.type,
        amount: p.amount,
        reference: p.reference,
      })),
      loyaltyCardNumber: sale.loyaltyCard?.cardNumber,
      notes: sale.notes,
      status: sale.status,
    };
  }

  /**
   * Mappa le carte fedeltà dal formato esterno
   */
  private mapLoyaltyCardsFromExternal(externalCards: any[]): LoyaltyCard[] {
    return externalCards.map((c) => ({
      id: c.id,
      cardNumber: c.cardNumber || c.code,
      customerName: c.customerName || c.name,
      customerEmail: c.email,
      customerPhone: c.phone || c.mobile,
      points: parseInt(c.points || 0),
      level: c.level || 'bronze',
      discount: parseFloat(c.discount || 0),
      createdAt: new Date(c.createdAt || c.registrationDate),
      lastUsed: c.lastUsed ? new Date(c.lastUsed) : undefined,
    }));
  }

  /**
   * Mappa gli operatori dal formato esterno
   */
  private mapOperatorsFromExternal(externalOperators: any[]): Operator[] {
    return externalOperators.map((o) => ({
      id: o.id,
      storeId: o.storeId || 'store-1',
      businessId: o.businessId || 'bus-1',
      name: o.name || `${o.firstName} ${o.lastName}`,
      email: o.email,
      role: o.role || 'cashier',
      pin: o.pin || o.code,
      avatar: o.avatar || o.photo,
      active: o.active !== false,
      createdAt: new Date(o.createdAt || o.registrationDate),
    }));
  }
}

// Singleton instance
export const apiService = new APIService();

// Hook personalizzato per React
export function useAPI() {
  return {
    configure: apiService.configure.bind(apiService),
    testConnection: apiService.testConnection.bind(apiService),
    syncProducts: apiService.syncProducts.bind(apiService),
    sendSale: apiService.sendSale.bind(apiService),
    syncLoyaltyCards: apiService.syncLoyaltyCards.bind(apiService),
    updateLoyaltyCardPoints: apiService.updateLoyaltyCardPoints.bind(apiService),
    syncOperators: apiService.syncOperators.bind(apiService),
    getConnectionStatus: apiService.getConnectionStatus.bind(apiService),
  };
}

export default apiService;

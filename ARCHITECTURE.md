# Architecture Documentation

## System Overview

OmnieLong is a multi-tenant POS (Point of Sale) system designed for retail businesses. It supports a hierarchical structure: Reseller → Business → Store → Operators.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages     │  │  Components  │  │   Store      │      │
│  │  - POS      │  │  - Cart      │  │  (Zustand)   │      │
│  │  - Dashboard│  │  - Checkout  │  │              │      │
│  │  - Admin    │  │  - ProductGrd│  │              │      │
│  └─────────────┘  └──────────────┘  └──────────────┘      │
│           │                │                  │            │
│           └────────────────┴──────────────────┘            │
│                            │                               │
│                     ┌──────▼──────┐                        │
│                     │  Services   │                        │
│                     │  - API      │                        │
│                     │  - Logger   │                        │
│                     │  - Sentry   │                        │
│                     └──────┬──────┘                        │
└────────────────────────────┼───────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  Local Storage  │
                    │  (Persistence)  │
                    └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │  External APIs  │
                    │  - Zucchetti    │
                    │  - Other ERP    │
                    └─────────────────┘
```

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing

### State Management
- **Zustand** - Lightweight state management
- **Zustand Persist** - LocalStorage persistence

### Data Validation
- **Zod** - Runtime type validation

### Testing
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Monitoring & Logging
- **Sentry** - Error tracking
- **Custom Logger** - Structured logging

### Internationalization
- **react-i18next** - Multi-language support

### Security
- **bcryptjs** - Password/PIN hashing
- **Custom encryption** - API key encryption

## Data Model

### Entity Relationship

```
Reseller (1) ────< (N) Business (1) ────< (N) Store (1) ────< (N) Operator
                                                 │
                                                 ├──< (N) Product
                                                 ├──< (N) Category
                                                 ├──< (N) Sale
                                                 ├──< (N) Customer
                                                 └──< (N) LoyaltyCard
```

### Core Entities

#### Reseller
```typescript
{
  id: string;
  companyName: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: Date;
}
```

#### Business
```typescript
{
  id: string;
  name: string;
  resellerId: string;
  vatNumber: string;
  subscriptionTier: 'basic' | 'professional' | 'enterprise';
  subscriptionExpiresAt: Date;
  isActive: boolean;
}
```

#### Store
```typescript
{
  id: string;
  name: string;
  businessId: string;
  address: string;
  phone: string;
  isActive: boolean;
}
```

#### Operator
```typescript
{
  id: string;
  name: string;
  pin: string; // hashed
  role: 'reseller_admin' | 'business_admin' | 'pos_manager' | 'pos_operator';
  businessId: string;
  storeId: string;
}
```

## Multi-Tenant Architecture

### Hierarchy Levels

1. **Reseller Level**
   - Manages multiple businesses
   - Global settings and configurations
   - Billing and subscriptions

2. **Business Level**
   - Manages multiple stores
   - Business-wide operators
   - Centralized reporting

3. **Store Level**
   - Individual point of sale
   - Store-specific inventory
   - Daily operations

### Data Isolation

- Each tenant's data is isolated by `resellerId`, `businessId`, and `storeId`
- Access control enforced at route and component level
- Role-based permissions (RBAC)

## Permission System

### Roles

| Role | Permissions |
|------|-------------|
| `reseller_admin` | Full access to all businesses |
| `business_admin` | Full access to all stores in business |
| `pos_manager` | Manage store operations, view reports |
| `pos_operator` | Process sales only |

### Permission Matrix

```typescript
const ROLE_PERMISSIONS = {
  reseller_admin: {
    manage_businesses: true,
    manage_operators: true,
    manage_products: true,
    view_reports: true,
    manage_promotions: true,
    // ... all permissions
  },
  business_admin: {
    manage_operators: true,
    manage_products: true,
    view_reports: true,
    manage_promotions: true,
    // ... business-level permissions
  },
  pos_manager: {
    manage_products: true,
    view_reports: true,
    process_sales: true,
    // ... manager permissions
  },
  pos_operator: {
    process_sales: true,
    // ... basic permissions
  }
};
```

## State Management

### Zustand Store Structure

```typescript
interface AppState {
  // Auth
  currentOperator: Operator | null;
  currentUser: AuthUser;
  currentStore: Store | null;

  // POS
  cart: CartItem[];
  selectedCustomer: Customer | null;
  globalDiscount: Discount | null;
  activeLoyaltyCard: LoyaltyCard | null;

  // Cash Register
  currentShift: CashRegisterShift | null;

  // Data
  products: Product[];
  categories: Category[];
  sales: Sale[];
  operators: Operator[];
  loyaltyCards: LoyaltyCard[];
  // ...

  // Actions
  login: (operator: Operator) => void;
  addToCart: (product: Product) => void;
  // ...
}
```

### Persistence Strategy

- **Persisted**: products, categories, sales, operators, settings
- **Session-only**: cart, currentShift, UI state
- **Storage**: localStorage with Zustand persist middleware

## API Integration

### External API Service

```typescript
class APIService {
  private config: APIConfig;

  // Connection
  testConnection(): Promise<boolean>;

  // Products
  syncProducts(): Promise<Product[]>;

  // Sales
  sendSale(sale: Sale): Promise<void>;

  // Loyalty
  updateLoyaltyPoints(cardId: string, points: number): Promise<void>;
}
```

### Supported Endpoints

```
GET  /api/v1/health
GET  /api/v1/products
POST /api/v1/sales
GET  /api/v1/loyalty-cards
PUT  /api/v1/loyalty-cards/:id/points
GET  /api/v1/operators
```

## Security Architecture

### Authentication Flow

```
1. User enters PIN
2. Hash comparison with bcrypt
3. Generate session token
4. Store in Zustand (memory only)
5. Validate on protected routes
```

### Data Encryption

- **PIN**: bcrypt hashing (salt rounds: 10)
- **API Keys**: XOR encryption + Base64 encoding
- **Sensitive data**: Encrypted before localStorage

### Security Headers (Nginx)

```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self' https:; ...
```

## Performance Optimizations

### Code Splitting

- Route-based code splitting with React Router
- Lazy loading for heavy components
- Dynamic imports for large libraries

### Caching Strategy

- **Service Worker**: PWA caching for offline support
- **Memory**: React.memo for expensive re-renders
- **Storage**: IndexedDB for large datasets (future)

### Bundle Optimization

- Tree-shaking with Vite
- Minification and compression
- Asset optimization (images, fonts)

## Testing Strategy

### Test Pyramid

```
        /\
       /  \  E2E (Playwright) - 20%
      /────\
     /      \  Integration - 30%
    /────────\
   /          \  Unit Tests (Vitest) - 50%
  /────────────\
```

### Test Coverage Goals

- **Unit Tests**: 60%+ coverage
- **Integration**: Critical user flows
- **E2E**: Happy paths and edge cases

## Monitoring & Observability

### Error Tracking (Sentry)

- Automatic error capture
- User context tracking
- Performance monitoring
- Session replay

### Custom Logging

```typescript
logger.info('Sale completed', { saleId, amount });
logger.error('API error', error, { endpoint });
logger.logSale(saleId, amount, operatorId);
```

### Metrics Tracked

- Sales per hour
- Average transaction value
- Product performance
- Operator activity
- Error rates

## Deployment Architecture

### Docker Container

```
┌─────────────────────────┐
│  Nginx (Static Server)  │
│         :80             │
│  ┌───────────────────┐  │
│  │  React SPA (dist) │  │
│  │  - index.html     │  │
│  │  - assets/        │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### CI/CD Pipeline

```
GitHub Push → GitHub Actions
              ├─ Lint
              ├─ Test (Unit + E2E)
              ├─ Build
              ├─ Security Scan
              └─ Deploy (Netlify/Vercel)
```

## Future Architecture Enhancements

### Phase 2: Backend API

```
┌──────────┐     ┌──────────────┐     ┌────────────┐
│ Frontend │────▶│ Backend API  │────▶│ PostgreSQL │
│  (React) │     │  (Node.js)   │     │  Database  │
└──────────┘     └──────────────┘     └────────────┘
                        │
                        ▼
                 ┌──────────────┐
                 │    Redis     │
                 │   (Cache)    │
                 └──────────────┘
```

### Phase 3: Microservices (Optional)

- Sales Service
- Inventory Service
- Analytics Service
- Payment Service

## Development Guidelines

### Adding New Features

1. Define TypeScript types in `src/types/`
2. Create Zod validation schema in `src/validation/`
3. Implement component in `src/components/` or `src/pages/`
4. Add store actions if needed
5. Write unit tests
6. Add E2E tests for critical flows
7. Update documentation

### Code Organization Best Practices

- One component per file
- Co-locate tests with components
- Use barrel exports (`index.ts`)
- Keep files under 300 lines
- Extract reusable logic to hooks

## References

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)

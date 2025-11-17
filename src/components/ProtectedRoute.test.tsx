import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import type { Operator } from '../types';

// Mock react-router-dom Navigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">{to}</div>,
  };
});

const mockAdmin: Operator = {
  id: '1',
  name: 'Admin User',
  pin: '1234',
  role: 'business_admin',
  businessId: 'biz1',
  storeId: 'store1',
  createdAt: new Date(),
};

const mockCashier: Operator = {
  id: '2',
  name: 'Cashier User',
  pin: '5678',
  role: 'pos_operator',
  businessId: 'biz1',
  storeId: 'store1',
  createdAt: new Date(),
};

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('should redirect to login when no operator is logged in', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute currentOperator={null}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByTestId('navigate')).toHaveTextContent('/');
  });

  it('should render children when operator is logged in and no restrictions', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute currentOperator={mockAdmin}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show access denied when role does not match', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute currentOperator={mockCashier} requiredRole={['business_admin']}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Accesso Negato')).toBeInTheDocument();
    expect(screen.getByText(/Non hai i permessi necessari/)).toBeInTheDocument();
  });

  it('should render children when role matches', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute currentOperator={mockAdmin} requiredRole={['business_admin']}>
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should allow access if operator has one of the required roles', () => {
    render(
      <BrowserRouter>
        <ProtectedRoute
          currentOperator={mockCashier}
          requiredRole={['pos_operator', 'pos_manager']}
        >
          <TestComponent />
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

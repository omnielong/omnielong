import { describe, it, expect } from 'vitest';
import { hasPermission, ROLE_PERMISSIONS } from '../utils/permissions';
import type { Operator } from '../types';

describe('Permissions Utils', () => {
  const businessAdmin: Operator = {
    id: '1',
    name: 'Business Admin',
    pin: '1234',
    role: 'business_admin',
    businessId: 'biz1',
    storeId: 'store1',
    createdAt: new Date(),
  };

  const posManager: Operator = {
    id: '2',
    name: 'POS Manager',
    pin: '5678',
    role: 'pos_manager',
    businessId: 'biz1',
    storeId: 'store1',
    createdAt: new Date(),
  };

  const posOperator: Operator = {
    id: '3',
    name: 'POS Operator',
    pin: '9012',
    role: 'pos_operator',
    businessId: 'biz1',
    storeId: 'store1',
    createdAt: new Date(),
  };

  describe('hasPermission', () => {
    it('should grant all permissions to business_admin', () => {
      expect(hasPermission(businessAdmin, 'manage_operators')).toBe(true);
      expect(hasPermission(businessAdmin, 'manage_products')).toBe(true);
      expect(hasPermission(businessAdmin, 'view_reports')).toBe(true);
      expect(hasPermission(businessAdmin, 'manage_promotions')).toBe(true);
    });

    it('should grant limited permissions to pos_manager', () => {
      expect(hasPermission(posManager, 'manage_products')).toBe(true);
      expect(hasPermission(posManager, 'view_reports')).toBe(true);
      expect(hasPermission(posManager, 'process_sales')).toBe(true);
      expect(hasPermission(posManager, 'manage_operators')).toBe(false);
    });

    it('should grant minimal permissions to pos_operator', () => {
      expect(hasPermission(posOperator, 'process_sales')).toBe(true);
      expect(hasPermission(posOperator, 'manage_products')).toBe(false);
      expect(hasPermission(posOperator, 'view_reports')).toBe(false);
      expect(hasPermission(posOperator, 'manage_operators')).toBe(false);
    });
  });

  describe('ROLE_PERMISSIONS', () => {
    it('should have correct structure for all roles', () => {
      expect(ROLE_PERMISSIONS).toHaveProperty('business_admin');
      expect(ROLE_PERMISSIONS).toHaveProperty('pos_manager');
      expect(ROLE_PERMISSIONS).toHaveProperty('pos_operator');
      expect(ROLE_PERMISSIONS).toHaveProperty('reseller_admin');
    });

    it('should have all required permissions defined', () => {
      const requiredPermissions = [
        'manage_operators',
        'manage_products',
        'view_reports',
        'manage_promotions',
        'process_sales',
        'manage_customers',
        'fiscal_operations',
      ];

      requiredPermissions.forEach((permission) => {
        expect(ROLE_PERMISSIONS.business_admin).toHaveProperty(permission);
      });
    });
  });
});

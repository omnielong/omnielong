import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Building2, Store } from 'lucide-react';
import useStore from '../store/useStore';
import type { Reseller, Business } from '../types';

// Mock data - In produzione verrebbe da API
const mockResellers: (Reseller & { password: string })[] = [
  {
    id: 'reseller-1',
    companyName: 'TechPOS Solutions',
    vatNumber: 'IT12345678901',
    email: 'admin@techpos.it',
    password: 'reseller123',
    phone: '+39 02 1234567',
    address: 'Via Roma 123, Milano',
    active: true,
    adminEmail: 'admin@techpos.it',
    adminName: 'Marco Rossi',
    commissionRate: 15,
    maxBusinesses: 50,
    createdAt: new Date('2024-01-01'),
  },
];

const mockBusinesses: (Business & { password: string })[] = [
  {
    id: 'business-1',
    resellerId: 'reseller-1',
    companyName: 'Fashion Store SRL',
    vatNumber: 'IT98765432109',
    fiscalCode: 'FSTSRL98765432',
    email: 'admin@fashionstore.it',
    password: 'business123',
    phone: '+39 06 9876543',
    address: 'Via Condotti 45, Roma',
    active: true,
    subscriptionPlan: 'professional',
    subscriptionStartDate: new Date('2024-01-15'),
    adminEmail: 'admin@fashionstore.it',
    adminName: 'Laura Bianchi',
    maxStores: 5,
    maxOperatorsPerStore: 10,
    billingEmail: 'billing@fashionstore.it',
    paymentMethod: 'credit_card',
    createdAt: new Date('2024-01-15'),
  },
];

const AdminLoginPage: React.FC = () => {
  const [loginType, setLoginType] = useState<'reseller' | 'business'>('business');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginUser } = useStore();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginType === 'reseller') {
      const reseller = mockResellers.find(
        (r) => r.email === email && r.password === password && r.active
      );

      if (reseller) {
        // Rimuovi password prima di salvare nello store
        const { password: _, ...resellerData } = reseller;
        loginUser(resellerData, 'reseller');
        navigate('/reseller');
      } else {
        setError('Email o password non validi');
      }
    } else {
      const business = mockBusinesses.find(
        (b) => b.email === email && b.password === password && b.active
      );

      if (business) {
        // Rimuovi password prima di salvare nello store
        const { password: _, ...businessData } = business;
        loginUser(businessData, 'business');
        navigate('/business');
      } else {
        setError('Email o password non validi');
      }
    }
  };

  const handleToggleType = (type: 'reseller' | 'business') => {
    setLoginType(type);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header with Type Selection */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 text-white">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Omnie POS</h1>
            <p className="text-gray-300">Accesso Amministrativo</p>
          </div>

          {/* Login Type Tabs */}
          <div className="flex space-x-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => handleToggleType('business')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                loginType === 'business'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Store className="w-5 h-5" />
              <span>Business</span>
            </button>
            <button
              onClick={() => handleToggleType('reseller')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                loginType === 'reseller'
                  ? 'bg-white text-gray-900'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Reseller</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            Accedi
          </button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              Credenziali Demo:
            </p>
            {loginType === 'reseller' ? (
              <div className="text-sm text-blue-800 space-y-1">
                <p>Email: <span className="font-mono">admin@techpos.it</span></p>
                <p>Password: <span className="font-mono">reseller123</span></p>
              </div>
            ) : (
              <div className="text-sm text-blue-800 space-y-1">
                <p>Email: <span className="font-mono">admin@fashionstore.it</span></p>
                <p>Password: <span className="font-mono">business123</span></p>
              </div>
            )}
          </div>

          {/* Link to POS Login */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              ← Accesso Operatori POS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import useStore from '../store/useStore';
import { mockOperators } from '../utils/mockData';

const LoginPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, setOperators } = useStore();

  // Initialize operators on first load
  React.useEffect(() => {
    setOperators(mockOperators);
  }, [setOperators]);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleLogin = () => {
    const operator = mockOperators.find((op) => op.pin === pin && op.active);

    if (operator) {
      login(operator);
      navigate('/shift');
    } else {
      setError('PIN non valido');
      setPin('');
    }
  };

  React.useEffect(() => {
    if (pin.length === 4) {
      handleLogin();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Lock className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">POS System</h1>
          <p className="text-gray-600">Inserisci il tuo PIN per accedere</p>
        </div>

        {/* PIN Display */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center ${
                  pin.length > i
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {pin.length > i && (
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
          {error && (
            <p className="text-center text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePinInput(num.toString())}
              className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-semibold text-gray-800 transition-colors touch-manipulation active:scale-95"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="h-16 bg-red-100 hover:bg-red-200 rounded-xl text-lg font-semibold text-red-600 transition-colors touch-manipulation active:scale-95"
          >
            ⌫
          </button>
          <button
            onClick={() => handlePinInput('0')}
            className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-2xl font-semibold text-gray-800 transition-colors touch-manipulation active:scale-95"
          >
            0
          </button>
          <button
            onClick={() => setPin('')}
            className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-600 transition-colors touch-manipulation active:scale-95"
          >
            Reset
          </button>
        </div>

        {/* Operators hint */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-800 font-semibold mb-2 flex items-center">
            <User className="w-4 h-4 mr-2" />
            PIN di test disponibili:
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs text-blue-700">
            <div>
              <div className="font-semibold">Admin</div>
              <div>PIN: 1234</div>
            </div>
            <div>
              <div className="font-semibold">Cassiere</div>
              <div>PIN: 5678</div>
            </div>
            <div>
              <div className="font-semibold">Manager</div>
              <div>PIN: 9012</div>
            </div>
          </div>
        </div>

        {/* Link to Admin Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/admin-login')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Accesso Reseller/Business →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

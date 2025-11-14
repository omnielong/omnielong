import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface AccessDeniedProps {
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = 'Solo gli amministratori possono accedere a questa sezione'
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <Shield className="w-12 h-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Accesso Negato</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        <button
          onClick={() => navigate('/pos')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          Torna al POS
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;

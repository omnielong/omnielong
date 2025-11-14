import React from 'react';
import { Navigate } from 'react-router-dom';
import type { Operator } from '../types';
import { hasPermission, ROLE_PERMISSIONS } from '../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  currentOperator: Operator | null;
  requiredPermission?: keyof typeof ROLE_PERMISSIONS.business_admin;
  requiredRole?: Operator['role'][];
}

/**
 * Componente per proteggere le route in base ai permessi dell'operatore
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  currentOperator,
  requiredPermission,
  requiredRole,
}) => {
  // Se non c'è operatore, redirect al login
  if (!currentOperator) {
    return <Navigate to="/" replace />;
  }

  // Se è richiesto un ruolo specifico
  if (requiredRole && !requiredRole.includes(currentOperator.role)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accesso Negato</h2>
          <p className="text-gray-600 mb-6">
            Non hai i permessi necessari per accedere a questa sezione.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Ruolo richiesto: {requiredRole.join(' o ')}
            </span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  // Se è richiesto un permesso specifico
  if (requiredPermission && !hasPermission(currentOperator, requiredPermission)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Accesso Negato</h2>
          <p className="text-gray-600 mb-6">
            Il tuo ruolo non ha i permessi necessari per accedere a questa funzionalità.
            <br />
            <span className="text-sm text-gray-500 mt-2 block">
              Contatta un amministratore se ritieni di averne bisogno.
            </span>
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  // L'operatore ha i permessi, mostra il contenuto
  return <>{children}</>;
};

export default ProtectedRoute;

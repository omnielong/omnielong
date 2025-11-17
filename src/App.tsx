import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShiftPage from './pages/ShiftPage';
import POSPage from './pages/POSPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import SetupPage from './pages/SetupPage';
import ProductsPage from './pages/ProductsPage';
import CustomersPage from './pages/CustomersPage';
import PromotionsPage from './pages/PromotionsPage';
import ReturnsPage from './pages/ReturnsPage';
import OperatorsPage from './pages/OperatorsPage';
import FiscalClosurePage from './pages/FiscalClosurePage';
import BackupPage from './pages/BackupPage';
import ResellerDashboard from './pages/ResellerDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import BusinessForm from './pages/BusinessForm';
import StoreForm from './pages/StoreForm';
import BusinessOperatorsPage from './pages/BusinessOperatorsPage';
import OperatorForm from './pages/OperatorForm';
import RoleSelectionPage from './pages/RoleSelectionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import useStore from './store/useStore';

// Lazy load pages for better performance
const ShiftPage = lazy(() => import('./pages/ShiftPage'));
const POSPage = lazy(() => import('./pages/POSPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SetupPage = lazy(() => import('./pages/SetupPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const CustomersPage = lazy(() => import('./pages/CustomersPage'));
const PromotionsPage = lazy(() => import('./pages/PromotionsPage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const OperatorsPage = lazy(() => import('./pages/OperatorsPage'));
const FiscalClosurePage = lazy(() => import('./pages/FiscalClosurePage'));
const BackupPage = lazy(() => import('./pages/BackupPage'));
const ResellerDashboard = lazy(() => import('./pages/ResellerDashboard'));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'));
const BusinessForm = lazy(() => import('./pages/BusinessForm'));
const StoreForm = lazy(() => import('./pages/StoreForm'));
const BusinessOperatorsPage = lazy(() => import('./pages/BusinessOperatorsPage'));
const OperatorForm = lazy(() => import('./pages/OperatorForm'));
const RoleSelectionPage = lazy(() => import('./pages/RoleSelectionPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 font-medium">Caricamento...</p>
    </div>
  </div>
);

function App() {
  const { currentOperator, currentUser, sectorConfig } = useStore();

  // Se il settore non è configurato, mostra setup
  if (!sectorConfig?.configured) {
    return (
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="*" element={<SetupPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Redirect root to unified login */}
          <Route path="/" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />

        {/* Reseller Routes - Protected */}
        <Route
          path="/reseller"
          element={
            currentUser?.type === 'reseller' ? (
              <ResellerDashboard />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />
        <Route
          path="/reseller/businesses/new"
          element={
            currentUser?.type === 'reseller' ? (
              <BusinessForm />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />
        <Route
          path="/reseller/businesses/:id/edit"
          element={
            currentUser?.type === 'reseller' ? (
              <BusinessForm />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          }
        />

          {/* Business Routes - Protected */}
          <Route
            path="/business"
            element={
              currentUser?.type === 'business' ? (
                <BusinessDashboard />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route
            path="/business/stores/new"
            element={
              currentUser?.type === 'business' ? (
                <StoreForm />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route
            path="/business/stores/:id/edit"
            element={
              currentUser?.type === 'business' ? (
                <StoreForm />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route
            path="/business/operators"
            element={
              currentUser?.type === 'business' ? (
                <BusinessOperatorsPage />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route
            path="/business/operators/new"
            element={
              currentUser?.type === 'business' ? (
                <OperatorForm />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route
            path="/business/operators/:id/edit"
            element={
              currentUser?.type === 'business' ? (
                <OperatorForm />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />

          {/* Store/POS Routes */}
          <Route
            path="/shift"
            element={currentOperator ? <ShiftPage /> : <Navigate to="/admin-login" replace />}
          />
          <Route
            path="/pos"
            element={currentOperator ? <POSPage /> : <Navigate to="/admin-login" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canAccessReports"
              >
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canAccessSettings"
              >
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canManageProducts"
              >
                <ProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={currentOperator ? <CustomersPage /> : <Navigate to="/admin-login" replace />}
          />
          <Route
            path="/promotions"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canManagePromotions"
              >
                <PromotionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/returns"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canProcessRefunds"
              >
                <ReturnsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/operators"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canManageOperators"
              >
                <OperatorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fiscal-closure"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canAccessFiscalClosure"
              >
                <FiscalClosurePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/backup"
            element={
              <ProtectedRoute
                currentOperator={currentOperator}
                requiredPermission="canAccessBackup"
              >
                <BackupPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/admin-login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

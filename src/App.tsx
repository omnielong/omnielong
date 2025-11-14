import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
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
import RoleSelectionPage from './pages/RoleSelectionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import useStore from './store/useStore';

function App() {
  const { currentOperator, currentUser, sectorConfig } = useStore();

  // Se il settore non è configurato, mostra setup
  if (!sectorConfig?.configured) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<SetupPage />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
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

        {/* Store/POS Routes */}
        <Route
          path="/shift"
          element={
            currentOperator ? <ShiftPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/pos"
          element={
            currentOperator ? <POSPage /> : <Navigate to="/" replace />
          }
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
          element={
            currentOperator ? <CustomersPage /> : <Navigate to="/" replace />
          }
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

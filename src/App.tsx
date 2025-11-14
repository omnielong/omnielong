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
import useStore from './store/useStore';

function App() {
  const { currentOperator, sectorConfig } = useStore();

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
        <Route path="/role-selection" element={<RoleSelectionPage />} />

        {/* Reseller Routes */}
        <Route path="/reseller" element={<ResellerDashboard />} />
        <Route path="/reseller/businesses/new" element={<BusinessForm />} />
        <Route path="/reseller/businesses/:id/edit" element={<BusinessForm />} />

        {/* Business Routes */}
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/business/stores/new" element={<StoreForm />} />
        <Route path="/business/stores/:id/edit" element={<StoreForm />} />

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
            currentOperator ? <DashboardPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/settings"
          element={
            currentOperator ? <SettingsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/products"
          element={
            currentOperator ? <ProductsPage /> : <Navigate to="/" replace />
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
            currentOperator ? <PromotionsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/returns"
          element={
            currentOperator ? <ReturnsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/operators"
          element={
            currentOperator ? <OperatorsPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/fiscal-closure"
          element={
            currentOperator ? <FiscalClosurePage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/backup"
          element={
            currentOperator ? <BackupPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

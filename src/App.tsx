import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Import Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import OrdersPage from '@/pages/OrdersPage';
import DeliveriesPage from '@/pages/DeliveriesPage';
import GestionPage from '@/pages/GestionPage';
import NotFound from '@/pages/NotFound';
import SignUp from '@/pages/auth/SignUp';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import VerifyOtp from '@/pages/auth/VerifyOtp';

// Import Layouts
import AppLayout from '@/components/layout/AppLayout';

// This component protects routes that require authentication.
// If the user is not authenticated, it redirects them to the home page.
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <AppLayout /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Protected Routes inside AppLayout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/deliveries" element={<DeliveriesPage />} />
        <Route path="/gestion" element={<GestionPage />} />
      </Route>

      {/* Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
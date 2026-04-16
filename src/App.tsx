import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useAuthStore';

// Layouts and Shared Components
import Layout from './components/Layout';
// import AdminLayout from './components/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import SpecialMenu from './pages/SpecialMenu';
import ItemDetail from './pages/ItemDetail';
import Reviews from './pages/Reviews';
import Cart from './pages/Cart';
import Login from './pages/Login';

// Protected Pages
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Account from './pages/Account';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminItems from './pages/admin/Items';
import AdminOrders from './pages/admin/Orders';
import AdminReviews from './pages/admin/Reviews';

// Component to protect authenticated routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isInitialized } = useAuthStore();
  if (!isInitialized) return null;
  if (!session) return <Navigate to="/login" />;
  return <>{children}</>;
};

// Component to protect admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, role, isInitialized } = useAuthStore();
  if (!isInitialized) return null;
  if (!session || role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading Tasty Kitchen...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/special" element={<SpecialMenu />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/invoice/:orderId" element={
            <ProtectedRoute><Invoice /></ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute><Account /></ProtectedRoute>
          } />
        </Route>
        
        <Route path="/admin" element={
          <AdminRoute><AdminLayout /></AdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="items" element={<AdminItems />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reviews" element={<AdminReviews />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

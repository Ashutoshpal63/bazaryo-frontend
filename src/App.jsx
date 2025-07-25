import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// --- CONTEXT PROVIDERS ---
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// --- LAYOUTS & ROUTE GUARDS ---
import { MainLayout } from './components/layout/MainLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// --- PAGE IMPORTS ---

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProductsPage } from './pages/public/ProductsPage';
import { ProductDetailsPage } from './pages/public/ProductDetailsPage';
import { ShopDetailsPage } from './pages/public/ShopDetailsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Customer Pages
import { CartPage } from './pages/customer/CartPage';
import { MyOrdersPage } from './pages/customer/MyOrdersPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';

// Shopkeeper Pages
import { ShopkeeperDashboard } from './pages/shopkeeper/ShopkeeperDashboard';
import { ManageProductsPage } from './pages/shopkeeper/ManageProductsPage';
import { ShopOrdersPage } from './pages/shopkeeper/ShopOrdersPage';

// Delivery Agent Pages
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { AvailableOrdersPage } from './pages/delivery/AvailableOrdersPage';
import { MyDeliveriesPage } from './pages/delivery/MyDeliveriesPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { ManageShopsPage } from './pages/admin/ManageShopsPage';
import { ManageOrdersPage } from './pages/admin/ManageOrdersPage';

// Not Found Page
import { NotFoundPage } from './pages/NotFoundPage';


function App() {
  return (
    // AuthProvider must be on the outside as other contexts may depend on it
    <AuthProvider>
      {/* CartProvider needs to know the user, so it goes inside AuthProvider */}
      <CartProvider>
        {/* Router enables navigation throughout the app */}
        <Router>
          {/* Toaster provides beautiful notifications across the app */}
          <Toaster 
            position="top-center" 
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
          <Routes>
            {/* --- PUBLIC & AUTH ROUTES --- */}
            {/* These routes do not require login and use their own full-page layouts */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* These routes are public but use the MainLayout (Navbar + Footer) */}
            <Route path="/" element={<HomePage />} />
            <Route element={<MainLayout />}>
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/shops/:id" element={<ShopDetailsPage />} />
            </Route>

            {/* --- PROTECTED ROUTES (CUSTOMER) --- */}
            <Route element={<ProtectedRoute roles={['customer']} />}>
              <Route element={<MainLayout />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                {/* Note: Tracking page is shared but defined here for customer access */}
                <Route path="/orders/:id/track" element={<OrderTrackingPage />} />
              </Route>
            </Route>

            {/* --- PROTECTED ROUTES (SHOPKEEPER) --- */}
            <Route element={<ProtectedRoute roles={['shopkeeper']} />}>
              <Route path="/shopkeeper" element={<DashboardLayout />}>
                <Route index element={<ShopkeeperDashboard />} /> {/* Default page for /shopkeeper */}
                <Route path="dashboard" element={<ShopkeeperDashboard />} />
                <Route path="products" element={<ManageProductsPage />} />
                <Route path="orders" element={<ShopOrdersPage />} />
              </Route>
            </Route>
            
            {/* --- PROTECTED ROUTES (DELIVERY AGENT) --- */}
            <Route element={<ProtectedRoute roles={['delivery_agent']} />}>
              <Route path="/delivery" element={<DashboardLayout />}>
                <Route index element={<DeliveryDashboard />} />
                <Route path="dashboard" element={<DeliveryDashboard />} />
                <Route path="available-orders" element={<AvailableOrdersPage />} />
                <Route path="my-deliveries" element={<MyDeliveriesPage />} />
              </Route>
            </Route>
            
            {/* --- PROTECTED ROUTES (ADMIN) --- */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="/admin" element={<DashboardLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsersPage />} />
                <Route path="shops" element={<ManageShopsPage />} />
                <Route path="orders" element={<ManageOrdersPage />} />
              </Route>
            </Route>

            {/* --- NOT FOUND (FALLBACK) ROUTE --- */}
            {/* This route must be the last one to catch all unmatched URLs */}
            <Route path="*" element={<NotFoundPage />} />
            
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
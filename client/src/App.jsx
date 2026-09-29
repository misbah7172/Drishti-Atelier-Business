import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Components
import CinematicGlassesIntro from './components/CinematicGlassesIntro';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import NotFound from './pages/NotFound/NotFound';
import PlaceholderPage from './pages/PlaceholderPage/PlaceholderPage';

// Auth Pages (Phase 3)
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Account from './pages/Account/Account';

// Cart & Wishlist Pages (Phase 5)
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
        <WishlistProvider>
        <BrowserRouter>
          <CinematicGlassesIntro />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#171717',
                color: '#FFFFFF',
                border: '1px solid #292929',
                borderRadius: '8px',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: {
                  primary: '#F97D01',
                  secondary: '#050505',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Public Routes */}
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="about" element={<PlaceholderPage title="About Us" phase={10} />} />
              <Route path="contact" element={<PlaceholderPage title="Contact Us" phase={10} />} />
              <Route path="faq" element={<PlaceholderPage title="FAQ" phase={10} />} />
              <Route path="privacy" element={<PlaceholderPage title="Privacy Policy" phase={10} />} />
              <Route path="terms" element={<PlaceholderPage title="Terms & Conditions" phase={10} />} />

              {/* Auth Routes (Phase 3) */}
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />

              {/* Cart & Wishlist (Phase 5) */}
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />

              {/* Protected Customer Routes (Phase 3 / 6 / 7) */}
              <Route element={<ProtectedRoute />}>
                <Route path="checkout" element={<PlaceholderPage title="Checkout" phase={6} />} />
                <Route path="order-success/:id" element={<PlaceholderPage title="Order Confirmation" phase={6} />} />
                <Route path="account" element={<Account />} />
                <Route path="account/orders" element={<PlaceholderPage title="Order History" phase={7} />} />
                <Route path="account/orders/:id" element={<PlaceholderPage title="Order Details" phase={7} />} />
              </Route>

              {/* Protected Admin Routes (Phase 3 / 8 / 9) */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<PlaceholderPage title="Admin Dashboard" phase={8} />} />
                <Route path="admin/products" element={<PlaceholderPage title="Manage Products" phase={9} />} />
                <Route path="admin/products/new" element={<PlaceholderPage title="Add Product" phase={9} />} />
                <Route path="admin/products/:id" element={<PlaceholderPage title="Edit Product" phase={9} />} />
                <Route path="admin/users" element={<PlaceholderPage title="Manage Users" phase={9} />} />
                <Route path="admin/orders" element={<PlaceholderPage title="Manage Orders" phase={9} />} />
                <Route path="admin/orders/:id" element={<PlaceholderPage title="Order Details" phase={9} />} />
                <Route path="admin/categories" element={<PlaceholderPage title="Manage Categories" phase={9} />} />
                <Route path="admin/coupons" element={<PlaceholderPage title="Manage Coupons" phase={9} />} />
                <Route path="admin/reviews" element={<PlaceholderPage title="Manage Reviews" phase={9} />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

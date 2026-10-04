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
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AuthCallback from './pages/Auth/AuthCallback';
import Account from './pages/Account/Account';

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '467831801487-st6pan7d82hsqqnbb0bm2t34ptaib88n.apps.googleusercontent.com';

// Cart & Wishlist Pages (Phase 5)
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist';

// Checkout & Order Pages (Phase 6)
import Checkout from './pages/Checkout/Checkout';
import OrderSuccess from './pages/OrderSuccess/OrderSuccess';
import OrderHistory from './pages/Orders/OrderHistory';
import OrderDetail from './pages/Orders/OrderDetail';

// Customer Account Pages (Phase 7)
import Profile from './pages/Account/Profile/Profile';
import Addresses from './pages/Account/Addresses/Addresses';

// Admin (Phase 8 + 9)
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard/Dashboard';
import ManageProducts from './pages/Admin/Products/ManageProducts';
import ManageUsers from './pages/Admin/Users/ManageUsers';
import ManageOrders from './pages/Admin/Orders/ManageOrders';
import ManageCategories from './pages/Admin/Categories/ManageCategories';
import ManageCoupons from './pages/Admin/Coupons/ManageCoupons';
import ManageReviews from './pages/Admin/Reviews/ManageReviews';
import AdminSettings from './pages/Admin/Settings/Settings';

// Public Pages (Phase 10)
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import FAQ from './pages/FAQ/FAQ';
import Privacy from './pages/Privacy/Privacy';
import Terms from './pages/Terms/Terms';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />

                {/* Auth Routes (Phase 3) */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="auth/callback" element={<AuthCallback />} />

              {/* Cart & Wishlist (Phase 5) */}
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />

              {/* Protected Customer Routes (Phase 6 / 7) */}
              <Route element={<ProtectedRoute />}>
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success/:id" element={<OrderSuccess />} />
                <Route path="account" element={<Account />} />
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/addresses" element={<Addresses />} />
                <Route path="account/orders" element={<OrderHistory />} />
                <Route path="account/orders/:id" element={<OrderDetail />} />
              </Route>

              {/* Protected Admin Routes (Phase 8 / 9) */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="products/new" element={<PlaceholderPage title="Add Product" phase={9} />} />
                  <Route path="products/:id" element={<PlaceholderPage title="Edit Product" phase={9} />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="orders" element={<ManageOrders />} />
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="coupons" element={<ManageCoupons />} />
                  <Route path="reviews" element={<ManageReviews />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
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
    </GoogleOAuthProvider>
  );
}

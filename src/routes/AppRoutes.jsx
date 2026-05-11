import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AppLayout } from '../components/layout/AppLayout'
import { useAuth } from '../context/AuthContext'
import Dashboard from '../pages/Dashboard'
import Products from '../pages/Products'
import Categories from '../pages/Categories'
import Users from '../pages/Users'
import Orders from '../pages/Orders'
import Banners from '../pages/Banners'
import Announcements from '../pages/Announcements'
import TopBar from '../pages/TopBar'
import RevenueAnalytics from '../pages/analytics/RevenueAnalytics'
import OrderAnalytics from '../pages/analytics/OrderAnalytics'
import ProductAnalytics from '../pages/analytics/ProductAnalytics'
import UserAnalytics from '../pages/analytics/UserAnalytics'
import CartWishlistAnalytics from '../pages/analytics/CartWishlistAnalytics'
import CategoryAnalytics from '../pages/analytics/CategoryAnalytics'
import BulkOrders from '../pages/BulkOrders'
import ContactInquiries from '../pages/ContactInquiries'
import Coupons from '../pages/Coupons'

const ProductCreate = lazy(() => import('../pages/ProductCreate'))
const ProductEdit = lazy(() => import('../pages/ProductEdit'))
const ProductContent = lazy(() => import('../pages/ProductContent'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

function AuthLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Verifying credentials...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <AuthLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRedirect />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/new" element={<Suspense fallback={<LoadingFallback />}><ProductCreate /></Suspense>} />
        <Route path="/products/:id/edit" element={<Suspense fallback={<LoadingFallback />}><ProductEdit /></Suspense>} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/banners" element={<Banners />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/topbar" element={<TopBar />} />
        <Route path="/product-content" element={<Suspense fallback={<LoadingFallback />}><ProductContent /></Suspense>} />
        <Route path="/analytics/revenue" element={<RevenueAnalytics />} />
        <Route path="/analytics/orders" element={<OrderAnalytics />} />
        <Route path="/analytics/products" element={<ProductAnalytics />} />
        <Route path="/analytics/users" element={<UserAnalytics />} />
        <Route path="/analytics/cart-wishlist" element={<CartWishlistAnalytics />} />
        <Route path="/analytics/categories" element={<CategoryAnalytics />} />
        <Route path="/bulk-orders" element={<BulkOrders />} />
        <Route path="/contact-inquiries" element={<ContactInquiries />} />
        <Route path="/coupons" element={<Coupons />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import Login from '../pages/Login'

function LoginRedirect() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <AuthLoader />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Login />
}

import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import NGOs from './pages/NGOs'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterNGO from './pages/RegisterNGO'
import Verify from './pages/Verify'
import Donate from './pages/Donate'
import Feedback from './pages/Feedback'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import DonorDashboard from './pages/DonorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NGODashboard from './pages/NGODashboard'
import NgoPickups from './pages/NgoPickups'
import NgoPickupDetailPage from './pages/NgoPickupDetailPage'

function AppContent() {
  const location = useLocation()
  
  // Hide navbar and footer on dashboard pages
  const isDashboardPage = ['/dashboard/user', '/dashboard/donor', '/dashboard/admin', '/dashboard/ngo'].some((p) => location.pathname === p || location.pathname.startsWith(p + '/'))

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboardPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/ngos" element={<NGOs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/ngo" element={<RegisterNGO />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Donor and user both use donor dashboard (donor = donate items) */}
          <Route path="/dashboard/user" element={<Navigate to="/dashboard/donor" replace />} />
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ngo"
            element={
              <ProtectedRoute requiredRole="ngo">
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor/pickups"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard initialPage="pickups" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor/pickups/new"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard initialPage="pickup-new" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor/pickups/:pickupId"
            element={
              <ProtectedRoute requiredRole="donor">
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ngo/pickups"
            element={
              <ProtectedRoute requiredRole="ngo">
                <NgoPickups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ngo/pickups/:pickupId"
            element={
              <ProtectedRoute requiredRole="ngo">
                <NgoPickupDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isDashboardPage && (
        <>
          <Footer />
          <BackToTop />
        </>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

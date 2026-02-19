import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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
import Verify from './pages/Verify'
import Donate from './pages/Donate'
import Feedback from './pages/Feedback'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import NGODashboard from './pages/NGODashboard'

function AppContent() {
  const location = useLocation()
  
  // Hide navbar and footer on dashboard pages
  const isDashboardPage = ['/dashboard/user', '/dashboard/admin', '/dashboard/ngo'].includes(location.pathname)

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
          <Route path="/verify" element={<Verify />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
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

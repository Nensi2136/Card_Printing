import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import About from './pages/About';
import Product from './pages/Product';
import Customize from './pages/Customize';
import Upgrade from './pages/Upgrade';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import Categories from './pages/admin/Categories';
import Templates from './pages/admin/Templates';
import Users from './pages/admin/Users';
import Payments from './pages/admin/Payments';
import ContactMessages from './pages/admin/ContactMessages';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useApp();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminLoggedIn } = useApp();
  return isAdminLoggedIn ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAdminRoute && <Header />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/product/:type" element={<Product />} />
          <Route 
            path="/customize" 
            element={
              <ProtectedRoute>
                <Customize />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/upgrade" 
            element={
              <ProtectedRoute>
                <Upgrade />
              </ProtectedRoute>
            } 
          />
          <Route path="/contact" element={<Contact />} />
          
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/categories" 
            element={
              <AdminProtectedRoute>
                <Categories />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/templates" 
            element={
              <AdminProtectedRoute>
                <Templates />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <AdminProtectedRoute>
                <Users />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/payments" 
            element={
              <AdminProtectedRoute>
                <Payments />
              </AdminProtectedRoute>
            } 
          />
          <Route 
            path="/admin/contact-messages" 
            element={
              <AdminProtectedRoute>
                <ContactMessages />
              </AdminProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
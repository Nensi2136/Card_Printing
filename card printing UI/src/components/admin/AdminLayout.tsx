import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  LogOut,
  Shield,
  Folder,
  Image,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { adminUser, setAdminUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setAdminUser(null);
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/categories', icon: Folder, label: 'Categories' },
    { path: '/admin/templates', icon: Image, label: 'Templates' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/payments', icon: DollarSign, label: 'Payments' },
    { path: '/admin/contact-messages', icon: Mail, label: 'Contact Messages' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900">
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <Shield className="h-8 w-8 text-blue-400 mr-2" />
          <span className="text-white text-xl font-bold">Admin Panel</span>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 w-full p-4 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm">
              <p className="font-medium">{adminUser?.username}</p>
              <p className="text-gray-400">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
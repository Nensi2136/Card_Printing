import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, CardData } from '../types';

interface AdminUser {
  id: string;
  username: string;
  role: string;
  loginTime: string;
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  cardData: CardData;
  setCardData: (data: CardData) => void;
  isLoggedIn: boolean;
  isAdminLoggedIn: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCardData: CardData = {
  businessName: '',
  email: '',
  website: '',
  userName: '',
  phone: '',
  address: '',
  title: '',
  backgroundColor: '#2563eb',
  textColor: '#ffffff'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [cardData, setCardData] = useState<CardData>(initialCardData);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('cardcraft_user');
    const savedAdminUser = localStorage.getItem('cardcraft_admin_user');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('cardcraft_user');
      }
    }
    
    if (savedAdminUser) {
      try {
        setAdminUser(JSON.parse(savedAdminUser));
      } catch (error) {
        console.error('Error parsing saved admin user:', error);
        localStorage.removeItem('cardcraft_admin_user');
      }
    }
  }, []);

  // Enhanced setUser with localStorage persistence
  const setUserWithPersistence = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('cardcraft_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('cardcraft_user');
    }
  };

  // Enhanced setAdminUser with localStorage persistence
  const setAdminUserWithPersistence = (newAdminUser: AdminUser | null) => {
    setAdminUser(newAdminUser);
    if (newAdminUser) {
      localStorage.setItem('cardcraft_admin_user', JSON.stringify(newAdminUser));
    } else {
      localStorage.removeItem('cardcraft_admin_user');
    }
  };

  const isLoggedIn = !!user;
  const isAdminLoggedIn = !!adminUser;

  return (
    <AppContext.Provider value={{
      user,
      setUser: setUserWithPersistence,
      adminUser,
      setAdminUser: setAdminUserWithPersistence,
      cardData,
      setCardData,
      isLoggedIn,
      isAdminLoggedIn
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
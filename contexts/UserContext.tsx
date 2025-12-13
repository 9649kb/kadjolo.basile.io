
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { currentUser as defaultAdmin, vendorProfiles, siteConfig } from '../services/mockData';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: string) => Promise<void>;
  register: (name: string, email: string, role: 'student' | 'creator') => Promise<void>;
  logout: () => void;
  // Dev tools
  role: 'admin' | 'creator' | 'student' | 'visitor'; 
  switchRole: (role: 'admin' | 'creator' | 'student' | 'visitor') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check LocalStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('kadjolo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, role?: string) => {
    // SIMULATED LOGIN LOGIC
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Admin Backdoor
        if (email.includes('admin') || email === defaultAdmin.email) {
          const adminUser = defaultAdmin;
          setUser(adminUser);
          localStorage.setItem('kadjolo_user', JSON.stringify(adminUser));
          resolve();
          return;
        }

        // Mock Login for standard users
        const mockUser: User = {
          id: `u_${Date.now()}`,
          name: email.split('@')[0],
          email: email,
          role: (role as any) || 'student', // Default to student if not specified
          avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
          balance: 0,
          joinedAt: new Date().toISOString()
        };
        
        setUser(mockUser);
        localStorage.setItem('kadjolo_user', JSON.stringify(mockUser));
        resolve();
      }, 800);
    });
  };

  const register = async (name: string, email: string, role: 'student' | 'creator') => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          id: `u_${Date.now()}`,
          name: name,
          email: email,
          role: role,
          avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
          balance: 0,
          joinedAt: new Date().toISOString()
        };

        // If Vendor, we would typically init a vendor profile here
        if (role === 'creator') {
           // In a real app, this would trigger a backend creation
           console.log("Vendor Profile Initialized for", name);
        }

        setUser(newUser);
        localStorage.setItem('kadjolo_user', JSON.stringify(newUser));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kadjolo_user');
    window.location.href = '/'; // Hard redirect to home
  };

  // Improved Dev Tool Logic
  const switchRole = (newRole: 'admin' | 'creator' | 'student' | 'visitor') => {
    if (newRole === 'visitor') {
      logout();
      return;
    }

    if (user) {
      // If user is logged in, just update their role in state
      const updatedUser = { ...user, role: newRole as any };
      // Special case: If switching to Admin, make sure they have Founder flag/perms
      if (newRole === 'admin') {
         updatedUser.isFounder = true;
         updatedUser.name = siteConfig.adminName;
         updatedUser.avatar = siteConfig.profilePicture;
      }
      setUser(updatedUser);
      localStorage.setItem('kadjolo_user', JSON.stringify(updatedUser));
    } else {
      // If NOT logged in, auto-login a mock user for that role
      let mockUser: User;
      
      if (newRole === 'admin') {
        mockUser = defaultAdmin;
      } else if (newRole === 'creator') {
        mockUser = {
          id: 'v1_mock',
          name: 'Vendeur Test',
          email: 'vendeur@test.com',
          role: 'creator',
          avatar: 'https://ui-avatars.com/api/?name=Vendeur&background=0D8ABC&color=fff',
          balance: 150000,
          joinedAt: new Date().toISOString()
        };
      } else {
        mockUser = {
          id: 's1_mock',
          name: 'Client Test',
          email: 'client@test.com',
          role: 'student',
          avatar: 'https://ui-avatars.com/api/?name=Client&background=16a34a&color=fff',
          balance: 0,
          joinedAt: new Date().toISOString()
        };
      }
      setUser(mockUser);
      localStorage.setItem('kadjolo_user', JSON.stringify(mockUser));
    }
  };

  const currentRole = !user ? 'visitor' : user.role;

  return (
    <UserContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      role: currentRole as any,
      switchRole 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

import React, { createContext, useContext, useState } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  registeredUsers: User[];
  register: (email: string, password: string, name: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<Array<{ email: string; password: string; name: string }>>([]);

  const register = (email: string, password: string, name: string) => {
    if (registeredUsers.some(user => user.email === email)) {
      return false;
    }
    setRegisteredUsers([...registeredUsers, { email, password, name }]);
    return true;
  };

  const login = (email: string, password: string) => {
    const user = registeredUsers.find(
      u => u.email === email && u.password === password
    );
    if (user) {
      setUser({ email: user.email, name: user.name });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, registeredUsers, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
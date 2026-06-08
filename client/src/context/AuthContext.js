import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  isLoggedIn: 'isLoggedIn',
  userData: 'userData',
};

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    localStorage.removeItem(key);
    return fallback;
  }
};

const resolveRole = (session) => {
  const user = session?.user;

  if (user?.ADMIN_ID) return 'admin';
  if (user?.DOCTOR_ID) return 'doctor';
  if (user?.NURSE_ID) return 'nurse';
  if (user?.PATIENT_ID) return 'patient';

  return null;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => readJson(STORAGE_KEYS.isLoggedIn, false));
  const [userData, setUserData] = useState(() => readJson(STORAGE_KEYS.userData, null));

  const login = (session) => {
    setIsLoggedIn(true);
    setUserData(session);
    localStorage.setItem(STORAGE_KEYS.isLoggedIn, JSON.stringify(true));
    localStorage.setItem(STORAGE_KEYS.userData, JSON.stringify(session));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem(STORAGE_KEYS.isLoggedIn);
    localStorage.removeItem(STORAGE_KEYS.userData);
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      userData,
      role: resolveRole(userData),
      login,
      logout,
    }),
    [isLoggedIn, userData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};

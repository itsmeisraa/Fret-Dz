// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [ready, setReady] = useState(false);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    const stored = localStorage.getItem('fret_user');
    if (stored) setUser(JSON.parse(stored));
    setReady(true);
  }, []);

  function signIn(token, userData) {
    localStorage.setItem('fret_token', token);
    localStorage.setItem('fret_user', JSON.stringify(userData));
    setUser(userData);
  }

  function signOut() {
    localStorage.removeItem('fret_token');
    localStorage.removeItem('fret_user');
    setUser(null);
  }

  return (
    <Ctx.Provider value={{ user, ready, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);

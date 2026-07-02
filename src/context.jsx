// ============================================
// CONTEXT - All React contexts in one file
// ============================================

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

// ---------- Storage Helpers ----------
const NS = 'atlasora';

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(`${NS}:${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

function removeKey(key) {
  localStorage.removeItem(`${NS}:${key}`);
}

// ---------- AuthContext ----------
const AuthContext = createContext(null);

function usersKey() {
  return 'users';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON('session', null));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) writeJSON('session', user);
    else removeKey('session');
  }, [user]);

  const signup = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const users = readJSON(usersKey(), []);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setLoading(false);
      throw new Error('An account with that email already exists.');
    }
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password, // demo only — never store plaintext passwords in a real app
      createdAt: new Date().toISOString(),
      homeBase: '',
      bio: '',
    };
    writeJSON(usersKey(), [...users, newUser]);
    const { password: _pw, ...publicUser } = newUser;
    setUser(publicUser);
    setLoading(false);
    return publicUser;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const users = readJSON(usersKey(), []);
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    setLoading(false);
    if (!found) throw new Error('That email and password combination doesn\u2019t match our records.');
    const { password: _pw, ...publicUser } = found;
    setUser(publicUser);
    return publicUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      const users = readJSON(usersKey(), []);
      writeJSON(
        usersKey(),
        users.map((u) => (u.id === updated.id ? { ...u, ...patch } : u))
      );
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// ---------- SavedContext ----------
const SavedContext = createContext(null);

function keyFor() {
  return 'saved:guest';
}

export function SavedProvider({ children }) {
  const storageKey = keyFor();
  const [saved, setSaved] = useState(() => readJSON(storageKey, []));

  useEffect(() => {
    writeJSON(storageKey, saved);
  }, [saved, storageKey]);

  const isSaved = useCallback((cca3) => saved.some((s) => s.cca3 === cca3), [saved]);

  const toggleSave = useCallback((country) => {
    setSaved((prev) => {
      const exists = prev.some((s) => s.cca3 === country.cca3);
      if (exists) return prev.filter((s) => s.cca3 !== country.cca3);
      return [
        ...prev,
        {
          cca3: country.cca3,
          name: country.name?.common ?? country.name,
          flag: country.flags?.svg ?? country.flag,
          region: country.region,
          capital: country.capital?.[0] ?? '',
          latlng: country.latlng,
          savedAt: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const removeSaved = useCallback((cca3) => {
    setSaved((prev) => prev.filter((s) => s.cca3 !== cca3));
  }, []);

  const value = useMemo(
    () => ({ saved, isSaved, toggleSave, removeSaved }),
    [saved, isSaved, toggleSave, removeSaved]
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used within SavedProvider');
  return ctx;
}

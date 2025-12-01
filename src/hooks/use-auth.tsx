'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';

// 1. Definição do Tipo de Cliente
export interface Customer {
  id: string;
  name: string;
  email: string;
  points_saldo: number;
  role?: string; // Definido aqui ✅
}

interface AuthContextType {
  user: Customer | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Customer | null) => void;
  addPoints: (points: number) => Promise<void>; 
  spendPoints: (points: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Erro ao ler sessão:", error);
        localStorage.removeItem('loggedInUser');
    }
    setLoading(false);
  }, []);
  
  const updateUser = useCallback((updatedUser: Customer | null) => {
    setUser(updatedUser);
    if (updatedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    } else {
        localStorage.removeItem('loggedInUser');
    }
  }, []);

  // --- LOGIN ---
  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.warn("Login falhou:", data.error);
            setLoading(false);
            return false;
        }

        // 3. Mapear os dados (AQUI ESTAVA O ERRO)
        const userData: Customer = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            points_saldo: data.user.points || 0,
            role: data.user.role // <--- ESTA LINHA FALTAVA! TENS DE ADICIONAR ISTO.
        };

        updateUser(userData);
        setLoading(false);
        return true;

    } catch (error) {
        console.error("Erro de rede no login:", error);
        setLoading(false);
        return false;
    }
  };

  const logout = () => {
    updateUser(null);
  };
  
  const updatePointsAPI = async (pointsChange: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            email: user.email, 
            pointsChange: pointsChange 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Quando atualizamos pontos, garantimos que o ROLE não se perde
        const updatedUser = { 
            ...user, 
            points_saldo: data.newBalance,
            role: user.role // <--- Mantém o role aqui também
        };
        updateUser(updatedUser);
      } else {
        console.error("Erro ao atualizar pontos:", data.error);
      }
    } catch (error) {
      console.error("Erro de rede ao atualizar pontos:", error);
    }
  };

  const addPoints = useCallback(async (points: number) => {
      if (!user || points <= 0) return;
      await updatePointsAPI(points);
  }, [user, updateUser]);

  const spendPoints = useCallback(async (points: number) => {
      if (!user || points <= 0) return;
      await updatePointsAPI(-points);
  }, [user, updateUser]);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    updateUser,
    addPoints,
    spendPoints,
  }), [user, loading, login, logout, updateUser, addPoints, spendPoints]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
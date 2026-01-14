'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';

// 1. Definição do Tipo de Cliente
export interface Customer {
  id: string;
  name: string;
  email: string;
  points_saldo: number;
  role?: string;
}

interface AuthContextType {
  user: Customer | null;
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
        const storedUser = localStorage.getItem('loggedInUser');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
    } catch (error) {
        console.error("Erro ao ler sessão:", error);
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('authToken');
    }
    setLoading(false);
  }, []);
  
  const updateUser = useCallback((updatedUser: Customer | null) => {
    setUser(updatedUser);
    if (updatedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    } else {
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('authToken');
        setToken(null);
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

        // Guardar Token
        const receivedToken = data.token; 
        if (receivedToken) {
            localStorage.setItem('authToken', receivedToken);
            setToken(receivedToken);
        }

        const userData: Customer = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            points_saldo: data.user.points || 0,
            role: data.user.role 
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
    setToken(null);
    localStorage.removeItem('authToken');
    // Opcional: Redirecionar para login aqui ou deixar a UI tratar disso
    // window.location.href = '/login'; 
  };
  
  // --- ATUALIZAR PONTOS (Endpoint Alterado) ---
  const updatePointsAPI = async (pointsChange: number) => {
    if (!user || !token) {
        console.error("Tentativa de atualizar pontos sem login ou token.");
        return;
    }

    try {
      const response = await fetch('/api/points/update', { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Token enviado no header
        },
        body: JSON.stringify({ 
            email: user.email, 
            pointsChange: pointsChange 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const updatedUser = { 
            ...user, 
            points_saldo: data.newBalance,
        };
        updateUser(updatedUser);
      } else {
        // CORREÇÃO APLICADA AQUI
        if (response.status === 401) {
            console.warn("Sessão expirada. A fazer logout...");
            logout(); // Token expirado ou inválido
            return; // <--- O IMPORTANTE: Pára a função aqui para não dar erro abaixo
        }
        console.error("Erro ao atualizar pontos:", data?.error || "Erro desconhecido");
      }
    } catch (error) {
      console.error("Erro de rede ao atualizar pontos:", error);
    }
  };

  const addPoints = useCallback(async (points: number) => {
      if (!user || points <= 0) return;
      await updatePointsAPI(points);
  }, [user, token, updateUser]); // removi updatePointsAPI das dependencias para evitar loops, pois é declarada dentro do componente

  const spendPoints = useCallback(async (points: number) => {
      if (!user || points <= 0) return;
      await updatePointsAPI(-points);
  }, [user, token, updateUser]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    addPoints,
    spendPoints,
  }), [user, token, loading, login, updateUser, addPoints, spendPoints]); // logout é estável, não precisa estar aqui, mas mal não faz.

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
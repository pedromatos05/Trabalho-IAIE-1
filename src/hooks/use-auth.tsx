'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from 'react';

// 1. Definimos o tipo de Cliente aqui para garantir que bate certo com a API
export interface Customer {
  id: string;
  name: string;
  email: string;
  points_saldo: number;
}

interface AuthContextType {
  user: Customer | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Customer | null) => void;
  addPoints: (points: number) => void;
  spendPoints: (points: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sessão ao recarregar a página
  useEffect(() => {
    setLoading(true);
    try {
        // Tenta ler do localStorage (é melhor que sessionStorage para manter login)
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
  
  // Função para atualizar estado e memória local
  const updateUser = useCallback((updatedUser: Customer | null) => {
    setUser(updatedUser);
    if (updatedUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
    } else {
        localStorage.removeItem('loggedInUser');
    }
  }, []);

  // --- A NOVA FUNÇÃO DE LOGIN REAL ---
  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    
    try {
        // 1. Chamamos a API que criámos
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass }),
        });

        const data = await response.json();

        // 2. Se a API der erro ou sucesso for falso
        if (!response.ok || !data.success) {
            console.warn("Login falhou:", data.error);
            setLoading(false);
            return false;
        }

        // 3. Mapear os dados da API para o formato do Frontend
        // A API devolve 'points', mas o teu front usa 'points_saldo'
        const userData: Customer = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            points_saldo: data.user.points || 0, // Garante que não vem vazio
        };

        // 4. Guardar utilizador
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
  
  // Nota: Estas funções atualizam apenas visualmente. 
  // Futuramente terás de criar uma API para salvar os pontos na base de dados.
  const addPoints = useCallback((points: number) => {
      if (!user || points <= 0) return;
      const newPoints = (user.points_saldo || 0) + points;
      updateUser({ ...user, points_saldo: newPoints });
  }, [user, updateUser]);

  const spendPoints = useCallback((points: number) => {
      if (!user || points <= 0) return;
      const newPoints = (user.points_saldo || 0) - points;
      updateUser({ ...user, points_saldo: Math.max(0, newPoints) });
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
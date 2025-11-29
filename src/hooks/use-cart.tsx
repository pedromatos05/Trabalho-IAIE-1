
'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { Product } from '@/lib/data';
import { useToast } from './use-toast';

interface CartItem {
  product: Product;
  quantity: number;
  isPointsPurchase?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, isPointsPurchase?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((product: Product, isPointsPurchase = false) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem && !isPointsPurchase) {
        // Increase quantity if item already exists and it's not a points purchase
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item (or overwrite if it was a points purchase)
      return [...prevCart.filter(item => item.product.id !== product.id), { product, quantity: 1, isPointsPurchase }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const itemInCart = cart.find(item => item.product.id === productId);
    if (itemInCart?.isPointsPurchase) {
      toast({
        variant: 'destructive',
        title: 'Ação não permitida',
        description: 'Não pode alterar a quantidade de um item comprado com pontos.',
      });
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart, cart, toast]);

  const clearCart = () => {
    setCart([]);
  };

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
        if (item.isPointsPurchase) {
            return sum; // Items bought with points don't add to the total
        }
        return sum + item.product.price * item.quantity;
    }, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface CookieOptions {
  expires?: number | Date;
  domain?: string;
  path?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export function useCookies() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const setCookie = (name: string, value: string, options?: CookieOptions) => {
    if (!isClient) return;
    
    try {
      Cookies.set(name, value, {
        expires: 7, // 7 dias por padrão
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        ...options
      });
    } catch (error) {
      console.error('Erro ao definir cookie:', error);
    }
  };

  const getCookie = (name: string): string | undefined => {
    if (!isClient) return undefined;
    
    try {
      return Cookies.get(name);
    } catch (error) {
      console.error('Erro ao ler cookie:', error);
      return undefined;
    }
  };

  const removeCookie = (name: string, options?: Pick<CookieOptions, 'domain' | 'path'>) => {
    if (!isClient) return;
    
    try {
      Cookies.remove(name, options);
    } catch (error) {
      console.error('Erro ao remover cookie:', error);
    }
  };

  const getAllCookies = (): { [key: string]: string } => {
    if (!isClient) return {};
    
    try {
      return Cookies.get();
    } catch (error) {
      console.error('Erro ao obter todos os cookies:', error);
      return {};
    }
  };

  return {
    setCookie,
    getCookie,
    removeCookie,
    getAllCookies,
    isClient
  };
}

// Hook específico para preferências do usuário
export function useUserPreferences() {
  const { setCookie, getCookie, removeCookie } = useCookies();

  const setTheme = (theme: 'light' | 'dark') => {
    setCookie('user-theme', theme, { expires: 365 }); // 1 ano
  };

  const getTheme = (): 'light' | 'dark' | null => {
    const theme = getCookie('user-theme');
    return theme === 'light' || theme === 'dark' ? theme : null;
  };

  const setLanguage = (language: string) => {
    setCookie('user-language', language, { expires: 365 });
  };

  const getLanguage = (): string | null => {
    return getCookie('user-language') || null;
  };

  const setAccessibilitySettings = (settings: any) => {
    setCookie('accessibility-settings', JSON.stringify(settings), { expires: 365 });
  };

  const getAccessibilitySettings = (): any | null => {
    const settings = getCookie('accessibility-settings');
    try {
      return settings ? JSON.parse(settings) : null;
    } catch {
      return null;
    }
  };

  const clearAllPreferences = () => {
    removeCookie('user-theme');
    removeCookie('user-language');
    removeCookie('accessibility-settings');
  };

  return {
    setTheme,
    getTheme,
    setLanguage,
    getLanguage,
    setAccessibilitySettings,
    getAccessibilitySettings,
    clearAllPreferences
  };
}

// Hook para carrinho de compras
export function useCartCookies() {
  const { setCookie, getCookie, removeCookie } = useCookies();

  const saveCart = (cartItems: any[]) => {
    setCookie('shopping-cart', JSON.stringify(cartItems), { expires: 30 }); // 30 dias
  };

  const getCart = (): any[] => {
    const cart = getCookie('shopping-cart');
    try {
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  };

  const clearCart = () => {
    removeCookie('shopping-cart');
  };

  return {
    saveCart,
    getCart,
    clearCart
  };
}
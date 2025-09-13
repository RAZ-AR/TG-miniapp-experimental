import { useState, useEffect, useMemo, useCallback } from 'react';
import { LS_KEYS } from '../constants';
import { cartAdd, toNumber } from '../utils';
import type { MenuItem } from '../types';

export const useCart = (menu: MenuItem[], currentTgId: string | null) => {
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_KEYS.cart) || "{}");
    } catch {
      return {};
    }
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEYS.cart, JSON.stringify(cart));
  }, [cart]);

  // Reset cart when owner changes
  useEffect(() => {
    const owner = localStorage.getItem(LS_KEYS.owner);
    if (currentTgId && owner && owner !== currentTgId) {
      console.log('🔄 Owner changed - clearing cart');
      setCart({});
      localStorage.setItem(LS_KEYS.owner, currentTgId);
    } else if (currentTgId && !owner) {
      localStorage.setItem(LS_KEYS.owner, currentTgId);
    }
  }, [currentTgId]);

  const total = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menu.find((i) => i.id === id);
        return sum + (item ? toNumber(item.price, 0) * qty : 0);
      }, 0),
    [cart, menu],
  );

  const cartCount = useMemo(
    () => Object.values(cart).reduce((a, b) => a + (b || 0), 0),
    [cart],
  );

  const add = useCallback((id: string, n = 1) => {
    setCart((prev) => cartAdd(prev, id, n));
  }, []);

  const remove = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setCart({});
  }, []);

  return {
    cart,
    total,
    cartCount,
    add,
    remove,
    clear
  };
};
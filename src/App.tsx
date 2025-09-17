import React, { useState, useMemo } from "react";
import { BRAND } from "./constants";
import { titleByLang } from "./utils";
import type { Lang } from "./types";

// Import all custom hooks
import {
  useTelegramAuth,
  useMenu,
  useLanguage,
  useLoyalty,
  useCart,
  useApi,
} from "./hooks";

// Import all components
import {
  Header,
  MenuGrid,
  CategoryFilter,
  CartSheet,
  AdsCarousel,
  BottomBar,
} from "./components";

import { TestRunner } from "./components/DevTools";

/**
 * Willow Telegram Mini-App — Frontend (v7.0 - REFACTORED)
 * - Modular architecture with custom hooks and components
 * - Clean separation of concerns
 * - TypeScript typed throughout
 */

export default function App() {
  // Custom hooks for all business logic
  const telegramAuth = useTelegramAuth();
  const { tg, currentTgId, hasRealTgData } = telegramAuth;
  
  const { menu, ads, loading: menuLoading, error: menuError } = useMenu();
  const { lang, setLang } = useLanguage();
  
  const loyalty = useLoyalty({
    tg,
    currentTgId,
    hasRealTgData,
    tgWebAppData: new URLSearchParams(window.location.search).get('tgWebAppData')
  });
  
  const cart = useCart(menu, currentTgId);
  const api = useApi({
    tg,
    currentTgId,
    hasRealTgData,
    tgWebAppData: new URLSearchParams(window.location.search).get('tgWebAppData')
  });

  // Local UI state
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showCart, setShowCart] = useState<boolean>(false);
  const [debugTapCount, setDebugTapCount] = useState<number>(0);

  // Debug visibility
  const [debugVisible, setDebugVisible] = useState<boolean>(() => {
    try {
      const qs = new URLSearchParams(window.location.search);
      return qs.get("debug") === "1";
    } catch {
      return false;
    }
  });

  // Computed values
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(menu.map((m) => m.category)))],
    [menu],
  );
  
  const filteredItems = useMemo(
    () =>
      activeCategory === "All"
        ? menu
        : menu.filter((m) => m.category === activeCategory),
    [activeCategory, menu],
  );

  // Event handlers
  const handleLogoTap = () => {
    setDebugTapCount((c) => {
      const n = c + 1;
      if (n >= 5) {
        setDebugVisible((v) => !v);
        return 0;
      }
      return n;
    });
  };

  const handleOrderSubmit = async (
    when: "now" | "10" | "20",
    table: number | null,
    payment: "cash" | "card" | "stars"
  ) => {
    console.log('📦 handleOrderSubmit called with:', { when, table, payment, currentTgId });
    
    if (!currentTgId) {
      console.log('❌ handleOrderSubmit blocked - no currentTgId');
      return;
    }

    try {
      const orderLines = Object.entries(cart.cart)
        .filter(([_, qty]) => (qty || 0) > 0)
        .map(([id, qty]) => {
          const item = menu.find((i) => i.id === id)!;
          return {
            id,
            title: titleByLang(item, lang),
            qty,
            unit_price: item.price,
          };
        });

      console.log('📦 Calling submitOrder with orderLines:', orderLines);
      console.log('📦 Order details:', { card: loyalty.cardNumber, total: cart.total, when, table, payment });
      
      const resp = await api.submitOrder({
        card: loyalty.cardNumber || null,
        total: cart.total,
        when,
        table: when === "now" ? table : null,
        payment,
        items: orderLines,
      });

      console.log('📦 Order submit response:', resp);

      if (resp && typeof resp.stars === "number") {
        loyalty.updateStars(resp.stars);
      }

      cart.clear();
    } catch (error) {
      console.error("Order error:", error);
      // Still clear cart and show success for UX
      cart.clear();
    }
  };

  // Show loading state
  if (menuLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold">{BRAND.name}</div>
          <div className="text-sm text-gray-500 mt-2">Loading menu...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (menuError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold">Error loading menu</div>
          <div className="text-sm mt-2">{menuError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Header
        cardNumber={loyalty.cardNumber}
        isLoadingCard={loyalty.isLoadingCard}
        lang={lang}
        setLang={setLang}
        stars={loyalty.stars}
        cartCount={cart.cartCount}
        onOpenCart={() => setShowCart(true)}
        onLogoTap={handleLogoTap}
      />

      <div className="px-4 pb-28 max-w-md mx-auto">
        <AdsCarousel ads={ads} />

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <MenuGrid
          items={filteredItems}
          lang={lang}
          onAddItem={(id) => cart.add(id, 1)}
        />
      </div>

      <BottomBar
        total={cart.total}
        cartCount={cart.cartCount}
        onOpenCart={() => setShowCart(true)}
      />

      {showCart && (
        <CartSheet
          items={menu}
          cart={cart.cart}
          lang={lang}
          total={cart.total}
          add={cart.add}
          remove={cart.remove}
          onClose={() => setShowCart(false)}
          onPaid={handleOrderSubmit}
        />
      )}

      {debugVisible && (
        <div className="fixed bottom-3 left-3 right-3 z-50 p-3 rounded-lg border bg-white text-xs shadow">
          <div className="flex items-center justify-between mb-2">
            <b>DEBUG</b>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setDebugVisible(false)}
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div><b>currentTgId:</b> {String(currentTgId || "null")}</div>
              <div><b>cardNumber:</b> {String(loyalty.cardNumber || "")}</div>
              <div><b>stars:</b> {String(loyalty.stars)}</div>
              <div><b>isLoadingCard:</b> {String(loyalty.isLoadingCard)}</div>
            </div>
            <div>
              <div><b>hasRealTgData:</b> {String(hasRealTgData)}</div>
              <div><b>menuItems:</b> {menu.length}</div>
              <div><b>cartItems:</b> {cart.cartCount}</div>
              <div><b>total:</b> {cart.total} RSD</div>
            </div>
          </div>
          <div className="mt-2">
            <div><b>Last register resp:</b></div>
            <pre className="whitespace-pre-wrap break-all max-h-28 overflow-auto bg-gray-50 p-2 rounded">
              {JSON.stringify(loyalty.lastRegisterResp)}
            </pre>
          </div>
          <div className="mt-2">
            <div><b>Last stars resp:</b></div>
            <pre className="whitespace-pre-wrap break-all max-h-28 overflow-auto bg-gray-50 p-2 rounded">
              {JSON.stringify(loyalty.lastStarsResp)}
            </pre>
          </div>
        </div>
      )}

      {debugVisible && <TestRunner />}

    </div>
  );
}

// Inject styles (keeping the self-contained approach)
const style = document.createElement("style");
style.innerHTML = `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}:root{--accent:${BRAND.accent}}`;
document.head.appendChild(style);
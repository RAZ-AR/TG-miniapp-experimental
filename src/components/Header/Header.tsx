import React from 'react';
import { BRAND } from '../../constants';
import { toNumber } from '../../utils';
import type { Lang } from '../../types';
import { LangPicker } from './LangPicker';

interface HeaderProps {
  cardNumber: string;
  isLoadingCard: boolean;
  lang: Lang;
  setLang: (lang: Lang) => void;
  stars: number;
  cartCount: number;
  onOpenCart: () => void;
  onLogoTap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cardNumber,
  isLoadingCard,
  lang,
  setLang,
  stars,
  cartCount,
  onOpenCart,
  onLogoTap,
}) => {
  const showCard = cardNumber && /^\d{4}$/.test(cardNumber);
  const cardBadge = showCard ? `#${cardNumber}` : isLoadingCard ? "#…" : "—";
  
  // Логирование для отладки
  console.log('🎨 Header render:', {
    cardNumber,
    cardNumberType: typeof cardNumber,
    cardNumberLength: cardNumber?.length,
    regexTest: cardNumber ? /^\d{4}$/.test(cardNumber) : false,
    showCard,
    isLoadingCard,
    cardBadge
  });

  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-2">
        <button
          onClick={onLogoTap}
          className="font-semibold text-lg active:opacity-60 relative"
          aria-label="Toggle debug"
        >
          {BRAND.name}
          <span className="absolute -top-1 -right-12 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded font-bold">
            EXP
          </span>
        </button>

        {/* 💳 Card */}
        <div className="ml-1 text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-700">
          💳 <b>{cardBadge}</b>
        </div>

        {/* ⭐ Stars */}
        <div className="ml-1 px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-sm">
          ⭐ {toNumber(stars, 0)}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onOpenCart}
            className="relative w-9 h-9 rounded-full border flex items-center justify-center"
            aria-label="Open cart"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <LangPicker value={lang} onChange={setLang} />
        </div>
      </div>
    </div>
  );
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BRAND } from '../../constants';
import { toNumber } from '../../utils';
import { LangPicker } from './LangPicker';
export const Header = ({ cardNumber, isLoadingCard, lang, setLang, stars, cartCount, onOpenCart, onLogoTap, }) => {
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
    return (_jsx("div", { className: "sticky top-0 z-10 bg-white/90 backdrop-blur border-b", children: _jsxs("div", { className: "max-w-md mx-auto px-4 py-3 flex items-center gap-2", children: [_jsxs("button", { onClick: onLogoTap, className: "font-semibold text-lg active:opacity-60 relative", "aria-label": "Toggle debug", children: [BRAND.name, _jsx("span", { className: "absolute -top-1 -right-12 bg-orange-500 text-white text-[8px] px-1 py-0.5 rounded font-bold", children: "EXP" })] }), _jsxs("div", { className: "ml-1 text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-700", children: ["\uD83D\uDCB3 ", _jsx("b", { children: cardBadge })] }), _jsxs("div", { className: "ml-1 px-2 py-1 rounded-full bg-teal-50 text-teal-700 text-sm", children: ["\u2B50 ", toNumber(stars, 0)] }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsxs("button", { onClick: onOpenCart, className: "relative w-9 h-9 rounded-full border flex items-center justify-center", "aria-label": "Open cart", children: ["\uD83D\uDED2", cartCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-black text-white text-[10px] leading-none px-1.5 py-1 rounded-full", children: cartCount }))] }), _jsx(LangPicker, { value: lang, onChange: setLang })] })] }) }));
};

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CartItem } from './CartItem';
import { OrderForm } from './OrderForm';
export const CartSheet = ({ items, cart, lang, total, add, remove, onClose, onPaid, }) => {
    const cartLines = Object.entries(cart)
        .filter(([_, qty]) => (qty || 0) > 0)
        .map(([id, qty]) => ({ item: items.find((i) => i.id === id), qty }))
        .filter((x) => Boolean(x.item));
    const handleOrderSubmit = async (when, table, payment) => {
        await onPaid(when, table, payment);
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 z-30 flex items-end sm:items-center sm:justify-center", onClick: onClose, children: _jsxs("div", { className: "bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between", children: [_jsx("div", { className: "font-semibold", children: lang === "ru" ? "Корзина" : lang === "sr" ? "Korpa" : "Cart" }), _jsx("button", { onClick: onClose, className: "w-9 h-9 rounded-full border", "aria-label": "Close", children: "\u2715" })] }), _jsxs("div", { className: "max-h-[60vh] overflow-y-auto px-4 py-3 divide-y", children: [cartLines.length === 0 && (_jsx("div", { className: "py-8 text-center text-gray-500", children: lang === "ru"
                                ? "Пусто"
                                : lang === "sr"
                                    ? "Prazno"
                                    : "Cart is empty" })), cartLines.map(({ item, qty }) => (_jsx(CartItem, { item: item, qty: qty, lang: lang, onAdd: add, onRemove: remove }, item.id)))] }), cartLines.length > 0 && (_jsx(OrderForm, { lang: lang, total: total, onSubmit: handleOrderSubmit }))] }) }));
};

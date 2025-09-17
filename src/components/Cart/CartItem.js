import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { titleByLang, currency } from '../../utils';
export const CartItem = ({ item, qty, lang, onAdd, onRemove, }) => {
    return (_jsxs("div", { className: "py-3 flex gap-3 items-center", children: [_jsx("img", { src: item.image || "", alt: titleByLang(item, lang), className: "w-16 h-16 rounded-xl object-cover bg-gray-100" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: titleByLang(item, lang) }), _jsx("div", { className: "text-xs text-gray-500", children: currency(item.price) }), _jsxs("div", { className: "mt-2 flex items-center gap-2", children: [_jsx("button", { onClick: () => onAdd(item.id, -1), className: "w-7 h-7 rounded-full border", "aria-label": "Decrease", children: "\u2212" }), _jsx("span", { className: "min-w-6 text-center text-sm", children: qty }), _jsx("button", { onClick: () => onAdd(item.id, 1), className: "w-7 h-7 rounded-full border", "aria-label": "Increase", children: "+" }), _jsx("button", { onClick: () => onRemove(item.id), className: "ml-3 text-xs text-gray-500 underline", children: lang === "ru"
                                    ? "Удалить"
                                    : lang === "sr"
                                        ? "Obriši"
                                        : "Remove" })] })] }), _jsx("div", { className: "text-sm font-semibold", children: currency(item.price * qty) })] }));
};

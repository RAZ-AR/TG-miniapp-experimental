import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { currency } from '../../utils';
export const BottomBar = ({ total, cartCount, onOpenCart, }) => {
    return (_jsx("div", { className: "fixed bottom-0 inset-x-0 border-t bg-white p-3", children: _jsxs("div", { className: "max-w-md mx-auto flex items-center gap-3", children: [_jsxs("div", { className: "text-sm text-gray-600 flex-1", children: ["Total: ", _jsx("span", { className: "font-semibold", children: currency(total) })] }), _jsx("button", { onClick: onOpenCart, className: "flex-1 bg-black text-white rounded-xl py-3 font-medium", children: cartCount ? `Cart • ${cartCount}` : "Cart" })] }) }));
};

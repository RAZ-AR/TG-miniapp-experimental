import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { currency } from '../../utils';
export const OrderForm = ({ lang, total, onSubmit }) => {
    const [when, setWhen] = useState("now");
    const [table, setTable] = useState(1);
    const [payment, setPayment] = useState("cash");
    const payDisabled = when === "now" && table == null;
    const handleSubmit = async () => {
        if (payDisabled)
            return;
        await onSubmit(when, table, payment);
    };
    return (_jsxs("div", { className: "px-4 pb-4", children: [_jsxs("div", { className: "mt-2 p-3 rounded-2xl bg-gray-50 border", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: lang === "ru"
                            ? "Когда приготовить"
                            : lang === "sr"
                                ? "Kada pripremiti"
                                : "When to prepare" }), _jsx("div", { className: "flex gap-2", children: [
                            {
                                v: "now",
                                label: lang === "ru" ? "Сейчас" : lang === "sr" ? "Sada" : "Now",
                            },
                            { v: "10", label: "+10 min" },
                            { v: "20", label: "+20 min" },
                        ].map((option) => (_jsx("button", { onClick: () => setWhen(option.v), className: `px-3 py-2 rounded-full text-sm border ${when === option.v
                                ? "bg-teal-500 text-white border-teal-500"
                                : "border-gray-200"}`, children: option.label }, option.v))) }), when === "now" && (_jsxs("div", { className: "mt-3", children: [_jsx("div", { className: "text-sm text-gray-600 mb-1", children: lang === "ru"
                                    ? "Номер стола"
                                    : lang === "sr"
                                        ? "Broj stola"
                                        : "Table number" }), _jsx("div", { className: "grid grid-cols-6 gap-2", children: Array.from({ length: 12 })
                                    .map((_, i) => i + 1)
                                    .map((n) => (_jsx("button", { onClick: () => setTable(n), className: `py-2 rounded-xl border text-sm ${table === n
                                        ? "bg-teal-500 text-white border-teal-500"
                                        : "border-gray-200"}`, children: n }, n))) })] }))] }), _jsxs("div", { className: "mt-3 p-3 rounded-2xl bg-gray-50 border", children: [_jsx("div", { className: "text-sm font-medium mb-2", children: lang === "ru" ? "Оплата" : lang === "sr" ? "Plaćanje" : "Payment" }), _jsx("div", { className: "flex gap-2", children: [
                            {
                                v: "cash",
                                label: lang === "ru" ? "Наличные" : lang === "sr" ? "Keš" : "Cash",
                            },
                            {
                                v: "card",
                                label: lang === "ru" ? "Карта" : lang === "sr" ? "Kartica" : "Card",
                            },
                            {
                                v: "stars",
                                label: lang === "ru" ? "Звезды" : lang === "sr" ? "Zvezdice" : "Stars",
                            },
                        ].map((option) => (_jsx("button", { onClick: () => setPayment(option.v), className: `px-3 py-2 rounded-full text-sm border ${payment === option.v
                                ? "bg-teal-500 text-white border-teal-500"
                                : "border-gray-200"}`, children: option.label }, option.v))) })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsx("div", { className: "text-base text-gray-600", children: lang === "ru" ? "Итого" : lang === "sr" ? "Ukupno" : "Total" }), _jsx("div", { className: "text-xl font-semibold", children: currency(total) })] }), _jsx("button", { onClick: handleSubmit, disabled: payDisabled, className: `mt-3 w-full py-3 rounded-xl font-semibold ${payDisabled
                    ? "bg-gray-200 text-gray-500"
                    : "bg-black text-white"}`, children: lang === "ru" ? "Оплатить" : lang === "sr" ? "Plati" : "Checkout" })] }));
};

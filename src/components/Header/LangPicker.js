import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const LangPicker = ({ value, onChange }) => {
    return (_jsxs("select", { className: "text-sm border rounded-full px-2 py-1", value: value, onChange: (e) => onChange(e.target.value), "aria-label": "Language", children: [_jsx("option", { value: "en", children: "EN" }), _jsx("option", { value: "sr", children: "SR" }), _jsx("option", { value: "ru", children: "RU" })] }));
};

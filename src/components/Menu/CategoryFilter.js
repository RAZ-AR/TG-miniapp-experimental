import { jsx as _jsx } from "react/jsx-runtime";
export const CategoryFilter = ({ categories, activeCategory, onCategoryChange, }) => {
    return (_jsx("div", { className: "mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2", children: categories.map((category) => (_jsx("button", { onClick: () => onCategoryChange(category), className: `px-3 py-2 rounded-full border text-sm whitespace-nowrap ${category === activeCategory
                ? "bg-teal-500 text-white border-teal-500"
                : "border-gray-200"}`, children: category }, category))) }));
};

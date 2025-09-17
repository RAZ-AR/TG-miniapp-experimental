import React, { useState } from 'react';
import { titleByLang, currency, selectLabel, compositionByLang } from '../../utils';
import type { MenuItem as MenuItemType, Lang } from '../../types';

interface MenuItemProps {
  item: MenuItemType;
  lang: Lang;
  onAdd: (id: string) => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, lang, onAdd }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const composition = compositionByLang(item, lang);
  // Updated design: centered layout with price in button

  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-white hover:shadow-md transition-shadow text-center">
      <div
        className="cursor-pointer"
        onClick={() => composition && setIsExpanded(!isExpanded)}
      >
        <div className="mb-3">
          <h3 className="text-lg font-bold leading-tight text-gray-900 mb-2">
            {titleByLang(item, lang)}
          </h3>
          {item.volume && (
            <div className="text-sm text-gray-600 font-medium">
              {item.volume}
            </div>
          )}
          {composition && (
            <div className="text-xs text-gray-400 mt-2">
              {isExpanded ? '▼' : '▶'}
            </div>
          )}
        </div>

        {isExpanded && composition && (
          <div className="mt-3 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3 text-left">
            {composition}
          </div>
        )}
      </div>

      <button
        onClick={() => onAdd(item.id)}
        className="mt-3 w-full py-2 rounded-lg bg-white border-2 border-black text-black text-sm font-medium hover:bg-black hover:text-white active:bg-black active:text-white transition-colors"
      >
        {currency(item.price)}
      </button>
    </div>
  );
};
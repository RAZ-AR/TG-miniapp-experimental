import type { Lang } from '../types';

export const toNumber = (v: any, def = 0): number => {
  if (v == null) return def;
  // Обрабатываем и запятые и точки как разделители тысяч/десятичных
  const str = String(v).replace(/[^0-9.,-]/g, "");
  let n: number;
  
  // Если есть и запятая и точка, предполагаем европейский формат (1.200,50)
  if (str.includes(",") && str.includes(".")) {
    n = Number(str.replace(/\./g, "").replace(",", "."));
  }
  // Если только запятая, может быть как тысячи (1,200) так и десятичные (1,5)
  else if (str.includes(",")) {
    // Если запятая не в последних 3 позициях - это тысячи
    const commaPos = str.lastIndexOf(",");
    if (str.length - commaPos > 3) {
      n = Number(str.replace(/,/g, ""));
    } else {
      n = Number(str.replace(",", "."));
    }
  }
  // Только точка или только цифры
  else {
    n = Number(str);
  }
  
  return Number.isFinite(n) ? n : def;
};

export const currency = (v: any) => `${toNumber(v, 0).toFixed(0)} RSD`;

export const selectLabel = (lang: Lang) =>
  lang === "ru" ? "Выбрать" : lang === "sr" ? "Izaberi" : "Select";

export const titleByLang = (item: { title_en?: string; title_sr?: string; title_ru?: string }, lang: Lang): string => {
  const pick =
    lang === "en"
      ? item.title_en
      : lang === "sr"
        ? item.title_sr
        : item.title_ru;
  return pick || item.title_en || item.title_sr || item.title_ru || "Item";
};

export const compositionByLang = (item: { composition_en?: string; composition_sr?: string; composition_ru?: string }, lang: Lang): string => {
  const pick =
    lang === "en"
      ? item.composition_en
      : lang === "sr"
        ? item.composition_sr
        : item.composition_ru;
  return pick || item.composition_en || item.composition_sr || item.composition_ru || "";
};
import { useState, useEffect } from 'react';
import { LS_KEYS, LANGS } from '../constants';
export const useLanguage = () => {
    const [lang, setLang] = useState(() => {
        try {
            const stored = localStorage.getItem(LS_KEYS.lang);
            return stored && LANGS.includes(stored) ? stored : "en";
        }
        catch {
            return "en";
        }
    });
    useEffect(() => {
        localStorage.setItem(LS_KEYS.lang, lang);
    }, [lang]);
    return {
        lang,
        setLang
    };
};

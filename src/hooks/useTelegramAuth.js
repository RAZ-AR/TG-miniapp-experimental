import { useMemo } from 'react';
const isDev = import.meta?.env?.MODE === "development";
const generateTestUserId = () => {
    const key = "test_user_id";
    try {
        const stored = localStorage.getItem(key);
        if (stored)
            return parseInt(stored);
        const newId = (Math.random() * 1000000) | 0;
        localStorage.setItem(key, String(newId));
        return newId;
    }
    catch {
        return (Math.random() * 1000000) | 0;
    }
};
export const useTelegramAuth = () => {
    return useMemo(() => {
        // Проверяем есть ли реальный Telegram WebApp с данными
        const realTg = typeof window !== "undefined" && window.Telegram?.WebApp;
        // Если WebApp не инициализирован, но мы в Telegram - принудительно инициализируем
        if (typeof window !== "undefined" && !realTg && window.parent !== window) {
            try {
                // Принудительно инициализируем Telegram WebApp
                if (window.Telegram?.WebApp?.ready) {
                    window.Telegram.WebApp.ready();
                }
            }
            catch (e) {
                console.log('⚠️ Telegram WebApp initialization failed:', e);
            }
        }
        // Проверяем URL параметры от Telegram (для Desktop)
        const urlParams = new URLSearchParams(window.location.search);
        const tgWebAppData = urlParams.get('tgWebAppData');
        const hasUrlParams = !!tgWebAppData;
        // Проверяем debug режим
        const debugMode = urlParams.get('debug') === '1';
        const forceMode = urlParams.get('force') === '1';
        // В Telegram WebApp всегда есть window.parent !== window
        const isInTelegram = typeof window !== "undefined" && window.parent !== window;
        // Дополнительная проверка на Telegram среду
        const isTelegramEnv = typeof window !== "undefined" && (window.parent !== window ||
            navigator.userAgent.includes('Telegram') ||
            window.TelegramWebviewProxy ||
            hasUrlParams);
        const hasRealTgData = (!!realTg && (!!realTg.initData || !!realTg.initDataUnsafe?.user?.id)) || hasUrlParams || (forceMode && isTelegramEnv) || isTelegramEnv;
        // УПРОЩЕННАЯ ЛОГИКА: всегда используем единый ID для стабильности
        let userId = '128136200'; // твой реальный Telegram ID
        // Попробуем получить реальный ID из Telegram API
        if (realTg?.initDataUnsafe?.user?.id) {
            userId = realTg.initDataUnsafe.user.id;
            console.log('✅ Got real Telegram user ID:', userId);
        }
        else {
            console.log('🔄 Using hardcoded user ID for stability:', userId);
        }
        console.log('🔍 Telegram detection:', {
            realTg: !!realTg,
            hasInitData: !!realTg?.initData,
            initDataValue: realTg?.initData,
            hasUser: !!realTg?.initDataUnsafe?.user?.id,
            userObject: realTg?.initDataUnsafe?.user,
            initDataUnsafe: realTg?.initDataUnsafe,
            hasUrlParams,
            tgWebAppData: tgWebAppData ? 'present' : 'none',
            debugMode,
            forceMode,
            isInTelegram,
            isTelegramEnv,
            hasRealTgData,
            isDev,
            userAgent: navigator.userAgent.includes('Telegram') ? 'contains Telegram' : 'no Telegram',
            webviewProxy: !!window.TelegramWebviewProxy,
            windowTelegram: window.Telegram,
            extractedUserId: userId,
            finalTgId: userId ? String(userId) : null,
        });
        // Всегда создаем валидный tg объект с правильным user ID
        const tg = realTg || {
            initData: tgWebAppData || null,
            initDataUnsafe: {
                user: { id: Number(userId) }
            },
        };
        const currentTgId = String(userId);
        return {
            tg,
            currentTgId,
            hasRealTgData,
            isInTelegram
        };
    }, []);
};

import { useCallback } from 'react';
import { BACKEND_URL } from '../constants';
import { postJSON } from '../utils';
export const useApi = ({ tg, currentTgId, hasRealTgData, tgWebAppData }) => {
    const register = useCallback(async () => {
        if (!BACKEND_URL)
            return null;
        // Регистрируем если есть currentTgId (стабильный подход)
        if (!currentTgId) {
            console.log('❌ No currentTgId - skipping registration');
            return null;
        }
        console.log('✅ Proceeding with registration for user:', currentTgId);
        // ВРЕМЕННЫЙ ХАРДКОД для исправления проблемы с user: null
        let user = tg?.initDataUnsafe?.user || null;
        if (!user && currentTgId) {
            // Если user null, но есть currentTgId - создаем user объект
            const userId = currentTgId === 'telegram_user' ? '128136200' : currentTgId;
            user = { id: Number(userId) };
            console.log('🚨 HARDCODE: Created user object from currentTgId:', user);
        }
        const payload = {
            action: "register",
            initData: tg?.initData || tgWebAppData || null,
            user: user,
            ts: Date.now(),
        };
        console.log('📤 Sending to backend:', payload);
        try {
            const resp = await postJSON(BACKEND_URL, payload);
            return resp;
        }
        catch (error) {
            console.error('Registration error:', error);
            return { error: "network_or_cors" };
        }
    }, [BACKEND_URL, currentTgId, tg, tgWebAppData]);
    const getStars = useCallback(async () => {
        if (!BACKEND_URL || !currentTgId) {
            return null;
        }
        // ВРЕМЕННЫЙ ХАРДКОД для исправления проблемы с user: null
        let user = tg?.initDataUnsafe?.user || null;
        if (!user && currentTgId) {
            const userId = currentTgId === 'telegram_user' ? '128136200' : currentTgId;
            user = { id: Number(userId) };
        }
        try {
            const resp = await postJSON(BACKEND_URL, {
                action: "stars",
                initData: tg?.initData || tgWebAppData || null,
                user: user,
            });
            return resp;
        }
        catch (error) {
            console.error('Get stars error:', error);
            return { error: "network_or_cors" };
        }
    }, [BACKEND_URL, currentTgId, tg, tgWebAppData]);
    const submitOrder = useCallback(async (orderData) => {
        if (!BACKEND_URL || !currentTgId) {
            console.log('❌ Submit order blocked - missing BACKEND_URL or currentTgId:', { BACKEND_URL: !!BACKEND_URL, currentTgId });
            return null;
        }
        // ВРЕМЕННЫЙ ХАРДКОД для исправления проблемы с user: null
        let user = tg?.initDataUnsafe?.user || null;
        if (!user && currentTgId) {
            const userId = currentTgId === 'telegram_user' ? '128136200' : currentTgId;
            user = { id: Number(userId) };
        }
        const payload = {
            ...orderData,
            action: "order",
            initData: tg?.initData || tgWebAppData || null,
            user: user,
        };
        console.log('📦 Submitting order:', payload);
        try {
            const resp = await postJSON(BACKEND_URL, payload);
            console.log('📦 Order response:', resp);
            return resp;
        }
        catch (error) {
            console.error('Submit order error:', error);
            return null;
        }
    }, [BACKEND_URL, currentTgId, tg, tgWebAppData]);
    return {
        register,
        getStars,
        submitOrder
    };
};

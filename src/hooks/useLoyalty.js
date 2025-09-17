import { useState, useEffect, useCallback } from 'react';
import { LS_KEYS } from '../constants';
import { toNumber } from '../utils';
import { useApi } from './useApi';
export const useLoyalty = ({ tg, currentTgId, hasRealTgData, tgWebAppData }) => {
    // Показываем из LS сразу — UI мгновенно с номером/звёздами
    const [cardNumber, setCardNumber] = useState(() => localStorage.getItem(LS_KEYS.card) || "");
    const [stars, setStars] = useState(() => toNumber(localStorage.getItem(LS_KEYS.stars), 0));
    const [isLoadingCard, setIsLoadingCard] = useState(hasRealTgData);
    const [lastRegisterResp, setLastRegisterResp] = useState(null);
    const [lastStarsResp, setLastStarsResp] = useState(null);
    const api = useApi({ tg, currentTgId, hasRealTgData, tgWebAppData });
    // Очистка только по флагу ?reset=1
    useEffect(() => {
        try {
            const qs = new URLSearchParams(window.location.search);
            const shouldReset = qs.has("reset") && qs.get("reset") === "1";
            if (shouldReset) {
                console.log('🧹 Reset flag detected - clearing all local data');
                localStorage.removeItem(LS_KEYS.card);
                localStorage.removeItem(LS_KEYS.stars);
                localStorage.removeItem(LS_KEYS.cart);
                localStorage.removeItem(LS_KEYS.owner);
                setCardNumber("");
                setStars(0);
            }
            console.log('💾 Initial localStorage state:', {
                card: localStorage.getItem(LS_KEYS.card),
                stars: localStorage.getItem(LS_KEYS.stars),
                owner: localStorage.getItem(LS_KEYS.owner),
            });
        }
        catch { }
    }, []);
    // Смена владельца → сброс локалки
    useEffect(() => {
        const owner = localStorage.getItem(LS_KEYS.owner);
        if (currentTgId && owner && owner !== currentTgId) {
            console.log('🔄 Owner changed from', owner, 'to', currentTgId, '- clearing cache');
            localStorage.removeItem(LS_KEYS.card);
            localStorage.removeItem(LS_KEYS.stars);
            setCardNumber("");
            setStars(0);
            localStorage.setItem(LS_KEYS.owner, currentTgId);
        }
        else if (currentTgId && !owner) {
            console.log('🆕 Setting owner to', currentTgId);
            localStorage.setItem(LS_KEYS.owner, currentTgId);
        }
    }, [currentTgId]);
    // Регистрация один раз при загрузке
    useEffect(() => {
        let aborted = false;
        const tryRegister = async () => {
            // Проверяем есть ли уже карта в localStorage
            const existingCard = localStorage.getItem(LS_KEYS.card);
            if (existingCard && /^\d{4}$/.test(existingCard)) {
                console.log('✅ useLoyalty: Card already exists in localStorage:', existingCard);
                setCardNumber(existingCard);
                setIsLoadingCard(false);
                return;
            }
            console.log('🎯 useLoyalty: Attempting registration...', { currentTgId, hasRealTgData });
            const resp = await api.register();
            console.log('🎯 useLoyalty: Registration response:', resp);
            setLastRegisterResp(resp);
            if (aborted || !resp) {
                console.log('❌ useLoyalty: Registration aborted or no response');
                setIsLoadingCard(false);
                return;
            }
            if (resp?.card) {
                const cardStr = String(resp.card);
                console.log('✅ useLoyalty: Got card number:', cardStr);
                console.log('💾 useLoyalty: Saving card to localStorage');
                setCardNumber(cardStr);
                localStorage.setItem(LS_KEYS.card, cardStr);
                // Проверим что сохранилось
                const saved = localStorage.getItem(LS_KEYS.card);
                console.log('✔️ useLoyalty: Card saved successfully:', saved);
            }
            if (typeof resp?.stars === "number") {
                console.log('✅ useLoyalty: Got stars:', resp.stars);
                setStars(resp.stars);
                localStorage.setItem(LS_KEYS.stars, String(resp.stars));
            }
            setIsLoadingCard(false);
        };
        if (currentTgId && !aborted) {
            tryRegister();
        }
        return () => {
            aborted = true;
        };
    }, [currentTgId]); // Убрал api из dependencies чтобы избежать лишних перезапусков
    // Пуллинг card/stars каждые 15s
    useEffect(() => {
        if (!hasRealTgData || (!currentTgId && !tg?.initData))
            return;
        const interval = setInterval(async () => {
            try {
                const resp = await api.getStars();
                setLastStarsResp(resp);
                if (!resp)
                    return;
                if (resp?.card && resp.card !== cardNumber) {
                    console.log('🔄 Card updated from', cardNumber, 'to', resp.card);
                    setCardNumber(String(resp.card));
                    localStorage.setItem(LS_KEYS.card, String(resp.card));
                }
                if (typeof resp?.stars === "number" && resp.stars !== stars) {
                    setStars(resp.stars);
                    localStorage.setItem(LS_KEYS.stars, String(resp.stars));
                }
            }
            catch (error) {
                setLastStarsResp({ error: "network_or_cors" });
            }
        }, 15000);
        return () => clearInterval(interval);
    }, [currentTgId, cardNumber, stars, hasRealTgData, tg, api]);
    const updateStars = useCallback((newStars) => {
        setStars(newStars);
        localStorage.setItem(LS_KEYS.stars, String(newStars));
    }, []);
    return {
        cardNumber,
        stars,
        isLoadingCard,
        lastRegisterResp,
        lastStarsResp,
        updateStars
    };
};

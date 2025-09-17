import { useState, useEffect } from 'react';
import { SHEET_JSON_URLS } from '../constants';
import { mapMenu, mapAds } from '../utils';
export const useMenu = () => {
    const [menu, setMenu] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        Promise.all([
            fetch(SHEET_JSON_URLS.menu)
                .then((r) => r.json())
                .catch(() => []),
            fetch(SHEET_JSON_URLS.ads)
                .then((r) => r.json())
                .catch(() => []),
        ]).then(([menuJson, adsJson]) => {
            try {
                setMenu(mapMenu(Array.isArray(menuJson) ? menuJson : []));
                setAds(mapAds(Array.isArray(adsJson) ? adsJson : []));
                setError(null);
            }
            catch (err) {
                setError('Failed to process menu data');
                console.error('Menu processing error:', err);
            }
        }).catch(err => {
            setError('Failed to load menu');
            console.error('Menu loading error:', err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);
    return {
        menu,
        ads,
        loading,
        error
    };
};

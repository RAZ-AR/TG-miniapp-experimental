import { toNumber } from './formatters';
// Google Drive → direct image
export const driveToDirect = (url) => {
    if (!url)
        return url;
    const m1 = url.match(/\/d\/([A-Za-z0-9_-]{10,})/);
    if (m1)
        return `https://lh3.googleusercontent.com/d/${m1[1]}=w1200`;
    const m2 = url.match(/[?&]id=([A-Za-z0-9_-]{10,})/);
    if (m2)
        return `https://lh3.googleusercontent.com/d/${m2[1]}=w1200`;
    return url;
};
const pickFrom = (row, keys, fallback = "") => {
    for (const k of keys) {
        const v = row[k];
        if (v !== undefined && v !== null && String(v).trim() !== "")
            return v;
    }
    return fallback;
};
export const mapMenu = (rows) => (rows || []).map((r, i) => {
    const id = String(pickFrom(r, ["id", "ID", "Id"], `m_${i}`));
    const category = String(pickFrom(r, ["Category"], "Other"));
    const title_en = String(pickFrom(r, ["English"], ""));
    const title_ru = String(pickFrom(r, ["Russian"], title_en));
    const title_sr = String(pickFrom(r, ["Serbian"], title_en));
    const volume = String(pickFrom(r, ["Volume"], ""));
    const price = toNumber(pickFrom(r, ["Price (RSD)", "Price", "RSD"], 0), 0);
    const comp = String(pickFrom(r, ["Ingredients"], ""));
    const image = driveToDirect(String(pickFrom(r, ["images", "image", "Image"], "")));
    return {
        id,
        category,
        title_en,
        title_ru,
        title_sr,
        volume,
        price,
        composition_en: comp,
        composition_ru: comp,
        composition_sr: comp,
        image,
    };
});
export const mapAds = (rows) => (rows || []).map((r, i) => ({
    id: String(pickFrom(r, ["id", "ID", "ADS"], `a_${i}`)),
    title: String(pickFrom(r, ["ADS", "Title"], "")),
    subtitle: String(pickFrom(r, ["description", "Subtitle"], "")),
    image: driveToDirect(String(pickFrom(r, ["image_ads", "image", "Image"], ""))),
    link: String(pickFrom(r, ["link", "Link"], "")),
}));

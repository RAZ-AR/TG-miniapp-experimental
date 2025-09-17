export async function postJSON(url, body) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(body),
    });
    if (!res.ok)
        throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    console.log('API Response:', text);
    // Пробуем парсить как обычный JSON
    try {
        return JSON.parse(text);
    }
    catch (jsonError) {
        console.log('Direct JSON parse failed, trying HTML extraction');
        // Если GAS возвращает HTML с JSON внутри, извлекаем его из userHtml
        const userHtmlMatch = text.match(/"userHtml":"(.*?)"/s);
        if (userHtmlMatch) {
            let userHtml = userHtmlMatch[1];
            // Декодируем HTML entities более тщательно
            userHtml = userHtml
                .replace(/\\x3c/g, '<')
                .replace(/\\x3e/g, '>')
                .replace(/\\x22/g, '"')
                .replace(/\\\//g, '/')
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\');
            console.log('Decoded userHtml:', userHtml);
            const jsonMatch = userHtml.match(/<pre id="json">(.*?)<\/pre>/s);
            if (jsonMatch) {
                console.log('Extracted JSON:', jsonMatch[1]);
                return JSON.parse(jsonMatch[1]);
            }
        }
        // Альтернативный поиск напрямую в HTML
        const directJsonMatch = text.match(/<pre id="json">(.*?)<\/pre>/s);
        if (directJsonMatch) {
            return JSON.parse(directJsonMatch[1]);
        }
        throw new Error(`Invalid JSON response: ${text.slice(0, 200)}...`);
    }
}
export function cartAdd(prev, id, n = 1) {
    const next = { ...prev };
    const q = (next[id] || 0) + n;
    if (q <= 0)
        delete next[id];
    else
        next[id] = q;
    return next;
}

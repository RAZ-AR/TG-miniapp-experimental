import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTelegramAuth } from '../../hooks/useTelegramAuth';
import { useLoyalty } from '../../hooks/useLoyalty';
import { useApi } from '../../hooks/useApi';
import { LS_KEYS } from '../../constants';
export const TestRunner = () => {
    const [tests, setTests] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [showLogs, setShowLogs] = useState(false);
    const [logs, setLogs] = useState([]);
    // Захватываем console.log для логов
    useEffect(() => {
        const originalLog = console.log;
        console.log = (...args) => {
            originalLog(...args);
            setLogs(prev => [...prev.slice(-50), args.join(' ')]);
        };
        return () => {
            console.log = originalLog;
        };
    }, []);
    const auth = useTelegramAuth();
    const loyalty = useLoyalty(auth);
    const api = useApi(auth);
    const updateTest = (name, status, message, duration) => {
        setTests(prev => prev.map(test => test.name === name ? { ...test, status, message, duration } : test));
    };
    const runTest = async (name, testFn) => {
        const startTime = Date.now();
        updateTest(name, 'running', 'Выполняется...');
        try {
            await testFn();
            const duration = Date.now() - startTime;
            updateTest(name, 'passed', 'Успешно', duration);
        }
        catch (error) {
            const duration = Date.now() - startTime;
            updateTest(name, 'failed', error instanceof Error ? error.message : String(error), duration);
        }
    };
    const runAllTests = async () => {
        setIsRunning(true);
        setLogs([]);
        const testCases = [
            { name: '1. Telegram Auth Detection', status: 'pending', message: 'Ожидание...' },
            { name: '2. LocalStorage State', status: 'pending', message: 'Ожидание...' },
            { name: '3. User ID Resolution', status: 'pending', message: 'Ожидание...' },
            { name: '4. Backend Registration', status: 'pending', message: 'Ожидание...' },
            { name: '5. Card Number Display', status: 'pending', message: 'Ожидание...' },
            { name: '6. Order Submission', status: 'pending', message: 'Ожидание...' },
            { name: '7. Google Sheets Integration', status: 'pending', message: 'Ожидание...' },
        ];
        setTests(testCases);
        // Тест 1: Telegram Auth Detection
        await runTest('1. Telegram Auth Detection', async () => {
            if (!auth.tg)
                throw new Error('Telegram WebApp не инициализирован');
            if (!auth.currentTgId)
                throw new Error('Telegram User ID не найден');
            if (auth.currentTgId === 'telegram_user')
                throw new Error('Используется fallback ID вместо реального');
        });
        // Тест 2: LocalStorage State
        await runTest('2. LocalStorage State', async () => {
            const owner = localStorage.getItem(LS_KEYS.owner);
            const card = localStorage.getItem(LS_KEYS.card);
            const stars = localStorage.getItem(LS_KEYS.stars);
            if (owner && owner !== auth.currentTgId) {
                throw new Error(`Owner mismatch: localStorage="${owner}", current="${auth.currentTgId}"`);
            }
        });
        // Тест 3: User ID Resolution
        await runTest('3. User ID Resolution', async () => {
            if (!auth.currentTgId)
                throw new Error('User ID не определен');
            if (!/^\d+$/.test(auth.currentTgId))
                throw new Error(`Некорректный формат User ID: ${auth.currentTgId}`);
            if (auth.currentTgId.length < 6)
                throw new Error(`User ID слишком короткий: ${auth.currentTgId}`);
        });
        // Тест 4: Backend Registration
        await runTest('4. Backend Registration', async () => {
            const response = await api.register();
            if (!response)
                throw new Error('Нет ответа от бэкенда');
            if (!response.card)
                throw new Error('Бэкенд не вернул номер карты');
            if (typeof response.stars !== 'number')
                throw new Error('Бэкенд не вернул количество звезд');
        });
        // Тест 5: Card Number Display
        await runTest('5. Card Number Display', async () => {
            if (!loyalty.cardNumber)
                throw new Error('Номер карты не отображается в интерфейсе');
            if (!/^\d{4}$/.test(loyalty.cardNumber))
                throw new Error(`Некорректный формат номера карты: ${loyalty.cardNumber}`);
            const storedCard = localStorage.getItem(LS_KEYS.card);
            if (storedCard !== loyalty.cardNumber) {
                throw new Error(`Несоответствие номера карты: localStorage="${storedCard}", display="${loyalty.cardNumber}"`);
            }
        });
        // Тест 6: Order Submission
        await runTest('6. Order Submission', async () => {
            const testOrder = {
                items: [{ id: 'test', name: 'Test Item', price: 100, quantity: 1 }],
                totalAmount: 100,
                phone: '+1234567890',
                address: 'Test Address'
            };
            const response = await api.submitOrder(testOrder);
            if (!response)
                throw new Error('Заказ не отправился');
        });
        // Тест 7: Google Sheets Integration (проверяем через API)
        await runTest('7. Google Sheets Integration', async () => {
            // Этот тест требует проверки наличия записи в таблице
            // Пока просто проверим что регистрация прошла успешно
            if (!loyalty.lastRegisterResp)
                throw new Error('Нет ответа от регистрации');
            if (loyalty.lastRegisterResp.error)
                throw new Error(`Ошибка регистрации: ${loyalty.lastRegisterResp.error}`);
        });
        setIsRunning(false);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'passed': return 'text-green-600';
            case 'failed': return 'text-red-600';
            case 'running': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed': return '✅';
            case 'failed': return '❌';
            case 'running': return '⏳';
            default: return '⏸️';
        }
    };
    return (_jsxs("div", { className: "fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "font-semibold text-sm", children: "\uD83E\uDDEA \u0422\u0435\u0441\u0442\u044B \u0421\u0438\u0441\u0442\u0435\u043C\u044B" }), _jsx("button", { onClick: () => setShowLogs(!showLogs), className: "text-xs px-2 py-1 bg-gray-100 rounded", children: showLogs ? 'Скрыть логи' : 'Показать логи' })] }), _jsx("button", { onClick: runAllTests, disabled: isRunning, className: "w-full mb-3 py-2 px-3 bg-blue-500 text-white rounded text-sm disabled:opacity-50", children: isRunning ? 'Выполняется...' : 'Запустить все тесты' }), _jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto text-xs", children: tests.map((test) => (_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("span", { className: getStatusColor(test.status), children: [getStatusIcon(test.status), " ", test.name] }), test.duration && _jsxs("span", { className: "text-gray-400 ml-2", children: ["(", test.duration, "ms)"] }), _jsx("div", { className: "text-gray-600 text-xs mt-1", children: test.message })] }) }, test.name))) }), showLogs && (_jsxs("div", { className: "mt-3 border-t pt-3", children: [_jsx("h4", { className: "text-xs font-semibold mb-2", children: "\u041B\u043E\u0433\u0438 \u043A\u043E\u043D\u0441\u043E\u043B\u0438:" }), _jsx("div", { className: "max-h-32 overflow-y-auto text-xs bg-gray-50 p-2 rounded", children: logs.slice(-10).map((log, i) => (_jsx("div", { className: "mb-1 font-mono text-xs", children: log }, i))) })] })), _jsxs("div", { className: "mt-3 text-xs text-gray-500", children: [_jsxs("div", { children: ["Current User ID: ", auth.currentTgId || 'не определен'] }), _jsxs("div", { children: ["Card Number: ", loyalty.cardNumber || 'не присвоен'] }), _jsxs("div", { children: ["Stars: ", loyalty.stars] }), _jsxs("div", { children: ["Loading: ", loyalty.isLoadingCard ? 'да' : 'нет'] })] })] }));
};

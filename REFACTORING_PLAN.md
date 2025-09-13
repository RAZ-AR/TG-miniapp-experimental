# 🏗️ Frontend Refactoring Plan - Phase 2

## 📊 Current State Analysis

**App.tsx: 1165 lines** - монолитный компонент содержит:

### 🧩 Компоненты (уже выделены):
1. `Header` (строки 720-782) - карта + звезды + корзина
2. `LangPicker` (строки 783-803) - выбор языка  
3. `AdsCarousel` (строки 805-885) - карусель баннеров
4. `CartSheet` (строки 887-1129) - корзина + заказ

### 🔧 Утилиты (для вынесения):
- `toNumber`, `currency`, `titleByLang` (строки 46-95)
- `mapMenu`, `mapAds` (строки 105-142)
- `postJSON` (строки 144-191)
- `cartAdd` (строка 253)

### 🎣 Логика для hooks:
- **Telegram detection** (строки 208-242)
- **Cart management** (состояние корзины)
- **API calls** (register, stars, order)
- **Menu/Ads loading**
- **Language management**

---

## 📁 Новая Структура

```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   ├── LangPicker.tsx
│   │   └── index.ts
│   ├── Menu/
│   │   ├── MenuGrid.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── MenuItem.tsx
│   │   └── index.ts
│   ├── Cart/
│   │   ├── CartSheet.tsx
│   │   ├── CartItem.tsx
│   │   ├── OrderForm.tsx
│   │   └── index.ts
│   ├── Ads/
│   │   ├── AdsCarousel.tsx
│   │   └── index.ts
│   └── Layout/
│       ├── BottomBar.tsx
│       └── index.ts
├── hooks/
│   ├── useTelegramAuth.ts
│   ├── useApi.ts
│   ├── useCart.ts
│   ├── useMenu.ts
│   └── useLoyalty.ts
├── utils/
│   ├── api.ts
│   ├── formatters.ts
│   ├── mappers.ts
│   └── telegram.ts
├── types/
│   ├── api.ts
│   ├── menu.ts
│   └── telegram.ts
├── constants/
│   └── index.ts
└── App.tsx (< 200 строк)
```

---

## 🎯 Пошаговый План

### Step 1: Подготовка инфраструктуры
- [ ] Создать папки структуры
- [ ] Вынести типы и интерфейсы
- [ ] Создать константы

### Step 2: Утилиты и helpers
- [ ] Вынести форматтеры (currency, toNumber)
- [ ] Создать API клиент
- [ ] Вынести маппинг данных

### Step 3: Кастомные хуки
- [ ] useTelegramAuth (детекция платформы)
- [ ] useApi (запросы к бэкенду)
- [ ] useCart (корзина)
- [ ] useMenu (меню + реклама)
- [ ] useLoyalty (карты + звезды)

### Step 4: Компоненты
- [ ] Header + LangPicker
- [ ] Menu компоненты
- [ ] Cart компоненты  
- [ ] Ads карусель
- [ ] Layout компоненты

### Step 5: Рефакторинг App.tsx
- [ ] Импорт новых компонентов
- [ ] Использование хуков
- [ ] Упрощение основного компонента

### Step 6: Тестирование
- [ ] Проверка функциональности
- [ ] Отладка багов
- [ ] Оптимизация

---

## 🎯 Ожидаемый результат

**Из:** App.tsx (1165 строк)
**В:** 
- App.tsx (~150 строк)
- 15+ переиспользуемых компонентов
- 5 кастомных хуков
- Чистая архитектура с разделением ответственности

**Выгоды:**
✅ Легче добавлять новые функции  
✅ Переиспользуемые компоненты  
✅ Лучшее тестирование  
✅ Упрощенная отладка  
✅ TypeScript типизация

---

## ⚠️ Риски и Mitigation

**Риск:** Сломать существующую функциональность
**Решение:** Постепенный рефакторинг с тестированием каждого шага

**Риск:** Конфликты в git
**Решение:** Частые коммиты с понятными описаниями

**Риск:** Ухудшение производительности  
**Решение:** Мониторинг bundle size, React.memo где нужно
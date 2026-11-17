import React, { createContext, useContext, useState } from 'react';
import { DarkColors, LightColors, ThemeColors } from './colors';
import { BankCard, initialCards } from '../data/cards';
import { initialTransactions, Transaction } from '../data/transactions';
import { initialProfile, UserProfile } from '../data/profile';

export type SupportedLanguage =
  | 'English'
  | 'Қазақша'
  | 'Русский'
  | 'Français'
  | 'Deutsch'
  | 'Español'
  | 'Türkçe'
  | '中文';

export type CurrencyCode = 'USD' | 'KZT' | 'EUR';

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ThemeColors;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatMoney: (amount: number, showSign?: boolean) => string;
  cards: BankCard[];
  selectedCardId: string;
  setSelectedCardId: (id: string) => void;
  addCard: (newCard: Omit<BankCard, 'id'>) => void;
  toggleFreezeCard: (id: string) => void;
  deleteCard: (id: string) => void;
  updateCardLimit: (id: string, limit: number) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>, cardId?: string) => void;
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  biometricEnabled: boolean;
  setBiometricEnabled: (val: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (val: boolean) => void;
}

const translations: Record<string, Record<string, string>> = {
  English: {
    welcomeBack: 'Welcome back,',
    home: 'Home',
    myCards: 'My Cards',
    statistics: 'Statistics',
    settings: 'Settings',
    sent: 'Sent',
    receive: 'Receive',
    loan: 'Loan',
    topup: 'Topup',
    transaction: 'Transaction',
    seeAll: 'See All',
    currentBalance: 'Current Balance',
    sendMoney: 'Send Money',
    requestMoney: 'Request Money',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    language: 'Language',
    allCards: 'All Cards',
    addNewCard: 'Add New Card',
    categoryChart: 'Category Chart',
    search: 'Search',
  },
  'Қазақша': {
    welcomeBack: 'Қайта оралуыңызбен,',
    home: 'Басты бет',
    myCards: 'Карталарым',
    statistics: 'Статистика',
    settings: 'Баптаулар',
    sent: 'Аудару',
    receive: 'Сұрату',
    loan: 'Несие',
    topup: 'Толтыру',
    transaction: 'Транзакциялар',
    seeAll: 'Барлығы',
    currentBalance: 'Ағымдағы баланс',
    sendMoney: 'Ақша жіберу',
    requestMoney: 'Ақша сұрату',
    profile: 'Профиль',
    editProfile: 'Профильді өңдеу',
    language: 'Тілді таңдау',
    allCards: 'Барлық карталар',
    addNewCard: 'Жаңа карта қосу',
    categoryChart: 'Санаттар диаграммасы',
    search: 'Іздеу',
  },
  'Русский': {
    welcomeBack: 'С возвращением,',
    home: 'Главная',
    myCards: 'Мои карты',
    statistics: 'Статистика',
    settings: 'Настройки',
    sent: 'Отправить',
    receive: 'Запросить',
    loan: 'Кредит',
    topup: 'Пополнить',
    transaction: 'Транзакции',
    seeAll: 'Все',
    currentBalance: 'Текущий баланс',
    sendMoney: 'Перевод средств',
    requestMoney: 'Запрос средств',
    profile: 'Профиль',
    editProfile: 'Редактировать',
    language: 'Язык приложения',
    allCards: 'Все карты',
    addNewCard: 'Добавить карту',
    categoryChart: 'По категориям',
    search: 'Поиск',
  },
};

const currencyRates: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  KZT: { symbol: '₸', rate: 495 },
  EUR: { symbol: '€', rate: 0.92 },
};

const ThemeContext = createContext<AppContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<SupportedLanguage>('English');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [cards, setCards] = useState<BankCard[]>(initialCards);
  const [selectedCardId, setSelectedCardId] = useState<string>(initialCards[0].id);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const colors = isDarkMode ? DarkColors : LightColors;

  const t = (key: string): string => {
    const langDict = translations[language] || translations.English;
    return langDict[key] || translations.English[key] || key;
  };

  const formatMoney = (amount: number, showSign = false): string => {
    const { symbol, rate } = currencyRates[currency];
    const converted = Math.abs(amount) * rate;
    const formatted =
      currency === 'KZT'
        ? converted.toLocaleString('en-US', { maximumFractionDigits: 0 })
        : converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const sign = showSign ? (amount >= 0 ? '+' : '-') : amount < 0 ? '-' : '';
    return currency === 'KZT' ? `${sign}${formatted} ${symbol}` : `${sign}${symbol}${formatted}`;
  };

  const addCard = (newCard: Omit<BankCard, 'id'>) => {
    const created: BankCard = {
      ...newCard,
      id: `card_${Date.now()}`,
    };
    setCards((prev) => [created, ...prev]);
    setSelectedCardId(created.id);
  };

  const toggleFreezeCard = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };

  const deleteCard = (id: string) => {
    setCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (updated.length > 0 && selectedCardId === id) {
        setSelectedCardId(updated[0].id);
      }
      return updated;
    });
  };

  const updateCardLimit = (id: string, limit: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, monthlyLimit: limit } : c))
    );
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>, cardId?: string) => {
    const targetCardId = cardId || selectedCardId;
    const created: Transaction = {
      ...tx,
      id: `tx_${Date.now()}`,
      cardId: targetCardId,
    };

    setTransactions((prev) => [created, ...prev]);

    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== targetCardId) return card;
        const delta = tx.type === 'income' ? Math.abs(tx.amount) : -Math.abs(tx.amount);
        const addedSpent = tx.type === 'expense' ? Math.abs(tx.amount) : 0;
        return {
          ...card,
          balance: Math.max(0, Number((card.balance + delta).toFixed(2))),
          monthlySpent: Number((card.monthlySpent + addedSpent).toFixed(2)),
        };
      })
    );
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        colors,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        formatMoney,
        cards,
        selectedCardId,
        setSelectedCardId,
        addCard,
        toggleFreezeCard,
        deleteCard,
        updateCardLimit,
        transactions,
        addTransaction,
        profile,
        updateProfile,
        biometricEnabled,
        setBiometricEnabled,
        notificationsEnabled,
        setNotificationsEnabled,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): AppContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }
  return ctx;
};

export type TransactionType = 'income' | 'expense';
export type TransactionCategory =
  | 'Shopping'
  | 'Entertainment'
  | 'Transfer'
  | 'Grocery'
  | 'Transport'
  | 'Salary';

export interface Transaction {
  id: string;
  title: string;
  category: TransactionCategory;
  type: TransactionType;
  amount: number;
  date: string;
  dateGroup: 'Today' | 'Yesterday' | 'Earlier';
  time: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
  cardId: string;
  referenceId: string;
  note?: string;
}

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  Shopping: '#0066FF',
  Entertainment: '#10B981',
  Transfer: '#8B5CF6',
  Grocery: '#F59E0B',
  Transport: '#EC4899',
  Salary: '#06B6D4',
};

export const initialTransactions: Transaction[] = [
  {
    id: 'tx_1',
    title: 'Apple Store',
    category: 'Shopping',
    type: 'expense',
    amount: 5.99,
    date: '17 Nov 2026',
    dateGroup: 'Today',
    time: '14:25',
    iconName: 'logo-apple',
    iconColor: '#FFFFFF',
    iconBg: '#1E1E2D',
    cardId: 'card_1',
    referenceId: 'BP-9841204',
    note: 'iCloud+ 200GB Monthly Plan',
  },
  {
    id: 'tx_2',
    title: 'Spotify',
    category: 'Entertainment',
    type: 'expense',
    amount: 12.99,
    date: '17 Nov 2026',
    dateGroup: 'Today',
    time: '10:12',
    iconName: 'musical-notes',
    iconColor: '#1DB954',
    iconBg: '#163024',
    cardId: 'card_3',
    referenceId: 'BP-9841189',
    note: 'Spotify Duo Subscription',
  },
  {
    id: 'tx_3',
    title: 'Money Transfer',
    category: 'Transfer',
    type: 'income',
    amount: 300.0,
    date: '17 Nov 2026',
    dateGroup: 'Today',
    time: '09:04',
    iconName: 'swap-horizontal',
    iconColor: '#0066FF',
    iconBg: '#1B2B4B',
    cardId: 'card_1',
    referenceId: 'BP-9841022',
    note: 'UI Consultation Payment from Alexey',
  },
  {
    id: 'tx_4',
    title: 'Grocery',
    category: 'Grocery',
    type: 'expense',
    amount: 88.0,
    date: '16 Nov 2026',
    dateGroup: 'Yesterday',
    time: '19:40',
    iconName: 'cart',
    iconColor: '#F59E0B',
    iconBg: '#362B1A',
    cardId: 'card_1',
    referenceId: 'BP-9839451',
    note: 'Whole Foods Market weekly groceries',
  },
  {
    id: 'tx_5',
    title: 'Netflix',
    category: 'Entertainment',
    type: 'expense',
    amount: 15.99,
    date: '16 Nov 2026',
    dateGroup: 'Yesterday',
    time: '11:00',
    iconName: 'film',
    iconColor: '#E50914',
    iconBg: '#361B20',
    cardId: 'card_3',
    referenceId: 'BP-9839102',
    note: 'Ultra HD 4K Plan',
  },
  {
    id: 'tx_6',
    title: 'Design Studio Salary',
    category: 'Salary',
    type: 'income',
    amount: 3450.0,
    date: '14 Nov 2026',
    dateGroup: 'Earlier',
    time: '08:30',
    iconName: 'briefcase',
    iconColor: '#10B981',
    iconBg: '#16322B',
    cardId: 'card_1',
    referenceId: 'BP-9835001',
    note: 'November Payroll Deposit',
  },
  {
    id: 'tx_7',
    title: 'Uber Ride',
    category: 'Transport',
    type: 'expense',
    amount: 24.5,
    date: '13 Nov 2026',
    dateGroup: 'Earlier',
    time: '22:15',
    iconName: 'car-sport',
    iconColor: '#EC4899',
    iconBg: '#361D2E',
    cardId: 'card_2',
    referenceId: 'BP-9834118',
    note: 'Airport drop-off trip',
  },
  {
    id: 'tx_8',
    title: 'Nike Store',
    category: 'Shopping',
    type: 'expense',
    amount: 164.0,
    date: '11 Nov 2026',
    dateGroup: 'Earlier',
    time: '16:50',
    iconName: 'bag-handle',
    iconColor: '#0066FF',
    iconBg: '#1B2B4B',
    cardId: 'card_1',
    referenceId: 'BP-9831880',
    note: 'Running shoes & sportswear',
  },
  {
    id: 'tx_9',
    title: 'Aruzhan Bekova',
    category: 'Transfer',
    type: 'income',
    amount: 120.0,
    date: '09 Nov 2026',
    dateGroup: 'Earlier',
    time: '15:18',
    iconName: 'person',
    iconColor: '#8B5CF6',
    iconBg: '#2A2142',
    cardId: 'card_2',
    referenceId: 'BP-9829043',
    note: 'Concert tickets split',
  },
  {
    id: 'tx_10',
    title: 'Starbucks Coffee',
    category: 'Grocery',
    type: 'expense',
    amount: 9.45,
    date: '08 Nov 2026',
    dateGroup: 'Earlier',
    time: '08:45',
    iconName: 'cafe',
    iconColor: '#10B981',
    iconBg: '#16322B',
    cardId: 'card_1',
    referenceId: 'BP-9827710',
    note: 'Iced Caramel Macchiato & croissant',
  },
];

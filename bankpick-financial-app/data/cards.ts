export type CardNetwork = 'Mastercard' | 'Visa';
export type CardType = 'Physical' | 'Virtual';

export interface BankCard {
  id: string;
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  network: CardNetwork;
  type: CardType;
  cardColor: string;
  accentColor: string;
  monthlyLimit: number;
  monthlySpent: number;
  isFrozen: boolean;
  label: string;
}

export const CARD_COLOR_THEMES = [
  { name: 'Midnight Navy', bg: '#25253D', accent: '#3B3B5C' },
  { name: 'Royal Blue', bg: '#0066FF', accent: '#3385FF' },
  { name: 'Obsidian Gold', bg: '#1C1917', accent: '#D97706' },
  { name: 'Emerald Deep', bg: '#064E3B', accent: '#10B981' },
];

export const initialCards: BankCard[] = [
  {
    id: 'card_1',
    cardHolder: 'Tanya Myroniuk',
    cardNumber: '4562 1122 4595 7852',
    expiryDate: '24/2029',
    cvv: '6986',
    balance: 8545.0,
    network: 'Mastercard',
    type: 'Physical',
    cardColor: '#25253D',
    accentColor: '#373759',
    monthlyLimit: 5000,
    monthlySpent: 1450.0,
    isFrozen: false,
    label: 'Main World Card',
  },
  {
    id: 'card_2',
    cardHolder: 'Tanya Myroniuk',
    cardNumber: '5289 3410 8821 3049',
    expiryDate: '11/2028',
    cvv: '412',
    balance: 3290.5,
    network: 'Visa',
    type: 'Physical',
    cardColor: '#0066FF',
    accentColor: '#2E83FF',
    monthlyLimit: 3500,
    monthlySpent: 890.25,
    isFrozen: false,
    label: 'Travel & Savings',
  },
  {
    id: 'card_3',
    cardHolder: 'Tanya Myroniuk',
    cardNumber: '4916 7702 1940 6618',
    expiryDate: '08/2027',
    cvv: '905',
    balance: 640.0,
    network: 'Mastercard',
    type: 'Virtual',
    cardColor: '#1E293B',
    accentColor: '#D97706',
    monthlyLimit: 1500,
    monthlySpent: 312.98,
    isFrozen: false,
    label: 'Online Subscriptions',
  },
];

// Format raw digits into groups of 4: "45621122..." -> "4562 1122 ..."
export const formatCardNumber = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
};

// Mask middle digits for security: "4562 1122 4595 7852" -> "4562  ****  ****  7852"
export const maskCardNumber = (cardNumber: string, showFull = false): string => {
  if (showFull) return cardNumber;
  const parts = cardNumber.split(' ');
  if (parts.length !== 4) return cardNumber;
  return `${parts[0]}   ****   ****   ${parts[3]}`;
};

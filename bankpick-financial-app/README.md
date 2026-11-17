# BankPick - Financial Management Mobile App (React Native + TypeScript)

Mobile banking and personal finance management application built with **React Native (Expo)** and **TypeScript**, inspired by the BankPick Financial Management UI kit.

## Project Structure

```text
├── data/
│   ├── cards.ts              # Bank cards mock data & formatting helpers
│   ├── profile.ts            # User profile & quick transfer contacts
│   └── transactions.ts       # Income/expense transactions & categories
├── navigation/
│   └── AppNavigator.tsx      # Bottom Tabs & Stack Navigation setup
├── screens/
│   ├── AddCardScreen.tsx
│   ├── AllCardsScreen.tsx
│   ├── CategoryChartScreen.tsx
│   ├── EditProfileScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LanguageScreen.tsx
│   ├── MyCardsScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── RequestMoneyScreen.tsx
│   ├── SearchScreen.tsx
│   ├── SendMoneyScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── StatisticsScreen.tsx
│   └── TransactionsScreen.tsx
├── theme/
│   ├── colors.ts             # Light & Dark mode color palettes
│   └── ThemeContext.tsx      # Global state (Theme, Cards, Transactions, Profile, Language)
├── App.tsx                   # App entry point
└── package.json
```

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start Expo development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code using **Expo Go** on Android/iOS or press `a` / `i` to run on an emulator.

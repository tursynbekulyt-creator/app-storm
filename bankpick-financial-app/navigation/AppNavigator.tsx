import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme/ThemeContext';

// Main Tab Screens
import HomeScreen from '../screens/HomeScreen';
import MyCardsScreen from '../screens/MyCardsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Stack Screens
import TransactionsScreen from '../screens/TransactionsScreen';
import SendMoneyScreen from '../screens/SendMoneyScreen';
import RequestMoneyScreen from '../screens/RequestMoneyScreen';
import AllCardsScreen from '../screens/AllCardsScreen';
import AddCardScreen from '../screens/AddCardScreen';
import CategoryChartScreen from '../screens/CategoryChartScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import LanguageScreen from '../screens/LanguageScreen';

export type RootStackParamList = {
  MainTabs: undefined;
  Transactions: { initialCategory?: string } | undefined;
  SendMoney: { preselectedContactId?: string } | undefined;
  RequestMoney: undefined;
  AllCards: undefined;
  AddCard: undefined;
  CategoryChart: undefined;
  Search: undefined;
  Profile: undefined;
  EditProfile: undefined;
  Language: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  MyCardsTab: undefined;
  StatisticsTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabNavigator: React.FC = () => {
  const { colors, t } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 10,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyCardsTab') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'StatisticsTab') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size || 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: t('home') }}
      />
      <Tab.Screen
        name="MyCardsTab"
        component={MyCardsScreen}
        options={{ tabBarLabel: t('myCards') }}
      />
      <Tab.Screen
        name="StatisticsTab"
        component={StatisticsScreen}
        options={{ tabBarLabel: t('statistics') }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: t('settings') }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Transactions" component={TransactionsScreen} />
      <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
      <Stack.Screen name="RequestMoney" component={RequestMoneyScreen} />
      <Stack.Screen name="AllCards" component={AllCardsScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
      <Stack.Screen name="CategoryChart" component={CategoryChartScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;

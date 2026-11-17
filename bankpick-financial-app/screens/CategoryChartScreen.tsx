import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import { CATEGORY_COLORS, TransactionCategory } from '../data/transactions';

type CatNavProp = NativeStackNavigationProp<RootStackParamList>;

const MONTHS = ['September 2026', 'October 2026', 'November 2026'];

const CategoryChartScreen: React.FC = () => {
  const navigation = useNavigation<CatNavProp>();
  const { colors, t, transactions, formatMoney } = useAppTheme();

  const [monthIdx, setMonthIdx] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | null>(null);

  const expenses = transactions.filter((tx) => tx.type === 'expense');
  const totalSpent = expenses.reduce((sum, tx) => sum + tx.amount, 0) || 1;

  const categoryList: TransactionCategory[] = [
    'Shopping',
    'Grocery',
    'Entertainment',
    'Transport',
  ];

  const breakdown = categoryList
    .map((cat) => {
      const catTxs = expenses.filter((tx) => tx.category === cat);
      const amount = catTxs.reduce((s, tx) => s + tx.amount, 0);
      const percent = Math.round((amount / totalSpent) * 100);
      return {
        category: cat,
        amount,
        percent,
        count: catTxs.length,
        color: CATEGORY_COLORS[cat],
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Donut Chart geometry
  const size = 210;
  const strokeWidth = 24;
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('categoryChart')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Month Switcher */}
        <View style={[styles.monthSelector, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => setMonthIdx((p) => (p > 0 ? p - 1 : MONTHS.length - 1))}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {MONTHS[monthIdx]}
          </Text>
          <TouchableOpacity
            onPress={() => setMonthIdx((p) => (p + 1) % MONTHS.length)}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Donut Ring Chart */}
        <View style={styles.donutWrapper}>
          <Svg width={size} height={size}>
            <G rotation="-90" origin={`${center}, ${center}`}>
              {breakdown.map((item) => {
                const strokeDashoffset =
                  circumference - (circumference * item.percent) / 100;
                const rotationAngle = (accumulatedPercent / 100) * 360;
                accumulatedPercent += item.percent;

                return (
                  <Circle
                    key={item.category}
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={
                      selectedCategory === item.category
                        ? strokeWidth + 5
                        : strokeWidth
                    }
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    rotation={rotationAngle}
                    origin={`${center}, ${center}`}
                  />
                );
              })}
            </G>
          </Svg>

          {/* Center Total Label */}
          <View style={styles.donutCenterText}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              {selectedCategory || 'Total Spent'}
            </Text>
            <Text style={[styles.donutTotalValue, { color: colors.text }]}>
              {formatMoney(
                selectedCategory
                  ? breakdown.find((b) => b.category === selectedCategory)?.amount || 0
                  : totalSpent
              )}
            </Text>
          </View>
        </View>

        {/* Category Breakdown Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Spending by Category
        </Text>

        {breakdown.map((item) => {
          const isSelected = selectedCategory === item.category;
          return (
            <TouchableOpacity
              key={item.category}
              activeOpacity={0.85}
              onPress={() =>
                setSelectedCategory(isSelected ? null : item.category)
              }
              style={[
                styles.catCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? item.color : 'transparent',
                  borderWidth: 1.5,
                },
              ]}
            >
              <View style={styles.catTopRow}>
                <View style={styles.catLeft}>
                  <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                  />
                  <View>
                    <Text style={[styles.catName, { color: colors.text }]}>
                      {item.category}
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      {item.count} transactions
                    </Text>
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.catAmount, { color: colors.text }]}>
                    {formatMoney(item.amount)}
                  </Text>
                  <Text style={{ color: item.color, fontWeight: '700', fontSize: 12 }}>
                    {item.percent}%
                  </Text>
                </View>
              </View>

              <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${item.percent}%`, backgroundColor: item.color },
                  ]}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.viewAllBtn, { backgroundColor: colors.primary }]}
          onPress={() =>
            navigation.navigate('Transactions', {
              initialCategory: selectedCategory || 'All',
            })
          }
        >
          <Text style={styles.viewAllBtnText}>
            View {selectedCategory || 'All'} Transactions
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 22,
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  donutWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    position: 'relative',
  },
  donutCenterText: {
    position: 'absolute',
    alignItems: 'center',
  },
  donutTotalValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  catCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  catTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  catName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  catAmount: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  viewAllBtn: {
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
  viewAllBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CategoryChartScreen;

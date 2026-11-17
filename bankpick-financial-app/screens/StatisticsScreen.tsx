import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
} from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';

type StatsNavProp = NativeStackNavigationProp<RootStackParamList>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 40;
const CHART_HEIGHT = 185;

const monthlyData = [
  { month: 'Oct', expense: 1420, income: 3200 },
  { month: 'Nov', expense: 1890, income: 3650 },
  { month: 'Dec', expense: 2450, income: 4100 },
  { month: 'Jan', expense: 1760, income: 3870 },
  { month: 'Feb', expense: 2140, income: 4250 },
  { month: 'Mar', expense: 1920, income: 4545 },
];

const StatisticsScreen: React.FC = () => {
  const navigation = useNavigation<StatsNavProp>();
  const { colors, t, cards, transactions, formatMoney } = useAppTheme();

  const [selectedIndex, setSelectedIndex] = useState<number>(3); // 'Jan' highlighted like BankPick UI
  const [chartMode, setChartMode] = useState<'income' | 'expense'>('income');

  const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0);
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Compute SVG points for smooth curve
  const values = monthlyData.map((d) =>
    chartMode === 'income' ? d.income : d.expense
  );
  const maxVal = Math.max(...values) * 1.15;
  const minVal = Math.min(...values) * 0.7;

  const points = values.map((val, idx) => {
    const x = 24 + (idx * (CHART_WIDTH - 48)) / (values.length - 1);
    const normalized = (val - minVal) / (maxVal - minVal || 1);
    const y = CHART_HEIGHT - 28 - normalized * (CHART_HEIGHT - 55);
    return { x, y, val };
  });

  // Build smooth cubic bezier SVG path
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const ctrlX1 = curr.x + (next.x - curr.x) / 2;
      const ctrlY1 = curr.y;
      const ctrlX2 = curr.x + (next.x - curr.x) / 2;
      const ctrlY2 = next.y;
      d += ` C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${next.x} ${next.y}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    CHART_HEIGHT - 15
  } L ${points[0].x} ${CHART_HEIGHT - 15} Z`;

  const activePoint = points[selectedIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 42 }} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('statistics')}
        </Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.navigate('CategoryChart')}
        >
          <Ionicons name="pie-chart-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Balance Hero */}
        <View style={styles.balanceCenter}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            {t('currentBalance')}
          </Text>
          <Text style={[styles.balanceValue, { color: colors.text }]}>
            {formatMoney(totalBalance)}
          </Text>
        </View>

        {/* Income / Expense Toggle Pills */}
        <View style={[styles.toggleBar, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={[
              styles.togglePill,
              chartMode === 'income' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setChartMode('income')}
          >
            <Text
              style={{
                color: chartMode === 'income' ? '#FFFFFF' : colors.textSecondary,
                fontWeight: '700',
                fontSize: 13,
              }}
            >
              Income Flow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.togglePill,
              chartMode === 'expense' && { backgroundColor: colors.primary },
            ]}
            onPress={() => setChartMode('expense')}
          >
            <Text
              style={{
                color: chartMode === 'expense' ? '#FFFFFF' : colors.textSecondary,
                fontWeight: '700',
                fontSize: 13,
              }}
            >
              Spending Flow
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Smooth Line Chart */}
        <View style={styles.chartWrapper}>
          {/* Floating value badge above active point */}
          <View
            style={[
              styles.tooltipBadge,
              {
                backgroundColor: colors.primary,
                left: Math.min(
                  Math.max(activePoint.x - 42, 8),
                  CHART_WIDTH - 92
                ),
                top: Math.max(activePoint.y - 38, 0),
              },
            ]}
          >
            <Text style={styles.tooltipText}>
              {formatMoney(activePoint.val)}
            </Text>
          </View>

          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="gradFill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.35" />
                <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.0" />
              </LinearGradient>
            </Defs>

            {/* Vertical guide line for selected month */}
            <Line
              x1={activePoint.x}
              y1={activePoint.y}
              x2={activePoint.x}
              y2={CHART_HEIGHT - 12}
              stroke={colors.primary}
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />

            {/* Gradient Area */}
            <Path d={areaPath} fill="url(#gradFill)" />

            {/* Smooth Spline Stroke */}
            <Path
              d={linePath}
              fill="none"
              stroke={colors.primary}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {points.map((pt, idx) => (
              <Circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r={idx === selectedIndex ? 7 : 4}
                fill={idx === selectedIndex ? colors.primary : colors.background}
                stroke={colors.primary}
                strokeWidth="3"
              />
            ))}
          </Svg>

          {/* Month Selector Buttons */}
          <View style={styles.monthsRow}>
            {monthlyData.map((item, idx) => {
              const active = idx === selectedIndex;
              return (
                <TouchableOpacity
                  key={item.month}
                  onPress={() => setSelectedIndex(idx)}
                  style={[
                    styles.monthPill,
                    active && { backgroundColor: colors.primary },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: active ? '700' : '500',
                      fontSize: 13,
                    }}
                  >
                    {item.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Income vs Expense Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#16322B' }]}>
              <Ionicons name="arrow-down" size={18} color="#10B981" />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Total Income
            </Text>
            <Text style={[styles.summaryAmount, { color: colors.text }]}>
              {formatMoney(totalIncome)}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.summaryIcon, { backgroundColor: '#361B20' }]}>
              <Ionicons name="arrow-up" size={18} color="#EB5757" />
            </View>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Total Expense
            </Text>
            <Text style={[styles.summaryAmount, { color: colors.text }]}>
              {formatMoney(totalExpense)}
            </Text>
          </View>
        </View>

        {/* Category Breakdown Banner */}
        <TouchableOpacity
          style={[styles.categoryBanner, { backgroundColor: colors.primaryLight }]}
          onPress={() => navigation.navigate('CategoryChart')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Ionicons name="pie-chart" size={24} color={colors.primary} />
            <View>
              <Text style={[styles.bannerTitle, { color: colors.text }]}>
                View Category Breakdown
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Analyze spending by Shopping, Food & Bills
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('transaction')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              {t('seeAll')}
            </Text>
          </TouchableOpacity>
        </View>

        {transactions.slice(0, 4).map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: colors.iconBg }]}>
              <Ionicons
                name={tx.iconName as keyof typeof Ionicons.glyphMap}
                size={19}
                color={tx.iconColor === '#FFFFFF' ? colors.text : tx.iconColor}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txName, { color: colors.text }]}>{tx.title}</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {tx.category}
              </Text>
            </View>
            <Text
              style={{
                color: tx.type === 'income' ? colors.primary : colors.text,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              {formatMoney(tx.type === 'income' ? tx.amount : -tx.amount, true)}
            </Text>
          </View>
        ))}
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
  iconBtn: {
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
  balanceCenter: {
    alignItems: 'center',
    marginVertical: 10,
  },
  balanceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 30,
    fontWeight: '800',
  },
  toggleBar: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginTop: 12,
    marginBottom: 18,
  },
  togglePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  chartWrapper: {
    position: 'relative',
    paddingTop: 24,
    marginBottom: 20,
  },
  tooltipBadge: {
    position: 'absolute',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    zIndex: 10,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  monthsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  monthPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: '800',
  },
  categoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    marginBottom: 22,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  txName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
});

export default StatisticsScreen;

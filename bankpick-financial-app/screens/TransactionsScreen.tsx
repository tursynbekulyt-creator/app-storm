import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import { Transaction } from '../data/transactions';

type TxNavProp = NativeStackNavigationProp<RootStackParamList>;
type TxRouteProp = RouteProp<RootStackParamList, 'Transactions'>;

const TransactionsScreen: React.FC = () => {
  const navigation = useNavigation<TxNavProp>();
  const route = useRoute<TxRouteProp>();
  const { colors, t, transactions, formatMoney } = useAppTheme();

  const [typeFilter, setTypeFilter] = useState<'All' | 'income' | 'expense'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>(
    route.params?.initialCategory || 'All'
  );
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((tx) => {
    const matchesType = typeFilter === 'All' ? true : tx.type === typeFilter;
    const matchesCat =
      categoryFilter === 'All' ? true : tx.category === categoryFilter;
    return matchesType && matchesCat;
  });

  const groups: ('Today' | 'Yesterday' | 'Earlier')[] = [
    'Today',
    'Yesterday',
    'Earlier',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('transaction')} History
        </Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Type Filter Segment */}
      <View style={styles.typeRow}>
        {[
          { key: 'All', label: 'All' },
          { key: 'income', label: 'Income' },
          { key: 'expense', label: 'Expense' },
        ].map((tab) => {
          const active = typeFilter === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setTypeFilter(tab.key as 'All' | 'income' | 'expense')}
              style={[
                styles.typePill,
                {
                  backgroundColor: active ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Category Filter Chips */}
      <View style={{ height: 42 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {['All', 'Shopping', 'Entertainment', 'Transfer', 'Grocery', 'Transport'].map(
            (cat) => {
              const active = categoryFilter === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategoryFilter(cat)}
                  style={[
                    styles.catChip,
                    {
                      borderColor: active ? colors.primary : colors.border,
                      backgroundColor: active
                        ? colors.primaryLight
                        : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.primary : colors.textSecondary,
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Transactions Found
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Try changing your category or type filter.
            </Text>
          </View>
        ) : (
          groups.map((grp) => {
            const itemsInGroup = filtered.filter((tx) => tx.dateGroup === grp);
            if (itemsInGroup.length === 0) return null;

            return (
              <View key={grp} style={{ marginBottom: 18 }}>
                <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>
                  {grp}
                </Text>
                {itemsInGroup.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.txRow}
                    onPress={() => setSelectedTx(item)}
                  >
                    <View
                      style={[styles.txIcon, { backgroundColor: colors.iconBg }]}
                    >
                      <Ionicons
                        name={item.iconName as keyof typeof Ionicons.glyphMap}
                        size={20}
                        color={
                          item.iconColor === '#FFFFFF'
                            ? colors.text
                            : item.iconColor
                        }
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.txTitle, { color: colors.text }]}>
                        {item.title}
                      </Text>
                      <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                        {item.category} • {item.time}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color:
                          item.type === 'income' ? colors.primary : colors.text,
                        fontWeight: '700',
                        fontSize: 15,
                      }}
                    >
                      {formatMoney(
                        item.type === 'income' ? item.amount : -item.amount,
                        true
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Receipt Details Modal */}
      <Modal
        visible={!!selectedTx}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTx(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            {selectedTx && (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedTx.title}
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
                  {selectedTx.date} at {selectedTx.time}
                </Text>
                <Text
                  style={[
                    styles.modalAmount,
                    {
                      color:
                        selectedTx.type === 'income'
                          ? colors.primary
                          : colors.text,
                    },
                  ]}
                >
                  {formatMoney(
                    selectedTx.type === 'income'
                      ? selectedTx.amount
                      : -selectedTx.amount,
                    true
                  )}
                </Text>
                <View style={styles.detailRow}>
                  <Text style={{ color: colors.textSecondary }}>Reference</Text>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    {selectedTx.referenceId}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={{ color: colors.textSecondary }}>Category</Text>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    {selectedTx.category}
                  </Text>
                </View>
                {selectedTx.note && (
                  <View style={styles.detailRow}>
                    <Text style={{ color: colors.textSecondary }}>Note</Text>
                    <Text style={{ color: colors.text, fontWeight: '500' }}>
                      {selectedTx.note}
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[styles.closeBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setSelectedTx(null)}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  typeRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  typePill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  catScroll: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  txIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  modalAmount: {
    fontSize: 26,
    fontWeight: '800',
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  closeBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
});

export default TransactionsScreen;

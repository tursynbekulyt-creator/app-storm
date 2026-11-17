import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import { maskCardNumber } from '../data/cards';

type MyCardsNavProp = NativeStackNavigationProp<RootStackParamList>;

const MyCardsScreen: React.FC = () => {
  const navigation = useNavigation<MyCardsNavProp>();
  const {
    colors,
    t,
    cards,
    selectedCardId,
    setSelectedCardId,
    toggleFreezeCard,
    updateCardLimit,
    transactions,
    formatMoney,
  } = useAppTheme();

  const [onlinePay, setOnlinePay] = useState(true);
  const [contactless, setContactless] = useState(true);
  const [revealDetails, setRevealDetails] = useState(false);

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];
  const progressPercent = Math.min(
    100,
    Math.round((currentCard.monthlySpent / currentCard.monthlyLimit) * 100)
  );

  const cardTransactions = transactions.filter((tx) => tx.cardId === currentCard.id);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.navigate('AllCards')}
        >
          <Ionicons name="albums-outline" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('myCards')}
        </Text>
        <TouchableOpacity
          style={[styles.headerBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.navigate('AddCard')}
        >
          <Ionicons name="add" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Horizontal Card Selector Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 14 }}
        >
          {cards.map((c) => {
            const active = c.id === currentCard.id;
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCardId(c.id)}
                style={[
                  styles.cardTabPill,
                  {
                    backgroundColor: active ? colors.primary : colors.iconBg,
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
                  {c.label} •••• {c.cardNumber.slice(-4)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Main Card Display */}
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: currentCard.isFrozen
                ? '#4B5563'
                : currentCard.cardColor,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.chip} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {currentCard.isFrozen && (
                <View style={styles.frozenBadge}>
                  <Text style={styles.frozenBadgeText}>FROZEN</Text>
                </View>
              )}
              <TouchableOpacity onPress={() => setRevealDetails((p) => !p)}>
                <Ionicons
                  name={revealDetails ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.cardNumber}>
            {maskCardNumber(currentCard.cardNumber, revealDetails)}
          </Text>

          <View style={styles.cardFooterRow}>
            <View>
              <Text style={styles.cardHolder}>{currentCard.cardHolder}</Text>
              <View style={{ flexDirection: 'row', gap: 22 }}>
                <View>
                  <Text style={styles.metaLabel}>Expiry Date</Text>
                  <Text style={styles.metaVal}>{currentCard.expiryDate}</Text>
                </View>
                <View>
                  <Text style={styles.metaLabel}>CVV</Text>
                  <Text style={styles.metaVal}>
                    {revealDetails ? currentCard.cvv : '***'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.metaLabel}>Balance</Text>
              <Text style={styles.cardBalance}>
                {formatMoney(currentCard.balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Monthly Spending Limit Card (Classic BankPick Component) */}
        <View style={[styles.limitCard, { backgroundColor: colors.surface }]}>
          <View style={styles.limitHeader}>
            <Text style={[styles.limitTitle, { color: colors.text }]}>
              Monthly Spending Limit
            </Text>
            <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
              {progressPercent}%
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor:
                    progressPercent > 85 ? colors.danger : colors.primary,
                },
              ]}
            />
          </View>

          <View style={styles.limitBottomRow}>
            <Text style={[styles.limitInfoText, { color: colors.textSecondary }]}>
              Amount:{' '}
              <Text style={{ color: colors.text, fontWeight: '700' }}>
                {formatMoney(currentCard.monthlySpent)}
              </Text>
            </Text>
            <Text style={[styles.limitInfoText, { color: colors.text }]}>
              {formatMoney(currentCard.monthlyLimit)}
            </Text>
          </View>

          {/* Quick Limit Adjustment Buttons */}
          <View style={styles.limitAdjustRow}>
            {[1500, 3500, 5000, 10000].map((lim) => (
              <TouchableOpacity
                key={lim}
                onPress={() => updateCardLimit(currentCard.id, lim)}
                style={[
                  styles.limitChip,
                  {
                    backgroundColor:
                      currentCard.monthlyLimit === lim
                        ? colors.primary
                        : colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      currentCard.monthlyLimit === lim
                        ? '#FFFFFF'
                        : colors.textSecondary,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  ${lim.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card Security & Settings */}
        <View style={[styles.controlsBox, { backgroundColor: colors.surface }]}>
          <View style={styles.controlRow}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="snow-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.controlTitle, { color: colors.text }]}>
                  Freeze Card
                </Text>
                <Text style={[styles.controlSub, { color: colors.textSecondary }]}>
                  Temporarily disable all card transactions
                </Text>
              </View>
            </View>
            <Switch
              value={currentCard.isFrozen}
              onValueChange={() => toggleFreezeCard(currentCard.id)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.controlRow}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="globe-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.controlTitle, { color: colors.text }]}>
                  Online Payments
                </Text>
                <Text style={[styles.controlSub, { color: colors.textSecondary }]}>
                  Allow e-commerce & subscriptions
                </Text>
              </View>
            </View>
            <Switch
              value={onlinePay}
              onValueChange={setOnlinePay}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.controlRow, { marginBottom: 0 }]}>
            <View style={styles.controlLeft}>
              <View style={[styles.controlIcon, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="wifi-outline" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={[styles.controlTitle, { color: colors.text }]}>
                  Contactless NFC
                </Text>
                <Text style={[styles.controlSub, { color: colors.textSecondary }]}>
                  Apple Pay & Google Pay tap
                </Text>
              </View>
            </View>
            <Switch
              value={contactless}
              onValueChange={setContactless}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Card Activity
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllCards')}>
            <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 13 }}>
              All Cards ({cards.length})
            </Text>
          </TouchableOpacity>
        </View>

        {cardTransactions.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 12 }}>
            No transactions on this card yet.
          </Text>
        ) : (
          cardTransactions.slice(0, 4).map((tx) => (
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
          ))
        )}
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
  headerBtn: {
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
  cardTabPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  cardContainer: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chip: {
    width: 34,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#D4AF37',
  },
  frozenBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  frozenBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 22,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolder: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  metaLabel: {
    color: '#A2A2A7',
    fontSize: 10,
    marginBottom: 2,
  },
  metaVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  cardBalance: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  limitCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  limitTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  limitBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  limitInfoText: {
    fontSize: 13,
  },
  limitAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  limitChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  controlsBox: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 22,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  controlLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  controlIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  controlTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  controlSub: {
    fontSize: 11,
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

export default MyCardsScreen;

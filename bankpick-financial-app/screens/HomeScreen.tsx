import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import { maskCardNumber } from '../data/cards';
import { Transaction } from '../data/transactions';

type HomeNavProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNavProp>();
  const {
    colors,
    t,
    cards,
    selectedCardId,
    setSelectedCardId,
    transactions,
    addTransaction,
    profile,
    formatMoney,
  } = useAppTheme();

  const [showFullCardNum, setShowFullCardNum] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [topupModalVisible, setTopupModalVisible] = useState(false);

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleQuickTopup = (amount: number) => {
    addTransaction(
      {
        title: 'Instant Card Topup',
        category: 'Transfer',
        type: 'income',
        amount,
        date: '17 Nov 2026',
        dateGroup: 'Today',
        time: 'Just now',
        iconName: 'cloud-upload',
        iconColor: '#0066FF',
        iconBg: '#1B2B4B',
        cardId: activeCard.id,
        referenceId: `BP-${Math.floor(1000000 + Math.random() * 9000000)}`,
        note: 'Quick wallet top-up',
      },
      activeCard.id
    );
    setTopupModalVisible(false);
    Alert.alert('Success', `Added ${formatMoney(amount)} to ${activeCard.label}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <View style={[styles.avatar, { backgroundColor: profile.avatarBg }]}>
              <Text style={styles.avatarText}>{profile.initials}</Text>
            </View>
            <View>
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>
                {t('welcomeBack')}
              </Text>
              <Text style={[styles.userName, { color: colors.text }]}>
                {profile.fullName}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconCircle, { backgroundColor: colors.iconBg }]}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={21} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* BankPick Card Visual */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => setShowFullCardNum((prev) => !prev)}
          style={[
            styles.creditCard,
            { backgroundColor: activeCard.cardColor },
          ]}
        >
          {/* Decorative background circles matching Figma card style */}
          <View
            style={[
              styles.cardDecorCircle1,
              { backgroundColor: activeCard.accentColor },
            ]}
          />
          <View
            style={[
              styles.cardDecorCircle2,
              { backgroundColor: activeCard.accentColor },
            ]}
          />

          <View style={styles.cardTopRow}>
            <View style={styles.chipIcon}>
              <View style={styles.chipInnerLine} />
            </View>
            <View style={styles.cardTopRight}>
              <Text style={styles.cardBalanceBadge}>
                {formatMoney(activeCard.balance)}
              </Text>
              <Ionicons name="wifi" size={20} color="#A2A2A7" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
          </View>

          <Text style={styles.cardNumberText}>
            {maskCardNumber(activeCard.cardNumber, showFullCardNum)}
          </Text>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardHolderName}>{activeCard.cardHolder}</Text>
              <View style={styles.cardMetaRow}>
                <View style={{ marginRight: 24 }}>
                  <Text style={styles.cardMetaLabel}>Expiry Date</Text>
                  <Text style={styles.cardMetaValue}>{activeCard.expiryDate}</Text>
                </View>
                <View>
                  <Text style={styles.cardMetaLabel}>CVV</Text>
                  <Text style={styles.cardMetaValue}>
                    {showFullCardNum ? activeCard.cvv : '***'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Mastercard / Visa Brand Mark */}
            <View style={styles.networkWrap}>
              {activeCard.network === 'Mastercard' ? (
                <View style={styles.mastercardCircles}>
                  <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
                  <View
                    style={[
                      styles.mcCircle,
                      { backgroundColor: '#F79E1B', marginLeft: -11, opacity: 0.9 },
                    ]}
                  />
                </View>
              ) : (
                <Text style={styles.visaLogoText}>VISA</Text>
              )}
              <Text style={styles.networkLabel}>{activeCard.network}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card switcher dots if multiple cards */}
        {cards.length > 1 && (
          <View style={styles.dotsRow}>
            {cards.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCardId(c.id)}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      c.id === activeCard.id ? colors.primary : colors.border,
                    width: c.id === activeCard.id ? 20 : 7,
                  },
                ]}
              />
            ))}
          </View>
        )}

        {/* 4 Quick Actions (Sent, Receive, Loan, Topup) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('SendMoney')}
          >
            <View style={[styles.actionCircle, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="arrow-up" size={22} color={colors.text} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
              {t('sent')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('RequestMoney')}
          >
            <View style={[styles.actionCircle, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="arrow-down" size={22} color={colors.text} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
              {t('receive')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('CategoryChart')}
          >
            <View style={[styles.actionCircle, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="cash-outline" size={22} color={colors.text} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
              {t('loan')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setTopupModalVisible(true)}
          >
            <View style={[styles.actionCircle, { backgroundColor: colors.iconBg }]}>
              <Ionicons name="cloud-upload-outline" size={22} color={colors.text} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
              {t('topup')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('transaction')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              {t('seeAll')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions List */}
        {transactions.slice(0, 6).map((item) => {
          const signedAmount = item.type === 'income' ? item.amount : -item.amount;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.txRow}
              onPress={() => setSelectedTx(item)}
              activeOpacity={0.75}
            >
              <View style={[styles.txIconBox, { backgroundColor: colors.iconBg }]}>
                <Ionicons
                  name={item.iconName as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={item.iconColor === '#FFFFFF' ? colors.text : item.iconColor}
                />
              </View>

              <View style={styles.txInfo}>
                <Text style={[styles.txTitle, { color: colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.txCategory, { color: colors.textSecondary }]}>
                  {item.category}
                </Text>
              </View>

              <Text
                style={[
                  styles.txAmount,
                  {
                    color: item.type === 'income' ? colors.primary : colors.text,
                  },
                ]}
              >
                {formatMoney(signedAmount, true)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Quick Topup Modal */}
      <Modal
        visible={topupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTopupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Quick Card Topup
            </Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Select an amount to deposit into {activeCard.label}
            </Text>
            <View style={styles.presetGrid}>
              {[50, 100, 250, 500].map((amt) => (
                <TouchableOpacity
                  key={amt}
                  style={[styles.presetBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={() => handleQuickTopup(amt)}
                >
                  <Text style={[styles.presetBtnText, { color: colors.primary }]}>
                    +{formatMoney(amt)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.closeModalBtn, { borderColor: colors.border }]}
              onPress={() => setTopupModalVisible(false)}
            >
              <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transaction Receipt Modal */}
      <Modal
        visible={!!selectedTx}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTx(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            {selectedTx && (
              <>
                <View style={[styles.receiptIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons
                    name={selectedTx.iconName as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {selectedTx.title}
                </Text>
                <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                  {selectedTx.date} • {selectedTx.time}
                </Text>
                <Text
                  style={[
                    styles.receiptAmount,
                    {
                      color:
                        selectedTx.type === 'income' ? colors.primary : colors.text,
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

                <View style={[styles.receiptDivider, { backgroundColor: colors.border }]} />

                <View style={styles.receiptRow}>
                  <Text style={{ color: colors.textSecondary }}>Category</Text>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    {selectedTx.category}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={{ color: colors.textSecondary }}>Reference ID</Text>
                  <Text style={{ color: colors.text, fontWeight: '600' }}>
                    {selectedTx.referenceId}
                  </Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={{ color: colors.textSecondary }}>Status</Text>
                  <Text style={{ color: colors.success, fontWeight: '700' }}>
                    Completed
                  </Text>
                </View>
                {selectedTx.note && (
                  <View style={styles.receiptRow}>
                    <Text style={{ color: colors.textSecondary }}>Note</Text>
                    <Text
                      style={{ color: colors.text, fontWeight: '500', maxWidth: '65%' }}
                      numberOfLines={2}
                    >
                      {selectedTx.note}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setSelectedTx(null)}
                >
                  <Text style={styles.primaryBtnText}>Done</Text>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: 12,
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditCard: {
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  cardDecorCircle1: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    top: -60,
    right: -40,
    opacity: 0.35,
  },
  cardDecorCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    bottom: -70,
    left: -30,
    opacity: 0.25,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chipIcon: {
    width: 34,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#D4AF37',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  chipInnerLine: {
    height: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 2,
  },
  cardTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardBalanceBadge: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardNumberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 22,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardHolderName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  cardMetaRow: {
    flexDirection: 'row',
  },
  cardMetaLabel: {
    color: '#A2A2A7',
    fontSize: 10,
    marginBottom: 2,
  },
  cardMetaValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  networkWrap: {
    alignItems: 'center',
  },
  mastercardCircles: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  mcCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  visaLogoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  networkLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    height: 7,
    borderRadius: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 26,
    paddingHorizontal: 6,
  },
  actionItem: {
    alignItems: 'center',
  },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
  },
  txIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  txCategory: {
    fontSize: 12,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginBottom: 18,
  },
  presetBtn: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  presetBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  closeModalBtn: {
    width: '100%',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  receiptIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptAmount: {
    fontSize: 26,
    fontWeight: '800',
    marginVertical: 8,
  },
  receiptDivider: {
    width: '100%',
    height: 1,
    marginVertical: 14,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  primaryBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default HomeScreen;

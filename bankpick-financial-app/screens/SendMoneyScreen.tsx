import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext';
import { quickContacts } from '../data/profile';

const SendMoneyScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    colors,
    t,
    cards,
    selectedCardId,
    setSelectedCardId,
    addTransaction,
    formatMoney,
  } = useAppTheme();

  const [selectedContactId, setSelectedContactId] = useState<string>(quickContacts[1].id);
  const [customRecipient, setCustomRecipient] = useState('');
  const [amount, setAmount] = useState('150.00');
  const [note, setNote] = useState('');
  const [successModal, setSuccessModal] = useState(false);
  const [lastSentSummary, setLastSentSummary] = useState({
    recipient: '',
    amount: 0,
  });

  const activeCard = cards.find((c) => c.id === selectedCardId) || cards[0];
  const selectedContact = quickContacts.find((c) => c.id === selectedContactId);

  const handleSend = () => {
    const numericAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount greater than 0.');
      return;
    }
    if (activeCard.isFrozen) {
      Alert.alert('Card Frozen', 'Unfreeze this card before sending money.');
      return;
    }
    if (numericAmount > activeCard.balance) {
      Alert.alert(
        'Insufficient Funds',
        `Available balance on ${activeCard.label} is ${formatMoney(activeCard.balance)}.`
      );
      return;
    }

    const recipientName = customRecipient.trim()
      ? customRecipient.trim()
      : selectedContact?.name || 'Recipient';

    addTransaction(
      {
        title: `Transfer to ${recipientName}`,
        category: 'Transfer',
        type: 'expense',
        amount: numericAmount,
        date: '17 Nov 2026',
        dateGroup: 'Today',
        time: 'Just now',
        iconName: 'paper-plane',
        iconColor: '#0066FF',
        iconBg: '#1B2B4B',
        cardId: activeCard.id,
        referenceId: `BP-${Math.floor(1000000 + Math.random() * 9000000)}`,
        note: note.trim() || 'Instant peer-to-peer transfer',
      },
      activeCard.id
    );

    setLastSentSummary({ recipient: recipientName, amount: numericAmount });
    setSuccessModal(true);
  };

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
          {t('sendMoney')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Source Card Selector */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          Select Source Card
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >
          {cards.map((card) => {
            const active = card.id === activeCard.id;
            return (
              <TouchableOpacity
                key={card.id}
                onPress={() => setSelectedCardId(card.id)}
                style={[
                  styles.sourceCard,
                  {
                    backgroundColor: active ? card.cardColor : colors.surface,
                    borderColor: active ? colors.primary : colors.border,
                    borderWidth: active ? 2 : 1,
                  },
                ]}
              >
                <Text
                  style={{
                    color: active ? '#FFFFFF' : colors.text,
                    fontWeight: '700',
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  {card.label}
                </Text>
                <Text
                  style={{
                    color: active ? '#CBD5E1' : colors.textSecondary,
                    fontSize: 12,
                    marginBottom: 8,
                  }}
                >
                  •••• {card.cardNumber.slice(-4)}
                </Text>
                <Text
                  style={{
                    color: active ? '#FFFFFF' : colors.primary,
                    fontWeight: '800',
                    fontSize: 16,
                  }}
                >
                  {formatMoney(card.balance)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Send To Contacts */}
        <View style={[styles.boxContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.boxTitle, { color: colors.text }]}>Send to</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingVertical: 6 }}
          >
            {quickContacts.map((person) => {
              const selected =
                !customRecipient.trim() && person.id === selectedContactId;
              return (
                <TouchableOpacity
                  key={person.id}
                  style={styles.contactItem}
                  onPress={() => {
                    setCustomRecipient('');
                    setSelectedContactId(person.id);
                  }}
                >
                  <View
                    style={[
                      styles.contactAvatar,
                      {
                        backgroundColor: person.avatarBg,
                        borderWidth: selected ? 3 : 0,
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    <Text style={styles.contactInitials}>{person.initials}</Text>
                  </View>
                  <Text
                    style={[
                      styles.contactName,
                      {
                        color: selected ? colors.primary : colors.text,
                        fontWeight: selected ? '700' : '500',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {person.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TextInput
            style={[
              styles.recipientInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={customRecipient}
            onChangeText={setCustomRecipient}
            placeholder="Or enter recipient name / card number..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Enter Amount Box */}
        <View style={[styles.boxContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.amountHeader}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Enter Your Amount
            </Text>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
              No Commission (0%)
            </Text>
          </View>

          <View style={styles.amountInputRow}>
            <Text style={[styles.currencySign, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Quick Amount Chips */}
          <View style={styles.chipsRow}>
            {['25', '50', '100', '250', '500'].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => setAmount(val)}
                style={[
                  styles.amountChip,
                  {
                    backgroundColor:
                      amount === val ? colors.primary : colors.background,
                  },
                ]}
              >
                <Text
                  style={{
                    color: amount === val ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: '600',
                    fontSize: 13,
                  }}
                >
                  ${val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[
              styles.noteInput,
              {
                borderTopColor: colors.border,
                color: colors.text,
              },
            ]}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note (optional)"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.primary }]}
          onPress={handleSend}
        >
          <Text style={styles.sendBtnText}>{t('sendMoney')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Transfer Confirmation Modal */}
      <Modal
        visible={successModal}
        transparent
        animationType="fade"
        onRequestClose={() => setSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={34} color="#FFFFFF" />
            </View>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Transfer Successful!
            </Text>
            <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
              You sent{' '}
              <Text style={{ color: colors.primary, fontWeight: '700' }}>
                {formatMoney(lastSentSummary.amount)}
              </Text>{' '}
              to {lastSentSummary.recipient}.
            </Text>
            <TouchableOpacity
              style={[styles.modalDoneBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setSuccessModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.sendBtnText}>Back to Home</Text>
            </TouchableOpacity>
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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  sourceCard: {
    width: 165,
    padding: 15,
    borderRadius: 18,
    marginRight: 12,
  },
  boxContainer: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
  },
  boxTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  contactItem: {
    alignItems: 'center',
    width: 62,
  },
  contactAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  contactName: {
    fontSize: 12,
  },
  recipientInput: {
    marginTop: 14,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  currencySign: {
    fontSize: 28,
    fontWeight: '800',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
  },
  chipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  amountChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 10,
  },
  noteInput: {
    borderTopWidth: 1,
    paddingTop: 12,
    fontSize: 14,
  },
  sendBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    borderRadius: 24,
    padding: 26,
    alignItems: 'center',
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 22,
  },
  modalDoneBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: 'center',
  },
});

export default SendMoneyScreen;

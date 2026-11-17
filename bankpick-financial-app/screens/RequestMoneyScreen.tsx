import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext';
import { quickContacts } from '../data/profile';

const RequestMoneyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, t, addTransaction, formatMoney } = useAppTheme();

  const [payerName, setPayerName] = useState(quickContacts[2].name);
  const [email, setEmail] = useState('aruzhan.bekova@gmail.com');
  const [description, setDescription] = useState('Shared dinner & coffee');
  const [dueDate, setDueDate] = useState<'Today' | 'In 3 Days' | 'Next Week'>('Today');
  const [amount, setAmount] = useState('85.00');

  const handleSelectContact = (name: string, username: string) => {
    setPayerName(name);
    setEmail(`${username.replace('@', '')}@gmail.com`);
  };

  const handleRequestSubmit = () => {
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (!payerName.trim()) {
      Alert.alert('Missing Info', 'Please enter Payer Name.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid request amount.');
      return;
    }

    Alert.alert(
      'Payment Request Sent',
      `Requested ${formatMoney(numAmount)} from ${payerName}.
Simulate instant payment received now?`,
      [
        {
          text: 'Keep Pending',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Simulate Paid (+)',
          onPress: () => {
            addTransaction({
              title: `From ${payerName}`,
              category: 'Transfer',
              type: 'income',
              amount: numAmount,
              date: '17 Nov 2026',
              dateGroup: 'Today',
              time: 'Just now',
              iconName: 'arrow-down-circle',
              iconColor: '#10B981',
              iconBg: '#16322B',
              cardId: 'card_1',
              referenceId: `BP-${Math.floor(1000000 + Math.random() * 9000000)}`,
              note: description || 'Payment request fulfilled',
            });
            navigation.goBack();
          },
        },
      ]
    );
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
          {t('requestMoney')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Contacts Strip */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Request From Contact
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 14, marginBottom: 18 }}
        >
          {quickContacts.slice(1).map((person) => {
            const selected = payerName === person.name;
            return (
              <TouchableOpacity
                key={person.id}
                onPress={() => handleSelectContact(person.name, person.username)}
                style={[
                  styles.contactChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                  },
                ]}
              >
                <View style={[styles.miniAvatar, { backgroundColor: person.avatarBg }]}>
                  <Text style={styles.miniAvatarText}>{person.initials}</Text>
                </View>
                <Text
                  style={{
                    color: selected ? '#FFFFFF' : colors.text,
                    fontWeight: '600',
                    fontSize: 13,
                  }}
                >
                  {person.name.split(' ')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Payer Name */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Payer Name
        </Text>
        <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={payerName}
            onChangeText={setPayerName}
            placeholder="Enter payer full name"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Email Address */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Email Address
        </Text>
        <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            placeholder="payer@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Description */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Description
        </Text>
        <View style={[styles.inputRow, { borderBottomColor: colors.border }]}>
          <Ionicons name="document-text-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="What is this request for?"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Monthly Due Date */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Due Date
        </Text>
        <View style={styles.dueRow}>
          {(['Today', 'In 3 Days', 'Next Week'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setDueDate(option)}
              style={[
                styles.duePill,
                {
                  backgroundColor:
                    dueDate === option ? colors.primary : colors.surface,
                },
              ]}
            >
              <Text
                style={{
                  color: dueDate === option ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: '600',
                  fontSize: 13,
                }}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enter Amount Box */}
        <View style={[styles.amountCard, { backgroundColor: colors.surface }]}>
          <View style={styles.amountTop}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              Enter Your Amount
            </Text>
            <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
              USD
            </Text>
          </View>
          <View style={styles.amountInputRow}>
            <Text style={[styles.dollarSign, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: colors.primary }]}
          onPress={handleRequestSubmit}
        >
          <Text style={styles.submitBtnText}>{t('requestMoney')}</Text>
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
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 6,
    paddingVertical: 6,
    borderRadius: 24,
    gap: 8,
  },
  miniAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniAvatarText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  dueRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  duePill: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
  },
  amountCard: {
    borderRadius: 20,
    padding: 18,
    marginTop: 6,
    marginBottom: 24,
  },
  amountTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dollarSign: {
    fontSize: 28,
    fontWeight: '800',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
  },
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default RequestMoneyScreen;

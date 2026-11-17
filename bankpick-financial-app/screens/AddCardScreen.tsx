import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext';
import {
  CARD_COLOR_THEMES,
  CardNetwork,
  CardType,
  formatCardNumber,
} from '../data/cards';

const AddCardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, t, addCard, profile } = useAppTheme();

  const [cardHolder, setCardHolder] = useState(profile.fullName);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [label, setLabel] = useState('Personal Card');
  const [network, setNetwork] = useState<CardNetwork>('Mastercard');
  const [cardType, setCardType] = useState<CardType>('Physical');
  const [selectedTheme, setSelectedTheme] = useState(CARD_COLOR_THEMES[0]);

  const handleExpiryInput = (text: string) => {
    const clean = text.replace(/\D/g, '').slice(0, 6);
    if (clean.length >= 3) {
      setExpiryDate(`${clean.slice(0, 2)}/${clean.slice(2)}`);
    } else {
      setExpiryDate(clean);
    }
  };

  const handleSaveCard = () => {
    const digitsOnly = cardNumber.replace(/\s/g, '');
    if (!cardHolder.trim()) {
      Alert.alert('Validation Error', 'Please enter Cardholder Name.');
      return;
    }
    if (digitsOnly.length < 16) {
      Alert.alert('Validation Error', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (expiryDate.length < 4) {
      Alert.alert('Validation Error', 'Please enter a valid Expiry Date (MM/YYYY).');
      return;
    }
    if (cvv.length < 3) {
      Alert.alert('Validation Error', 'Please enter a 3 or 4 digit CVV code.');
      return;
    }

    addCard({
      cardHolder: cardHolder.trim(),
      cardNumber: formatCardNumber(digitsOnly),
      expiryDate,
      cvv,
      balance: 1500.0,
      network,
      type: cardType,
      cardColor: selectedTheme.bg,
      accentColor: selectedTheme.accent,
      monthlyLimit: 4000,
      monthlySpent: 0,
      isFrozen: false,
      label: label.trim() || 'New BankPick Card',
    });

    Alert.alert('Card Added', 'Your new card has been linked to BankPick!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.iconBg }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {t('addNewCard')}
          </Text>
          <View style={{ width: 42 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Live Preview Card */}
          <View style={[styles.previewCard, { backgroundColor: selectedTheme.bg }]}>
            <View style={styles.previewTop}>
              <View style={styles.chip} />
              <Text style={styles.previewNetwork}>{network}</Text>
            </View>
            <Text style={styles.previewNumber}>
              {cardNumber || '4562  ****  ****  7852'}
            </Text>
            <View style={styles.previewBottom}>
              <View>
                <Text style={styles.previewLabel}>Card Holder</Text>
                <Text style={styles.previewVal}>
                  {cardHolder || 'Tanya Myroniuk'}
                </Text>
              </View>
              <View>
                <Text style={styles.previewLabel}>Expiry Date</Text>
                <Text style={styles.previewVal}>{expiryDate || '24/2029'}</Text>
              </View>
              <View>
                <Text style={styles.previewLabel}>CVV</Text>
                <Text style={styles.previewVal}>{cvv || '698'}</Text>
              </View>
            </View>
          </View>

          {/* Card Color Theme Picker */}
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Card Color Style
          </Text>
          <View style={styles.colorRow}>
            {CARD_COLOR_THEMES.map((themeItem) => {
              const isSelected = selectedTheme.name === themeItem.name;
              return (
                <TouchableOpacity
                  key={themeItem.name}
                  onPress={() => setSelectedTheme(themeItem)}
                  style={[
                    styles.colorSwatch,
                    {
                      backgroundColor: themeItem.bg,
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: colors.primary,
                    },
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Network & Type Toggle */}
          <View style={styles.dualRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Network
              </Text>
              <View style={styles.segmentRow}>
                {(['Mastercard', 'Visa'] as const).map((net) => (
                  <TouchableOpacity
                    key={net}
                    onPress={() => setNetwork(net)}
                    style={[
                      styles.segmentBtn,
                      {
                        backgroundColor:
                          network === net ? colors.primary : colors.inputBg,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: network === net ? '#FFFFFF' : colors.text,
                        fontWeight: '600',
                        fontSize: 13,
                      }}
                    >
                      {net}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Card Type
              </Text>
              <View style={styles.segmentRow}>
                {(['Physical', 'Virtual'] as const).map((tp) => (
                  <TouchableOpacity
                    key={tp}
                    onPress={() => setCardType(tp)}
                    style={[
                      styles.segmentBtn,
                      {
                        backgroundColor:
                          cardType === tp ? colors.primary : colors.inputBg,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: cardType === tp ? '#FFFFFF' : colors.text,
                        fontWeight: '600',
                        fontSize: 13,
                      }}
                    >
                      {tp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Form Inputs */}
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Cardholder Name
          </Text>
          <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
            <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="Enter cardholder name"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Card Number
          </Text>
          <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
            <Ionicons name="card-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={cardNumber}
              onChangeText={(txt) => setCardNumber(formatCardNumber(txt))}
              placeholder="4562 1122 4595 7852"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              maxLength={19}
            />
          </View>

          <View style={styles.dualRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                Expiry Date
              </Text>
              <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, marginLeft: 0 }]}
                  value={expiryDate}
                  onChangeText={handleExpiryInput}
                  placeholder="24/2029"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={7}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                4-Digit CVV
              </Text>
              <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
                <TextInput
                  style={[styles.input, { color: colors.text, marginLeft: 0 }]}
                  value={cvv}
                  onChangeText={(txt) => setCvv(txt.replace(/\D/g, '').slice(0, 4))}
                  placeholder="6986"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
            Card Nickname
          </Text>
          <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
            <Ionicons name="pricetag-outline" size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={label}
              onChangeText={setLabel}
              placeholder="e.g. Travel Card, Daily Spend"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={handleSaveCard}
          >
            <Text style={styles.saveBtnText}>Add Card</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingBottom: 34,
  },
  previewCard: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
  },
  previewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  chip: {
    width: 34,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#D4AF37',
  },
  previewNetwork: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  previewNumber: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: 1.4,
    marginBottom: 20,
  },
  previewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewLabel: {
    color: '#A2A2A7',
    fontSize: 10,
    marginBottom: 2,
  },
  previewVal: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dualRow: {
    flexDirection: 'row',
    gap: 14,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 10,
    fontWeight: '500',
  },
  saveBtn: {
    marginTop: 28,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddCardScreen;

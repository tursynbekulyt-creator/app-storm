import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import { maskCardNumber } from '../data/cards';

type AllCardsNavProp = NativeStackNavigationProp<RootStackParamList>;

const AllCardsScreen: React.FC = () => {
  const navigation = useNavigation<AllCardsNavProp>();
  const {
    colors,
    t,
    cards,
    setSelectedCardId,
    deleteCard,
    formatMoney,
  } = useAppTheme();

  const [filterType, setFilterType] = useState<'All' | 'Physical' | 'Virtual'>('All');

  const filteredCards = cards.filter((c) =>
    filterType === 'All' ? true : c.type === filterType
  );

  const handleDeleteCard = (id: string, label: string) => {
    if (cards.length <= 1) {
      Alert.alert('Cannot Remove', 'You must keep at least one active card.');
      return;
    }
    Alert.alert('Remove Card', `Delete "${label}" from your wallet?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCard(id),
      },
    ]);
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
          {t('allCards')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['All', 'Physical', 'Virtual'] as const).map((tab) => {
          const active = filterType === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilterType(tab)}
              style={[
                styles.filterTab,
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
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            activeOpacity={0.9}
            onPress={() => {
              setSelectedCardId(card.id);
              navigation.goBack();
            }}
            style={[
              styles.cardBox,
              {
                backgroundColor: card.isFrozen ? '#4B5563' : card.cardColor,
              },
            ]}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.cardLabel}>{card.label}</Text>
                <Text style={styles.cardTypeTag}>
                  {card.type} • {card.network}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteCard(card.id, card.label)}
                style={styles.trashBtn}
              >
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.cardNumber}>
              {maskCardNumber(card.cardNumber, false)}
            </Text>

            <View style={styles.cardBottom}>
              <View>
                <Text style={styles.subLabel}>Card Holder</Text>
                <Text style={styles.holderName}>{card.cardHolder}</Text>
              </View>
              <View>
                <Text style={styles.subLabel}>Expires</Text>
                <Text style={styles.holderName}>{card.expiryDate}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.subLabel}>Balance</Text>
                <Text style={styles.balanceText}>
                  {formatMoney(card.balance)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Add Card CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddCard')}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={styles.addBtnText}>{t('addNewCard')} +</Text>
        </TouchableOpacity>
      </View>
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardBox: {
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardTypeTag: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },
  trashBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1.3,
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  subLabel: {
    color: '#A2A2A7',
    fontSize: 10,
    marginBottom: 2,
  },
  holderName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AllCardsScreen;

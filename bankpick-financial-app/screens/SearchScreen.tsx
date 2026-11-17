import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext';

const RECENT_TAGS = ['Apple Store', 'Spotify', 'Transfer', 'Grocery', 'Netflix'];

const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, t, transactions, formatMoney } = useAppTheme();
  const [query, setQuery] = useState('');

  const results = transactions.filter((tx) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      tx.title.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q) ||
      (tx.note && tx.note.toLowerCase().includes(q))
    );
  });

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
          {t('search')}
        </Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => setQuery('')}
        >
          <Ionicons name="close" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.inputBg }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Search transactions, brands..."
          placeholderTextColor={colors.textMuted}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Search Tags */}
      <View style={styles.tagsWrap}>
        {RECENT_TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => setQuery(tag)}
            style={[
              styles.tagPill,
              {
                backgroundColor:
                  query.toLowerCase() === tag.toLowerCase()
                    ? colors.primary
                    : colors.surface,
              },
            ]}
          >
            <Text
              style={{
                color:
                  query.toLowerCase() === tag.toLowerCase()
                    ? '#FFFFFF'
                    : colors.textSecondary,
                fontSize: 12,
                fontWeight: '600',
              }}
            >
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {results.length} {results.length === 1 ? 'result' : 'results'} found
        </Text>

        {results.map((item) => (
          <View key={item.id} style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: colors.iconBg }]}>
              <Ionicons
                name={item.iconName as keyof typeof Ionicons.glyphMap}
                size={20}
                color={item.iconColor === '#FFFFFF' ? colors.text : item.iconColor}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {item.category} • {item.date}
              </Text>
            </View>
            <Text
              style={{
                color: item.type === 'income' ? colors.primary : colors.text,
                fontWeight: '700',
                fontSize: 15,
              }}
            >
              {formatMoney(
                item.type === 'income' ? item.amount : -item.amount,
                true
              )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  resultCount: {
    fontSize: 12,
    marginBottom: 10,
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
});

export default SearchScreen;

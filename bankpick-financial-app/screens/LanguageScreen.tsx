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
import { SupportedLanguage, useAppTheme } from '../theme/ThemeContext';

const LANGUAGES: { name: SupportedLanguage; region: string; badge: string }[] = [
  { name: 'English', region: 'United States', badge: 'US' },
  { name: 'Қазақша', region: 'Қазақстан', badge: 'KZ' },
  { name: 'Русский', region: 'Россия / СНГ', badge: 'RU' },
  { name: 'Français', region: 'France', badge: 'FR' },
  { name: 'Deutsch', region: 'Deutschland', badge: 'DE' },
  { name: 'Español', region: 'España', badge: 'ES' },
  { name: 'Türkçe', region: 'Türkiye', badge: 'TR' },
  { name: '中文', region: '中国 (Chinese)', badge: 'CN' },
];

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, t, language, setLanguage } = useAppTheme();
  const [search, setSearch] = useState('');

  const filtered = LANGUAGES.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.region.toLowerCase().includes(search.toLowerCase())
  );

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
          {t('language')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBox, { backgroundColor: colors.inputBg }]}>
        <Ionicons name="search" size={19} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          value={search}
          onChangeText={setSearch}
          placeholder="Search Language"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filtered.map((item) => {
          const isSelected = language === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.langRow, { borderBottomColor: colors.border }]}
              onPress={() => setLanguage(item.name)}
            >
              <View style={styles.langLeft}>
                <View
                  style={[
                    styles.flagCircle,
                    { backgroundColor: colors.primaryLight },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>
                    {item.badge}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.langName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                    {item.region}
                  </Text>
                </View>
              </View>

              {isSelected && (
                <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                  <Ionicons name="checkmark" size={15} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
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
  searchBox: {
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  langName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LanguageScreen;

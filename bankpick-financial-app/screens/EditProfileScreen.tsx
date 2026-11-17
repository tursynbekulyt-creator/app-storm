import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeContext';

const AVATAR_COLORS = ['#0066FF', '#8B5CF6', '#10B981', '#D97706', '#EC4899'];

const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, t, profile, updateProfile } = useAppTheme();

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [birthDay, setBirthDay] = useState(profile.birthDay);
  const [birthMonth, setBirthMonth] = useState(profile.birthMonth);
  const [birthYear, setBirthYear] = useState(profile.birthYear);
  const [city, setCity] = useState(profile.city);
  const [avatarBg, setAvatarBg] = useState(profile.avatarBg);

  const handleSave = () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    const parts = fullName.trim().split(' ');
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : fullName.slice(0, 2).toUpperCase();

    updateProfile({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      birthDay,
      birthMonth,
      birthYear,
      city: city.trim(),
      avatarBg,
      initials,
    });

    Alert.alert('Profile Updated', 'Your personal details have been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
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
          {t('editProfile')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarLarge, { backgroundColor: avatarBg }]}>
            <Text style={styles.avatarLargeText}>
              {fullName
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'TM'}
            </Text>
          </View>
          <Text style={[styles.nameHeadline, { color: colors.text }]}>
            {fullName || 'Your Name'}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
            {profile.role}
          </Text>

          {/* Avatar Color Selector */}
          <View style={styles.colorDots}>
            {AVATAR_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setAvatarBg(c)}
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: c,
                    borderWidth: avatarBg === c ? 2.5 : 0,
                    borderColor: colors.text,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Form Fields */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
        <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
          <Ionicons name="person-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Email Address
        </Text>
        <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
          <Ionicons name="mail-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Phone Number
        </Text>
        <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
          <Ionicons name="call-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Birth Date 3-Column Row (BankPick Figma Signature) */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Birth Date</Text>
        <View style={styles.birthRow}>
          <View style={[styles.birthCol, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.birthInput, { color: colors.text }]}
              value={birthDay}
              onChangeText={setBirthDay}
              placeholder="28"
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
          <View style={[styles.birthCol, { flex: 1.5, borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.birthInput, { color: colors.text }]}
              value={birthMonth}
              onChangeText={setBirthMonth}
              placeholder="September"
            />
          </View>
          <View style={[styles.birthCol, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.birthInput, { color: colors.text }]}
              value={birthYear}
              onChangeText={setBirthYear}
              placeholder="2000"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        </View>

        <Text style={[styles.label, { color: colors.textSecondary }]}>City</Text>
        <View style={[styles.inputBox, { borderBottomColor: colors.border }]}>
          <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <Text style={[styles.joinedText, { color: colors.textMuted }]}>
          Joined {profile.memberSince}
        </Text>
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
    paddingBottom: 34,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatarLarge: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  nameHeadline: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 3,
  },
  colorDots: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 14,
    marginBottom: 6,
  },
  inputBox: {
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
  birthRow: {
    flexDirection: 'row',
    gap: 14,
  },
  birthCol: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  birthInput: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
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
  joinedText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 16,
  },
});

export default EditProfileScreen;

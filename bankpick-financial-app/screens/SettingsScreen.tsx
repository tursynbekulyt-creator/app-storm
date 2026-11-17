import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { CurrencyCode, useAppTheme } from '../theme/ThemeContext';

type SettingsNavProp = NativeStackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsNavProp>();
  const {
    colors,
    t,
    isDarkMode,
    toggleDarkMode,
    language,
    currency,
    setCurrency,
    biometricEnabled,
    setBiometricEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useAppTheme();

  const [passwordModal, setPasswordModal] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleChangePassword = () => {
    if (!oldPass || newPass.length < 6) {
      Alert.alert('Weak Password', 'New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
    setPasswordModal(false);
    Alert.alert('Success', 'Your BankPick PIN/Password has been updated.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 42 }} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('settings')}
        </Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* General Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          General
        </Text>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('Language')}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>Language</Text>
          <View style={styles.rowRight}>
            <Text style={{ color: colors.textSecondary, marginRight: 6 }}>
              {language}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>My Profile</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() =>
            Alert.alert(
              'Contact BankPick',
              '24/7 Customer Support:\nsupport@bankpick.app\n+1 (800) 555-0199'
            )
          }
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>Contact Us</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Currency Switcher */}
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Currency</Text>
          <View style={styles.currencyRow}>
            {(['USD', 'KZT', 'EUR'] as CurrencyCode[]).map((code) => (
              <TouchableOpacity
                key={code}
                onPress={() => setCurrency(code)}
                style={[
                  styles.currChip,
                  {
                    backgroundColor:
                      currency === code ? colors.primary : colors.surface,
                  },
                ]}
              >
                <Text
                  style={{
                    color: currency === code ? '#FFFFFF' : colors.textSecondary,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {code}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Security Section */}
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          Security
        </Text>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() => setPasswordModal(true)}
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Change Password
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { borderBottomColor: colors.border }]}
          onPress={() =>
            Alert.alert(
              'Privacy Policy',
              'All card numbers and transactions are encrypted with AES-256 and TLS 1.3 security standards.'
            )
          }
        >
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Privacy Policy
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <Text style={[styles.helperSub, { color: colors.textSecondary }]}>
          Choose what data you share with us
        </Text>

        {/* Toggles */}
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Biometric</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>
            Push Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Change Password
            </Text>

            <TextInput
              style={[
                styles.passInput,
                { backgroundColor: colors.inputBg, color: colors.text },
              ]}
              placeholder="Current Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={oldPass}
              onChangeText={setOldPass}
            />
            <TextInput
              style={[
                styles.passInput,
                { backgroundColor: colors.inputBg, color: colors.text },
              ]}
              placeholder="New Password (min 6 chars)"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={newPass}
              onChangeText={setNewPass}
            />
            <TextInput
              style={[
                styles.passInput,
                { backgroundColor: colors.inputBg, color: colors.text },
              ]}
              placeholder="Confirm New Password"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={confirmPass}
              onChangeText={setConfirmPass}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.surface }]}
                onPress={() => setPasswordModal(false)}
              >
                <Text style={{ color: colors.textSecondary, fontWeight: '600' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleChangePassword}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Update</Text>
              </TouchableOpacity>
            </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  currChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  helperSub: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 6,
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
    borderRadius: 22,
    padding: 22,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  passInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
});

export default SettingsScreen;

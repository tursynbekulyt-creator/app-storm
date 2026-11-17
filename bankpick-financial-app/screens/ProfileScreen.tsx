import React from 'react';
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

type ProfileNavProp = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const { colors, t, profile, cards } = useAppTheme();

  const menuItems = [
    {
      icon: 'person-outline',
      label: 'Personal Information',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'card-outline',
      label: 'Payment Preferences',
      onPress: () => navigation.navigate('AllCards'),
    },
    {
      icon: 'wallet-outline',
      label: `Banks and Cards (${cards.length})`,
      onPress: () => navigation.navigate('AllCards'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      badge: '2',
      onPress: () =>
        Alert.alert(
          'Notifications',
          '• Monthly statement for November is ready.\n• Security check passed on your World Card.'
        ),
    },
    {
      icon: 'chatbubble-ellipses-outline',
      label: 'Message Center',
      onPress: () =>
        Alert.alert('BankPick Support', 'No unread support tickets. Avg reply time: 3 mins.'),
    },
    {
      icon: 'location-outline',
      label: 'Address',
      sub: `${profile.city}, ${profile.country}`,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'settings-outline',
      label: t('settings'),
      onPress: () => navigation.navigate('MainTabs'),
    },
  ];

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
          {t('profile')}
        </Text>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.iconBg }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={21} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Profile Header Card */}
        <View style={styles.profileTop}>
          <View style={[styles.avatarCircle, { backgroundColor: profile.avatarBg }]}>
            <Text style={styles.avatarText}>{profile.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {profile.fullName}
            </Text>
            <Text style={[styles.userRole, { color: colors.textSecondary }]}>
              {profile.role}
            </Text>
          </View>
        </View>

        {/* Menu List */}
        {menuItems.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.menuRow, { borderBottomColor: colors.border }]}
            onPress={item.onPress}
          >
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color={colors.textSecondary}
            />
            <View style={styles.menuMiddle}>
              <Text style={[styles.menuLabel, { color: colors.text }]}>
                {item.label}
              </Text>
              {item.sub && (
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {item.sub}
                </Text>
              )}
            </View>

            {item.badge && (
              <View style={styles.badgeCircle}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
            <Ionicons
              name="chevron-forward"
              size={19}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() =>
            Alert.alert('Sign Out', 'Are you sure you want to log out of BankPick?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive' },
            ])
          }
        >
          <Ionicons name="log-out-outline" size={21} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>
            Sign Out
          </Text>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuMiddle: {
    flex: 1,
    marginLeft: 14,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  badgeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EB5757',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ProfileScreen;

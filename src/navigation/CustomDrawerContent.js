import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';
import { UserAvatar } from '../components/UserAvatar';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const CustomDrawerContent = ({ navigation, state }) => {
  const { currentUser, userRole, signOut } = useAuth();
  const { showSignOutConfirm } = useNotification();

  const handleSignOut = () => {
    navigation.closeDrawer();
    showSignOutConfirm({
      title: 'Sign Out Confirmation',
      message: 'Are you sure you want to sign out of your account?',
      onConfirm: async () => {
        await signOut();
      },
    });
  };

  const customerItems = [
    { name: 'CustomerTabs', label: 'Dashboard', icon: 'home-outline' },
    { name: 'AnalysisDrawer', label: 'Financial Analysis', icon: 'pie-chart-outline', target: 'Analysis' },
    { name: 'TransactionsDrawer', label: 'Month-wise Transactions', icon: 'receipt-outline', target: 'Transactions' },
    { name: 'CategoriesDrawer', label: 'Overall Categories', icon: 'grid-outline', target: 'Categories' },
    { name: 'ReportsDrawer', label: 'Financial Reports', icon: 'document-text-outline', target: 'Reports' },
    { name: 'ProfileDrawer', label: 'Customer Profile', icon: 'person-outline', target: 'Profile' },
  ];

  const adminItems = [
    { name: 'AdminTabs', label: 'Admin Control Hub', icon: 'shield-outline', target: 'AdminTabs' },
    { name: 'AdminCustomers', label: 'Customer Directory', icon: 'people-outline', target: 'AdminCustomers' },
    { name: 'AdminAnalysis', label: 'Macro Analysis', icon: 'pie-chart-outline', target: 'AdminAnalysis' },
    { name: 'AdminReports', label: 'System Reports', icon: 'document-text-outline', target: 'AdminReports' },
    { name: 'AdminTransactions', label: 'Platform Transactions', icon: 'receipt-outline', target: 'AdminTransactions' },
  ];

  const items = userRole === 'admin' ? adminItems : customerItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        {/* User Header Profile Card */}
        <View style={styles.profileHeader}>
          <UserAvatar
            user={currentUser}
            size={68}
            showBorder={true}
            borderColor={colors.primary}
            showVerified={true}
            style={{ marginBottom: 10 }}
          />

          <Text style={styles.userName} numberOfLines={1}>
            {currentUser?.name || 'User'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {currentUser?.email || 'user@example.com'}
          </Text>

          <View
            style={[
              styles.roleBadge,
              { backgroundColor: userRole === 'admin' ? '#DBEAFE' : colors.primaryLight },
            ]}
          >
            <Ionicons
              name={userRole === 'admin' ? 'shield' : 'person'}
              size={12}
              color={userRole === 'admin' ? '#1D4ED8' : colors.primaryDark}
            />
            <Text
              style={[
                styles.roleBadgeText,
                { color: userRole === 'admin' ? '#1D4ED8' : colors.primaryDark },
              ]}
            >
              {userRole?.toUpperCase() || 'CUSTOMER'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Drawer Menu Items */}
        <View style={styles.menuItemsList}>
          {items.map((item) => {
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => {
                  navigation.closeDrawer();
                  if (item.target) {
                    navigation.navigate(item.target);
                  } else {
                    navigation.navigate(item.name);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.itemIconBox}>
                  <Ionicons name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <View style={[styles.itemIconBox, { backgroundColor: colors.expenseBg }]}>
            <Ionicons name="log-out-outline" size={20} color={colors.expense} />
          </View>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerAppTitle}>FinPulse</Text>
          <Text style={styles.footerAssessment}>Smart Budget & Wealth Tracker v2.4</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: 8,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  menuItemsList: {
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: borderRadius.lg,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: borderRadius.lg,
  },
  signOutText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.expense,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    alignItems: 'center',
  },
  footerAppTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  footerAssessment: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default CustomDrawerContent;

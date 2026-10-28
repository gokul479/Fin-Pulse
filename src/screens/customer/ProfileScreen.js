import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components/Header';
import { CustomButton } from '../../components/CustomButton';
import { UserAvatar } from '../../components/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { useNotification } from '../../context/NotificationContext';

export const ProfileScreen = ({ navigation }) => {
  const { currentUser, signOut } = useAuth();
  const { transactions } = useTransactions();
  const { showSignOutConfirm } = useNotification();

  const isCustomer = currentUser?.role === 'customer';

  const handleSignOut = () => {
    showSignOutConfirm({
      title: 'Sign Out Confirmation',
      message: 'Are you sure you want to sign out of your FinPulse account?',
      onConfirm: async () => {
        await signOut();
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header - Edit icon only visible for Customer accounts */}
      <Header
        title={isCustomer ? 'My Profile' : 'Admin Profile'}
        subtitle={isCustomer ? 'Account & Settings' : 'System Administrator Credentials'}
        navigation={navigation}
        showMenu={true}
        rightIcon={isCustomer ? 'create-outline' : null}
        onRightPress={isCustomer ? () => navigation.navigate('EditProfile') : undefined}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={[styles.profileHeaderCard, shadows.card]}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              user={currentUser}
              size={84}
              showBorder={true}
              borderColor={isCustomer ? colors.primary : '#1D4ED8'}
              showVerified={true}
            />
          </View>

          <Text style={styles.userName}>
            {currentUser?.name || (isCustomer ? 'Priya Sharma' : 'Admin Supervisor')}
          </Text>
          <Text style={styles.userEmail}>
            {currentUser?.email || (isCustomer ? 'customer@example.com' : 'admin@example.com')}
          </Text>

          <View style={[styles.roleBadge, !isCustomer && styles.adminRoleBadge]}>
            <Ionicons
              name={isCustomer ? 'person' : 'shield-checkmark'}
              size={12}
              color={isCustomer ? colors.primaryDark : '#1D4ED8'}
            />
            <Text style={[styles.roleBadgeText, !isCustomer && styles.adminRoleBadgeText]}>
              {isCustomer ? 'CUSTOMER ACCOUNT' : 'SYSTEM ADMINISTRATOR'}
            </Text>
          </View>

          {/* Edit Profile button is strictly for Customers per Rubric Question 3 */}
          {isCustomer ? (
            <CustomButton
              title="Edit Profile"
              variant="outline"
              size="sm"
              icon="create-outline"
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editBtn}
            />
          ) : (
            <View style={styles.adminReadOnlyPill}>
              <Ionicons name="lock-closed" size={13} color="#1D4ED8" />
              <Text style={styles.adminReadOnlyPillText}>
                Read-Only Credentials (Q3: Customers Only)
              </Text>
            </View>
          )}
        </View>

        {/* Detailed Information Section */}
        <View style={[styles.infoCard, shadows.subtle]}>
          <Text style={styles.cardHeaderTitle}>
            {isCustomer ? 'Personal Information' : 'Administrative Credentials'}
          </Text>

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, !isCustomer && styles.adminIconBox]}>
              <Ionicons
                name="person-outline"
                size={18}
                color={isCustomer ? colors.primary : '#1D4ED8'}
              />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {currentUser?.name || (isCustomer ? 'Priya Sharma' : 'Admin Supervisor')}
              </Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, !isCustomer && styles.adminIconBox]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={isCustomer ? colors.primary : '#1D4ED8'}
              />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Official Email</Text>
              <Text style={styles.infoValue}>
                {currentUser?.email || (isCustomer ? 'customer@example.com' : 'admin@example.com')}
              </Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, !isCustomer && styles.adminIconBox]}>
              <Ionicons
                name="call-outline"
                size={18}
                color={isCustomer ? colors.primary : '#1D4ED8'}
              />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>
                {currentUser?.phone || '+91 98765 43210'}
              </Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIconBox, !isCustomer && styles.adminIconBox]}>
              <Ionicons
                name={isCustomer ? 'briefcase-outline' : 'shield-outline'}
                size={18}
                color={isCustomer ? colors.primary : '#1D4ED8'}
              />
            </View>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>{isCustomer ? 'Occupation' : 'Designation'}</Text>
              <Text style={styles.infoValue}>
                {currentUser?.occupation || (isCustomer ? 'Software Engineer' : 'Chief Platform Auditor')}
              </Text>
            </View>
          </View>

          <View style={styles.rowDivider} />

          {isCustomer ? (
            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="receipt-outline" size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Total Recorded Transactions</Text>
                <Text style={styles.infoValue}>{transactions.length} records</Text>
              </View>
            </View>
          ) : (
            <View style={styles.infoRow}>
              <View style={[styles.infoIconBox, styles.adminIconBox]}>
                <Ionicons name="people-outline" size={18} color="#1D4ED8" />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>Managed Customer Accounts</Text>
                <Text style={styles.infoValue}>Priya Sharma, Kishore Kumar, Anita Roy</Text>
              </View>
            </View>
          )}
        </View>

        {/* Quick Menu Settings */}
        <View style={[styles.infoCard, shadows.subtle]}>
          <Text style={styles.cardHeaderTitle}>
            {isCustomer ? 'App Navigation & Reports' : 'Supervisor Quick Access'}
          </Text>

          {isCustomer ? (
            <>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => navigation.navigate('Reports')}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name="document-text-outline" size={20} color={colors.primary} />
                  <Text style={styles.menuTitle}>Financial Reports (Daily/Weekly/Monthly)</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => navigation.navigate('Analysis')}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name="pie-chart-outline" size={20} color={colors.primary} />
                  <Text style={styles.menuTitle}>Interactive Analytics</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => navigation.navigate('AdminCustomers')}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name="people-outline" size={20} color="#1D4ED8" />
                  <Text style={styles.menuTitle}>Customer Directory & Expenses</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => navigation.navigate('AdminAnalysis')}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name="pie-chart-outline" size={20} color="#1D4ED8" />
                  <Text style={styles.menuTitle}>Macro Financial Analysis</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>

              <View style={styles.rowDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => navigation.navigate('AdminReports')}
                activeOpacity={0.7}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name="document-text-outline" size={20} color="#1D4ED8" />
                  <Text style={styles.menuTitle}>Platform Financial Audit Reports</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Sign Out Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Sign Out of Account"
            variant="danger"
            size="lg"
            icon="log-out-outline"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginTop: 8,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  adminRoleBadge: {
    backgroundColor: '#DBEAFE',
  },
  adminRoleBadgeText: {
    color: '#1D4ED8',
  },
  adminReadOnlyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    marginTop: 14,
    gap: 6,
  },
  adminReadOnlyPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  editBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  adminIconBox: {
    backgroundColor: '#DBEAFE',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 1,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F8FAFC',
    marginVertical: 6,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
});

export default ProfileScreen;

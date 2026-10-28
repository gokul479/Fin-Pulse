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
import { TransactionCard } from '../../components/TransactionCard';
import { CustomButton } from '../../components/CustomButton';
import { UserAvatar } from '../../components/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/currency';
import { calculateFinancialSummary } from '../../utils/calculations';

export const AdminDashboardScreen = ({ navigation }) => {
  const { currentUser, users, signOut } = useAuth();
  const { allPlatformTransactions, deleteTransaction } = useTransactions();
  const { showSignOutConfirm } = useNotification();

  const platformSummary = calculateFinancialSummary(allPlatformTransactions);

  const handleSignOut = () => {
    showSignOutConfirm({
      title: 'Sign Out Admin Session',
      message: 'Confirm signing out from Administrator mode? Unsaved changes will be secured.',
      onConfirm: async () => {
        await signOut();
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      
      {/* Admin Emerald Header */}
      <Header
        title="Admin Control Hub"
        subtitle={`Supervisor: ${currentUser?.name || 'Administrator'}`}
        navigation={navigation}
        showMenu={true}
        variant="emerald"
        rightIcon="log-out-outline"
        onRightPress={handleSignOut}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin System Banner */}
        <View style={[styles.adminBanner, shadows.elevated]}>
          <View style={styles.bannerBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#FDE047" />
            <Text style={styles.bannerBadgeText}>SYSTEM AUDIT & OVERSIGHT</Text>
          </View>
          <Text style={styles.bannerTitle}>Platform Financial Summary</Text>
          <Text style={styles.bannerBalance}>
            {formatCurrency(platformSummary.netBalance)}
          </Text>
          <Text style={styles.bannerSub}>Aggregate Net Volume across all active users</Text>

          <View style={styles.bannerDivider} />

          <View style={styles.bannerMetricsRow}>
            <View style={styles.bannerMetricCol}>
              <Text style={styles.bannerMetricLabel}>Total Inflow</Text>
              <Text style={styles.bannerMetricIncome}>
                +{formatCurrency(platformSummary.totalIncome)}
              </Text>
            </View>

            <View style={styles.bannerVerticalDivider} />

            <View style={styles.bannerMetricCol}>
              <Text style={styles.bannerMetricLabel}>Total Outflow</Text>
              <Text style={styles.bannerMetricExpense}>
                -{formatCurrency(platformSummary.totalExpenses)}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Admin Navigation Actions */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[styles.actionCard, shadows.subtle]}
            onPress={() => navigation.navigate('AdminAnalysis')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="pie-chart" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Platform Analysis</Text>
            <Text style={styles.actionSub}>Detailed metrics</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, shadows.subtle]}
            onPress={() => navigation.navigate('AdminReports')}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="document-text" size={22} color="#2563EB" />
            </View>
            <Text style={styles.actionTitle}>System Reports</Text>
            <Text style={styles.actionSub}>Daily / Weekly / Monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Registered Users Audit Section */}
        <View style={[styles.sectionCard, shadows.card]}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>User Directory</Text>
              <Text style={styles.sectionSub}>Registered local database users</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminCustomersTab')}
              style={styles.userCountBadge}
            >
              <Text style={styles.userCountText}>{users.length} Users →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.usersList}>
            {users.map((u) => {
              const isAdmin = u.role === 'admin';
              return (
                <View key={u.id} style={styles.userRow}>
                  <UserAvatar
                    user={u}
                    size={42}
                    showBorder={true}
                    borderColor={isAdmin ? colors.secondary : colors.primary}
                    style={{ marginRight: 12 }}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.userNameText}>{u.name}</Text>
                    <Text style={styles.userEmailText}>{u.email}</Text>
                  </View>

                  <View
                    style={[
                      styles.roleTag,
                      { backgroundColor: isAdmin ? '#DBEAFE' : colors.primaryLight },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        { color: isAdmin ? '#1D4ED8' : colors.primaryDark },
                      ]}
                    >
                      {u.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* All Platform Transactions Ledger */}
        <View style={styles.transactionsHeaderRow}>
          <Text style={styles.sectionTitle}>Global System Ledger</Text>
          <Text style={styles.totalTxnText}>
            {allPlatformTransactions.length} recorded operations
          </Text>
        </View>

        {allPlatformTransactions.slice(0, 8).map((tx) => (
          <TransactionCard
            key={tx.id}
            transaction={tx}
            showDelete={true}
            onDelete={deleteTransaction}
          />
        ))}

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <CustomButton
            title="Terminate Admin Session"
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
    paddingBottom: 40,
  },
  adminBanner: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 22,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: 10,
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FDE047',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#93C5FD',
    textTransform: 'uppercase',
  },
  bannerBalance: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.textLight,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  bannerSub: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 2,
  },
  bannerDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 14,
  },
  bannerMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bannerMetricCol: {
    flex: 1,
  },
  bannerMetricLabel: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '600',
  },
  bannerMetricIncome: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  bannerMetricExpense: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FECACA',
    marginTop: 2,
  },
  bannerVerticalDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 14,
  },
  actionGrid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 14,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  userCountBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  userCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  usersList: {
    gap: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  userAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  userEmailText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  transactionsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  totalTxnText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  signOutContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
});

export default AdminDashboardScreen;

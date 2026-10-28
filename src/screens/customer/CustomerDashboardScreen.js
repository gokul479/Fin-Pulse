import React, { useState } from 'react';
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
import { SummaryCard } from '../../components/SummaryCard';
import { TransactionCard } from '../../components/TransactionCard';
import { EmptyState } from '../../components/EmptyState';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { UserAvatar } from '../../components/UserAvatar';
import { FinancialHealthModal } from '../../components/FinancialHealthModal';
import { SavingsGoalsSection } from '../../components/SavingsGoalsSection';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/currency';
import { getFilteredReportData } from '../../utils/calculations';

export const CustomerDashboardScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { transactions, currentSummary, deleteTransaction } = useTransactions();
  const [modalVisible, setModalVisible] = useState(false);
  const [healthModalVisible, setHealthModalVisible] = useState(false);

  // Time-based dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick report calculations
  const dailyData = getFilteredReportData(transactions, 'daily');
  const weeklyData = getFilteredReportData(transactions, 'weekly');
  const monthlyData = getFilteredReportData(transactions, 'monthly');

  // Recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Top Header with Drawer Toggle & User Avatar */}
      <Header
        title={`${getGreeting()}, ${currentUser?.name?.split(' ')[0] || 'User'} ✨`}
        subtitle="FinPulse Intelligent Wealth Engine"
        navigation={navigation}
        showMenu={true}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Profile')}
            style={{ padding: 2 }}
          >
            <UserAvatar
              user={currentUser}
              size={36}
              showBorder={true}
              borderColor={colors.primary}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Hero Summary Card */}
        <SummaryCard
          balance={currentSummary.netBalance}
          income={currentSummary.totalIncome}
          expenses={currentSummary.totalExpenses}
          savingsRate={currentSummary.savingsRate}
        />

        {/* Interactive FinPulse AI Financial Health Widget */}
        <TouchableOpacity
          style={[styles.healthWidget, shadows.subtle]}
          onPress={() => setHealthModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.healthHeader}>
            <View style={styles.healthLeft}>
              <View style={styles.healthPulseDot} />
              <Text style={styles.healthTitle}>Monthly Budget Health</Text>
            </View>
            <View style={styles.healthAiBadge}>
              <Ionicons name="sparkles" size={12} color="#2563EB" />
              <Text style={styles.healthAiBadgeText}>AI Insights →</Text>
            </View>
          </View>

          <View style={styles.healthProgressBar}>
            <View
              style={[
                styles.healthProgressFill,
                { width: `${Math.min(100, Math.max(15, currentSummary.savingsRate || 40))}%` },
              ]}
            />
          </View>

          <View style={styles.healthFooterRow}>
            <Text style={styles.healthSub}>
              {currentSummary.transactionCount} txns • Tap for 50/30/20 advice
            </Text>
            <Text style={styles.healthRatioText}>
              {currentSummary.savingsRate}% retained
            </Text>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}
              onPress={() => setModalVisible(true)}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: colors.primary }]}>
                <Ionicons name="add" size={22} color={colors.textLight} />
              </View>
              <Text style={styles.actionBtnText}>Add Txn</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}
              onPress={() => navigation.navigate('Analysis')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="pie-chart-outline" size={20} color={colors.textLight} />
              </View>
              <Text style={styles.actionBtnText}>Analysis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FDF2F8' }]}
              onPress={() => navigation.navigate('Categories')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EC4899' }]}>
                <Ionicons name="grid-outline" size={20} color={colors.textLight} />
              </View>
              <Text style={styles.actionBtnText}>Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#FEF3C7' }]}
              onPress={() => navigation.navigate('Reports')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="document-text-outline" size={20} color={colors.textLight} />
              </View>
              <Text style={styles.actionBtnText}>Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Unique Feature: Smart Savings Vault / Piggy Bank Goals */}
        <SavingsGoalsSection userId={currentUser?.id} />

        {/* Reports Preview Cards */}
        <View style={styles.reportsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Period Reports Overview</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
              <Text style={styles.viewAllText}>Detailed View</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reportsHorizontalScroll}
          >
            {/* Daily Card */}
            <TouchableOpacity
              style={[styles.reportCard, shadows.subtle]}
              onPress={() => navigation.navigate('Reports', { initialTab: 'daily' })}
            >
              <View style={styles.reportCardTop}>
                <View style={[styles.reportBadge, { backgroundColor: '#EFF6FF' }]}>
                  <Text style={[styles.reportBadgeText, { color: '#2563EB' }]}>Today</Text>
                </View>
                <Ionicons name="today-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.reportAmount}>{formatCurrency(dailyData.netBalance)}</Text>
              <Text style={styles.reportSub}>Net Balance • {dailyData.transactionCount} txns</Text>
            </TouchableOpacity>

            {/* Weekly Card */}
            <TouchableOpacity
              style={[styles.reportCard, shadows.subtle]}
              onPress={() => navigation.navigate('Reports', { initialTab: 'weekly' })}
            >
              <View style={styles.reportCardTop}>
                <View style={[styles.reportBadge, { backgroundColor: '#F5F3FF' }]}>
                  <Text style={[styles.reportBadgeText, { color: '#7C3AED' }]}>Last 7 Days</Text>
                </View>
                <Ionicons name="calendar-outline" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.reportAmount}>{formatCurrency(weeklyData.netBalance)}</Text>
              <Text style={styles.reportSub}>Net Balance • {weeklyData.transactionCount} txns</Text>
            </TouchableOpacity>

            {/* Monthly Card */}
            <TouchableOpacity
              style={[styles.reportCard, shadows.subtle]}
              onPress={() => navigation.navigate('Reports', { initialTab: 'monthly' })}
            >
              <View style={styles.reportCardTop}>
                <View style={[styles.reportBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.reportBadgeText, { color: colors.primaryDark }]}>This Month</Text>
                </View>
                <Ionicons name="bar-chart-outline" size={18} color={colors.primary} />
              </View>
              <Text style={styles.reportAmount}>{formatCurrency(monthlyData.netBalance)}</Text>
              <Text style={styles.reportSub}>Net Balance • {monthlyData.transactionCount} txns</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recent Transactions Section */}
        <View style={styles.recentSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Ledger Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
              <Text style={styles.viewAllText}>See All ({transactions.length})</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="No Transactions Yet"
              description="Start recording your daily expenses and income to see them here."
              actionTitle="Add Transaction"
              onAction={() => setModalVisible(true)}
            />
          ) : (
            recentTransactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                showDelete={true}
                onDelete={deleteTransaction}
                onPress={() => navigation.navigate('Transactions')}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Add Transaction Button - positioned comfortably above floating bar */}
      <TouchableOpacity
        style={[styles.fab, shadows.primary]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color={colors.textLight} />
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* FinPulse Financial Health & 50/30/20 Intelligence Modal */}
      <FinancialHealthModal
        visible={healthModalVisible}
        onClose={() => setHealthModalVisible(false)}
        transactions={transactions}
        currentSummary={currentSummary}
        userName={currentUser?.name}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 110, // Comfortably scrolls past the floating tab bar
  },
  healthWidget: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  healthPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  healthTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  healthAiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  healthAiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  healthBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  healthBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  healthProgressBar: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginVertical: 4,
  },
  healthProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  healthFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  healthSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  healthRatioText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: borderRadius.xl,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  actionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reportsSection: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  reportsHorizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  reportCard: {
    width: 170,
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  reportBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reportAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  reportSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  recentSection: {
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 92, // Positioned right above the floating island tab bar!
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomerDashboardScreen;

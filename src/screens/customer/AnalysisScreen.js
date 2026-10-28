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
import { TransactionCard } from '../../components/TransactionCard';
import { EmptyState } from '../../components/EmptyState';
import { useTransactions } from '../../context/TransactionContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currency';
import {
  calculateFinancialSummary,
  calculateCategoryTotals,
} from '../../utils/calculations';
import {
  isSameDay,
  isWithinSevenDays,
  isWithinCurrentMonth,
  getTodayString,
} from '../../utils/dateHelpers';

export const AnalysisScreen = ({ navigation, route }) => {
  const { userRole, users } = useAuth();
  const { transactions, categories, deleteTransaction } = useTransactions();
  const [period, setPeriod] = useState('monthly'); // 'daily' | 'weekly' | 'monthly' | 'all'
  const [selectedCustomerId, setSelectedCustomerId] = useState('all');

  const customers = users ? users.filter((u) => u.role === 'customer') : [];

  // Base transactions based on customer selection (for admin)
  const baseTransactions =
    userRole === 'admin' && selectedCustomerId !== 'all'
      ? transactions.filter((t) => t.userId === selectedCustomerId)
      : transactions;

  // Filter transactions based on selected period
  const getFilteredTransactions = () => {
    const todayStr = getTodayString();
    if (period === 'daily') {
      return baseTransactions.filter((t) => isSameDay(t.date, todayStr));
    }
    if (period === 'weekly') {
      return baseTransactions.filter((t) => isWithinSevenDays(t.date));
    }
    if (period === 'monthly') {
      return baseTransactions.filter((t) => isWithinCurrentMonth(t.date));
    }
    return baseTransactions;
  };

  const filteredTransactions = getFilteredTransactions();
  const summary = calculateFinancialSummary(filteredTransactions);
  const categoryBreakdown = calculateCategoryTotals(filteredTransactions, categories).filter(
    (c) => c.totalAmount > 0
  );

  // Income vs Expense comparison bar percentage
  const totalVolume = summary.totalIncome + summary.totalExpenses;
  const incomePct = totalVolume > 0 ? Math.round((summary.totalIncome / totalVolume) * 100) : 50;
  const expensePct = totalVolume > 0 ? Math.round((summary.totalExpenses / totalVolume) * 100) : 50;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <Header
        title="Financial Analysis"
        subtitle={userRole === 'admin' ? 'Platform Macro Overview' : 'Real-time Financial Analytics'}
        navigation={navigation}
        showMenu={true}
        rightIcon="document-text-outline"
        onRightPress={() => navigation.navigate('Reports', { initialTab: period === 'all' ? 'monthly' : period })}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Customer Selector */}
        {userRole === 'admin' && (
          <View style={styles.customerSelectorContainer}>
            <Text style={styles.customerSelectorLabel}>Analyze Customer Portfolio:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.customerScrollRow}
            >
              <TouchableOpacity
                style={[
                  styles.customerFilterPill,
                  selectedCustomerId === 'all' && styles.activeCustomerFilterPill,
                ]}
                onPress={() => setSelectedCustomerId('all')}
              >
                <Text
                  style={[
                    styles.customerFilterPillText,
                    selectedCustomerId === 'all' && styles.activeCustomerFilterPillText,
                  ]}
                >
                  🌐 All Platform ({transactions.length})
                </Text>
              </TouchableOpacity>

              {customers.map((c) => {
                const count = transactions.filter((t) => t.userId === c.id).length;
                const isSelected = selectedCustomerId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[
                      styles.customerFilterPill,
                      isSelected && styles.activeCustomerFilterPill,
                    ]}
                    onPress={() => setSelectedCustomerId(c.id)}
                  >
                    <Text
                      style={[
                        styles.customerFilterPillText,
                        isSelected && styles.activeCustomerFilterPillText,
                      ]}
                    >
                      👤 {c.name.split(' ')[0]} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Period Selector Tabs */}
        <View style={styles.periodContainer}>
          {[
            { key: 'daily', label: 'Daily' },
            { key: 'weekly', label: 'Weekly' },
            { key: 'monthly', label: 'Monthly' },
            { key: 'all', label: 'All Time' },
          ].map((tab) => {
            const isActive = period === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setPeriod(tab.key)}
                style={[styles.periodTab, isActive && styles.activePeriodTab]}
              >
                <Text style={[styles.periodTabText, isActive && styles.activePeriodTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 4 Financial Stat Cards Grid */}
        <View style={styles.statsGrid}>
          {/* Total Income */}
          <View style={[styles.statCard, shadows.subtle]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.incomeBg }]}>
              <Ionicons name="arrow-down-outline" size={18} color={colors.income} />
            </View>
            <Text style={styles.statLabel}>Total Income</Text>
            <Text style={[styles.statValue, { color: colors.income }]}>
              +{formatCurrency(summary.totalIncome)}
            </Text>
          </View>

          {/* Total Expenses */}
          <View style={[styles.statCard, shadows.subtle]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.expenseBg }]}>
              <Ionicons name="arrow-up-outline" size={18} color={colors.expense} />
            </View>
            <Text style={styles.statLabel}>Total Expenses</Text>
            <Text style={[styles.statValue, { color: colors.expense }]}>
              -{formatCurrency(summary.totalExpenses)}
            </Text>
          </View>

          {/* Current Balance */}
          <View style={[styles.statCard, shadows.subtle]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.balanceBg }]}>
              <Ionicons name="wallet-outline" size={18} color={colors.balance} />
            </View>
            <Text style={styles.statLabel}>Net Balance</Text>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {formatCurrency(summary.netBalance)}
            </Text>
          </View>

          {/* Total Savings Rate */}
          <View style={[styles.statCard, shadows.subtle]}>
            <View style={[styles.statIconBox, { backgroundColor: colors.savingsBg }]}>
              <Ionicons name="trending-up-outline" size={18} color={colors.savings} />
            </View>
            <Text style={styles.statLabel}>Savings Rate</Text>
            <Text style={[styles.statValue, { color: colors.savings }]}>
              {summary.savingsRate}%
            </Text>
          </View>
        </View>

        {/* Income vs Expense Comparison Bar Card */}
        <View style={[styles.card, shadows.card]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Cashflow Ratio (Income vs Expense)</Text>
            <Text style={styles.cardSub}>
              {filteredTransactions.length} recorded {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
            </Text>
          </View>

          {totalVolume === 0 ? (
            <Text style={styles.noVolumeText}>No cashflow activity in this selected timeframe.</Text>
          ) : (
            <View>
              {/* Ratio Bar */}
              <View style={styles.ratioBarContainer}>
                <View style={[styles.ratioBarIncome, { width: `${incomePct}%` }]} />
                <View style={[styles.ratioBarExpense, { width: `${expensePct}%` }]} />
              </View>

              {/* Legend & Percentages */}
              <View style={styles.ratioLegendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
                  <Text style={styles.legendLabel}>Income: {incomePct}%</Text>
                </View>

                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
                  <Text style={styles.legendLabel}>Expense: {expensePct}%</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Category-wise Spending Breakdown */}
        <View style={[styles.card, shadows.card]}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Category-wise Spending</Text>
              <Text style={styles.cardSub}>Ranked by expenditure volume</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.accentLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {categoryBreakdown.length === 0 ? (
            <EmptyState
              icon="pie-chart-outline"
              title="No Expense Data"
              description="No expense transactions recorded for the selected timeframe."
            />
          ) : (
            <View style={styles.categoriesList}>
              {categoryBreakdown.map((cat) => (
                <View key={cat.id || cat.name} style={styles.categoryRow}>
                  <View style={styles.catLeftRow}>
                    <View style={[styles.catIconBox, { backgroundColor: cat.bgColor }]}>
                      <Ionicons name={cat.icon} size={18} color={cat.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.catTitleRow}>
                        <Text style={styles.catName}>{cat.name}</Text>
                        <Text style={styles.catAmount}>{formatCurrency(cat.totalAmount)}</Text>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressBarBg}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                              backgroundColor: cat.color,
                            },
                          ]}
                        />
                      </View>

                      <View style={styles.catMetaRow}>
                        <Text style={styles.catTxCount}>
                          {cat.transactionCount} {cat.transactionCount === 1 ? 'txn' : 'txns'}
                        </Text>
                        <Text style={styles.catPct}>{cat.percentage}% of total expenses</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Filtered Period Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.cardTitle}>Transactions in Period</Text>
            <Text style={styles.badgeCountText}>{filteredTransactions.length}</Text>
          </View>

          {filteredTransactions.length === 0 ? (
            <EmptyState
              icon="receipt-outline"
              title="No Transactions"
              description="No transaction records match the current period."
            />
          ) : (
            filteredTransactions.map((tx) => (
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
  periodContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.lg,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  activePeriodTab: {
    backgroundColor: colors.surface,
    ...shadows.subtle,
  },
  periodTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activePeriodTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  accentLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  noVolumeText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 12,
  },
  ratioBarContainer: {
    height: 12,
    flexDirection: 'row',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  ratioBarIncome: {
    backgroundColor: colors.income,
    height: '100%',
  },
  ratioBarExpense: {
    backgroundColor: colors.expense,
    height: '100%',
  },
  ratioLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  categoriesList: {
    gap: 14,
  },
  categoryRow: {
    marginBottom: 4,
  },
  catLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  catIconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  catMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catTxCount: {
    fontSize: 11,
    color: colors.textMuted,
  },
  catPct: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  transactionsSection: {
    marginTop: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  badgeCountText: {
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  customerSelectorContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  customerSelectorLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customerScrollRow: {
    gap: 8,
    paddingVertical: 4,
  },
  customerFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCustomerFilterPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  customerFilterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeCustomerFilterPillText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default AnalysisScreen;

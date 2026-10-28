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
import { formatCurrency } from '../../utils/currency';
import { getFilteredReportData, calculateCategoryTotals } from '../../utils/calculations';
import { formatDateDisplay, getTodayString } from '../../utils/dateHelpers';

export const ReportsScreen = ({ route, navigation }) => {
  const initialTab = route?.params?.initialTab || 'monthly';
  const [reportType, setReportType] = useState(initialTab); // 'daily' | 'weekly' | 'monthly'
  const { transactions, categories, deleteTransaction } = useTransactions();

  const reportData = getFilteredReportData(transactions, reportType);
  const categoryTotals = calculateCategoryTotals(reportData.transactions, categories).filter(
    (c) => c.totalAmount > 0
  );

  const getReportDescription = () => {
    if (reportType === 'daily') {
      return `Showing financial report for Today (${formatDateDisplay(getTodayString())})`;
    }
    if (reportType === 'weekly') {
      return 'Showing financial report for the Last 7 Days';
    }
    return 'Showing financial report for Current Calendar Month';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <Header
        title="Financial Reports"
        subtitle="Daily • Weekly • Monthly Summaries"
        navigation={navigation}
        showBack={true}
        showMenu={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Segmented Report Selector */}
        <View style={styles.tabContainer}>
          {[
            { key: 'daily', label: 'Daily Report', icon: 'today-outline' },
            { key: 'weekly', label: 'Weekly Report', icon: 'calendar-outline' },
            { key: 'monthly', label: 'Monthly Report', icon: 'bar-chart-outline' },
          ].map((tab) => {
            const isActive = reportType === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setReportType(tab.key)}
                style={[styles.tab, isActive && styles.activeTab]}
              >
                <Ionicons
                  name={tab.icon}
                  size={16}
                  color={isActive ? colors.primaryDark : colors.textSecondary}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Report Scope Subtitle Banner */}
        <View style={styles.scopeBanner}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.scopeBannerText}>{getReportDescription()}</Text>
        </View>

        {/* 4 Report Financial Summary Cards */}
        <View style={styles.metricsGrid}>
          {/* Total Income */}
          <View style={[styles.metricCard, shadows.subtle]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.incomeBg }]}>
              <Ionicons name="arrow-down" size={18} color={colors.income} />
            </View>
            <Text style={styles.metricLabel}>Total Income</Text>
            <Text style={[styles.metricValue, { color: colors.income }]}>
              +{formatCurrency(reportData.totalIncome)}
            </Text>
          </View>

          {/* Total Expenses */}
          <View style={[styles.metricCard, shadows.subtle]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.expenseBg }]}>
              <Ionicons name="arrow-up" size={18} color={colors.expense} />
            </View>
            <Text style={styles.metricLabel}>Total Expenses</Text>
            <Text style={[styles.metricValue, { color: colors.expense }]}>
              -{formatCurrency(reportData.totalExpenses)}
            </Text>
          </View>

          {/* Net Balance */}
          <View style={[styles.metricCard, shadows.subtle]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.balanceBg }]}>
              <Ionicons name="wallet-outline" size={18} color={colors.balance} />
            </View>
            <Text style={styles.metricLabel}>Net Balance</Text>
            <Text
              style={[
                styles.metricValue,
                { color: reportData.netBalance >= 0 ? colors.textPrimary : colors.expense },
              ]}
            >
              {formatCurrency(reportData.netBalance)}
            </Text>
          </View>

          {/* Transaction Count */}
          <View style={[styles.metricCard, shadows.subtle]}>
            <View style={[styles.metricIconBox, { backgroundColor: colors.savingsBg }]}>
              <Ionicons name="receipt-outline" size={18} color={colors.savings} />
            </View>
            <Text style={styles.metricLabel}>Transactions</Text>
            <Text style={[styles.metricValue, { color: colors.textPrimary }]}>
              {reportData.transactionCount} records
            </Text>
          </View>
        </View>

        {/* Category-wise Summary for Period */}
        <View style={[styles.sectionCard, shadows.card]}>
          <Text style={styles.sectionTitle}>Category-wise Summary</Text>
          <Text style={styles.sectionSub}>Breakdown of spending in this period</Text>

          {categoryTotals.length === 0 ? (
            <Text style={styles.emptyNote}>
              No categorized expenses recorded in this period.
            </Text>
          ) : (
            <View style={styles.catBreakdownList}>
              {categoryTotals.map((cat) => (
                <View key={cat.id || cat.name} style={styles.catRow}>
                  <View style={styles.catTopInfo}>
                    <View style={styles.catIconAndName}>
                      <View style={[styles.smallCatIcon, { backgroundColor: cat.bgColor }]}>
                        <Ionicons name={cat.icon} size={16} color={cat.color} />
                      </View>
                      <Text style={styles.catNameText}>{cat.name}</Text>
                    </View>
                    <Text style={styles.catAmountText}>{formatCurrency(cat.totalAmount)}</Text>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.catProgressBg}>
                    <View
                      style={[
                        styles.catProgressFill,
                        {
                          width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                          backgroundColor: cat.color,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.catMetaRow}>
                    <Text style={styles.catTxnSub}>
                      {cat.transactionCount} {cat.transactionCount === 1 ? 'transaction' : 'transactions'}
                    </Text>
                    <Text style={styles.catPctSub}>{cat.percentage}% of period expenses</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Transactions in Period */}
        <View style={styles.recordsSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Period Transaction Records</Text>
            <Text style={styles.countBadge}>{reportData.transactions.length}</Text>
          </View>

          {reportData.transactions.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="No Period Transactions"
              description="No transaction records found matching this timeframe."
            />
          ) : (
            reportData.transactions.map((tx) => (
              <TransactionCard
                key={tx.id}
                transaction={tx}
                showDelete={true}
                onDelete={deleteTransaction}
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
    paddingBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.lg,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  activeTab: {
    backgroundColor: colors.surface,
    ...shadows.subtle,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  scopeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: borderRadius.lg,
    gap: 8,
  },
  scopeBannerText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '600',
    flex: 1,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    marginBottom: 12,
  },
  emptyNote: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 12,
  },
  catBreakdownList: {
    gap: 12,
  },
  catRow: {
    marginBottom: 4,
  },
  catTopInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catIconAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallCatIcon: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  catAmountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catProgressBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: 4,
  },
  catProgressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  catMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catTxnSub: {
    fontSize: 11,
    color: colors.textMuted,
  },
  catPctSub: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },
  recordsSection: {
    marginTop: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: colors.primaryLight,
    color: colors.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
});

export default ReportsScreen;

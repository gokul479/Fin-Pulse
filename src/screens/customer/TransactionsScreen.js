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
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/currency';
import { SHORT_MONTHS, MONTH_NAMES, isSameMonthAndYear } from '../../utils/dateHelpers';
import { calculateFinancialSummary } from '../../utils/calculations';

export const TransactionsScreen = ({ navigation }) => {
  const { transactions, deleteTransaction } = useTransactions();

  // Current selected month (0 = Jan, 9 = Oct) and year
  const [selectedMonth, setSelectedMonth] = useState(9); // October
  const [selectedYear, setSelectedYear] = useState(2026);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter transactions for selected month and year
  const monthlyTransactions = transactions.filter((t) =>
    isSameMonthAndYear(t.date, selectedMonth, selectedYear)
  );

  const monthSummary = calculateFinancialSummary(monthlyTransactions);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <Header
        title="Transactions"
        subtitle="Month-wise Transaction Ledger"
        navigation={navigation}
        showMenu={true}
        rightIcon="add-circle"
        onRightPress={() => setModalVisible(true)}
      />

      {/* Month & Year Selector Pills */}
      <View style={styles.monthSelectorWrapper}>
        <View style={styles.yearRow}>
          <Text style={styles.yearText}>{selectedYear}</Text>
          <View style={styles.yearButtons}>
            <TouchableOpacity
              onPress={() => setSelectedYear(selectedYear - 1)}
              style={styles.yearArrow}
            >
              <Ionicons name="chevron-back" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedYear(selectedYear + 1)}
              style={styles.yearArrow}
            >
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.monthsScrollView}
        >
          {SHORT_MONTHS.map((monthName, idx) => {
            const isSelected = selectedMonth === idx;
            return (
              <TouchableOpacity
                key={monthName}
                activeOpacity={0.7}
                onPress={() => setSelectedMonth(idx)}
                style={[styles.monthPill, isSelected && styles.activeMonthPill]}
              >
                <Text
                  style={[
                    styles.monthPillText,
                    isSelected && styles.activeMonthPillText,
                  ]}
                >
                  {monthName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Monthly Financial Summary Card */}
      <View style={[styles.summaryCard, shadows.card]}>
        <Text style={styles.summaryTitle}>
          {MONTH_NAMES[selectedMonth]} {selectedYear} Overview
        </Text>

        <View style={styles.summaryMetricsRow}>
          {/* Income */}
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Income</Text>
            <Text style={[styles.metricValue, { color: colors.income }]}>
              +{formatCurrency(monthSummary.totalIncome)}
            </Text>
          </View>

          <View style={styles.metricDivider} />

          {/* Expenses */}
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Expenses</Text>
            <Text style={[styles.metricValue, { color: colors.expense }]}>
              -{formatCurrency(monthSummary.totalExpenses)}
            </Text>
          </View>

          <View style={styles.metricDivider} />

          {/* Net Balance */}
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Net Balance</Text>
            <Text
              style={[
                styles.metricValue,
                { color: monthSummary.netBalance >= 0 ? colors.primaryDark : colors.expense },
              ]}
            >
              {formatCurrency(monthSummary.netBalance)}
            </Text>
          </View>
        </View>
      </View>

      {/* Transaction List */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.listHeading}>
          {monthlyTransactions.length}{' '}
          {monthlyTransactions.length === 1 ? 'Transaction' : 'Transactions'} in{' '}
          {SHORT_MONTHS[selectedMonth]}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {monthlyTransactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={`No Transactions in ${SHORT_MONTHS[selectedMonth]}`}
            description="You don't have any records for this month yet. Tap below to add one."
            actionTitle="Add Transaction"
            onAction={() => setModalVisible(true)}
          />
        ) : (
          monthlyTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              showDelete={true}
              onDelete={deleteTransaction}
            />
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  monthSelectorWrapper: {
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  yearText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  yearButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  yearArrow: {
    padding: 4,
    borderRadius: borderRadius.sm,
    backgroundColor: '#F1F5F9',
  },
  monthsScrollView: {
    paddingHorizontal: 16,
    gap: 8,
  },
  monthPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeMonthPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  monthPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeMonthPillText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    padding: 16,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  metricDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9',
  },
  listHeaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  listContent: {
    paddingBottom: 110,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 92,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TransactionsScreen;

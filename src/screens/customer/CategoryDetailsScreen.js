import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
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
import { CATEGORIES } from '../../data/demoData';

export const CategoryDetailsScreen = ({ route, navigation }) => {
  const { category: passedCategory } = route.params || {};
  const { transactions, deleteTransaction, currentSummary } = useTransactions();

  // Find category definition
  const categoryName = passedCategory?.name || 'Food';
  const categoryMeta =
    CATEGORIES.find((c) => c.name === categoryName) || passedCategory || {
      name: categoryName,
      icon: 'folder-outline',
      color: colors.primary,
      bgColor: colors.primaryLight,
    };

  // Filter transactions exclusively for this category
  const categoryTransactions = transactions.filter(
    (t) => t.category?.toLowerCase() === categoryName.toLowerCase()
  );

  // Recalculate dynamic totals from actual transaction data
  const totalAmount = categoryTransactions.reduce(
    (sum, t) => sum + (Number(t.amount) || 0),
    0
  );

  const percentageOfTotal =
    currentSummary.totalExpenses > 0
      ? Math.round((totalAmount / currentSummary.totalExpenses) * 100)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header with Back Button */}
      <Header
        title={categoryName}
        subtitle="Category Details"
        navigation={navigation}
        showBack={true}
        showMenu={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Header Card */}
        <View style={[styles.categoryHeaderCard, shadows.card]}>
          <View style={[styles.largeIconBox, { backgroundColor: categoryMeta.bgColor }]}>
            <Ionicons name={categoryMeta.icon} size={36} color={categoryMeta.color} />
          </View>

          <Text style={styles.categoryTitle}>{categoryName}</Text>
          <Text style={styles.categoryDesc}>{categoryMeta.description || 'Category breakdown'}</Text>

          <View style={styles.amountBadgeRow}>
            <Text style={styles.totalAmountText}>{formatCurrency(totalAmount)}</Text>
          </View>

          <View style={styles.metricsPillRow}>
            <View style={styles.metaPill}>
              <Ionicons name="receipt-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.metaPillText}>
                {categoryTransactions.length}{' '}
                {categoryTransactions.length === 1 ? 'Transaction' : 'Transactions'}
              </Text>
            </View>

            <View style={styles.metaPill}>
              <Ionicons name="pie-chart-outline" size={14} color={colors.primary} />
              <Text style={[styles.metaPillText, { color: colors.primaryDark, fontWeight: '700' }]}>
                {percentageOfTotal}% of total spend
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarWrapper}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${Math.min(100, Math.max(0, percentageOfTotal))}%`,
                  backgroundColor: categoryMeta.color,
                },
              ]}
            />
          </View>
        </View>

        {/* Transactions List */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Category Transactions</Text>
          <Text style={styles.txCountBadge}>{categoryTransactions.length}</Text>
        </View>

        {categoryTransactions.length === 0 ? (
          <EmptyState
            icon="receipt-outline"
            title={`No ${categoryName} Transactions`}
            description={`You haven't recorded any transactions under ${categoryName} yet.`}
            actionTitle="Go Back to Categories"
            onAction={() => navigation.goBack()}
          />
        ) : (
          categoryTransactions.map((tx) => (
            <TransactionCard
              key={tx.id}
              transaction={tx}
              showDelete={true}
              onDelete={deleteTransaction}
            />
          ))
        )}
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
  categoryHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  largeIconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  categoryDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  amountBadgeRow: {
    marginBottom: 12,
  },
  totalAmountText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  metricsPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  metaPillText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progressBarWrapper: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  txCountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
});

export default CategoryDetailsScreen;

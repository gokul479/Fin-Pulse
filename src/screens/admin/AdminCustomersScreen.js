import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components/Header';
import { UserAvatar } from '../../components/UserAvatar';
import { TransactionCard } from '../../components/TransactionCard';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/currency';
import { calculateCategoryTotals } from '../../utils/calculations';

export const AdminCustomersScreen = ({ navigation }) => {
  const { users } = useAuth();
  const {
    allPlatformTransactions,
    getCustomerTransactions,
    getCustomerSummary,
    deleteTransaction,
    categories,
  } = useTransactions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [inspectorFilter, setInspectorFilter] = useState('all'); // 'all' | 'expense' | 'income'

  // Filter only customer accounts
  const customers = users.filter((u) => u.role === 'customer');

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.occupation &&
        c.occupation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Inspector data for selected customer
  const selectedTxs = selectedCustomer
    ? getCustomerTransactions(selectedCustomer.id)
    : [];
  const selectedSummary = selectedCustomer
    ? getCustomerSummary(selectedCustomer.id)
    : { netBalance: 0, totalIncome: 0, totalExpenses: 0, savingsRate: 0 };

  const displayedTxs = selectedTxs.filter((t) => {
    if (inspectorFilter === 'expense') return t.type === 'expense';
    if (inspectorFilter === 'income') return t.type === 'income';
    return true;
  });

  const selectedCategoryTotals = calculateCategoryTotals(
    selectedTxs.filter((t) => t.type === 'expense'),
    categories
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

      {/* Top Header */}
      <Header
        title="Customer Directory"
        subtitle="Manage Customers & Expense Ledgers"
        navigation={navigation}
        showMenu={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={[styles.searchBar, shadows.subtle]}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search customer by name or email..."
              placeholderTextColor={colors.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Aggregate Overview Card */}
        <View style={[styles.aggregateCard, shadows.card]}>
          <View style={styles.aggregateHeader}>
            <View>
              <Text style={styles.aggregateTitle}>Active Portfolio Overview</Text>
              <Text style={styles.aggregateSub}>
                {customers.length} registered customers across system
              </Text>
            </View>
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>{customers.length} Customers</Text>
            </View>
          </View>

          <View style={styles.aggregateStatsRow}>
            <View style={styles.aggregateStatCol}>
              <Text style={styles.aggregateStatLabel}>Total Inflow</Text>
              <Text style={styles.aggregateIncome}>
                +
                {formatCurrency(
                  customers.reduce(
                    (acc, c) => acc + getCustomerSummary(c.id).totalIncome,
                    0
                  )
                )}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.aggregateStatCol}>
              <Text style={styles.aggregateStatLabel}>Total Outflow</Text>
              <Text style={styles.aggregateExpense}>
                -
                {formatCurrency(
                  customers.reduce(
                    (acc, c) => acc + getCustomerSummary(c.id).totalExpenses,
                    0
                  )
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Customer Accounts</Text>
          <Text style={styles.sectionCount}>
            {filteredCustomers.length} of {customers.length}
          </Text>
        </View>

        {/* Customer Cards List */}
        {filteredCustomers.length === 0 ? (
          <EmptyState
            icon="people-outline"
            title="No Customers Found"
            message={`No customer matching "${searchQuery}" was located.`}
          />
        ) : (
          filteredCustomers.map((customer) => {
            const summary = getCustomerSummary(customer.id);
            const customerTxs = getCustomerTransactions(customer.id);

            return (
              <TouchableOpacity
                key={customer.id}
                style={[styles.customerCard, shadows.card]}
                activeOpacity={0.8}
                onPress={() => setSelectedCustomer(customer)}
              >
                {/* Top Profile Row */}
                <View style={styles.customerTopRow}>
                  <UserAvatar
                    user={customer}
                    size={52}
                    showBorder={true}
                    borderColor={colors.primary}
                    showVerified={true}
                  />

                  <View style={styles.customerInfoCol}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <Text style={styles.customerEmail}>{customer.email}</Text>
                    <Text style={styles.customerOccupation}>
                      {customer.occupation || 'Customer Account'}
                    </Text>
                  </View>

                  <View style={styles.arrowBox}>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                </View>

                {/* Financial Summary Strip */}
                <View style={styles.customerFinancialStrip}>
                  <View style={styles.miniMetric}>
                    <Text style={styles.miniMetricLabel}>Balance</Text>
                    <Text
                      style={[
                        styles.miniMetricValue,
                        { color: summary.netBalance >= 0 ? colors.primary : colors.expense },
                      ]}
                    >
                      {formatCurrency(summary.netBalance)}
                    </Text>
                  </View>

                  <View style={styles.miniMetric}>
                    <Text style={styles.miniMetricLabel}>Expenses</Text>
                    <Text style={[styles.miniMetricValue, { color: '#DC2626' }]}>
                      -{formatCurrency(summary.totalExpenses)}
                    </Text>
                  </View>

                  <View style={styles.miniMetric}>
                    <Text style={styles.miniMetricLabel}>Inflow</Text>
                    <Text style={[styles.miniMetricValue, { color: '#059669' }]}>
                      +{formatCurrency(summary.totalIncome)}
                    </Text>
                  </View>

                  <View style={styles.miniMetric}>
                    <Text style={styles.miniMetricLabel}>Txns</Text>
                    <Text style={[styles.miniMetricValue, { color: colors.textSecondary }]}>
                      {customerTxs.length}
                    </Text>
                  </View>
                </View>

                {/* Inspect Action Button */}
                <View style={styles.inspectBtn}>
                  <Text style={styles.inspectBtnText}>
                    Inspect Expenses & Activity →
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* 📊 Customer Expense Inspector Modal 📊 */}
      <Modal
        visible={!!selectedCustomer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedCustomer(null)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <UserAvatar
                user={selectedCustomer}
                size={44}
                showBorder={true}
                borderColor={colors.primary}
                showVerified={true}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.modalHeaderTitle} numberOfLines={1}>
                  {selectedCustomer?.name}
                </Text>
                <Text style={styles.modalHeaderSubtitle}>
                  {selectedCustomer?.email}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setSelectedCustomer(null)}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
          >
            {/* Customer Summary Deck */}
            <View style={[styles.inspectorHeroCard, shadows.elevated]}>
              <View style={styles.inspectorTopRow}>
                <View>
                  <Text style={styles.inspectorLabel}>CUSTOMER NET PORTFOLIO</Text>
                  <Text style={styles.inspectorBalance}>
                    {formatCurrency(selectedSummary.netBalance)}
                  </Text>
                </View>
                <View style={styles.inspectorBadge}>
                  <Text style={styles.inspectorBadgeText}>
                    {selectedCustomer?.occupation || 'Customer'}
                  </Text>
                </View>
              </View>

              <View style={styles.inspectorStatsDeck}>
                <View style={styles.inspectorStatBox}>
                  <Text style={styles.inspectorStatLabel}>Total Inflow</Text>
                  <Text style={styles.inspectorIncomeVal}>
                    +{formatCurrency(selectedSummary.totalIncome)}
                  </Text>
                </View>

                <View style={styles.inspectorDivider} />

                <View style={styles.inspectorStatBox}>
                  <Text style={styles.inspectorStatLabel}>Total Outflow</Text>
                  <Text style={styles.inspectorExpenseVal}>
                    -{formatCurrency(selectedSummary.totalExpenses)}
                  </Text>
                </View>
              </View>

              <View style={styles.customerMetaRow}>
                <Ionicons name="call-outline" size={14} color="#93C5FD" />
                <Text style={styles.customerMetaText}>
                  {selectedCustomer?.phone || 'No phone recorded'}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.customerMetaText}>
                  Savings: {selectedSummary.savingsRate}%
                </Text>
              </View>
            </View>

            {/* Category Expenses Breakdown for this customer */}
            <View style={[styles.categoryBreakdownCard, shadows.card]}>
              <Text style={styles.categoryCardTitle}>
                Expense Breakdown by Category
              </Text>
              <Text style={styles.categoryCardSub}>
                Where {selectedCustomer?.name?.split(' ')[0]} spent their money
              </Text>

              <View style={styles.categoryPillsGrid}>
                {selectedCategoryTotals
                  .filter((c) => c.totalAmount > 0)
                  .map((cat) => (
                    <View key={cat.id} style={styles.categoryProgressRow}>
                      <View style={styles.catRowHeader}>
                        <Text style={styles.catNameText}>{cat.name}</Text>
                        <Text style={styles.catAmountText}>
                          {formatCurrency(cat.totalAmount)} ({cat.percentage}%)
                        </Text>
                      </View>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            {
                              width: `${cat.percentage}%`,
                              backgroundColor: cat.color || colors.primary,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
              </View>
            </View>

            {/* Transaction Filter Segment */}
            <View style={styles.filterSection}>
              <View style={styles.filterTabsRow}>
                <TouchableOpacity
                  style={[
                    styles.filterTab,
                    inspectorFilter === 'all' && styles.activeFilterTab,
                  ]}
                  onPress={() => setInspectorFilter('all')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      inspectorFilter === 'all' && styles.activeFilterTabText,
                    ]}
                  >
                    All ({selectedTxs.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterTab,
                    inspectorFilter === 'expense' && styles.activeFilterTab,
                  ]}
                  onPress={() => setInspectorFilter('expense')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      inspectorFilter === 'expense' && styles.activeFilterTabText,
                    ]}
                  >
                    Expenses ({selectedTxs.filter((t) => t.type === 'expense').length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterTab,
                    inspectorFilter === 'income' && styles.activeFilterTab,
                  ]}
                  onPress={() => setInspectorFilter('income')}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      inspectorFilter === 'income' && styles.activeFilterTabText,
                    ]}
                  >
                    Inflow ({selectedTxs.filter((t) => t.type === 'income').length})
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Customer Transactions List */}
            <View style={styles.txListWrapper}>
              {displayedTxs.length === 0 ? (
                <EmptyState
                  icon="receipt-outline"
                  title="No Transactions"
                  message={`No ${inspectorFilter} records found for this customer.`}
                />
              ) : (
                displayedTxs.map((tx) => (
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
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
  },
  aggregateCard: {
    backgroundColor: '#0F172A',
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(2, 132, 199, 0.3)',
  },
  aggregateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  aggregateTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  aggregateSub: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 2,
  },
  badgePill: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  aggregateStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 12,
  },
  aggregateStatCol: {
    flex: 1,
  },
  aggregateStatLabel: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '600',
  },
  aggregateIncome: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 2,
  },
  aggregateExpense: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F87171',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  customerCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  customerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  customerEmail: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  customerOccupation: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerFinancialStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  miniMetric: {
    alignItems: 'center',
  },
  miniMetricLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
  miniMetricValue: {
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  inspectBtn: {
    alignItems: 'center',
    paddingTop: 10,
  },
  inspectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalHeaderSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    paddingBottom: 40,
  },
  inspectorHeroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(2, 132, 199, 0.35)',
  },
  inspectorTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  inspectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 0.8,
  },
  inspectorBalance: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  inspectorBadge: {
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  inspectorBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8',
  },
  inspectorStatsDeck: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
  },
  inspectorStatBox: {
    flex: 1,
  },
  inspectorStatLabel: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '600',
  },
  inspectorIncomeVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 2,
  },
  inspectorExpenseVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F87171',
    marginTop: 2,
  },
  inspectorDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 12,
  },
  customerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  customerMetaText: {
    fontSize: 11,
    color: '#E0E7FF',
  },
  dot: {
    color: '#E0E7FF',
    fontSize: 12,
  },
  categoryBreakdownCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  categoryCardSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  categoryPillsGrid: {
    gap: 10,
  },
  categoryProgressRow: {
    gap: 4,
  },
  catRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  catNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  catAmountText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterTab: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeFilterTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  txListWrapper: {
    marginTop: 6,
  },
});

export default AdminCustomersScreen;

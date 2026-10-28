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
import { CategoryCard } from '../../components/CategoryCard';
import { EmptyState } from '../../components/EmptyState';
import { useTransactions } from '../../context/TransactionContext';
import { formatCurrency } from '../../utils/currency';

export const CategoriesScreen = ({ navigation }) => {
  const { currentCategoryTotals, currentSummary } = useTransactions();
  const [filterType, setFilterType] = useState('all'); // 'all' | 'expense' | 'income'

  const filteredCategories = currentCategoryTotals.filter((c) => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <Header
        title="Expense Categories"
        subtitle="Overall Category Spending & Breakdown"
        navigation={navigation}
        showMenu={true}
        rightIcon="pie-chart-outline"
        onRightPress={() => navigation.navigate('Analysis')}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Top Summary Banner */}
        <View style={[styles.heroBanner, shadows.primary]}>
          <View style={styles.heroTextCol}>
            <Text style={styles.heroSubText}>Total Tracked Expenses</Text>
            <Text style={styles.heroAmountText}>
              {formatCurrency(currentSummary.totalExpenses)}
            </Text>
            <Text style={styles.heroSubCount}>
              Across {currentCategoryTotals.length} spending categories
            </Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="pie-chart" size={32} color={colors.textLight} />
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {[
            { key: 'all', label: 'All Categories' },
            { key: 'expense', label: 'Expenses' },
            { key: 'income', label: 'Income Sources' },
          ].map((tab) => {
            const isActive = filterType === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => setFilterType(tab.key)}
                style={[styles.filterChip, isActive && styles.activeFilterChip]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.activeFilterChipText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Categories List */}
        <View style={styles.listSection}>
          {filteredCategories.length === 0 ? (
            <EmptyState
              icon="grid-outline"
              title="No Categories Available"
              description="No category transactions recorded for this filter."
            />
          ) : (
            filteredCategories.map((cat) => (
              <CategoryCard
                key={cat.id || cat.name}
                category={cat}
                onPress={() =>
                  navigation.navigate('CategoryDetails', {
                    category: cat,
                  })
                }
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
  heroBanner: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xxl,
    marginHorizontal: 16,
    marginVertical: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTextCol: {
    flex: 1,
  },
  heroSubText: {
    fontSize: 13,
    color: '#93C5FD',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroAmountText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textLight,
    marginVertical: 4,
  },
  heroSubCount: {
    fontSize: 12,
    color: '#E0E7FF',
  },
  heroIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeFilterChipText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  listSection: {
    marginTop: 6,
  },
});

export default CategoriesScreen;

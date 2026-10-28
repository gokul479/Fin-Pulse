import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';

export const SummaryCard = ({
  balance = 0,
  income = 0,
  expenses = 0,
  savingsRate,
  variant = 'hero',
  title = 'Portfolio Balance',
}) => {
  if (variant === 'hero') {
    return (
      <View style={[styles.cardContainer, shadows.elevated]}>
        {/* Top Brand & Chip Row */}
        <View style={styles.topRow}>
          <View style={styles.cardBrandGroup}>
            <View style={styles.chipEmblem}>
              <Ionicons name="hardware-chip-outline" size={22} color="#38BDF8" />
            </View>
            <View>
              <Text style={styles.brandTitle}>FinPulse</Text>
              <Text style={styles.cardType}>SAPPHIRE EDITION</Text>
            </View>
          </View>
          <View style={styles.contactlessContainer}>
            <Ionicons
              name="wifi"
              size={18}
              color="rgba(147, 197, 253, 0.7)"
              style={styles.rotateIcon}
            />
            <Text style={styles.cardMaskNumber}>•••• 8492</Text>
          </View>
        </View>

        {/* Balance Display */}
        <View style={styles.balanceSection}>
          <View style={styles.labelRow}>
            <View style={styles.activeDot} />
            <Text style={styles.balanceLabel}>{title}</Text>
          </View>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        </View>

        {/* Frosted Income / Expense Stats Deck */}
        <View style={styles.statsDeck}>
          {/* Income Column */}
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: 'rgba(5, 150, 105, 0.2)' }]}>
              <Ionicons name="arrow-down" size={14} color="#34D399" />
            </View>
            <View>
              <Text style={styles.statLabel}>Total Inflow</Text>
              <Text style={styles.statIncomeValue}>+{formatCurrency(income)}</Text>
            </View>
          </View>

          <View style={styles.deckDivider} />

          {/* Expense Column */}
          <View style={styles.statBox}>
            <View style={[styles.statIconBadge, { backgroundColor: 'rgba(220, 38, 38, 0.2)' }]}>
              <Ionicons name="arrow-up" size={14} color="#F87171" />
            </View>
            <View>
              <Text style={styles.statLabel}>Total Outflow</Text>
              <Text style={styles.statExpenseValue}>-{formatCurrency(expenses)}</Text>
            </View>
          </View>
        </View>

        {/* Bottom Savings Glow Pill */}
        {savingsRate !== undefined && (
          <View style={styles.savingsPill}>
            <View style={styles.savingsDot} />
            <Text style={styles.savingsText}>
              Savings Retention: <Text style={styles.savingsBold}>{savingsRate}%</Text> of cash retained
            </Text>
          </View>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0A1128', // Deep Sapphire Obsidian
    borderRadius: 24,
    padding: 22,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(2, 132, 199, 0.3)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardBrandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chipEmblem: {
    width: 38,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  cardType: {
    fontSize: 9,
    fontWeight: '700',
    color: '#93C5FD',
    letterSpacing: 1.2,
  },
  contactlessContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rotateIcon: {
    transform: [{ rotate: '90deg' }],
  },
  cardMaskNumber: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.55)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
  },
  balanceSection: {
    marginVertical: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  balanceLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#93C5FD',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  balanceAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  statsDeck: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: borderRadius.xl,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#93C5FD',
    fontWeight: '500',
  },
  statIncomeValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#34D399',
    marginTop: 1,
  },
  statExpenseValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F87171',
    marginTop: 1,
  },
  deckDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 10,
  },
  savingsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 132, 199, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    marginTop: 14,
    alignSelf: 'flex-start',
    gap: 6,
  },
  savingsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  savingsText: {
    fontSize: 11,
    color: '#E0F2FE',
  },
  savingsBold: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default SummaryCard;

import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';

export const CategoryCard = ({ category, onPress, style }) => {
  const {
    name,
    icon = 'folder-outline',
    color = colors.primary,
    bgColor = colors.primaryLight,
    totalAmount = 0,
    transactionCount = 0,
    percentage = 0,
  } = category;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.card, shadows.subtle, style]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.txCount}>
            {transactionCount} {transactionCount === 1 ? 'transaction' : 'transactions'}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min(100, Math.max(0, percentage))}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  txCount: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});

export default CategoryCard;

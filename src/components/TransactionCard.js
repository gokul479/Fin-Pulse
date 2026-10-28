import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { formatDateDisplay } from '../utils/dateHelpers';
import { CATEGORIES } from '../data/demoData';

export const TransactionCard = ({
  transaction,
  onPress,
  onDelete,
  showDelete = false,
  style,
}) => {
  const { title, amount, type, category, date, description } = transaction;

  // Match category icon & colors
  const matchedCategory = CATEGORIES.find((c) => c.name === category) || {
    icon: 'card-outline',
    color: colors.primary,
    bgColor: colors.primaryLight,
  };

  const isIncome = type === 'income';
  const amountColor = isIncome ? '#059669' : '#DC2626';
  const pillBg = isIncome ? '#ECFDF5' : '#FEF2F2';
  const pillBorder = isIncome ? '#A7F3D0' : '#FECACA';
  const amountPrefix = isIncome ? '+ ' : '- ';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      style={[styles.card, shadows.subtle, style]}
    >
      <View style={styles.leftSection}>
        {/* Modern Squircle Category Emblem */}
        <View style={[styles.iconContainer, { backgroundColor: matchedCategory.bgColor }]}>
          <Ionicons name={matchedCategory.icon} size={22} color={matchedCategory.color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.subRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{category}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{formatDateDisplay(date)}</Text>
          </View>
          {description ? (
            <Text style={styles.description} numberOfLines={1}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.rightSection}>
        {/* Custom Rounded Pill for Amount */}
        <View style={[styles.amountPill, { backgroundColor: pillBg, borderColor: pillBorder }]}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {amountPrefix}{formatCurrency(amount)}
          </Text>
        </View>

        {showDelete && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(transaction.id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.1,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dot: {
    fontSize: 12,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  date: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
    fontStyle: 'italic',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
  },
  amountPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  amount: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  deleteButton: {
    marginTop: 6,
    padding: 4,
  },
});

export default TransactionCard;

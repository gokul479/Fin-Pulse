import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';

const { width } = Dimensions.get('window');

export const FinancialHealthModal = ({
  visible,
  onClose,
  transactions = [],
  currentSummary = {},
  userName = 'User',
}) => {
  if (!visible) return null;

  const totalIncome = currentSummary.totalIncome || 0;
  const totalExpenses = currentSummary.totalExpenses || 0;
  const netBalance = currentSummary.netBalance || 0;

  // 1. Calculate 50/30/20 Rule Distribution
  const needsKeywords = ['rent', 'groceries', 'utilities', 'bills', 'electricity', 'health', 'medical', 'transport', 'fuel', 'education', 'maintenance'];
  const wantsKeywords = ['shopping', 'dining', 'food', 'restaurant', 'entertainment', 'movies', 'subscriptions', 'gifts', 'travel', 'vacation', 'cafe'];

  let needsAmount = 0;
  let wantsAmount = 0;

  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      const cat = (tx.category || '').toLowerCase();
      const title = (tx.title || '').toLowerCase();
      const combined = `${cat} ${title}`;

      if (needsKeywords.some((k) => combined.includes(k))) {
        needsAmount += Math.abs(tx.amount || 0);
      } else {
        wantsAmount += Math.abs(tx.amount || 0);
      }
    });

  const effectiveIncome = Math.max(totalIncome, totalExpenses);
  const needsPct = effectiveIncome > 0 ? Math.min(100, Math.round((needsAmount / effectiveIncome) * 100)) : 45;
  const wantsPct = effectiveIncome > 0 ? Math.min(100, Math.round((wantsAmount / effectiveIncome) * 100)) : 30;
  const savingsPct = effectiveIncome > 0 ? Math.max(0, 100 - needsPct - wantsPct) : 25;

  // 2. Financial Health Score (0 - 100)
  let score = 65;
  if (savingsPct >= 20) score += 15;
  else if (savingsPct >= 10) score += 5;
  if (needsPct <= 50) score += 10;
  if (wantsPct <= 30) score += 10;
  if (netBalance > 0) score += 5;
  score = Math.min(96, Math.max(25, score));

  // Health Rating Label
  let ratingLabel = 'Optimal Wealth Builder';
  let ratingColor = '#059669';
  let ratingIcon = 'sparkles';
  if (score < 50) {
    ratingLabel = 'Action Needed — High Outflow';
    ratingColor = '#DC2626';
    ratingIcon = 'alert-circle';
  } else if (score < 75) {
    ratingLabel = 'Moderate Health — Keep Saving';
    ratingColor = '#D97706';
    ratingIcon = 'trending-up';
  }

  // 3. Daily Safe-to-Spend calculation
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - now.getDate());
  const safeDailySpend = Math.max(0, Math.round(Math.max(0, netBalance) / daysLeft));

  // 4. Dynamic AI Insights
  const insights = [];
  if (savingsPct >= 20) {
    insights.push({
      icon: 'checkmark-circle-outline',
      color: '#059669',
      title: 'Strong Savings Discipline',
      desc: `Your savings rate of ${savingsPct}% outperforms standard benchmark of 20%. Keep maintaining this surplus!`,
    });
  } else {
    insights.push({
      icon: 'alert-circle-outline',
      color: '#DC2626',
      title: 'Boost Monthly Savings',
      desc: `Currently saving ${savingsPct}% of income. Aim to trim non-essential shopping to reach 20%.`,
    });
  }

  if (wantsPct > 35) {
    insights.push({
      icon: 'pricetag-outline',
      color: '#D97706',
      title: 'Discretionary Wants at ' + wantsPct + '%',
      desc: 'Discretionary spending is higher than recommended 30%. Review dining and entertainment subscriptions.',
    });
  } else {
    insights.push({
      icon: 'shield-checkmark-outline',
      color: '#2563EB',
      title: 'Needs & Wants Balanced',
      desc: `Needs (${needsPct}%) and Wants (${wantsPct}%) are strictly within sustainable 50/30 financial thresholds.`,
    });
  }

  insights.push({
    icon: 'cash-outline',
    color: '#0284C7',
    title: `Safe Daily Allowance: ${formatCurrency(safeDailySpend)}/day`,
    desc: `With ${daysLeft} days left in the billing cycle, spending under ${formatCurrency(safeDailySpend)} daily preserves your positive cash flow.`,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={13} color="#2563EB" />
                <Text style={styles.aiBadgeText}>FINPULSE INTELLIGENCE</Text>
              </View>
              <Text style={styles.headerTitle}>Financial Health Advisor</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
            {/* Health Score Card */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreRow}>
                <View style={[styles.scoreCircle, { borderColor: ratingColor }]}>
                  <Text style={[styles.scoreValue, { color: ratingColor }]}>{score}</Text>
                  <Text style={styles.scoreMax}>/100</Text>
                </View>
                <View style={styles.scoreInfo}>
                  <View style={[styles.ratingPill, { backgroundColor: ratingColor + '18' }]}>
                    <Ionicons name={ratingIcon} size={13} color={ratingColor} />
                    <Text style={[styles.ratingPillText, { color: ratingColor }]}>
                      {ratingLabel}
                    </Text>
                  </View>
                  <Text style={styles.scoreAdvice}>
                    Calculated from your live income, expense split, and savings discipline.
                  </Text>
                </View>
              </View>
            </View>

            {/* 50/30/20 Rule Breakdown */}
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeader}>
                <Ionicons name="pie-chart-outline" size={16} color={colors.primary} />
                <Text style={styles.sectionTitle}>50/30/20 Financial Rule Compliance</Text>
              </View>

              {/* Needs Bar */}
              <View style={styles.metricItem}>
                <View style={styles.metricLabelRow}>
                  <Text style={styles.metricName}>Needs (Rent, Bills, Food)</Text>
                  <Text style={styles.metricVal}>
                    {needsPct}% <Text style={styles.targetVal}>(Target ≤ 50%)</Text>
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(100, needsPct)}%`,
                        backgroundColor: needsPct <= 50 ? '#059669' : '#DC2626',
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Wants Bar */}
              <View style={styles.metricItem}>
                <View style={styles.metricLabelRow}>
                  <Text style={styles.metricName}>Wants (Shopping, Leisure)</Text>
                  <Text style={styles.metricVal}>
                    {wantsPct}% <Text style={styles.targetVal}>(Target ≤ 30%)</Text>
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(100, wantsPct)}%`,
                        backgroundColor: wantsPct <= 30 ? '#2563EB' : '#D97706',
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Savings Bar */}
              <View style={styles.metricItem}>
                <View style={styles.metricLabelRow}>
                  <Text style={styles.metricName}>Savings Retained</Text>
                  <Text style={styles.metricVal}>
                    {savingsPct}% <Text style={styles.targetVal}>(Target ≥ 20%)</Text>
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${Math.min(100, savingsPct)}%`,
                        backgroundColor: savingsPct >= 20 ? '#059669' : '#D97706',
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* AI Actionable Insights */}
            <View style={styles.sectionBox}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb-outline" size={16} color={colors.primary} />
                <Text style={styles.sectionTitle}>Smart Algorithmic Recommendations</Text>
              </View>

              {insights.map((item, index) => (
                <View key={index} style={styles.insightCard}>
                  <View style={[styles.insightIconBox, { backgroundColor: item.color + '18' }]}>
                    <Ionicons name={item.icon} size={18} color={item.color} />
                  </View>
                  <View style={styles.insightTextCol}>
                    <Text style={styles.insightTitle}>{item.title}</Text>
                    <Text style={styles.insightDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.gotItBtn} onPress={onClose} activeOpacity={0.85}>
              <Text style={styles.gotItText}>Close & Return to Dashboard</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '88%',
    paddingBottom: 24,
    ...shadows.elevated,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 20,
    paddingBottom: 30,
  },
  scoreCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.xxl,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  scoreMax: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
    marginTop: -2,
  },
  scoreInfo: {
    flex: 1,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  ratingPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreAdvice: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  sectionBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
    ...shadows.subtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricItem: {
    marginBottom: 12,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  metricName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  metricVal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  targetVal: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: borderRadius.lg,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  insightIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  insightTextCol: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  insightDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  gotItBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  gotItText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
});

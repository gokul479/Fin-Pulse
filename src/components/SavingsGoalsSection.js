import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { useNotification } from '../context/NotificationContext';

const DEFAULT_GOALS = [
  {
    id: 'goal-1',
    title: 'Emergency Fund',
    targetAmount: 30000,
    savedAmount: 24500,
    icon: 'shield-checkmark',
    color: '#059669',
    category: 'Safety Net',
  },
  {
    id: 'goal-2',
    title: 'Tech Upgrade',
    targetAmount: 50000,
    savedAmount: 35000,
    icon: 'laptop-outline',
    color: '#2563EB',
    category: 'Electronics',
  },
  {
    id: 'goal-3',
    title: 'Vacation & Travel',
    targetAmount: 20000,
    savedAmount: 12000,
    icon: 'airplane-outline',
    color: '#8B5CF6',
    category: 'Leisure',
  },
];

const GOAL_ICONS = [
  { name: 'shield-checkmark', label: 'Emergency', color: '#059669' },
  { name: 'laptop-outline', label: 'Tech', color: '#2563EB' },
  { name: 'airplane-outline', label: 'Travel', color: '#8B5CF6' },
  { name: 'car-sport-outline', label: 'Vehicle', color: '#EA580C' },
  { name: 'home-outline', label: 'House', color: '#0284C7' },
  { name: 'gift-outline', label: 'Gifts', color: '#EC4899' },
  { name: 'school-outline', label: 'Course', color: '#D97706' },
];

export const SavingsGoalsSection = ({ userId = 'customer' }) => {
  const storageKey = `@finpulse_savings_goals_v1_${userId}`;
  const { showFeedback } = useNotification();

  const [goals, setGoals] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Form states for new goal
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newInitial, setNewInitial] = useState('');
  const [selectedIconIndex, setSelectedIconIndex] = useState(0);

  // Form state for deposit
  const [depositAmount, setDepositAmount] = useState('');

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, [userId]);

  const loadGoals = async () => {
    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setGoals(JSON.parse(stored));
      } else {
        setGoals(DEFAULT_GOALS);
        await AsyncStorage.setItem(storageKey, JSON.stringify(DEFAULT_GOALS));
      }
    } catch (e) {
      setGoals(DEFAULT_GOALS);
    }
  };

  const saveGoalsToStorage = async (updatedGoals) => {
    try {
      setGoals(updatedGoals);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedGoals));
    } catch (e) {
      console.error('Error saving goals:', e);
    }
  };

  // Add new goal
  const handleCreateGoal = async () => {
    const target = parseFloat(newTarget);
    if (!newTitle.trim() || isNaN(target) || target <= 0) {
      showFeedback({
        type: 'delete',
        title: 'Invalid Goal',
        message: 'Please enter a valid goal title and target amount.',
      });
      return;
    }

    const initial = parseFloat(newInitial) || 0;
    const selectedIcon = GOAL_ICONS[selectedIconIndex];

    const newGoalObj = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      targetAmount: target,
      savedAmount: Math.min(target, initial),
      icon: selectedIcon.name,
      color: selectedIcon.color,
      category: selectedIcon.label,
    };

    const updated = [newGoalObj, ...goals];
    await saveGoalsToStorage(updated);

    setNewTitle('');
    setNewTarget('');
    setNewInitial('');
    setCreateModalVisible(false);

    showFeedback({
      type: 'profile',
      title: 'Goal Created! 🎯',
      message: `"${newGoalObj.title}" target of ${formatCurrency(target)} added to your vault.`,
      buttonText: 'OK',
    });
  };

  // Open deposit modal
  const openDepositModal = (goal) => {
    setSelectedGoal(goal);
    setDepositAmount('');
    setDepositModalVisible(true);
  };

  // Add money to goal
  const handleDeposit = async () => {
    if (!selectedGoal) return;
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      showFeedback({
        type: 'delete',
        title: 'Invalid Amount',
        message: 'Please enter a valid deposit amount.',
      });
      return;
    }

    const updated = goals.map((g) => {
      if (g.id === selectedGoal.id) {
        const newSaved = Math.min(g.targetAmount, g.savedAmount + amount);
        return { ...g, savedAmount: newSaved };
      }
      return g;
    });

    await saveGoalsToStorage(updated);
    setDepositModalVisible(false);

    showFeedback({
      type: 'profile',
      title: 'Savings Added! 💰',
      message: `Added ${formatCurrency(amount)} into "${selectedGoal.title}".`,
      buttonText: 'OK',
    });
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    const updated = goals.filter((g) => g.id !== goalId);
    await saveGoalsToStorage(updated);
    setDepositModalVisible(false);
  };

  // Total saved calculation
  const totalSavedAcrossGoals = goals.reduce((acc, g) => acc + (g.savedAmount || 0), 0);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.badgeRow}>
            <Ionicons name="sparkles" size={13} color={colors.primary} />
            <Text style={styles.sectionBadge}>SMART VAULT</Text>
          </View>
          <Text style={styles.sectionTitle}>Savings Goals & Piggy Bank</Text>
        </View>

        <TouchableOpacity
          style={styles.newGoalBtn}
          onPress={() => setCreateModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color={colors.primary} />
          <Text style={styles.newGoalBtnText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Goals Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round(((goal.savedAmount || 0) / (goal.targetAmount || 1)) * 100));
          const isComplete = pct >= 100;

          return (
            <TouchableOpacity
              key={goal.id}
              style={[styles.goalCard, shadows.subtle]}
              onPress={() => openDepositModal(goal)}
              activeOpacity={0.8}
            >
              {/* Card Top */}
              <View style={styles.cardTop}>
                <View style={[styles.iconCircle, { backgroundColor: goal.color + '16' }]}>
                  <Ionicons name={goal.icon} size={20} color={goal.color} />
                </View>
                <View style={[styles.pctBadge, { backgroundColor: isComplete ? '#DCFCE7' : '#EFF6FF' }]}>
                  <Text style={[styles.pctBadgeText, { color: isComplete ? '#166534' : colors.primaryDark }]}>
                    {pct}%
                  </Text>
                </View>
              </View>

              {/* Title & Category */}
              <Text style={styles.goalTitle} numberOfLines={1}>
                {goal.title}
              </Text>
              <Text style={styles.goalCategory}>{goal.category}</Text>

              {/* Progress Bar */}
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${pct}%`,
                      backgroundColor: isComplete ? '#10B981' : goal.color,
                    },
                  ]}
                />
              </View>

              {/* Amount Row */}
              <View style={styles.amountRow}>
                <Text style={styles.savedAmount}>{formatCurrency(goal.savedAmount)}</Text>
                <Text style={styles.targetAmount}>of {formatCurrency(goal.targetAmount)}</Text>
              </View>

              {/* Action Hint */}
              <View style={styles.cardFooter}>
                <Text style={styles.actionHint}>
                  {isComplete ? '🎉 Target Achieved!' : '+ Tap to Deposit'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal 1: Create New Goal */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Savings Goal</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody}>
              <Text style={styles.inputLabel}>Goal Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. MacBook Pro, Goa Trip, Bike..."
                placeholderTextColor={colors.textMuted}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Target Amount (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 50000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={newTarget}
                onChangeText={setNewTarget}
              />

              <Text style={styles.inputLabel}>Initial Saved Balance (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 5000"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={newInitial}
                onChangeText={setNewInitial}
              />

              <Text style={styles.inputLabel}>Choose Goal Category & Icon</Text>
              <View style={styles.iconPickerRow}>
                {GOAL_ICONS.map((item, idx) => {
                  const isSelected = selectedIconIndex === idx;
                  return (
                    <TouchableOpacity
                      key={item.name}
                      style={[
                        styles.iconPickerItem,
                        isSelected && { borderColor: item.color, backgroundColor: item.color + '15' },
                      ]}
                      onPress={() => setSelectedIconIndex(idx)}
                    >
                      <Ionicons name={item.name} size={22} color={item.color} />
                      <Text style={styles.iconPickerLabel}>{item.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleCreateGoal}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Create Goal in Vault</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Quick Deposit into Goal */}
      <Modal
        visible={depositModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDepositModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedGoal?.title}</Text>
                <Text style={styles.modalSub}>
                  Saved {formatCurrency(selectedGoal?.savedAmount || 0)} of{' '}
                  {formatCurrency(selectedGoal?.targetAmount || 0)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setDepositModalVisible(false)}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.depositBody}>
              <Text style={styles.inputLabel}>Deposit Amount (₹)</Text>
              <TextInput
                style={styles.depositInput}
                placeholder="₹ Amount to add"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={depositAmount}
                onChangeText={setDepositAmount}
                autoFocus
              />

              {/* Quick Preset Pills */}
              <View style={styles.quickPillsRow}>
                {[500, 1000, 2000, 5000].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.pillBtn}
                    onPress={() => setDepositAmount(String(amt))}
                  >
                    <Text style={styles.pillBtnText}>+{amt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleDeposit}
                activeOpacity={0.85}
              >
                <Ionicons name="wallet-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.submitBtnText}>Deposit to Goal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteGoalBtn}
                onPress={() => handleDeleteGoal(selectedGoal?.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color={colors.expense} />
                <Text style={styles.deleteGoalText}>Remove this goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  newGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  newGoalBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  goalCard: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  pctBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  goalCategory: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    marginBottom: 10,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  savedAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  targetAmount: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  actionHint: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 24,
    ...shadows.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalBody: {
    padding: 20,
  },
  depositBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  depositInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  quickPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 8,
  },
  pillBtn: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  pillBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  iconPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
    marginBottom: 16,
  },
  iconPickerItem: {
    width: 70,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconPickerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  submitBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textLight,
  },
  deleteGoalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    marginTop: 8,
  },
  deleteGoalText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.expense,
  },
});

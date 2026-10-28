import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { CustomInput } from './CustomInput';
import { CustomButton } from './CustomButton';
import { CATEGORIES } from '../data/demoData';
import { getTodayString } from '../utils/dateHelpers';
import { validateTransaction } from '../utils/validation';
import { useTransactions } from '../context/TransactionContext';

export const AddTransactionModal = ({ visible, onClose }) => {
  const { addTransaction } = useTransactions();

  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayString());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter categories based on transaction type
  const availableCategories = CATEGORIES.filter(
    (c) => (type === 'income' ? c.type === 'income' : c.type === 'expense')
  );

  const handleTypeChange = (newType) => {
    setType(newType);
    // Auto-select first matching category
    const matching = CATEGORIES.find((c) => (newType === 'income' ? c.type === 'income' : c.type === 'expense'));
    if (matching) {
      setCategory(matching.name);
    }
  };

  const handleSave = async () => {
    const validation = validateTransaction({
      title,
      amount,
      type,
      category,
      date,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await addTransaction({
        title,
        amount,
        type,
        category,
        date,
        description,
      });

      // Reset form
      setTitle('');
      setAmount('');
      setDescription('');
      setDate(getTodayString());
      setErrors({});
      onClose();
    } catch (e) {
      console.error('Failed to add transaction:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.modalTitle}>Add Transaction</Text>
              <Text style={styles.modalSubTitle}>Record a new income or expense</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Income / Expense Segmented Control */}
            <View style={styles.typeSelectorContainer}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleTypeChange('expense')}
                style={[
                  styles.typeTab,
                  type === 'expense' && styles.activeExpenseTab,
                ]}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={18}
                  color={type === 'expense' ? colors.textLight : colors.expense}
                />
                <Text
                  style={[
                    styles.typeTabText,
                    type === 'expense' && styles.activeTypeTabText,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleTypeChange('income')}
                style={[
                  styles.typeTab,
                  type === 'income' && styles.activeIncomeTab,
                ]}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={18}
                  color={type === 'income' ? colors.textLight : colors.income}
                />
                <Text
                  style={[
                    styles.typeTabText,
                    type === 'income' && styles.activeTypeTabText,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Title Input */}
            <CustomInput
              label="Transaction Title *"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              placeholder="e.g. Grocery Shopping, Client Invoice"
              icon="document-text-outline"
              error={errors.title}
            />

            {/* Amount Input */}
            <CustomInput
              label="Amount (₹) *"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount) setErrors({ ...errors, amount: null });
              }}
              placeholder="e.g. 1500"
              keyboardType="numeric"
              icon="cash-outline"
              error={errors.amount}
            />

            {/* Category Selector */}
            <View style={styles.categorySection}>
              <Text style={styles.inputLabel}>Select Category *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {availableCategories.map((cat) => {
                  const isSelected = category === cat.name;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        setCategory(cat.name);
                        if (errors.category) setErrors({ ...errors, category: null });
                      }}
                      style={[
                        styles.categoryChip,
                        isSelected && { borderColor: cat.color, backgroundColor: cat.bgColor },
                      ]}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={18}
                        color={isSelected ? cat.color : colors.textSecondary}
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          isSelected && { color: cat.color, fontWeight: '700' },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {errors.category ? (
                <Text style={styles.errorText}>{errors.category}</Text>
              ) : null}
            </View>

            {/* Date Input */}
            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <CustomInput
                  label="Date (YYYY-MM-DD) *"
                  value={date}
                  onChangeText={(text) => {
                    setDate(text);
                    if (errors.date) setErrors({ ...errors, date: null });
                  }}
                  placeholder="YYYY-MM-DD"
                  icon="calendar-outline"
                  error={errors.date}
                />
              </View>
              <TouchableOpacity
                style={styles.todayButton}
                onPress={() => setDate(getTodayString())}
              >
                <Text style={styles.todayButtonText}>Today</Text>
              </TouchableOpacity>
            </View>

            {/* Description (Optional) */}
            <CustomInput
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Add personal notes or remarks..."
              icon="create-outline"
              multiline
              numberOfLines={2}
            />

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={onClose}
                style={styles.cancelBtn}
              />
              <CustomButton
                title="Save Transaction"
                variant="primary"
                loading={isSubmitting}
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '90%',
    ...shadows.elevated,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  modalSubTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.lg,
    padding: 4,
    marginBottom: 18,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  activeExpenseTab: {
    backgroundColor: colors.expense,
  },
  activeIncomeTab: {
    backgroundColor: colors.primary,
  },
  typeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTypeTabText: {
    color: colors.textLight,
    fontWeight: '700',
  },
  categorySection: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  categoryScroll: {
    paddingVertical: 4,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  categoryChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  todayButton: {
    marginTop: 26,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.6,
  },
  errorText: {
    fontSize: 12,
    color: colors.expense,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default AddTransactionModal;

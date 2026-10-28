import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';
import { formatCurrency } from '../utils/currency';
import { CATEGORIES } from '../data/demoData';

export const FeedbackModal = ({
  visible,
  type = 'success', // 'success' | 'delete' | 'profile' | 'confirm' | 'signout'
  title,
  message,
  transaction,
  buttonText = 'OK',
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!visible) return null;

  const isConfirm = type === 'confirm' || type === 'signout';
  const isSignOut = type === 'signout';
  const isDelete = type === 'delete';
  const isProfile = type === 'profile';

  // Clean, minimal badge icon configuration
  const getBadgeConfig = () => {
    if (isSignOut) {
      return {
        icon: 'log-out-outline',
        iconColor: '#E11D48',
        bgColor: '#FFE4E6',
      };
    }
    if (type === 'confirm') {
      return {
        icon: 'alert-circle-outline',
        iconColor: '#D97706',
        bgColor: '#FEF3C7',
      };
    }
    if (isDelete) {
      return {
        icon: 'trash-outline',
        iconColor: '#DC2626',
        bgColor: '#FEE2E2',
      };
    }
    if (isProfile) {
      return {
        icon: 'checkmark-circle-outline',
        iconColor: '#059669',
        bgColor: '#ECFDF5',
      };
    }
    return {
      icon: 'checkmark-circle-outline',
      iconColor: colors.primary,
      bgColor: colors.primaryLight,
    };
  };

  const badgeConfig = getBadgeConfig();

  // Matched category for transaction preview
  const matchedCategory = transaction
    ? CATEGORIES.find((c) => c.name === transaction.category) || {
        icon: 'card-outline',
        color: colors.primary,
        bgColor: colors.primaryLight,
      }
    : null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.dialogCard, shadows.elevated]}>
          {/* Minimalist Icon Circle */}
          <View
            style={[
              styles.emblemCircle,
              { backgroundColor: badgeConfig.bgColor },
            ]}
          >
            <Ionicons
              name={badgeConfig.icon}
              size={26}
              color={badgeConfig.iconColor}
            />
          </View>

          {/* Clean Title */}
          <Text style={styles.title}>{title || 'Success'}</Text>

          {/* Simple Clean Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Transaction Mini Preview if applicable */}
          {transaction && (
            <View style={styles.txPreviewCard}>
              <View
                style={[
                  styles.txIconBox,
                  { backgroundColor: matchedCategory?.bgColor },
                ]}
              >
                <Ionicons
                  name={matchedCategory?.icon || 'receipt-outline'}
                  size={18}
                  color={matchedCategory?.color || colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle} numberOfLines={1}>
                  {transaction.title}
                </Text>
                <Text style={styles.txCategory}>
                  {transaction.category} • {transaction.date}
                </Text>
              </View>
              <View
                style={[
                  styles.txAmountPill,
                  {
                    backgroundColor:
                      transaction.type === 'income' ? '#ECFDF5' : '#FEF2F2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.txAmountText,
                    {
                      color:
                        transaction.type === 'income' ? '#059669' : '#DC2626',
                    },
                  ]}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </Text>
              </View>
            </View>
          )}

          {/* Clean Action Buttons */}
          {isConfirm ? (
            <View style={styles.confirmRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onClose}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>{cancelText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  onClose?.();
                  onConfirm?.();
                }}
                style={[
                  styles.confirmBtn,
                  { backgroundColor: isSignOut ? '#E11D48' : '#DC2626' },
                ]}
              >
                <Text style={styles.confirmBtnText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.okBtn}
            >
              <Text style={styles.okBtnText}>{buttonText || 'OK'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  dialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 310,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emblemCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  message: {
    fontSize: 13.5,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 19,
    paddingHorizontal: 4,
  },
  txPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 10,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  txIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  txCategory: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  txAmountPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  txAmountText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  okBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  cancelBtnText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

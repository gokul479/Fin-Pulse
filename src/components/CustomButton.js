import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius, shadows } from '../theme/spacing';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getContainerStyles = () => {
    const base = [styles.container];

    // Sizes
    if (size === 'sm') base.push(styles.smContainer);
    else if (size === 'lg') base.push(styles.lgContainer);
    else base.push(styles.mdContainer);

    // Variants
    if (variant === 'primary') {
      base.push(styles.primaryContainer);
      if (!disabled) base.push(shadows.primary);
    } else if (variant === 'secondary') {
      base.push(styles.secondaryContainer);
    } else if (variant === 'outline') {
      base.push(styles.outlineContainer);
    } else if (variant === 'danger') {
      base.push(styles.dangerContainer);
    } else if (variant === 'ghost') {
      base.push(styles.ghostContainer);
    }

    if (disabled) {
      base.push(styles.disabledContainer);
    }

    if (style) base.push(style);
    return base;
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (variant === 'primary' || variant === 'danger') return colors.textLight;
    if (variant === 'secondary' || variant === 'outline' || variant === 'ghost') return colors.primary;
    return colors.textPrimary;
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyles()}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={textColor} style={styles.leftIcon} />
          )}
          <Text style={[styles.text, { color: textColor }, size === 'sm' && styles.smText, size === 'lg' && styles.lgText, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={textColor} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  // Sizes
  smContainer: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
  },
  mdContainer: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: borderRadius.lg,
  },
  lgContainer: {
    paddingVertical: 18,
    paddingHorizontal: 26,
    borderRadius: borderRadius.xl,
  },
  // Variants
  primaryContainer: {
    backgroundColor: colors.primary,
  },
  secondaryContainer: {
    backgroundColor: colors.primaryLight,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  dangerContainer: {
    backgroundColor: colors.expense,
  },
  ghostContainer: {
    backgroundColor: 'transparent',
  },
  disabledContainer: {
    backgroundColor: colors.borderLight,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  // Text Styles
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  smText: {
    fontSize: 13,
    fontWeight: '600',
  },
  lgText: {
    fontSize: 17,
    fontWeight: '700',
  },
});

export default CustomButton;

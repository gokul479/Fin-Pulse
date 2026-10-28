import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

export const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
  rightIcon,
  onRightIconPress,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.focusedWrapper,
          error ? styles.errorWrapper : null,
          !editable && styles.disabledWrapper,
          multiline && styles.multilineWrapper,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? colors.expense : isFocused ? colors.primary : colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, multiline && styles.multilineInput, inputStyle]}
        />

        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIconButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity
            style={styles.rightIconButton}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  focusedWrapper: {
    borderColor: colors.primary,
    backgroundColor: '#FAFCFB',
  },
  errorWrapper: {
    borderColor: colors.expense,
  },
  disabledWrapper: {
    backgroundColor: colors.borderLight,
    borderColor: colors.border,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingVertical: 12,
    minHeight: 90,
  },
  leftIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 12,
  },
  multilineInput: {
    paddingVertical: 0,
    textAlignVertical: 'top',
  },
  rightIconButton: {
    padding: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.expense,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
});

export default CustomInput;

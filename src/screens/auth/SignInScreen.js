import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { validateSignIn } from '../../utils/validation';

export const SignInScreen = ({ navigation }) => {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setApiError('');
    const validation = validateSignIn({ email, password });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await signIn(email, password);
    setLoading(false);

    if (!result.success) {
      setApiError(result.error);
    }
    // Note: On success, AuthContext triggers currentUser update and RootNavigator automatically navigates!
  };

  const handleFillDemo = (role) => {
    setApiError('');
    setErrors({});
    if (role === 'customer') {
      setEmail('customer@example.com');
      setPassword('password123');
    } else if (role === 'kishore') {
      setEmail('kishore@example.com');
      setPassword('password123');
    } else {
      setEmail('admin@example.com');
      setPassword('adminpassword');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Welcome Back 👋</Text>
            <Text style={styles.subTitle}>
              Sign in to manage your budget, track transactions & view insights.
            </Text>
          </View>

          {/* Quick Demo Fill Buttons */}
          <View style={styles.demoFillContainer}>
            <Text style={styles.demoFillLabel}>Quick Test Accounts:</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.demoChip, { borderColor: colors.primary }]}
                onPress={() => handleFillDemo('customer')}
              >
                <Ionicons name="person-outline" size={14} color={colors.primary} />
                <Text style={[styles.demoChipText, { color: colors.primary }]}>
                  Priya
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoChip, { borderColor: colors.secondary }]}
                onPress={() => handleFillDemo('kishore')}
              >
                <Ionicons name="person-outline" size={14} color={colors.secondary} />
                <Text style={[styles.demoChipText, { color: colors.secondary }]}>
                  Kishore
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.demoChip, { borderColor: '#1E3A8A' }]}
                onPress={() => handleFillDemo('admin')}
              >
                <Ionicons name="shield-outline" size={14} color="#1E3A8A" />
                <Text style={[styles.demoChipText, { color: '#1E3A8A' }]}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Global error banner */}
          {apiError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.expense} />
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formCard}>
            <CustomInput
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="e.g. customer@example.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <CustomButton
              title="Sign In"
              variant="primary"
              size="lg"
              loading={loading}
              onPress={handleSignIn}
              style={styles.signInButton}
            />
          </View>

          {/* Switch to Sign Up */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  demoFillContainer: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  demoFillLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    backgroundColor: '#FAFCFB',
    gap: 6,
  },
  demoChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.expenseBg,
    padding: 12,
    borderRadius: borderRadius.lg,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.expense,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...shadows.card,
  },
  signInButton: {
    marginTop: 10,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default SignInScreen;

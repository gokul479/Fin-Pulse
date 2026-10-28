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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { UserAvatar } from '../../components/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { validateSignUp } from '../../utils/validation';

export const SignUpScreen = ({ navigation }) => {
  const { signUp, completeSignUpLogin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // 'customer' | 'admin'
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Custom Creative Celebration Modal States
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [newRegisteredUser, setNewRegisteredUser] = useState(null);

  const handleSignUp = async () => {
    setApiError('');
    const validation = validateSignUp({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await signUp(
      {
        name,
        email,
        password,
        role,
        phone,
        occupation,
      },
      false // false: don't auto-redirect immediately, show our creative modal first!
    );

    setLoading(false);

    if (!result.success) {
      setApiError(result.error);
      return;
    }

    // Trigger the creative celebration overlay
    setNewRegisteredUser(result.user);
    setSuccessModalVisible(true);
  };

  const handleLaunchDashboard = async () => {
    setSuccessModalVisible(false);
    if (newRegisteredUser) {
      await completeSignUpLogin(newRegisteredUser);
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
            <Text style={styles.title}>Create Account 🚀</Text>
            <Text style={styles.subTitle}>
              Join FinPulse to take complete charge of your expenses.
            </Text>
          </View>

          {/* Role Selection Tabs */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>Select User Role *</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'customer' && styles.activeCustomerRole,
                ]}
                onPress={() => setRole('customer')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'customer' ? colors.textLight : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'customer' && styles.activeRoleText,
                  ]}
                >
                  Customer Role
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'admin' && styles.activeAdminRole,
                ]}
                onPress={() => setRole('admin')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="shield"
                  size={16}
                  color={role === 'admin' ? colors.textLight : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.roleButtonText,
                    role === 'admin' && styles.activeRoleText,
                  ]}
                >
                  Admin Role
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* API Error Banner */}
          {apiError ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color={colors.expense} />
              <Text style={styles.errorBannerText}>{apiError}</Text>
            </View>
          ) : null}

          {/* Form Card */}
          <View style={styles.formCard}>
            <CustomInput
              label="Full Name *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="e.g. Priya Sharma"
              icon="person-outline"
              error={errors.name}
            />

            <CustomInput
              label="Email Address *"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="e.g. priya@example.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
            />

            <CustomInput
              label="Occupation / Title"
              value={occupation}
              onChangeText={setOccupation}
              placeholder="e.g. Software Engineer / Consultant"
              icon="briefcase-outline"
            />

            <CustomInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="e.g. +91 98765 43210"
              keyboardType="phone-pad"
              icon="call-outline"
            />

            <CustomInput
              label="Password *"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              placeholder="Minimum 4 characters"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password *"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              placeholder="Re-enter password"
              secureTextEntry
              icon="shield-checkmark-outline"
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Create Account"
              variant="primary"
              size="lg"
              loading={loading}
              onPress={handleSignUp}
              style={styles.signUpBtn}
            />
          </View>

          {/* Switch to Sign In */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🌟 Creative In-App Account Created Celebration Modal 🌟 */}
      <Modal
        visible={successModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleLaunchDashboard}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.celebrationCard, shadows.elevated]}>
            {/* Celebration Icon Header */}
            <View style={styles.celebrationBadgeContainer}>
              <View style={styles.celebrationIconBox}>
                <Ionicons name="sparkles" size={32} color="#FDE047" />
              </View>
              <View style={styles.verifiedCheckPill}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            </View>

            <Text style={styles.celebrationTitle}>Account Activated! 🎉</Text>
            <Text style={styles.celebrationSubtitle}>
              Welcome to the FinPulse Intelligent Wealth Engine
            </Text>

            {/* Personalized Virtual Pass Card */}
            <View style={styles.virtualPassCard}>
              <View style={styles.passTopRow}>
                <UserAvatar
                  user={newRegisteredUser}
                  size={46}
                  showBorder={true}
                  borderColor="#38BDF8"
                />
                <View style={styles.passUserCol}>
                  <Text style={styles.passName} numberOfLines={1}>
                    {newRegisteredUser?.name}
                  </Text>
                  <Text style={styles.passEmail} numberOfLines={1}>
                    {newRegisteredUser?.email}
                  </Text>
                </View>
                <View style={styles.passBadge}>
                  <Text style={styles.passBadgeText}>
                    {newRegisteredUser?.role?.toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.passDivider} />

              <View style={styles.passBottomRow}>
                <View>
                  <Text style={styles.passMetaLabel}>MEMBER ID</Text>
                  <Text style={styles.passMetaValue}>
                    #FP-{newRegisteredUser?.id?.slice(-4) || '8492'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.passMetaLabel}>ACCOUNT STATUS</Text>
                  <View style={styles.activeStatusRow}>
                    <View style={styles.greenDot} />
                    <Text style={styles.activeStatusText}>VERIFIED</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Unlocked Benefits List */}
            <View style={styles.benefitsContainer}>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  Personalized Ledger & Month Tracking Active
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  Real-time Visual Analytics & Category Breakdowns
                </Text>
              </View>
              <View style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text style={styles.benefitText}>
                  Instant Transaction Alerts & Automated Reports
                </Text>
              </View>
            </View>

            {/* Launch Dashboard Button */}
            <CustomButton
              title="Launch My FinPulse Dashboard 🚀"
              variant="primary"
              size="lg"
              onPress={handleLaunchDashboard}
              style={styles.launchBtn}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleSection: {
    marginBottom: 16,
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
    marginTop: 4,
    lineHeight: 20,
  },
  roleContainer: {
    marginBottom: 18,
  },
  roleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.lg,
    padding: 4,
    gap: 4,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  activeCustomerRole: {
    backgroundColor: colors.primary,
  },
  activeAdminRole: {
    backgroundColor: '#2563EB',
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeRoleText: {
    color: colors.textLight,
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
    borderColor: '#E2E8F0',
    ...shadows.card,
  },
  signUpBtn: {
    marginTop: 10,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  signInText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '700',
  },

  /* 🌟 Celebration Modal Styles 🌟 */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  celebrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  celebrationBadgeContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  celebrationIconBox: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1E1B4B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(253, 224, 71, 0.4)',
  },
  verifiedCheckPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  celebrationTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  celebrationSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  virtualPassCard: {
    width: '100%',
    backgroundColor: '#1E1B4B',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  passTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  passAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(79, 70, 229, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#818CF8',
  },
  passAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passUserCol: {
    flex: 1,
  },
  passName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  passEmail: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 2,
  },
  passBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  passBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#34D399',
  },
  passDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  passBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passMetaLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A5B4FC',
    letterSpacing: 0.5,
  },
  passMetaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  activeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  activeStatusText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#34D399',
  },
  benefitsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  launchBtn: {
    width: '100%',
  },
});

export default SignUpScreen;

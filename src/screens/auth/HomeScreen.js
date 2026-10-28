import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';
import { CustomButton } from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';

export const HomeScreen = ({ navigation }) => {
  const { signIn } = useAuth();

  const handleQuickCustomer = async () => {
    await signIn('customer@example.com', 'password123');
  };

  const handleQuickAdmin = async () => {
    await signIn('admin@example.com', 'adminpassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Brand Logo / Hero Icon */}
        <View style={styles.heroSection}>
          <View style={[styles.logoContainer, shadows.primary]}>
            <Ionicons name="wallet" size={48} color={colors.textLight} />
          </View>

          <View style={styles.badgeContainer}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>Smart Financial Intelligence</Text>
          </View>

          <Text style={styles.title}>FinPulse</Text>
          <Text style={styles.titleHighlight}>Smart Budget Tracker</Text>

          <Text style={styles.description}>
            Empower your financial journey. Track real-time cashflow, analyze month-wise expenses,
            and monitor your financial health with intuitive analytics.
          </Text>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresRow}>
          <View style={styles.featurePill}>
            <Ionicons name="pie-chart-outline" size={16} color={colors.primary} />
            <Text style={styles.featurePillText}>Visual Analysis</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={styles.featurePillText}>Monthly Tracking</Text>
          </View>
          <View style={styles.featurePill}>
            <Ionicons name="document-text-outline" size={16} color={colors.primary} />
            <Text style={styles.featurePillText}>Daily/Weekly Reports</Text>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <View style={styles.buttonSection}>
          <CustomButton
            title="Sign In to Account"
            variant="primary"
            size="lg"
            icon="log-in-outline"
            onPress={() => navigation.navigate('SignIn')}
            style={styles.mainBtn}
          />

          <CustomButton
            title="Create New Account"
            variant="outline"
            size="lg"
            icon="person-add-outline"
            onPress={() => navigation.navigate('SignUp')}
            style={styles.secondaryBtn}
          />
        </View>

        {/* Quick Demo Access Bar */}
        <View style={styles.demoSection}>
          <Text style={styles.demoHeading}>⚡ Instant Demo Evaluation</Text>
          <Text style={styles.demoSubHeading}>
            Tap below to immediately test role-based dashboards:
          </Text>

          <View style={styles.demoButtonsRow}>
            <TouchableOpacity
              style={[styles.demoRoleCard, { borderColor: colors.primary }]}
              onPress={handleQuickCustomer}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconBox, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleCardTitle}>Customer Demo</Text>
                <Text style={styles.roleCardSub}>Priya Sharma</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.demoRoleCard, { borderColor: '#3B82F6' }]}
              onPress={handleQuickAdmin}
              activeOpacity={0.7}
            >
              <View style={[styles.roleIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="shield" size={20} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.roleCardTitle}>Admin Demo</Text>
                <Text style={styles.roleCardSub}>System Auditor</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          FinPulse v2.4 • Secure & Smart Personal Wealth Management
        </Text>
      </ScrollView>
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
    paddingTop: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    marginBottom: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleHighlight: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
    marginTop: 4,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 18,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  featurePillText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  buttonSection: {
    width: '100%',
    marginVertical: 10,
    gap: 12,
  },
  mainBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
    backgroundColor: colors.surface,
  },
  demoSection: {
    width: '100%',
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.subtle,
  },
  demoHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  demoSubHeading: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 2,
  },
  demoButtonsRow: {
    gap: 10,
  },
  demoRoleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    backgroundColor: '#FAFCFB',
    gap: 12,
  },
  roleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  roleCardSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footerNote: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 24,
    textAlign: 'center',
  },
});

export default HomeScreen;

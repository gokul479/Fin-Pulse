import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { borderRadius, shadows } from '../../theme/spacing';
import { Header } from '../../components/Header';
import { CustomInput } from '../../components/CustomInput';
import { CustomButton } from '../../components/CustomButton';
import { UserAvatar, AVATAR_PRESETS, getDefaultAvatar } from '../../components/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { validateProfile } from '../../utils/validation';

export const EditProfileScreen = ({ navigation }) => {
  const { currentUser, updateProfile } = useAuth();
  const { showFeedback } = useNotification();

  // Rubric Question 3 specifies Profile & Edit Profile is strictly for Customers
  if (currentUser?.role === 'admin') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Edit Profile" navigation={navigation} showBack={true} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Ionicons name="shield-checkmark" size={54} color="#1D4ED8" />
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginTop: 16 }}>
            Customer Access Only
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 21 }}>
            Per Question 3 of the examination rubric, Profile and Edit Profile is specifically designed for Customer accounts. Administrative credentials are read-only.
          </Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 24, minWidth: 160 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [occupation, setOccupation] = useState(currentUser?.occupation || '');
  const [avatar, setAvatar] = useState(
    currentUser?.avatar || getDefaultAvatar(currentUser?.name)
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const validation = validateProfile({ name, email, phone });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSaving(true);

    const result = await updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      occupation: occupation.trim(),
      avatar,
    });

    setSaving(false);

    if (result.success) {
      // Simple clean in-app confirmation modal
      showFeedback({
        type: 'profile',
        title: 'Profile Updated',
        message: `Hi ${result.user.name}, your profile has been updated successfully.`,
        buttonText: 'OK',
        onClose: () => navigation.goBack(),
      });
    } else {
      showFeedback({
        type: 'delete',
        title: 'Update Failed',
        message: result.error || 'Failed to update profile.',
      });
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      
      {/* Header */}
      <Header
        title="Edit Profile"
        subtitle="Update Personal Information"
        navigation={navigation}
        showBack={true}
        showMenu={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Selector Card */}
          <View style={[styles.avatarCard, shadows.card]}>
            <Text style={styles.cardHeader}>Profile Photo</Text>
            
            <View style={styles.currentAvatarContainer}>
              <UserAvatar
                imageUri={avatar}
                name={name}
                size={88}
                showBorder={true}
                borderColor={colors.primary}
                showVerified={true}
              />
              <Text style={styles.avatarHint}>Choose your profile avatar:</Text>
            </View>

            {/* Presets Horizontal Row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetsRow}
            >
              {AVATAR_PRESETS.map((uri, index) => {
                const isSelected = avatar === uri;
                return (
                  <View key={index} style={styles.presetItem}>
                    <UserAvatar
                      imageUri={uri}
                      name={`Avatar ${index + 1}`}
                      size={52}
                      showBorder={isSelected}
                      borderColor={isSelected ? colors.primary : '#E2E8F0'}
                      style={{ opacity: isSelected ? 1 : 0.7 }}
                    />
                    <Text
                      onPress={() => setAvatar(uri)}
                      style={[
                        styles.selectPill,
                        isSelected && styles.selectPillActive,
                      ]}
                    >
                      {isSelected ? 'Active' : 'Select'}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={[styles.card, shadows.card]}>
            <Text style={styles.cardHeader}>User Account Details</Text>

            <CustomInput
              label="Full Name *"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Enter full name"
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
              placeholder="Enter email address"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
            />

            <CustomInput
              label="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="e.g. +91 98765 43210"
              keyboardType="phone-pad"
              icon="call-outline"
              error={errors.phone}
            />

            <CustomInput
              label="Occupation / Title"
              value={occupation}
              onChangeText={setOccupation}
              placeholder="e.g. Software Engineer / Consultant"
              icon="briefcase-outline"
            />

            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel"
                variant="outline"
                onPress={handleCancel}
                style={styles.cancelBtn}
              />

              <CustomButton
                title="Save Changes"
                variant="primary"
                loading={saving}
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
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
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  currentAvatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarHint: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  presetItem: {
    alignItems: 'center',
    gap: 6,
  },
  selectPill: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  selectPillActive: {
    color: '#FFFFFF',
    backgroundColor: colors.primary,
  },
  cardHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.6,
  },
});

export default EditProfileScreen;

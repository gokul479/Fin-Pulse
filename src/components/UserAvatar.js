import React, { useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
];

export const getDefaultAvatar = (name, index = 0) => {
  if (name?.toLowerCase().includes('admin')) {
    return AVATAR_PRESETS[1]; // Professional supervisor
  }
  return AVATAR_PRESETS[index % AVATAR_PRESETS.length];
};

export const UserAvatar = ({
  user,
  imageUri,
  name,
  size = 48,
  showBorder = true,
  borderColor = colors.primary,
  showVerified = false,
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  const userName = name || user?.name || 'User';
  const uri =
    imageUri ||
    user?.avatar ||
    getDefaultAvatar(userName);

  // Initials generator
  const getInitials = (str) => {
    if (!str) return 'U';
    return str
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const borderRadius = size / 2;
  const fontSize = Math.max(12, Math.floor(size * 0.38));

  return (
    <View style={[{ width: size, height: size }, style]}>
      <View
        style={[
          styles.container,
          {
            width: size,
            height: size,
            borderRadius,
            borderWidth: showBorder ? 2 : 0,
            borderColor: borderColor || colors.primary,
            backgroundColor: colors.primaryLight,
          },
        ]}
      >
        {!hasError && uri ? (
          <Image
            source={{ uri }}
            style={{ width: '100%', height: '100%', borderRadius }}
            onError={() => setHasError(true)}
            resizeMode="cover"
          />
        ) : (
          <Text style={[styles.initials, { fontSize, color: colors.primary }]}>
            {getInitials(userName)}
          </Text>
        )}
      </View>

      {showVerified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: Math.max(16, size * 0.28),
              height: Math.max(16, size * 0.28),
              borderRadius: Math.max(8, size * 0.14),
            },
          ]}
        >
          <Ionicons
            name="checkmark"
            size={Math.max(10, size * 0.18)}
            color="#FFFFFF"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '800',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UserAvatar;

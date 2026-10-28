import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { borderRadius } from '../theme/spacing';

export const Header = ({
  title,
  subtitle,
  navigation,
  showBack = false,
  showMenu = true,
  rightAction,
  rightIcon,
  onRightPress,
  variant = 'light', // 'light' | 'emerald'
}) => {
  const insets = useSafeAreaInsets();
  const isEmerald = variant === 'emerald';

  const textColor = isEmerald ? colors.textLight : colors.textPrimary;
  const subTextColor = isEmerald ? '#93C5FD' : colors.textMuted;
  const iconColor = isEmerald ? colors.textLight : colors.textPrimary;
  const bgColor = isEmerald ? colors.primary : colors.surface;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top > 0 ? insets.top + 6 : 14, backgroundColor: bgColor },
        !isEmerald && styles.bottomBorder,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Left Action: Back or Menu */}
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              style={[styles.iconButton, isEmerald && styles.iconButtonEmerald]}
              onPress={() => navigation?.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color={iconColor} />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity
              style={[styles.iconButton, isEmerald && styles.iconButtonEmerald]}
              onPress={() => navigation?.openDrawer?.()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="menu-outline" size={26} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Center Title */}
        <View style={styles.centerContainer}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: subTextColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Right Action */}
        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : rightIcon ? (
            <TouchableOpacity
              style={[styles.iconButton, isEmerald && styles.iconButtonEmerald]}
              onPress={onRightPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name={rightIcon} size={22} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonEmerald: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});

export default Header;

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { CustomerStackNavigator } from './CustomerStackNavigator';
import { AdminDrawerNavigator } from './AdminDrawerNavigator';
import { colors } from '../theme/colors';

export const RootNavigator = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userRole === 'admin' ? (
        <AdminDrawerNavigator />
      ) : (
        <CustomerStackNavigator />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;

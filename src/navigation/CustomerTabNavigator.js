import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { CustomerDashboardScreen } from '../screens/customer/CustomerDashboardScreen';
import { AnalysisScreen } from '../screens/customer/AnalysisScreen';
import { TransactionsScreen } from '../screens/customer/TransactionsScreen';
import { CategoriesScreen } from '../screens/customer/CategoriesScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';

const Tab = createBottomTabNavigator();

export const CustomerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.floatingTabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Analysis') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
              <Ionicons
                name={iconName}
                size={focused ? 20 : 21}
                color={focused ? colors.primary : colors.textMuted}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={CustomerDashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{ tabBarLabel: 'Analysis' }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{ tabBarLabel: 'Ledger' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Categories' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 14,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 32,
    borderRadius: 16,
  },
  activeIconWrapper: {
    backgroundColor: colors.primaryLight,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: -2,
  },
});

export default CustomerTabNavigator;

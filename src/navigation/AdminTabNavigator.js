import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminCustomersScreen } from '../screens/admin/AdminCustomersScreen';
import { AnalysisScreen } from '../screens/customer/AnalysisScreen';
import { ReportsScreen } from '../screens/customer/ReportsScreen';

const Tab = createBottomTabNavigator();

export const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="AdminDashboardTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.floatingTabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'AdminDashboardTab') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'AdminCustomersTab') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'AdminAnalysisTab') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'AdminReportsTab') {
            iconName = focused ? 'document-text' : 'document-text-outline';
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
        name="AdminDashboardTab"
        component={AdminDashboardScreen}
        options={{ tabBarLabel: 'Hub' }}
      />
      <Tab.Screen
        name="AdminCustomersTab"
        component={AdminCustomersScreen}
        options={{ tabBarLabel: 'Customers' }}
      />
      <Tab.Screen
        name="AdminAnalysisTab"
        component={AnalysisScreen}
        options={{ tabBarLabel: 'Analysis' }}
      />
      <Tab.Screen
        name="AdminReportsTab"
        component={ReportsScreen}
        options={{ tabBarLabel: 'Reports' }}
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
    fontSize: 10.5,
    fontWeight: '700',
    marginTop: -2,
  },
});

export default AdminTabNavigator;

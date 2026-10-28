import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AdminTabNavigator } from './AdminTabNavigator';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminCustomersScreen } from '../screens/admin/AdminCustomersScreen';
import { AnalysisScreen } from '../screens/customer/AnalysisScreen';
import { TransactionsScreen } from '../screens/customer/TransactionsScreen';
import { ReportsScreen } from '../screens/customer/ReportsScreen';
import { CategoriesScreen } from '../screens/customer/CategoriesScreen';
import { CategoryDetailsScreen } from '../screens/customer/CategoryDetailsScreen';
import { CustomDrawerContent } from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export const AdminDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="AdminTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="AdminTabs" component={AdminTabNavigator} />
      <Drawer.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Drawer.Screen name="AdminCustomers" component={AdminCustomersScreen} />
      <Drawer.Screen name="AdminAnalysis" component={AnalysisScreen} />
      <Drawer.Screen name="AdminTransactions" component={TransactionsScreen} />
      <Drawer.Screen name="AdminReports" component={ReportsScreen} />
      <Drawer.Screen name="AdminCategories" component={CategoriesScreen} />
      <Drawer.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
    </Drawer.Navigator>
  );
};

export default AdminDrawerNavigator;

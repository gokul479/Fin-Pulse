import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CustomerTabNavigator } from './CustomerTabNavigator';
import { ReportsScreen } from '../screens/customer/ReportsScreen';
import { CategoryDetailsScreen } from '../screens/customer/CategoryDetailsScreen';
import { EditProfileScreen } from '../screens/customer/EditProfileScreen';
import { AnalysisScreen } from '../screens/customer/AnalysisScreen';
import { TransactionsScreen } from '../screens/customer/TransactionsScreen';
import { CategoriesScreen } from '../screens/customer/CategoriesScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { CustomDrawerContent } from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export const CustomerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="CustomerTabs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="CustomerTabs" component={CustomerTabNavigator} />
      <Drawer.Screen name="Reports" component={ReportsScreen} />
      <Drawer.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Drawer.Screen name="EditProfile" component={EditProfileScreen} />
      <Drawer.Screen name="Analysis" component={AnalysisScreen} />
      <Drawer.Screen name="Transactions" component={TransactionsScreen} />
      <Drawer.Screen name="Categories" component={CategoriesScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

export default CustomerDrawerNavigator;

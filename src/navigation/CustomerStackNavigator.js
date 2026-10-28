import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDrawerNavigator } from './CustomerDrawerNavigator';
import { CategoryDetailsScreen } from '../screens/customer/CategoryDetailsScreen';
import { EditProfileScreen } from '../screens/customer/EditProfileScreen';
import { ReportsScreen } from '../screens/customer/ReportsScreen';

const Stack = createNativeStackNavigator();

export const CustomerStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="DrawerRoot"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="DrawerRoot" component={CustomerDrawerNavigator} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
};

export default CustomerStackNavigator;

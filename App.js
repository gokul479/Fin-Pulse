import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { TransactionProvider } from './src/context/TransactionContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NotificationProvider>
          <TransactionProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </TransactionProvider>
        </NotificationProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_TRANSACTIONS, CATEGORIES } from '../data/demoData';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateNetBalance,
  calculateFinancialSummary,
  calculateCategoryTotals,
} from '../utils/calculations';

const TRANSACTIONS_STORAGE_KEY = '@finance_app_transactions_v1';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { currentUser, userRole } = useAuth();
  const { showFeedback, showConfirmDelete } = useNotification();
  const [allTransactions, setAllTransactions] = useState(INITIAL_TRANSACTIONS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [isTxLoading, setIsTxLoading] = useState(true);

  // Load transactions from AsyncStorage
  useEffect(() => {
    const loadStoredTransactions = async () => {
      try {
        const stored = await AsyncStorage.getItem(TRANSACTIONS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const existingIds = new Set(parsed.map((t) => t.id));
          const missing = INITIAL_TRANSACTIONS.filter((t) => !existingIds.has(t.id));
          const combined = [...parsed, ...missing];
          setAllTransactions(combined);
          if (missing.length > 0) {
            await AsyncStorage.setItem(
              TRANSACTIONS_STORAGE_KEY,
              JSON.stringify(combined)
            );
          }
        } else {
          await AsyncStorage.setItem(
            TRANSACTIONS_STORAGE_KEY,
            JSON.stringify(INITIAL_TRANSACTIONS)
          );
        }
      } catch (e) {
        console.error('Error loading stored transactions:', e);
      } finally {
        setIsTxLoading(false);
      }
    };

    loadStoredTransactions();
  }, []);

  // Save transactions helper
  const persistTransactions = async (newTransactions) => {
    try {
      await AsyncStorage.setItem(
        TRANSACTIONS_STORAGE_KEY,
        JSON.stringify(newTransactions)
      );
    } catch (e) {
      console.warn('Failed to save transactions to AsyncStorage:', e);
    }
  };

  // User-specific transactions (Admin sees all demo transactions; Customer sees only their own)
  const userTransactions =
    userRole === 'admin'
      ? allTransactions
      : allTransactions.filter(
          (t) => !currentUser || t.userId === currentUser.id
        );

  // Add Transaction
  const addTransaction = async (txData) => {
    const customerName = currentUser?.name || 'Customer';

    const newTx = {
      id: `tx-${Date.now()}`,
      userId: currentUser?.id || 'user-cust-1',
      title: txData.title.trim(),
      amount: Number(txData.amount),
      type: txData.type, // 'income' | 'expense'
      category: txData.category,
      date: txData.date, // 'YYYY-MM-DD'
      description: txData.description ? txData.description.trim() : '',
    };

    const updated = [newTx, ...allTransactions];
    setAllTransactions(updated);
    await persistTransactions(updated);

    // Clean in-app feedback
    showFeedback({
      type: 'success',
      title: 'Transaction Added',
      message: `Hi ${customerName}, your transaction "${newTx.title}" has been added successfully.`,
      transaction: newTx,
      buttonText: 'OK',
    });

    return { success: true, transaction: newTx };
  };

  // Update Transaction
  const updateTransaction = async (txId, updatedData) => {
    const customerName = currentUser?.name || 'Customer';

    const updated = allTransactions.map((tx) => {
      if (tx.id === txId) {
        return {
          ...tx,
          ...updatedData,
          amount: Number(updatedData.amount),
        };
      }
      return tx;
    });

    setAllTransactions(updated);
    await persistTransactions(updated);

    // Clean in-app feedback
    showFeedback({
      type: 'success',
      title: 'Transaction Updated',
      message: `Hi ${customerName}, your transaction has been updated successfully.`,
      buttonText: 'OK',
    });

    return { success: true };
  };

  // Delete Transaction with custom in-app confirmation
  const deleteTransaction = (txId) => {
    const customerName = currentUser?.name || 'Customer';
    const tx = allTransactions.find((t) => t.id === txId);

    showConfirmDelete({
      title: 'Delete Transaction Record',
      message: `Are you sure you want to remove "${tx?.title || 'this transaction'}"? This action cannot be reversed.`,
      onConfirm: async () => {
        const updated = allTransactions.filter((t) => t.id !== txId);
        setAllTransactions(updated);
        await persistTransactions(updated);

        // Clean in-app feedback
        showFeedback({
          type: 'delete',
          title: 'Transaction Removed',
          message: `Hi ${customerName}, your transaction has been removed successfully.`,
          transaction: tx,
          buttonText: 'OK',
        });
      },
    });
  };

  // Overall financial summary for current viewing context
  const currentSummary = calculateFinancialSummary(userTransactions);
  const currentCategoryTotals = calculateCategoryTotals(userTransactions, categories);

  // Helper: Retrieve transactions for a specific customer
  const getCustomerTransactions = (customerId) => {
    if (!customerId) return [];
    return allTransactions.filter((t) => t.userId === customerId);
  };

  // Helper: Calculate financial summary for a specific customer
  const getCustomerSummary = (customerId) => {
    const custTxs = getCustomerTransactions(customerId);
    return calculateFinancialSummary(custTxs);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions: userTransactions,
        allPlatformTransactions: allTransactions,
        categories,
        isTxLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        currentSummary,
        currentCategoryTotals,
        getCustomerTransactions,
        getCustomerSummary,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

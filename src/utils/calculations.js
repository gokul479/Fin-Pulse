/**
 * Financial Calculation Utilities
 * Accurately calculates Income, Expenses, Balance, Savings, Category breakdowns, and Report summaries.
 */

/**
 * Calculates total income from a list of transactions
 */
export const calculateTotalIncome = (transactions = []) => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

/**
 * Calculates total expense from a list of transactions
 */
export const calculateTotalExpenses = (transactions = []) => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

/**
 * Calculates net balance (Income - Expenses)
 */
export const calculateNetBalance = (transactions = []) => {
  const income = calculateTotalIncome(transactions);
  const expenses = calculateTotalExpenses(transactions);
  return income - expenses;
};

/**
 * Calculates financial summary object
 */
export const calculateFinancialSummary = (transactions = []) => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const netBalance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  return {
    totalIncome,
    totalExpenses,
    netBalance,
    savingsRate: Math.round(savingsRate),
    transactionCount: transactions.length,
  };
};

/**
 * Calculates spending breakdown by category
 */
export const calculateCategoryTotals = (transactions = [], predefinedCategories = []) => {
  const totalExpenses = calculateTotalExpenses(transactions);

  // Group expense transactions by category
  const categoryMap = {};

  predefinedCategories.forEach((cat) => {
    categoryMap[cat.name] = {
      ...cat,
      totalAmount: 0,
      transactionCount: 0,
      percentage: 0,
      transactions: [],
    };
  });

  transactions.forEach((tx) => {
    const catName = tx.category || 'Other';
    if (!categoryMap[catName]) {
      categoryMap[catName] = {
        name: catName,
        icon: 'ellipsis-horizontal-circle-outline',
        color: '#64748B',
        bgColor: '#F1F5F9',
        totalAmount: 0,
        transactionCount: 0,
        percentage: 0,
        transactions: [],
      };
    }

    if (tx.type === 'expense') {
      categoryMap[catName].totalAmount += Number(tx.amount) || 0;
    }
    categoryMap[catName].transactionCount += 1;
    categoryMap[catName].transactions.push(tx);
  });

  // Calculate percentages
  const result = Object.values(categoryMap).map((cat) => {
    const pct = totalExpenses > 0 ? (cat.totalAmount / totalExpenses) * 100 : 0;
    return {
      ...cat,
      percentage: Math.round(pct * 10) / 10, // 1 decimal place
    };
  });

  // Sort by total amount descending
  return result.sort((a, b) => b.totalAmount - a.totalAmount);
};

/**
 * Filter transactions for specific report types: Daily, Weekly, Monthly
 */
export const getFilteredReportData = (transactions = [], reportType = 'monthly', targetDate = new Date()) => {
  const { isSameDay, isWithinSevenDays, isWithinCurrentMonth, getTodayString } = require('./dateHelpers');

  let filtered = [];

  if (reportType === 'daily') {
    const todayStr = getTodayString();
    filtered = transactions.filter((t) => isSameDay(t.date, todayStr));
  } else if (reportType === 'weekly') {
    filtered = transactions.filter((t) => isWithinSevenDays(t.date, targetDate));
  } else {
    // monthly
    filtered = transactions.filter((t) => isWithinCurrentMonth(t.date, targetDate));
  }

  const summary = calculateFinancialSummary(filtered);

  return {
    transactions: filtered,
    summary,
    totalIncome: summary.totalIncome,
    totalExpenses: summary.totalExpenses,
    netBalance: summary.netBalance,
    transactionCount: filtered.length,
  };
};

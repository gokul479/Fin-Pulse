/**
 * Utility functions for Indian Rupee currency formatting
 */

export const formatCurrency = (amount, showSymbol = true) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }
  
  const num = Math.abs(Number(amount));
  // Format to Indian numbering system (e.g. 1,00,000)
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  const sign = amount < 0 ? '-' : '';
  return showSymbol ? `${sign}₹${formatted}` : `${sign}${formatted}`;
};

export const formatAmountWithSign = (amount, type) => {
  const formatted = formatCurrency(Math.abs(amount));
  if (type === 'income') {
    return `+${formatted}`;
  } else if (type === 'expense') {
    return `-${formatted}`;
  }
  return formatted;
};

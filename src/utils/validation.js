/**
 * Form Validation Utilities
 */

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return true; // Optional field
  const cleanPhone = phone.replace(/[\s-()]/g, '');
  return cleanPhone.length >= 7 && /^\+?[0-9]{7,15}$/.test(cleanPhone);
};

export const validateSignUp = ({ name, email, password, confirmPassword, role }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!role || (role !== 'admin' && role !== 'customer')) {
    errors.role = 'Please select a valid role (Admin or Customer)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateSignIn = ({ email, password }) => {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateProfile = ({ name, email, phone }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Full name is required';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (phone && !isValidPhone(phone)) {
    errors.phone = 'Please enter a valid phone number (7-15 digits)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateTransaction = ({ title, amount, type, category, date }) => {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Transaction title is required';
  }

  const numericAmount = Number(amount);
  if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
    errors.amount = 'Please enter a valid positive amount greater than 0';
  }

  if (!type || (type !== 'income' && type !== 'expense')) {
    errors.type = 'Please select either Income or Expense';
  }

  if (!category || !category.trim()) {
    errors.category = 'Please select a category';
  }

  if (!date || !date.trim()) {
    errors.date = 'Date is required';
  } else {
    const parts = date.split('-');
    if (parts.length !== 3 || isNaN(new Date(date).getTime())) {
      errors.date = 'Please enter a valid date (YYYY-MM-DD)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

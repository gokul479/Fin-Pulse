import React, { createContext, useContext, useState } from 'react';
import { Keyboard } from 'react-native';
import { FeedbackModal } from '../components/FeedbackModal';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: 'success', // 'success' | 'delete' | 'profile' | 'confirm' | 'signout'
    title: '',
    message: '',
    transaction: null,
    onConfirm: null,
    onClose: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    buttonText: 'OK',
  });

  const hideFeedback = () => {
    const callback = modalConfig.onClose;
    setModalConfig((prev) => ({ ...prev, visible: false, onClose: null }));
    if (callback && typeof callback === 'function') {
      callback();
    }
  };

  const showFeedback = ({
    type = 'success',
    title = 'Operation Successful',
    message = '',
    transaction = null,
    buttonText = 'OK',
    onClose = null,
  }) => {
    Keyboard.dismiss();
    setModalConfig({
      visible: true,
      type,
      title,
      message,
      transaction,
      onConfirm: null,
      onClose,
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      buttonText,
    });
  };

  const showConfirm = ({
    type = 'confirm',
    title = 'Confirmation Required',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
  }) => {
    Keyboard.dismiss();
    setModalConfig({
      visible: true,
      type,
      title,
      message,
      transaction: null,
      onConfirm,
      onClose: null,
      confirmText,
      cancelText,
      buttonText: 'OK',
    });
  };

  const showConfirmDelete = ({ title, message, onConfirm }) => {
    showConfirm({
      type: 'confirm',
      title: title || 'Delete Transaction Record',
      message: message || 'Are you sure you want to remove this transaction? This action cannot be reversed.',
      confirmText: 'Delete Record',
      cancelText: 'Cancel',
      onConfirm,
    });
  };

  const showSignOutConfirm = ({ title, message, onConfirm }) => {
    showConfirm({
      type: 'signout',
      title: title || 'Sign Out Confirmation',
      message: message || 'Are you sure you want to sign out of your account?',
      confirmText: 'Sign Out',
      cancelText: 'Cancel',
      onConfirm,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        showFeedback,
        hideFeedback,
        showConfirm,
        showConfirmDelete,
        showSignOutConfirm,
      }}
    >
      {children}
      <FeedbackModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        transaction={modalConfig.transaction}
        buttonText={modalConfig.buttonText}
        onClose={hideFeedback}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

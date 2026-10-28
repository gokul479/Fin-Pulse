import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_USERS } from '../data/demoData';
import { getDefaultAvatar } from '../components/UserAvatar';

const AUTH_STORAGE_KEY = '@finance_app_users_v1';
const CURRENT_USER_KEY = '@finance_app_current_user_v1';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted users and session on startup
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        const storedCurrentUser = await AsyncStorage.getItem(CURRENT_USER_KEY);

        if (storedUsers) {
          const parsedUsers = JSON.parse(storedUsers);
          const withAvatars = parsedUsers.map((u, i) => {
            const initialMatch = INITIAL_USERS.find(
              (init) => init.id === u.id || init.email.toLowerCase() === u.email.toLowerCase()
            );
            return {
              ...u,
              avatar: u.avatar || initialMatch?.avatar || getDefaultAvatar(u.name, i),
            };
          });
          setUsers(withAvatars);
        } else {
          // Initialize storage with demo users
          await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
        }

        if (storedCurrentUser) {
          const parsedUser = JSON.parse(storedCurrentUser);
          const initialMatch = INITIAL_USERS.find(
            (init) => init.id === parsedUser.id || init.email.toLowerCase() === parsedUser.email.toLowerCase()
          );
          const userWithAvatar = {
            ...parsedUser,
            avatar: parsedUser.avatar || initialMatch?.avatar || getDefaultAvatar(parsedUser.name),
          };
          setCurrentUser(userWithAvatar);
        }
      } catch (e) {
        console.error('Error loading stored auth data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  // Sign In handler
  const signIn = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid email or password. Try customer@example.com / password123 or admin@example.com / adminpassword',
      };
    }

    setCurrentUser(user);
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist session to AsyncStorage:', e);
    }

    return {
      success: true,
      user,
    };
  };

  // Sign Up handler
  const signUp = async (
    { name, email, password, role = 'customer', phone = '', occupation = '' },
    autoLogin = true
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.',
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
      phone: phone ? phone.trim() : '+91 98765 00000',
      occupation: occupation ? occupation.trim() : (role === 'admin' ? 'Finance Administrator' : 'General Customer'),
      avatar: getDefaultAvatar(name, users.length),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUsers));
      if (autoLogin) {
        setCurrentUser(newUser);
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      }
    } catch (e) {
      console.warn('Failed to persist new user:', e);
    }

    return {
      success: true,
      user: newUser,
    };
  };

  // Update Profile handler
  const updateProfile = async (profileData) => {
    if (!currentUser) return { success: false, error: 'No active user session' };

    const updatedUser = {
      ...currentUser,
      ...profileData,
    };

    const updatedUsers = users.map((u) => (u.id === currentUser.id ? updatedUser : u));

    setCurrentUser(updatedUser);
    setUsers(updatedUsers);

    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUsers));
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('Failed to persist profile update:', e);
    }

    return {
      success: true,
      user: updatedUser,
    };
  };

  // Complete login after viewing celebration modal
  const completeSignUpLogin = async (user) => {
    setCurrentUser(user);
    try {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to persist session:', e);
    }
  };

  // Sign Out handler
  const signOut = async () => {
    setCurrentUser(null);
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (e) {
      console.warn('Failed to clear current user from AsyncStorage:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        isLoading,
        users,
        signIn,
        signUp,
        completeSignUpLogin,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

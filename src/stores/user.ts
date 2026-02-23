import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export const useUserStore = defineStore('user', () => {
  // Mock user state
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  // Initialize from local storage if available (simple persistence)
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    } catch (e) {
      console.error('Failed to parse user from local storage', e);
    }
  }

  function login(userData: User) {
    user.value = userData;
    isAuthenticated.value = true;
    localStorage.setItem('user', JSON.stringify(userData));
  }

  function logout() {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('user');
  }

  function updateProfile(updates: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updates };
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile
  };
});

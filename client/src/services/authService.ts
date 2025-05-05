import { User } from '../types';

// Mock API service for authentication
// In a real app, this would make actual API calls to your backend

export const authService = {
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          profilePic: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        });
      }, 500);
    });
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: userData.name || 'John Doe',
          email: userData.email || 'john.doe@example.com',
          profilePic: userData.profilePic || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          phone: userData.phone || ''
        });
      }, 500);
    });
  },
  
  // Login
  login: async (email: string, password: string): Promise<string> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          resolve('mock-jwt-token');
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  },
  
  // Register
  register: async (name: string, email: string, password: string): Promise<string> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (name && email && password) {
          resolve('mock-jwt-token');
        } else {
          reject(new Error('Invalid information'));
        }
      }, 800);
    });
  },
  
  // Google login
  googleLogin: async (): Promise<string> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('mock-google-jwt-token');
      }, 800);
    });
  }
};
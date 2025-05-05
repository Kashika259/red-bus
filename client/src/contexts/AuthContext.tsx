// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { authService } from '../services/authService';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   profilePic?: string;
//   phone?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   isAuthenticated: boolean;
//   login: (token: string) => Promise<void>;
//   logout: () => void;
//   googleLogin: () => Promise<void>;
//   updateUserProfile: (userData: Partial<User>) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   // Check if user is already logged in
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         setLoading(true);
//         const token = localStorage.getItem('token');
        
//         if (token) {
//           const userData = await authService.getUserProfile();
//           setUser(userData);
//         }
//       } catch (err) {
//         console.error('Authentication error:', err);
//         localStorage.removeItem('token');
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   const login = async (token: string) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Save token to localStorage
//       localStorage.setItem('token', token);
      
//       // Get user profile with the token
//       const userData = await authService.getUserProfile();
//       setUser(userData);
      
//       toast.success('Successfully logged in!');
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Login failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//       localStorage.removeItem('token');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.success('Successfully logged out');
//     navigate('/');
//   };

//   const googleLogin = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       // In a real implementation, this would redirect to Google OAuth
//       // For now, we'll simulate it with mock data
//       const mockToken = 'mock-google-token-12345';
//       await login(mockToken);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Google login failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateUserProfile = async (userData: Partial<User>) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const updatedUser = await authService.updateProfile(userData);
//       setUser(updatedUser);
      
//       toast.success('Profile updated successfully');
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         isAuthenticated: !!user,
//         login,
//         logout,
//         googleLogin,
//         updateUserProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !token) {
        setToken(storedToken);
      }
      if (storedToken && !username) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }
          const data = await response.json();
          setUsername(data.username || 'User');
        } catch (error) {
          console.error('Error fetching user info:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUsername(null);
        }
      }
    };
    initializeAuth();
  }, [token, username]);

  const login = (newToken: string, newUsername: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, username, login, logout }}>
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
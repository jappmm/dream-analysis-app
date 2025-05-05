import axios from 'axios';
import { API_URL } from '../config/constants';

// Local storage keys
const TOKEN_KEY = 'dream_analysis_token';
const USER_KEY = 'dream_analysis_user';

/**
 * Register a new user
 * @param {Object} userData - User data including name, email, password
 * @returns {Promise} Promise with user data
 */
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, userData);
    
    if (response.data.token) {
      // Store token and user data in local storage
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error en el registro';
    throw new Error(message);
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Promise with user data
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password
    });
    
    if (response.data.token) {
      // Store token and user data in local storage
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Credenciales incorrectas';
    throw new Error(message);
  }
};

/**
 * Logout user
 */
export const logout = () => {
  // Remove token and user data from local storage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get current user data
 * @returns {Object|null} User data or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Get authentication token
 * @returns {string|null} Token or null if not available
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set authentication header for axios requests
 */
export const setAuthHeader = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @returns {Promise} Promise with updated user data
 */
export const updateProfile = async (userData) => {
  try {
    setAuthHeader();
    const response = await axios.put(`${API_URL}/api/users/profile`, userData);
    
    // Update user data in local storage
    localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al actualizar perfil';
    throw new Error(message);
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Promise with success message
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    setAuthHeader();
    const response = await axios.post(`${API_URL}/api/users/change-password`, {
      currentPassword,
      newPassword
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al cambiar contraseña';
    throw new Error(message);
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Promise with success message
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/request-reset`, {
      email
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al solicitar restablecimiento';
    throw new Error(message);
  }
};

/**
 * Reset password with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Promise with success message
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/reset-password`, {
      token,
      newPassword
    });
    
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al restablecer contraseña';
    throw new Error(message);
  }
};

/**
 * Verify account with token
 * @param {string} token - Verification token
 * @returns {Promise} Promise with success message
 */
export const verifyAccount = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/verify/${token}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Error al verificar cuenta';
    throw new Error(message);
  }
};

/**
 * Check token validity
 * @returns {Promise} Promise resolving to boolean indicating if token is valid
 */
export const checkTokenValidity = async () => {
  try {
    setAuthHeader();
    await axios.get(`${API_URL}/api/users/check-token`);
    return true;
  } catch (error) {
    logout(); // Clear invalid token
    return false;
  }
};

// Initialize auth header on page load
setAuthHeader();

// Export all functions as default object
export default {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  setAuthHeader,
  isAuthenticated,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyAccount,
  checkTokenValidity
};
import apiClient from './axios';

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async (refreshToken) => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateProfile: async (display_name) => {
    const response = await apiClient.put('/settings/profile', { display_name });
    return response.data;
  },

  changePassword: async (current_password, new_password) => {
    const response = await apiClient.put('/settings/password', { current_password, new_password });
    return response.data;
  }
};

export default authApi;

import apiClient from './axios';

export const mailApi = {
  getFolderEmails: async (folder, limit = 50, skip = 0) => {
    const response = await apiClient.get(`/mail/folder/${folder}`, {
      params: { limit, skip }
    });
    return response.data;
  },

  getEmailDetail: async (id) => {
    const response = await apiClient.get(`/mail/detail/${id}`);
    return response.data;
  },

  sendEmail: async (data) => {
    const response = await apiClient.post('/mail/compose', data);
    return response.data;
  },

  saveDraft: async (data) => {
    const response = await apiClient.post('/mail/draft', data);
    return response.data;
  },

  moveEmails: async (emailIds, targetFolder) => {
    const response = await apiClient.post('/mail/move', {
      email_ids: emailIds,
      target_folder: targetFolder
    });
    return response.data;
  },

  flagEmails: async (emailIds, flags) => {
    const response = await apiClient.post('/mail/flag', {
      email_ids: emailIds,
      ...flags
    });
    return response.data;
  },

  purgeEmails: async (emailIds) => {
    const response = await apiClient.delete('/mail/purge', {
      params: { email_ids: emailIds }
    });
    return response.data;
  },

  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/mail/attachment/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  downloadAttachment: async (url) => {
    const response = await apiClient.get(url, {
      responseType: 'blob'
    });
    return response;
  },

  // Admin APIs
  adminListUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  adminCreateUser: async (userData) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  adminUpdateUser: async (id, userData) => {
    const response = await apiClient.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  adminDeleteUser: async (id) => {
    await apiClient.delete(`/admin/users/${id}`);
  }
};

export default mailApi;

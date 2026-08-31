import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  emails: [],
  selectedEmail: null,
  activeFolder: 'inbox', // 'inbox' | 'sent' | 'drafts' | 'trash' | 'archive'
  loading: false,
  error: null,
  searchQuery: '',
};

const mailSlice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    fetchEmailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchEmailsSuccess(state, action) {
      state.loading = false;
      state.emails = action.payload;
    },
    fetchEmailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    selectEmail(state, action) {
      state.selectedEmail = action.payload;
      // Also update inside emails array (mark as read)
      if (action.payload) {
        state.emails = state.emails.map(email =>
          email.id === action.payload.id ? { ...email, read: true } : email
        );
      }
    },
    setFolder(state, action) {
      state.activeFolder = action.payload;
      state.selectedEmail = null;
      state.emails = [];
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    markAsRead(state, action) {
      const { ids, read } = action.payload;
      state.emails = state.emails.map(email =>
        ids.includes(email.id) ? { ...email, read } : email
      );
      if (state.selectedEmail && ids.includes(state.selectedEmail.id)) {
        state.selectedEmail.read = read;
      }
    },
    toggleStar(state, action) {
      const id = action.payload;
      state.emails = state.emails.map(email =>
        email.id === id ? { ...email, starred: !email.starred } : email
      );
      if (state.selectedEmail && state.selectedEmail.id === id) {
        state.selectedEmail.starred = !state.selectedEmail.starred;
      }
    },
    removeEmails(state, action) {
      const ids = action.payload;
      state.emails = state.emails.filter(email => !ids.includes(email.id));
      if (state.selectedEmail && ids.includes(state.selectedEmail.id)) {
        state.selectedEmail = null;
      }
    }
  },
});

export const {
  fetchEmailsStart,
  fetchEmailsSuccess,
  fetchEmailsFailure,
  selectEmail,
  setFolder,
  setSearchQuery,
  markAsRead,
  toggleStar,
  removeEmails
} = mailSlice.actions;

export default mailSlice.reducer;

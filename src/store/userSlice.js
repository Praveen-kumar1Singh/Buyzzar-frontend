import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Store in localStorage
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('userInfo'); // Clear on logout
    },
  },
});

export const { setUserDetails, logout } = userSlice.actions;
export default userSlice.reducer;

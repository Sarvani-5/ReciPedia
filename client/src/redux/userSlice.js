// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: {
    name: 'Sakthi Sarvani',
    wallet: '0x742d...4e8f',
    avatar: '👨‍🍳',
  },
  isConnected: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    connectWallet: (state, action) => {
      state.currentUser = action.payload;
      state.isConnected = true;
    },
    disconnectWallet: (state) => {
      state.currentUser = null;
      state.isConnected = false;
    },
  },
});

export const { connectWallet, disconnectWallet } = userSlice.actions;
export default userSlice.reducer;
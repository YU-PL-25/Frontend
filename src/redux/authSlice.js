import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false, // True for testing purposes
    user: {
      id: 1,
      password: null,
      name: '홍길동',
      nickname: null,
      gender: null,
      email: 'hong@test.com',
      phone: '010-1234-5678',
      rank: 'S',
      mmr: {
        mmrId: 0,
        rating: 1600,
        winRate: 0.0,
        gamesPlayed: 0,
        winsCount: 0,
        tolerance: 200
      },
      profile: {
        profileId: 1,
        ageGroup: '20대',
        playStyle: '즐겜',
        gameType: '단식'
      },
      gameRoom: null,
      role: 'normal',
      currentGame: null,
      inGame: false
    },
    status: 'succeeded',
    error: null
  },
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

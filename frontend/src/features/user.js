import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    user: null,
};
const fetchUserByToken = createAsyncThunk(
    'users/fetchByTokenStatus',
    async (userId, thunkAPI) => {
      const response = await userAPI.fetchById(userId)
      return response.data
    },
  )
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetAuth: state => {
            state.isAuthenticated = false;
        },
    },
    extraReducers:builder=>{
        builder.addCase()
    }
})
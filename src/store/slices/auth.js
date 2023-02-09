import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params)
  return data
})

export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (params) => {
  const { data } = await axios.post('/auth/login', params)
  return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me')
  return data
})

const initialState = {
  user: null,
  status: 'loading'
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    // register
    builder.addCase(fetchRegister.pending, (state) => {
      state.user = null
      state.status = 'loading'
    })
    builder.addCase(fetchRegister.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.user = action.payload
    })
    builder.addCase(fetchRegister.rejected, (state) => {
      state.user = null
      state.status = 'error'
    })

    // login
    builder.addCase(fetchLogin.pending, (state) => {
      state.user = null
      state.status = 'loading'
    })
    builder.addCase(fetchLogin.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.user = action.payload
    })
    builder.addCase(fetchLogin.rejected, (state) => {
      state.user = null
      state.status = 'error'
    })

    // auth me
    builder.addCase(fetchAuthMe.pending, (state) => {
      state.user = null
      state.status = 'loading'
    })
    builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
      state.status = 'loaded'
      state.user = action.payload
    })
    builder.addCase(fetchAuthMe.rejected, (state) => {
      state.user = null
      state.status = 'error'
    })
  }
})

export const selectAuth = state => state.auth.user
 
export const { logout } = authSlice.actions

export default authSlice.reducer
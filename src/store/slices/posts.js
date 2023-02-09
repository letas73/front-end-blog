import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts')
  return data
})

export const fetchTags = createAsyncThunk('posts/fetchTags', async () => {
  const { data } = await axios.get('/tags')
  return data
})

export const fetchRemovePost = createAsyncThunk('posts/fetchRemovePost', (id) => {
  axios.delete(`posts/${id}`)
})

const initialState = {
  posts: {
    items: [],
    status: 'loading'
  },
  tags: {
    items: [],
    status: 'loading'
  }
}

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    // POSTS
    builder.addCase(fetchPosts.pending, (state) => {
      state.posts.status = 'loading'
    })
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts.status = 'loaded'
      state.posts.items = action.payload
    })
    builder.addCase(fetchPosts.rejected, (state) => {
      state.posts.items = []
      state.posts.status = 'error'
    })

    // TAGS
    builder.addCase(fetchTags.pending, (state) => {
      state.tags.status = 'loading'
    })
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.tags.status = 'loaded'
      state.tags.items = action.payload
    })
    builder.addCase(fetchTags.rejected, (state) => {
      state.tags.items = []
      state.tags.status = 'error'
    })

    // remove post
    builder.addCase(fetchRemovePost.pending, (state, action) => {
      state.posts.items = state.posts.items.filter((item) => item._id !== action.meta.arg)
    })
  }
})



export const { } = postsSlice.actions

export default postsSlice.reducer
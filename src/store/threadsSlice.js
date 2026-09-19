import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getThreads,
  createThread,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  getAllUsers,
} from '../api/api';

export const fetchThreads = createAsyncThunk('threads/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const [threadsData, usersData] = await Promise.all([getThreads(), getAllUsers()]);
    const usersMap = {};
    usersData.users.forEach((u) => {
      usersMap[u.id] = u;
    });
    return { threads: threadsData.threads, users: usersMap };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addThread = createAsyncThunk('threads/create', async (threadData, { rejectWithValue }) => {
  try {
    const data = await createThread(threadData);
    return data.thread;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const voteThread = createAsyncThunk(
  'threads/vote',
  async ({ threadId, voteType, userId }, { rejectWithValue, dispatch }) => {
    try {
      if (voteType === 'up') {
        await upVoteThread(threadId);
      } else if (voteType === 'down') {
        await downVoteThread(threadId);
      } else {
        await neutralVoteThread(threadId);
      }
      return { threadId, voteType, userId };
    } catch (error) {
      dispatch(revertVote({ threadId, userId }));
      return rejectWithValue(error.message);
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    list: [],
    users: {},
    selectedCategory: '',
    loading: false,
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    optimisticVote: (state, action) => {
      const { threadId, voteType, userId } = action.payload;
      const thread = state.list.find((t) => t.id === threadId);
      if (!thread) return;

      const alreadyUp = thread.upVotesBy.includes(userId);
      const alreadyDown = thread.downVotesBy.includes(userId);

      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);

      if (voteType === 'up' && !alreadyUp) {
        thread.upVotesBy.push(userId);
      } else if (voteType === 'down' && !alreadyDown) {
        thread.downVotesBy.push(userId);
      }
    },
    revertVote: (state, action) => {
      // In case of error, re-fetch will sync state
      console.error('Vote failed for thread', action.payload.threadId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.threads;
        state.users = action.payload.users;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addThread.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export const { setCategory, optimisticVote, revertVote } = threadsSlice.actions;

export const selectFilteredThreads = (state) => {
  const { list, selectedCategory } = state.threads;
  if (!selectedCategory) return list;
  return list.filter((t) => t.category === selectedCategory);
};

export const selectAllCategories = (state) => {
  const cats = new Set(state.threads.list.map((t) => t.category));
  return Array.from(cats);
};

export default threadsSlice.reducer;

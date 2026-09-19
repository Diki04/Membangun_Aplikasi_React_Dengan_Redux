import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getThreadDetail,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
} from '../api/api';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId, { rejectWithValue }) => {
    try {
      const data = await getThreadDetail(threadId);
      return data.detailThread;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const postComment = createAsyncThunk(
  'threadDetail/postComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const data = await createComment({ threadId, content });
      return data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const voteThreadDetail = createAsyncThunk(
  'threadDetail/vote',
  async ({ threadId, voteType }, { rejectWithValue }) => {
    try {
      if (voteType === 'up') {
        await upVoteThread(threadId);
      } else if (voteType === 'down') {
        await downVoteThread(threadId);
      } else {
        await neutralVoteThread(threadId);
      }
      return { voteType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({ threadId, commentId, voteType }, { rejectWithValue }) => {
    try {
      if (voteType === 'up') {
        await upVoteComment({ threadId, commentId });
      } else if (voteType === 'down') {
        await downVoteComment({ threadId, commentId });
      } else {
        await neutralVoteComment({ threadId, commentId });
      }
      return { commentId, voteType };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    thread: null,
    loading: false,
    error: null,
    commentLoading: false,
  },
  reducers: {
    clearDetail: (state) => {
      state.thread = null;
      state.error = null;
    },
    optimisticVoteThread: (state, action) => {
      if (!state.thread) return;
      const { voteType, userId } = action.payload;
      const thread = state.thread;
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
    optimisticVoteComment: (state, action) => {
      if (!state.thread) return;
      const { commentId, voteType, userId } = action.payload;
      const comment = state.thread.comments.find((c) => c.id === commentId);
      if (!comment) return;

      const alreadyUp = comment.upVotesBy.includes(userId);
      const alreadyDown = comment.downVotesBy.includes(userId);

      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);

      if (voteType === 'up' && !alreadyUp) {
        comment.upVotesBy.push(userId);
      } else if (voteType === 'down' && !alreadyDown) {
        comment.downVotesBy.push(userId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.thread = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postComment.pending, (state) => {
        state.commentLoading = true;
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.commentLoading = false;
        if (state.thread) {
          state.thread.comments.unshift(action.payload);
        }
      })
      .addCase(postComment.rejected, (state) => {
        state.commentLoading = false;
      });
  },
});

export const {
  clearDetail,
  optimisticVoteThread,
  optimisticVoteComment,
} = threadDetailSlice.actions;
export default threadDetailSlice.reducer;

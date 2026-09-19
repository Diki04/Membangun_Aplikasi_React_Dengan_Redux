/**
 * Test scenarios for threadDetailSlice reducer
 *
 * - threadDetailReducer function
 *   - should return the initial state when given an unknown action
 *   - should handle clearDetail action to reset thread detail
 *   - should handle optimisticVoteThread action for upvoting the thread
 *   - should handle optimisticVoteThread action for downvoting the thread
 *   - should toggle off upvote on thread when user already upvoted
 *   - should handle optimisticVoteComment action for upvoting a comment
 *   - should handle optimisticVoteComment action for downvoting a comment
 *   - should toggle off downvote on comment when user already downvoted
 *   - should not modify state if thread is null on optimisticVoteThread
 */

import { describe, it, expect } from 'vitest';
import threadDetailReducer, {
  clearDetail,
  optimisticVoteThread,
  optimisticVoteComment,
} from '../threadDetailSlice';

const initialState = {
  thread: null,
  loading: false,
  error: null,
  commentLoading: false,
};

const fakeThread = {
  id: 'thread-1',
  title: 'Test Thread',
  body: '<p>Thread body</p>',
  category: 'test',
  createdAt: '2023-01-01T00:00:00.000Z',
  owner: { id: 'user-1', name: 'User 1', avatar: 'https://example.com/avatar.png' },
  upVotesBy: [],
  downVotesBy: [],
  comments: [
    {
      id: 'comment-1',
      content: '<p>Comment body</p>',
      createdAt: '2023-01-01T01:00:00.000Z',
      owner: { id: 'user-2', name: 'User 2', avatar: 'https://example.com/avatar2.png' },
      upVotesBy: [],
      downVotesBy: [],
    },
  ],
};

describe('threadDetailReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    const state = threadDetailReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  it('should handle clearDetail action to reset thread detail', () => {
    const prevState = {
      ...initialState,
      thread: fakeThread,
      error: 'some error',
    };

    const state = threadDetailReducer(prevState, clearDetail());

    expect(state.thread).toBeNull();
    expect(state.error).toBeNull();
  });

  it('should handle optimisticVoteThread action for upvoting the thread', () => {
    const prevState = {
      ...initialState,
      thread: { ...fakeThread },
    };

    const state = threadDetailReducer(
      prevState,
      optimisticVoteThread({ voteType: 'up', userId: 'user-3' }),
    );

    expect(state.thread.upVotesBy).toContain('user-3');
    expect(state.thread.downVotesBy).not.toContain('user-3');
  });

  it('should handle optimisticVoteThread action for downvoting the thread', () => {
    const prevState = {
      ...initialState,
      thread: { ...fakeThread },
    };

    const state = threadDetailReducer(
      prevState,
      optimisticVoteThread({ voteType: 'down', userId: 'user-3' }),
    );

    expect(state.thread.downVotesBy).toContain('user-3');
    expect(state.thread.upVotesBy).not.toContain('user-3');
  });

  it('should toggle off upvote on thread when user already upvoted', () => {
    const prevState = {
      ...initialState,
      thread: { ...fakeThread, upVotesBy: ['user-3'] },
    };

    const state = threadDetailReducer(
      prevState,
      optimisticVoteThread({ voteType: 'neutral', userId: 'user-3' }),
    );

    expect(state.thread.upVotesBy).not.toContain('user-3');
  });

  it('should handle optimisticVoteComment action for upvoting a comment', () => {
    const prevState = {
      ...initialState,
      thread: {
        ...fakeThread,
        comments: [{ ...fakeThread.comments[0] }],
      },
    };

    const state = threadDetailReducer(
      prevState,
      optimisticVoteComment({ commentId: 'comment-1', voteType: 'up', userId: 'user-3' }),
    );

    expect(state.thread.comments[0].upVotesBy).toContain('user-3');
    expect(state.thread.comments[0].downVotesBy).not.toContain('user-3');
  });

  it('should handle optimisticVoteComment action for downvoting a comment', () => {
    const prevState = {
      ...initialState,
      thread: {
        ...fakeThread,
        comments: [{ ...fakeThread.comments[0] }],
      },
    };

    const state = threadDetailReducer(
      prevState,
      optimisticVoteComment({ commentId: 'comment-1', voteType: 'down', userId: 'user-3' }),
    );

    expect(state.thread.comments[0].downVotesBy).toContain('user-3');
  });

  it('should toggle off downvote on comment when user already downvoted', () => {
    const prevState = {
      ...initialState,
      thread: {
        ...fakeThread,
        comments: [{ ...fakeThread.comments[0], downVotesBy: ['user-3'] }],
      },
    };

    const state = threadDetailReducer(
      prevState,
      optimisticVoteComment({ commentId: 'comment-1', voteType: 'neutral', userId: 'user-3' }),
    );

    expect(state.thread.comments[0].downVotesBy).not.toContain('user-3');
    expect(state.thread.comments[0].upVotesBy).not.toContain('user-3');
  });

  it('should not modify state if thread is null on optimisticVoteThread', () => {
    const state = threadDetailReducer(
      initialState,
      optimisticVoteThread({ voteType: 'up', userId: 'user-3' }),
    );

    expect(state.thread).toBeNull();
  });
});

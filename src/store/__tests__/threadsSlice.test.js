/**
 * Test scenarios for threadsSlice reducer
 *
 * - threadsReducer function
 *   - should return the initial state when given an unknown action
 *   - should handle setCategory action to filter threads by category
 *   - should handle setCategory action to clear category filter
 *   - should handle optimisticVote action for upvoting a thread
 *   - should handle optimisticVote action for downvoting a thread
 *   - should toggle off upvote when user already upvoted (becomes neutral)
 *   - should toggle off downvote when user already downvoted (becomes neutral)
 *   - should switch from upvote to downvote
 */

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setCategory,
  optimisticVote,
} from '../threadsSlice';

const initialState = {
  list: [],
  users: {},
  selectedCategory: '',
  loading: false,
  error: null,
};

describe('threadsReducer', () => {
  it('should return the initial state when given an unknown action', () => {
    const state = threadsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  it('should handle setCategory action to filter threads by category', () => {
    const state = threadsReducer(initialState, setCategory('javascript'));

    expect(state.selectedCategory).toBe('javascript');
  });

  it('should handle setCategory action to clear category filter', () => {
    const prevState = { ...initialState, selectedCategory: 'react' };

    const state = threadsReducer(prevState, setCategory(''));

    expect(state.selectedCategory).toBe('');
  });

  it('should handle optimisticVote action for upvoting a thread', () => {
    const prevState = {
      ...initialState,
      list: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };

    const state = threadsReducer(
      prevState,
      optimisticVote({ threadId: 'thread-1', voteType: 'up', userId: 'user-1' }),
    );

    expect(state.list[0].upVotesBy).toContain('user-1');
    expect(state.list[0].downVotesBy).not.toContain('user-1');
  });

  it('should handle optimisticVote action for downvoting a thread', () => {
    const prevState = {
      ...initialState,
      list: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: [],
        },
      ],
    };

    const state = threadsReducer(
      prevState,
      optimisticVote({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' }),
    );

    expect(state.list[0].downVotesBy).toContain('user-1');
    expect(state.list[0].upVotesBy).not.toContain('user-1');
  });

  it('should toggle off upvote when user already upvoted (becomes neutral)', () => {
    const prevState = {
      ...initialState,
      list: [
        {
          id: 'thread-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };

    // When voteType is 'neutral', it removes user from both arrays
    const state = threadsReducer(
      prevState,
      optimisticVote({ threadId: 'thread-1', voteType: 'neutral', userId: 'user-1' }),
    );

    expect(state.list[0].upVotesBy).not.toContain('user-1');
    expect(state.list[0].downVotesBy).not.toContain('user-1');
  });

  it('should toggle off downvote when user already downvoted (becomes neutral)', () => {
    const prevState = {
      ...initialState,
      list: [
        {
          id: 'thread-1',
          upVotesBy: [],
          downVotesBy: ['user-1'],
        },
      ],
    };

    const state = threadsReducer(
      prevState,
      optimisticVote({ threadId: 'thread-1', voteType: 'neutral', userId: 'user-1' }),
    );

    expect(state.list[0].downVotesBy).not.toContain('user-1');
    expect(state.list[0].upVotesBy).not.toContain('user-1');
  });

  it('should switch from upvote to downvote', () => {
    const prevState = {
      ...initialState,
      list: [
        {
          id: 'thread-1',
          upVotesBy: ['user-1'],
          downVotesBy: [],
        },
      ],
    };

    const state = threadsReducer(
      prevState,
      optimisticVote({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' }),
    );

    expect(state.list[0].downVotesBy).toContain('user-1');
    expect(state.list[0].upVotesBy).not.toContain('user-1');
  });
});

/**
 * Test scenarios for threads thunk functions
 *
 * - fetchThreads thunk
 *   - should dispatch fulfilled with threads and users when API call succeeds
 *   - should dispatch rejected with error message when API call fails
 *
 * - addThread thunk
 *   - should dispatch fulfilled with new thread data when API call succeeds
 *   - should dispatch rejected with error message when API call fails
 *
 * - voteThread thunk
 *   - should dispatch fulfilled with vote data when upvote API call succeeds
 *   - should dispatch fulfilled with vote data when downvote API call succeeds
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, { fetchThreads, addThread, voteThread } from '../threadsSlice';

// Mock the API module
vi.mock('../../api/api', () => ({
  getThreads: vi.fn(),
  getAllUsers: vi.fn(),
  createThread: vi.fn(),
  upVoteThread: vi.fn(),
  downVoteThread: vi.fn(),
  neutralVoteThread: vi.fn(),
}));

// Import mocked functions
import * as api from '../../api/api';

function createTestStore(preloadedState) {
  return configureStore({
    reducer: { threads: threadsReducer },
    preloadedState: preloadedState ? { threads: preloadedState } : undefined,
  });
}

describe('threads thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchThreads', () => {
    it('should dispatch fulfilled with threads and users when API call succeeds', async () => {
      const fakeThreads = [
        {
          id: 'thread-1',
          title: 'Thread 1',
          body: 'Body 1',
          category: 'test',
          createdAt: '2023-01-01T00:00:00.000Z',
          ownerId: 'user-1',
          upVotesBy: [],
          downVotesBy: [],
          totalComments: 0,
        },
      ];
      const fakeUsers = [
        { id: 'user-1', name: 'User 1', email: 'user1@test.com', avatar: 'https://avatar.com/1' },
      ];

      api.getThreads.mockResolvedValue({ threads: fakeThreads });
      api.getAllUsers.mockResolvedValue({ users: fakeUsers });

      const store = createTestStore();

      await store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.list).toEqual(fakeThreads);
      expect(state.users['user-1']).toEqual(fakeUsers[0]);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should dispatch rejected with error message when API call fails', async () => {
      api.getThreads.mockRejectedValue(new Error('Network error'));
      api.getAllUsers.mockResolvedValue({ users: [] });

      const store = createTestStore();

      await store.dispatch(fetchThreads());

      const state = store.getState().threads;
      expect(state.error).toBe('Network error');
      expect(state.loading).toBe(false);
    });
  });

  describe('addThread', () => {
    it('should dispatch fulfilled with new thread data when API call succeeds', async () => {
      const newThread = {
        id: 'thread-new',
        title: 'New Thread',
        body: 'New Body',
        category: 'general',
        createdAt: '2023-01-02T00:00:00.000Z',
        ownerId: 'user-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      };

      api.createThread.mockResolvedValue({ thread: newThread });

      const store = createTestStore();

      await store.dispatch(addThread({ title: 'New Thread', body: 'New Body', category: 'general' }));

      const state = store.getState().threads;
      expect(state.list[0]).toEqual(newThread);
    });

    it('should dispatch rejected with error message when API call fails', async () => {
      api.createThread.mockRejectedValue(new Error('Unauthorized'));

      const store = createTestStore();

      const result = await store.dispatch(addThread({ title: 'X', body: 'Y', category: 'z' }));

      expect(result.type).toBe('threads/create/rejected');
      expect(result.payload).toBe('Unauthorized');
    });
  });

  describe('voteThread', () => {
    it('should dispatch fulfilled with vote data when upvote API call succeeds', async () => {
      api.upVoteThread.mockResolvedValue({ vote: { id: 'vote-1' } });

      const store = createTestStore({
        list: [],
        users: {},
        selectedCategory: '',
        loading: false,
        error: null,
      });

      const result = await store.dispatch(
        voteThread({ threadId: 'thread-1', voteType: 'up', userId: 'user-1' }),
      );

      expect(result.type).toBe('threads/vote/fulfilled');
      expect(result.payload).toEqual({ threadId: 'thread-1', voteType: 'up', userId: 'user-1' });
    });

    it('should dispatch fulfilled with vote data when downvote API call succeeds', async () => {
      api.downVoteThread.mockResolvedValue({ vote: { id: 'vote-2' } });

      const store = createTestStore({
        list: [],
        users: {},
        selectedCategory: '',
        loading: false,
        error: null,
      });

      const result = await store.dispatch(
        voteThread({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' }),
      );

      expect(result.type).toBe('threads/vote/fulfilled');
      expect(result.payload).toEqual({ threadId: 'thread-1', voteType: 'down', userId: 'user-1' });
    });
  });
});

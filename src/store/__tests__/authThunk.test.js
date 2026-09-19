/**
 * Test scenarios for auth thunk functions
 *
 * - login thunk
 *   - should dispatch fulfilled and return token when API call succeeds
 *   - should dispatch rejected with error message when API call fails
 *
 * - register thunk
 *   - should dispatch fulfilled when registration succeeds
 *   - should dispatch rejected with error message when registration fails
 *
 * - fetchProfile thunk
 *   - should dispatch fulfilled with user data when API call succeeds
 *   - should dispatch rejected and clear auth state when API call fails
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, register, fetchProfile } from '../authSlice';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock the API module
vi.mock('../../api/api', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
  getOwnProfile: vi.fn(),
}));

import * as api from '../../api/api';

function createTestStore() {
  return configureStore({
    reducer: { auth: authReducer },
  });
}

describe('auth thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  describe('login', () => {
    it('should dispatch fulfilled and return token when API call succeeds', async () => {
      api.loginUser.mockResolvedValue({ token: 'token-xyz-123' });

      const store = createTestStore();

      const result = await store.dispatch(login({ email: 'test@test.com', password: 'password123' }));

      expect(result.type).toBe('auth/login/fulfilled');
      expect(result.payload).toBe('token-xyz-123');

      const state = store.getState().auth;
      expect(state.token).toBe('token-xyz-123');
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('accessToken', 'token-xyz-123');
    });

    it('should dispatch rejected with error message when API call fails', async () => {
      api.loginUser.mockRejectedValue(new Error('email or password is wrong'));

      const store = createTestStore();

      const result = await store.dispatch(login({ email: 'wrong@test.com', password: 'wrong' }));

      expect(result.type).toBe('auth/login/rejected');
      expect(result.payload).toBe('email or password is wrong');

      const state = store.getState().auth;
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('email or password is wrong');
    });
  });

  describe('register', () => {
    it('should dispatch fulfilled when registration succeeds', async () => {
      const fakeUser = { id: 'user-1', name: 'Test', email: 'test@test.com' };
      api.registerUser.mockResolvedValue({ user: fakeUser });

      const store = createTestStore();

      const result = await store.dispatch(register({ name: 'Test', email: 'test@test.com', password: 'password123' }));

      expect(result.type).toBe('auth/register/fulfilled');
      expect(store.getState().auth.loading).toBe(false);
    });

    it('should dispatch rejected with error message when registration fails', async () => {
      api.registerUser.mockRejectedValue(new Error('email is already taken'));

      const store = createTestStore();

      const result = await store.dispatch(register({ name: 'Test', email: 'taken@test.com', password: 'password123' }));

      expect(result.type).toBe('auth/register/rejected');
      expect(result.payload).toBe('email is already taken');
      expect(store.getState().auth.error).toBe('email is already taken');
    });
  });

  describe('fetchProfile', () => {
    it('should dispatch fulfilled with user data when API call succeeds', async () => {
      const fakeUser = { id: 'user-1', name: 'John Doe', email: 'john@test.com', avatar: 'https://avatar.com/1' };
      api.getOwnProfile.mockResolvedValue({ user: fakeUser });

      const store = createTestStore();

      const result = await store.dispatch(fetchProfile());

      expect(result.type).toBe('auth/fetchProfile/fulfilled');

      const state = store.getState().auth;
      expect(state.user).toEqual(fakeUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should dispatch rejected and clear auth state when API call fails', async () => {
      api.getOwnProfile.mockRejectedValue(new Error('Token expired'));

      const store = createTestStore();

      const result = await store.dispatch(fetchProfile());

      expect(result.type).toBe('auth/fetchProfile/rejected');

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.token).toBeNull();
    });
  });
});

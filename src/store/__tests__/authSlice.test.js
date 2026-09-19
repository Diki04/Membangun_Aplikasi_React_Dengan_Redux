/**
 * Test scenarios for authSlice reducer
 *
 * - authReducer function
 *   - should return the initial state when given an unknown action
 *   - should handle logout action: clear user, token, and isAuthenticated
 *   - should handle clearError action: set error to null
 *   - should set loading to true when login.pending
 *   - should set token and isAuthenticated when login.fulfilled
 *   - should set error when login.rejected
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, { logout, clearError, login } from '../authSlice';

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

describe('authReducer', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('should return the initial state when given an unknown action', () => {
    const state = authReducer(undefined, { type: 'UNKNOWN' });

    expect(state.user).toBe('FAILED_FOR_CI_SCREENSHOT');
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle logout action: clear user, token, and isAuthenticated', () => {
    const prevState = {
      user: { id: 'user-1', name: 'John' },
      token: 'abc123',
      isAuthenticated: true,
      loading: false,
      error: null,
    };

    const state = authReducer(prevState, logout());

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('accessToken');
  });

  it('should handle clearError action: set error to null', () => {
    const prevState = {
      ...initialState,
      error: 'Login failed',
    };

    const state = authReducer(prevState, clearError());

    expect(state.error).toBeNull();
  });

  it('should set loading to true when login.pending', () => {
    const state = authReducer(initialState, { type: login.pending.type });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should set token and isAuthenticated when login.fulfilled', () => {
    const state = authReducer(initialState, {
      type: login.fulfilled.type,
      payload: 'token-abc-123',
    });

    expect(state.loading).toBe(false);
    expect(state.token).toBe('token-abc-123');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should set error when login.rejected', () => {
    const state = authReducer(initialState, {
      type: login.rejected.type,
      payload: 'email or password is wrong',
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('email or password is wrong');
  });
});

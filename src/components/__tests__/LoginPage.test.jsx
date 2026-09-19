/**
 * Test scenarios for LoginPage component
 *
 * - LoginPage component
 *   - should render login form with email and password inputs
 *   - should render submit button with text "Masuk"
 *   - should show error message when login error exists in state
 *   - should have a link to register page
 *   - should render the page title "Selamat Datang Kembali"
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../../pages/LoginPage';

// Mock the authSlice thunks to avoid actual API calls
vi.mock('../../store/authSlice', async () => {
  const actual = await vi.importActual('../../store/authSlice');
  return {
    ...actual,
    login: vi.fn(() => ({ type: 'auth/login/pending' })),
    fetchProfile: vi.fn(() => ({ type: 'auth/fetchProfile/pending' })),
  };
});

function createStore(authOverrides = {}) {
  return configureStore({
    reducer: {
      auth: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        ...authOverrides,
      }),
    },
  });
}

function renderLoginPage(authOverrides = {}) {
  const store = createStore(authOverrides);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );
}

describe('LoginPage', () => {
  it('should render login form with email and password inputs', () => {
    renderLoginPage();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/masukkan password/i)).toBeInTheDocument();
  });

  it('should render submit button with text "Masuk"', () => {
    renderLoginPage();

    const button = screen.getByRole('button', { name: /masuk/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should show error message when login error exists in state', () => {
    renderLoginPage({ error: 'email or password is wrong' });

    expect(screen.getByText('email or password is wrong')).toBeInTheDocument();
  });

  it('should have a link to register page', () => {
    renderLoginPage();

    const registerLink = screen.getByRole('link', { name: /daftar sekarang/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should render the page title "Selamat Datang Kembali"', () => {
    renderLoginPage();

    expect(screen.getByText('Selamat Datang Kembali')).toBeInTheDocument();
  });
});

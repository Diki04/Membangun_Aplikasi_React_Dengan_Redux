/**
 * Test scenarios for ThreadCard component
 *
 * - ThreadCard component
 *   - should render thread title correctly
 *   - should render thread category with # prefix
 *   - should render thread body preview (truncated and stripped of HTML)
 *   - should show upvote and downvote counts
 *   - should show owner name
 *   - should have a link to thread detail page
 *   - should show total comments count
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ThreadCard from '../../components/threads/ThreadCard';

// Mock formatDate to avoid date-fns locale issues in tests
vi.mock('../../utils/formatDate', () => ({
  formatRelativeTime: vi.fn(() => '2 hours ago'),
  truncateText: vi.fn((text) => (text && text.length > 160 ? `${text.substring(0, 160)}...` : text || '')),
  stripHtml: vi.fn((html) => html ? html.replace(/<[^>]*>/g, '') : ''),
}));

function renderWithProviders(ui, { authState = {} } = {}) {
  const store = configureStore({
    reducer: {
      auth: () => ({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        ...authState,
      }),
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>,
  );
}

const fakeThread = {
  id: 'thread-1',
  title: 'Belajar React untuk Pemula',
  body: '<p>React adalah library JavaScript untuk membangun UI</p>',
  category: 'react',
  createdAt: '2023-05-01T10:00:00.000Z',
  ownerId: 'user-1',
  upVotesBy: ['user-2', 'user-3'],
  downVotesBy: ['user-4'],
  totalComments: 5,
};

const fakeUsers = {
  'user-1': { id: 'user-1', name: 'John Doe', avatar: 'https://example.com/john.png' },
};

describe('ThreadCard', () => {
  it('should render thread title correctly', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    expect(screen.getByText('Belajar React untuk Pemula')).toBeInTheDocument();
  });

  it('should render thread category with # prefix', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    expect(screen.getByText('#react')).toBeInTheDocument();
  });

  it('should render thread body preview', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    // stripHtml mock removes tags, so we expect plain text
    expect(screen.getByText('React adalah library JavaScript untuk membangun UI')).toBeInTheDocument();
  });

  it('should show upvote and downvote counts', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    // upVotesBy has 2 users, downVotesBy has 1
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should show owner name', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should have a link to thread detail page', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    const link = screen.getByRole('link', { name: /Belajar React untuk Pemula/i });
    expect(link).toHaveAttribute('href', '/threads/thread-1');
  });

  it('should show total comments count', () => {
    renderWithProviders(<ThreadCard thread={fakeThread} users={fakeUsers} />);

    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

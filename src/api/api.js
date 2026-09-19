const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function getToken() {
  return localStorage.getItem('accessToken');
}

async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  const data = await response.json();
  if (data.status !== 'success') {
    throw new Error(data.message || 'Request failed');
  }
  return data.data;
}

// Auth
export async function registerUser({ name, email, password }) {
  return fetchWithAuth('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  return fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function getOwnProfile() {
  return fetchWithAuth('/users/me');
}

export async function getAllUsers() {
  return fetchWithAuth('/users');
}

// Threads
export async function getThreads() {
  return fetchWithAuth('/threads');
}

export async function getThreadDetail(threadId) {
  return fetchWithAuth(`/threads/${threadId}`);
}

export async function createThread({ title, body, category }) {
  return fetchWithAuth('/threads', {
    method: 'POST',
    body: JSON.stringify({ title, body, category }),
  });
}

// Comments
export async function createComment({ threadId, content }) {
  return fetchWithAuth(`/threads/${threadId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// Thread Votes
export async function upVoteThread(threadId) {
  return fetchWithAuth(`/threads/${threadId}/up-vote`, { method: 'POST' });
}

export async function downVoteThread(threadId) {
  return fetchWithAuth(`/threads/${threadId}/down-vote`, { method: 'POST' });
}

export async function neutralVoteThread(threadId) {
  return fetchWithAuth(`/threads/${threadId}/neutral-vote`, { method: 'POST' });
}

// Comment Votes
export async function upVoteComment({ threadId, commentId }) {
  return fetchWithAuth(`/threads/${threadId}/comments/${commentId}/up-vote`, { method: 'POST' });
}

export async function downVoteComment({ threadId, commentId }) {
  return fetchWithAuth(`/threads/${threadId}/comments/${commentId}/down-vote`, { method: 'POST' });
}

export async function neutralVoteComment({ threadId, commentId }) {
  return fetchWithAuth(`/threads/${threadId}/comments/${commentId}/neutral-vote`, { method: 'POST' });
}

// Leaderboard
export async function getLeaderboard() {
  return fetchWithAuth('/leaderboards');
}

import React from 'react';
import ThreadCard from './ThreadCard';

function ThreadList({ threads, users }) {
  if (threads.length === 0) {
    return (
      <div className="empty-state">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <h3>Belum ada thread</h3>
        <p>Jadilah yang pertama membuat diskusi!</p>
      </div>
    );
  }

  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} users={users} />
      ))}
    </div>
  );
}

export default ThreadList;

import React from 'react';

function VoteButton({
  type, count, active, onClick, disabled,
}) {
  const isUp = type === 'up';
  const isDown = type === 'down';

  return (
    <button
      type="button"
      className={`vote-btn ${isUp ? 'vote-up' : ''} ${isDown ? 'vote-down' : ''} ${active ? 'vote-active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`${isUp ? 'Upvote' : 'Downvote'} (${count})`}
    >
      {isUp ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
      )}
      <span className="vote-count">{count}</span>
    </button>
  );
}

export default VoteButton;

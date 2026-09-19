import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import VoteButton from '../common/VoteButton';
import { formatRelativeTime, truncateText, stripHtml } from '../../utils/formatDate';
import { optimisticVote, voteThread } from '../../store/threadsSlice';

function ThreadCard({ thread, users }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const owner = users[thread.ownerId] || { name: 'Unknown', avatar: '' };
  const isUpVoted = userId && thread.upVotesBy.includes(userId);
  const isDownVoted = userId && thread.downVotesBy.includes(userId);

  const handleVote = (voteType) => {
    if (!isAuthenticated) return;
    const effectiveVote = (voteType === 'up' && isUpVoted) || (voteType === 'down' && isDownVoted)
      ? 'neutral'
      : voteType;
    dispatch(optimisticVote({ threadId: thread.id, voteType: effectiveVote, userId }));
    dispatch(voteThread({ threadId: thread.id, voteType: effectiveVote, userId }));
  };

  const bodyPreview = truncateText(stripHtml(thread.body), 160);

  return (
    <div className="thread-card">
      <div className="thread-card-header">
        <span className="thread-category">#{thread.category}</span>
        <span className="thread-time">{formatRelativeTime(thread.createdAt)}</span>
      </div>

      <Link to={`/threads/${thread.id}`} className="thread-card-title">
        <h3>{thread.title}</h3>
      </Link>

      {bodyPreview && (
        <p className="thread-card-body">{bodyPreview}</p>
      )}

      <div className="thread-card-footer">
        <div className="thread-vote-actions">
          <VoteButton
            type="up"
            count={thread.upVotesBy.length}
            active={isUpVoted}
            onClick={() => handleVote('up')}
            disabled={!isAuthenticated}
          />
          <VoteButton
            type="down"
            count={thread.downVotesBy.length}
            active={isDownVoted}
            onClick={() => handleVote('down')}
            disabled={!isAuthenticated}
          />
        </div>

        <div className="thread-meta">
          <div className="thread-comments-count">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{thread.totalComments}</span>
          </div>
          <div className="thread-owner">
            <Avatar src={owner.avatar} name={owner.name} size="xs" />
            <span>{owner.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreadCard;

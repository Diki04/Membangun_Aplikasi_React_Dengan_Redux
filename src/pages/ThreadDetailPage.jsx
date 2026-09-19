import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchThreadDetail,
  clearDetail,
  optimisticVoteThread,
  voteThreadDetail,
} from '../store/threadDetailSlice';
import Avatar from '../components/common/Avatar';
import VoteButton from '../components/common/VoteButton';
import CommentItem from '../components/thread-detail/CommentItem';
import CommentForm from '../components/thread-detail/CommentForm';
import { formatRelativeTime } from '../utils/formatDate';

function ThreadDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { thread, loading, error } = useSelector((state) => state.threadDetail);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
    return () => {
      dispatch(clearDetail());
    };
  }, [dispatch, id]);

  const handleVote = (voteType) => {
    if (!isAuthenticated) return;
    const isUpVoted = thread.upVotesBy.includes(userId);
    const isDownVoted = thread.downVotesBy.includes(userId);
    const effectiveVote = (voteType === 'up' && isUpVoted) || (voteType === 'down' && isDownVoted)
      ? 'neutral'
      : voteType;
    dispatch(optimisticVoteThread({ voteType: effectiveVote, userId }));
    dispatch(voteThreadDetail({ threadId: id, voteType: effectiveVote }));
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="detail-skeleton">
          <div className="skeleton-line skeleton-line-short" />
          <div className="skeleton-line skeleton-line-long" style={{ height: '2.5rem' }} />
          <div className="skeleton-line skeleton-line-medium" />
          <div className="skeleton-line skeleton-line-long" />
          <div className="skeleton-line skeleton-line-long" />
          <div className="skeleton-line skeleton-line-medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h2>Gagal Memuat Thread</h2>
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (!thread) return null;

  const isUpVoted = userId && thread.upVotesBy.includes(userId);
  const isDownVoted = userId && thread.downVotesBy.includes(userId);

  return (
    <div className="page-container">
      <div className="thread-detail-page">
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Kembali
        </button>

        <article className="thread-detail-card">
          <div className="thread-detail-header">
            <span className="thread-category">#{thread.category}</span>
            <h1 className="thread-detail-title">{thread.title}</h1>
            <div className="thread-detail-meta">
              <div className="thread-owner-info">
                <Avatar src={thread.owner.avatar} name={thread.owner.name} size="md" />
                <div>
                  <span className="owner-name">{thread.owner.name}</span>
                  <span className="thread-time">{formatRelativeTime(thread.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="thread-detail-body"
            dangerouslySetInnerHTML={{ __html: thread.body }}
          />

          <div className="thread-detail-actions">
            <div className="vote-group">
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
            <div className="comment-count-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>
                {thread.comments.length}
                {' '}
                Komentar
              </span>
            </div>
          </div>
        </article>

        <div className="comments-section">
          <h2 className="comments-title">
            Komentar
            <span className="comments-badge">{thread.comments.length}</span>
          </h2>

          <CommentForm threadId={id} />

          <div className="comments-list">
            {thread.comments.length === 0 ? (
              <div className="empty-state empty-state-sm">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p>Belum ada komentar. Jadilah yang pertama!</p>
              </div>
            ) : (
              thread.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} threadId={id} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreadDetailPage;

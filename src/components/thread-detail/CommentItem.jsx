import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../common/Avatar';
import VoteButton from '../common/VoteButton';
import { formatRelativeTime } from '../../utils/formatDate';
import { optimisticVoteComment, voteComment } from '../../store/threadDetailSlice';

function CommentItem({ comment, threadId }) {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const userId = user?.id;

  const isUpVoted = userId && comment.upVotesBy.includes(userId);
  const isDownVoted = userId && comment.downVotesBy.includes(userId);

  const handleVote = (voteType) => {
    if (!isAuthenticated) return;
    const effectiveVote = (voteType === 'up' && isUpVoted) || (voteType === 'down' && isDownVoted)
      ? 'neutral'
      : voteType;
    dispatch(optimisticVoteComment({ commentId: comment.id, voteType: effectiveVote, userId }));
    dispatch(voteComment({ threadId, commentId: comment.id, voteType: effectiveVote }));
  };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-owner">
          <Avatar src={comment.owner.avatar} name={comment.owner.name} size="sm" />
          <div>
            <span className="comment-owner-name">{comment.owner.name}</span>
            <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
          </div>
        </div>
      </div>

      <div
        className="comment-content"
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />

      <div className="comment-actions">
        <VoteButton
          type="up"
          count={comment.upVotesBy.length}
          active={isUpVoted}
          onClick={() => handleVote('up')}
          disabled={!isAuthenticated}
        />
        <VoteButton
          type="down"
          count={comment.downVotesBy.length}
          active={isDownVoted}
          onClick={() => handleVote('down')}
          disabled={!isAuthenticated}
        />
      </div>
    </div>
  );
}

export default CommentItem;

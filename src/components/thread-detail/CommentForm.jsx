import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { postComment } from '../../store/threadDetailSlice';

function CommentForm({ threadId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { commentLoading } = useSelector((state) => state.threadDetail);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await dispatch(postComment({ threadId, content }));
    setContent('');
  };

  if (!isAuthenticated) {
    return (
      <div className="comment-form-login">
        <p>
          <button type="button" className="link-btn" onClick={() => navigate('/login')}>Masuk</button>
          {' '}
          untuk meninggalkan komentar.
        </p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        id="comment-content"
        className="comment-textarea"
        placeholder="Tulis komentar Anda..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        disabled={commentLoading}
      />
      <div className="comment-form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!content.trim() || commentLoading}
        >
          {commentLoading ? (
            <span className="btn-loading">
              <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Mengirim...
            </span>
          ) : 'Kirim Komentar'}
        </button>
      </div>
    </form>
  );
}

export default CommentForm;

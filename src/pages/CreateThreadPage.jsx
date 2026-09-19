import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addThread } from '../store/threadsSlice';

function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Judul dan isi thread wajib diisi');
      return;
    }
    setLoading(true);
    setError('');
    const result = await dispatch(addThread({ title, body, category: category.trim() || 'general' }));
    setLoading(false);
    if (addThread.fulfilled.match(result)) {
      navigate(`/threads/${result.payload.id}`);
    } else {
      setError(result.payload || 'Gagal membuat thread');
    }
  };

  return (
    <div className="page-container">
      <div className="create-thread-page">
        <div className="page-header">
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali
          </button>
          <h1 className="page-title">Buat Thread Baru</h1>
          <p className="page-subtitle">Bagikan ide atau pertanyaan Anda dengan komunitas</p>
        </div>

        {error && (
          <div className="error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form className="create-thread-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="thread-title" className="form-label">
              Judul Thread
              <span className="required">*</span>
            </label>
            <input
              id="thread-title"
              type="text"
              className="form-input"
              placeholder="Judul yang menarik dan jelas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
            <span className="char-count">{title.length}/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="thread-category" className="form-label">Kategori</label>
            <input
              id="thread-category"
              type="text"
              className="form-input"
              placeholder="Contoh: javascript, react, diskusi (opsional)"
              value={category}
              onChange={(e) => setCategory(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="thread-body" className="form-label">
              Isi Thread
              <span className="required">*</span>
            </label>
            <textarea
              id="thread-body"
              className="form-textarea"
              placeholder="Tuliskan isi diskusi Anda secara lengkap..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !title.trim() || !body.trim()}
            >
              {loading ? (
                <span className="btn-loading">
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Menerbitkan...
                </span>
              ) : 'Terbitkan Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateThreadPage;

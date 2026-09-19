import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchThreads, selectFilteredThreads } from '../store/threadsSlice';
import ThreadList from '../components/threads/ThreadList';
import CategoryFilter from '../components/threads/CategoryFilter';

function HomePage() {
  const dispatch = useDispatch();
  const threads = useSelector(selectFilteredThreads);
  const users = useSelector((state) => state.threads.users);
  const { loading, error } = useSelector((state) => state.threads);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  return (
    <div className="page-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Selamat Datang di
            {' '}
            <span className="gradient-text">ForumSpace</span>
          </h1>
          <p className="hero-subtitle">
            Bergabunglah dalam diskusi seru, bagikan ide, dan temukan wawasan baru bersama komunitas kami.
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Mulai Sekarang</Link>
              <Link to="/login" className="btn btn-ghost btn-lg">Sudah Punya Akun?</Link>
            </div>
          )}
        </div>
        <div className="hero-decoration">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
      </div>

      <div className="threads-section">
        <div className="threads-header">
          <h2 className="section-title">Thread Terbaru</h2>
          {isAuthenticated && (
            <Link to="/threads/new" className="btn btn-primary btn-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Buat Thread
            </Link>
          )}
        </div>

        <CategoryFilter />

        {error && (
          <div className="error-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {loading && threads.length === 0 ? (
          <div className="skeleton-list">
            {Array.from({ length: 5 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="skeleton-card">
                <div className="skeleton-line skeleton-line-short" />
                <div className="skeleton-line skeleton-line-long" />
                <div className="skeleton-line skeleton-line-medium" />
              </div>
            ))}
          </div>
        ) : (
          <ThreadList threads={threads} users={users} />
        )}
      </div>
    </div>
  );
}

export default HomePage;

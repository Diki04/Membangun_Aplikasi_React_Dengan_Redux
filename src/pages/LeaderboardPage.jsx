import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/leaderboardSlice';
import Avatar from '../components/common/Avatar';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="page-container">
      <div className="leaderboard-page">
        <div className="page-header">
          <h1 className="page-title">
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="page-subtitle">Pengguna paling aktif di komunitas ForumSpace</p>
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

        {loading ? (
          <div className="skeleton-list">
            {Array.from({ length: 10 }).map((_, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className="skeleton-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div className="skeleton-avatar" />
                <div style={{ flex: 1 }}>
                  <div className="skeleton-line skeleton-line-medium" />
                </div>
                <div className="skeleton-line skeleton-line-short" style={{ width: '60px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="leaderboard-list">
            {list.map((item, index) => (
              <div
                key={item.user.id}
                className={`leaderboard-item ${index < 3 ? `leaderboard-top-${index + 1}` : ''}`}
              >
                <div className="leaderboard-rank">
                  {index < 3 ? (
                    <span className="medal">{medals[index]}</span>
                  ) : (
                    <span className="rank-number">{index + 1}</span>
                  )}
                </div>

                <div className="leaderboard-user">
                  <Avatar src={item.user.avatar} name={item.user.name} size="md" />
                  <div className="leaderboard-user-info">
                    <span className="leaderboard-name">{item.user.name}</span>
                    <span className="leaderboard-email">{item.user.email}</span>
                  </div>
                </div>

                <div className="leaderboard-score">
                  <span className="score-value">{item.score}</span>
                  <span className="score-label">poin</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;

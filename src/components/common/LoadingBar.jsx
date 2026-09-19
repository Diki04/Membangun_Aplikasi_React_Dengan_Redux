import React from 'react';
import { useSelector } from 'react-redux';

function LoadingBar() {
  const threadsLoading = useSelector((state) => state.threads.loading);
  const detailLoading = useSelector((state) => state.threadDetail.loading);
  const leaderboardLoading = useSelector((state) => state.leaderboard.loading);
  const authLoading = useSelector((state) => state.auth.loading);

  const isLoading = threadsLoading || detailLoading || leaderboardLoading || authLoading;

  if (!isLoading) return null;

  return (
    <div className="loading-bar-container">
      <div className="loading-bar" />
    </div>
  );
}

export default LoadingBar;

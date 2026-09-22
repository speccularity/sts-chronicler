import React from 'react';
import { type User } from '../types/sts';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onGoHome }) => {
  return (
    <header className="sts-header">
      <div className="header-brand" onClick={onGoHome}>
        <h1 className="spire-title">
          SLAY THE SP<span className="fire-i">I</span>RE
        </h1>
        <div className="spire-subtitle">BOARD GAME CHRONICLER</div>
      </div>

      {user && (
        <div className="header-user">
          <span className="user-greeting">
            Signed in as: <strong style={{ color: 'var(--color-header-gold-2)' }}>{user.username} </strong>
          </span>
          <button style={{margin: '5px'}} className="sts-btn secondary small" onClick={onGoHome}>
            All Runs
          </button>
          <button style={{margin: '5px'}} className="sts-btn danger small" onClick={onLogout}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
};
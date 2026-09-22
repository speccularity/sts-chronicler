import React, { useState } from 'react';
import { type CharacterType, type User } from '../types/sts';
import { getUsers, saveUser, setCurrentSession } from '../services/storage';

interface PinAuthProps {
  onLoginSuccess: (user: User) => void;
}

const CHARACTERS: { type: CharacterType; label: string; icon: string; color: string }[] = [
  { type: 'ironclad', label: 'Ironclad', icon: '⚔️', color: '#c0392b' },
  { type: 'silent', label: 'Silent', icon: '🗡️', color: '#27ae60' },
  { type: 'defect', label: 'Defect', icon: '⚡', color: '#2980b9' },
  { type: 'watcher', label: 'Watcher', icon: '☯️', color: '#8e44ad' },
];

export const PinAuth: React.FC<PinAuthProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState<CharacterType[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectChar = (type: CharacterType) => {
    if (pin.length < 4) {
      setPin([...pin, type]);
      setErrorMsg('');
    }
  };

  const handleClearPin = () => {
    setPin([]);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter a username.');
      return;
    }
    if (pin.length !== 4) {
      setErrorMsg('PIN must consist of exactly 4 character icons.');
      return;
    }

    const users = getUsers();
    const existingUser = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());

    if (existingUser) {
      // Validate PIN
      const isPinMatch = existingUser.pin.every((p, idx) => p === pin[idx]);
      if (isPinMatch) {
        setCurrentSession(existingUser);
        onLoginSuccess(existingUser);
      } else {
        setErrorMsg('Incorrect PIN for this username.');
      }
    } else {
      // Register new user
      const newUser: User = { username: username.trim(), pin };
      saveUser(newUser);
      setCurrentSession(newUser);
      onLoginSuccess(newUser);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Enter the Spire</h2>
        <p className="subtitle">Sign in or create account with a 4-Hero PIN</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="sts-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. SpireSlayer99"
          />
        </div>

        <div className="form-group">
          <label>4-Character PIN Code</label>
          <div className="pin-display">
            {[0, 1, 2, 3].map((slotIndex) => {
              const charType = pin[slotIndex];
              const charInfo = CHARACTERS.find((c) => c.type === charType);
              return (
                <div key={slotIndex} className="pin-slot" style={{ borderColor: charInfo?.color || '#555' }}>
                  {charInfo ? <span className="pin-icon">{charInfo.icon}</span> : <span className="pin-placeholder">•</span>}
                </div>
              );
            })}
          </div>

          <div className="character-selector">
            {CHARACTERS.map((char) => (
              <button
                key={char.type}
                type="button"
                className="char-btn"
                onClick={() => handleSelectChar(char.type)}
                disabled={pin.length >= 4}
                style={{ borderColor: char.color }}
              >
                <span className="char-icon">{char.icon}</span>
                <span className="char-name">{char.label}</span>
              </button>
            ))}
          </div>

          <div className="pin-actions">
            <button type="button" className="sts-btn secondary" onClick={handleClearPin} disabled={pin.length === 0}>
              Clear PIN
            </button>
          </div>
        </div>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        <button type="submit" className="sts-btn primary block-btn">
          Log In / Create Account
        </button>
      </form>
    </div>
  );
};
import React from 'react';
import { type GameInstance, type User, type CharacterType } from '../types/sts';
import { ACT_BOSSES } from '../data/gameData';

interface DashboardProps {
  user: User;
  games: GameInstance[];
  onSelectGame: (game: GameInstance) => void;
  onCreateNewGame: (newGame: GameInstance) => void;
  onDeleteGame: (gameId: string) => void;
}

// Character visual mapping for the card art area
const CHARACTER_INFO: Record<CharacterType, { icon: string; color: string; label: string }> = {
  ironclad: { icon: '⚔️', color: '#c0392b', label: 'Ironclad' },
  silent: { icon: '🗡️', color: '#27ae60', label: 'Silent' },
  defect: { icon: '⚡', color: '#2980b9', label: 'Defect' },
  watcher: { icon: '☯️', color: '#8e44ad', label: 'Watcher' },
};

export const Dashboard: React.FC<DashboardProps> = ({ user, games, onSelectGame, onCreateNewGame, onDeleteGame }) => {

  const handleCreate = () => {
    const newGame: GameInstance = {
      id: `game-${Date.now()}`,
      userId: user.username,
      instanceName: `Run - ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      act: 1,
      ascension: 0,
      selectedBoss: ACT_BOSSES[1][0],
      currentNodeId: 'act1-f1-s0', // Updated to match the new BoardMapTracker ID system
      nodes: [], // We now start empty and only save user overrides/dropdown selections
      characters: [],
    };
    onCreateNewGame(newGame);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-actions" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'wheat', fontFamily: 'Cinzel, serif' }}>Your Saved Game Instances</h2>
        <button className="sts-btn primary highlight" onClick={handleCreate}>
          + Create New Game Instance
        </button>
      </div>

      {games.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '3rem', background: 'rgba(15, 7, 3, 0.8)', border: '1px solid #5a1818', borderRadius: '8px' }}>
          <p>No active runs found for user <strong>{user.username}</strong>.</p>
          <p>Start a new instance to keep track of your board game progress!</p>
        </div>
      ) : (
        <div className="games-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'flex-start' }}>
          {games.map((game) => (
            <div
              key={game.id}
              className="sts-card-item game-card-sts"
              style={{
                width: '240px',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0.6rem',
                background: 'var(--color-card-crimson, #5a1818)',
                border: '3px solid #800000',
                borderRadius: '10px',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.8)',
                position: 'relative'
              }}
            >
              {/* CARD TITLE & ASCENSION COST BANNER */}
              <div className="card-top-bar" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-silver-banner, #8a9ba8)', padding: '0.25rem 0.4rem', borderRadius: '4px' }}>
                <span
                  className="cost-node"
                  title={`Ascension Level ${game.ascension}`}
                  style={{
                    background: '#00ebf1',
                    color: '#000',
                    fontWeight: 'bold',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    flexShrink: 0
                  }}
                >
                  {game.ascension}
                </span>
                <span
                  className="card-title"
                  style={{
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    color: '#000',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: 'Cinzel, serif'
                  }}
                  title={game.instanceName}
                >
                  {game.instanceName}
                </span>
              </div>

              {/* CARD ART AREA: DISPLAYS HERO ICONS IN PLAY */}
              <div
                className="card-art game-art-box"
                style={{
                  height: '110px',
                  background: '#1a0b05',
                  borderRadius: '4px',
                  margin: '0.4rem 0',
                  border: '1px solid #3a1508',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.4rem'
                }}
              >
                {game.characters.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: game.characters.length > 2 ? '1fr 1fr' : '1fr', gap: '0.4rem', width: '100%' }}>
                    {game.characters.map((char) => {
                      const info = CHARACTER_INFO[char.characterType];
                      return (
                        <div
                          key={char.id}
                          title={`${char.playerName || info.label} (${info.label})`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            borderLeft: `3px solid ${info.color}`,
                            padding: '0.2rem 0.4rem',
                            borderRadius: '3px',
                            fontSize: '0.75rem',
                            color: '#fff',
                            overflow: 'hidden'
                          }}
                        >
                          <span>{info.icon}</span>
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {char.playerName || info.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="card-art-placeholder" style={{ color: '#777', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    No Heroes Selected
                  </div>
                )}
              </div>

              {/* CARD DESCRIPTION BOX: GAME METADATA */}
              <div
                className="card-description game-card-desc"
                style={{
                  fontSize: '0.75rem',
                  background: 'rgba(0, 0, 0, 0.75)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  color: '#e0e0e0',
                  lineHeight: '1.3',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '0.2rem',
                  marginBottom: '0.4rem'
                }}
              >
                <div>
                  <strong style={{ color: '#ffb300' }}>Act {game.act}:</strong> {game.selectedBoss}
                </div>
                <div>
                  <strong style={{ color: '#ffb300' }}>Party:</strong>{' '}
                  {game.characters.map((c) => c.playerName || CHARACTER_INFO[c.characterType].label).join(', ') || 'None'}
                </div>
                <div>
                  <strong style={{ color: '#ffb300' }}>Saved:</strong> {new Date(game.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {/* CARD ACTIONS (RESUME / DELETE) */}
              <div className="card-actions game-card-actions" style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className="sts-btn primary small"
                  style={{ flex: 2, fontSize: '0.75rem' }}
                  onClick={() => onSelectGame(game)}
                >
                  Resume Run
                </button>
                <button
                  className="sts-btn danger small"
                  style={{ flex: 1, fontSize: '0.75rem' }}
                  onClick={() => onDeleteGame(game.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
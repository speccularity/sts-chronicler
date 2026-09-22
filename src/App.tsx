import { useState, useEffect } from 'react';
import { type User, type GameInstance } from './types/sts';
import { getCurrentSession, setCurrentSession, getSavedGames, saveGameInstance, deleteGameInstance } from './services/storage';
import { PinAuth } from './components/PinAuth';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { RunEditor } from './components/RunEditor';
import './App.css';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [games, setGames] = useState<GameInstance[]>([]);
  const [activeGame, setActiveGame] = useState<GameInstance | null>(null);

  useEffect(() => {
    const session = getCurrentSession();
    if (session) {
      setCurrentUser(session);
      setGames(getSavedGames(session.username));
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setGames(getSavedGames(user.username));
  };

  const handleLogout = () => {
    setCurrentSession(null);
    setCurrentUser(null);
    setActiveGame(null);
  };

  const handleSaveGame = (game: GameInstance) => {
    saveGameInstance(game);
    if (currentUser) {
      setGames(getSavedGames(currentUser.username));
    }
    setActiveGame(null);
  };

  const handleDeleteGame = (gameId: string) => {
    if (window.confirm('Are you sure you want to delete this game instance?')) {
      deleteGameInstance(gameId);
      if (currentUser) {
        setGames(getSavedGames(currentUser.username));
      }
    }
  };

  return (
    <div className="sts-app">
      <Header user={currentUser} onLogout={handleLogout} onGoHome={() => setActiveGame(null)} />

      <main className="sts-content">
        {!currentUser ? (
          <PinAuth onLoginSuccess={handleLoginSuccess} />
        ) : activeGame ? (
          <RunEditor game={activeGame} onSave={handleSaveGame} onBack={() => setActiveGame(null)} />
        ) : (
          <Dashboard
            user={currentUser}
            games={games}
            onSelectGame={(game) => setActiveGame(game)}
            onCreateNewGame={(newGame) => setActiveGame(newGame)}
            onDeleteGame={handleDeleteGame}
          />
        )}
      </main>
    </div>
  );
}

export default App;
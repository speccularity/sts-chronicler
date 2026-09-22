import { type GameInstance, type User } from '../types/sts';

const USERS_KEY = 'sts_chronicler_users';
const SESSION_KEY = 'sts_chronicler_session';
const GAMES_KEY = 'sts_chronicler_games';

export function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  const existingIdx = users.findIndex((u) => u.username.toLowerCase() === user.username.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentSession(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentSession(user: User | null): void {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSavedGames(username: string): GameInstance[] {
  const data = localStorage.getItem(GAMES_KEY);
  if (!data) return [];
  const games: GameInstance[] = JSON.parse(data);
  return games.filter((g) => g.userId.toLowerCase() === username.toLowerCase());
}

export function saveGameInstance(game: GameInstance): void {
  const data = localStorage.getItem(GAMES_KEY);
  const games: GameInstance[] = data ? JSON.parse(data) : [];
  const idx = games.findIndex((g) => g.id === game.id);
  
  const updatedGame = {
    ...game,
    updatedAt: new Date().toISOString(),
  };

  if (idx >= 0) {
    games[idx] = updatedGame;
  } else {
    games.push(updatedGame);
  }

  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

export function deleteGameInstance(gameId: string): void {
  const data = localStorage.getItem(GAMES_KEY);
  if (!data) return;
  const games: GameInstance[] = JSON.parse(data);
  const filtered = games.filter((g) => g.id !== gameId);
  localStorage.setItem(GAMES_KEY, JSON.stringify(filtered));
}
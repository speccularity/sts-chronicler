export type CharacterType = 'ironclad' | 'silent' | 'defect' | 'watcher';

export type NodeType = 'enemy' | 'elite' | 'event' | 'rest' | 'shop' | 'treasure' | 'boss' | 'unknown';

export interface Card {
  id: string;
  name: string;
  character: CharacterType | 'colourless' | 'curses';
  type: 'Attack' | 'Skill' | 'Power' | 'Status' | 'Curse';
  cost: number | string;
  upgraded: boolean;
  imageFileName?: string;
  description?: string;
}

export interface Relic {
  id: string;
  name: string;
  rarity: 'Starter' | 'Common' | 'Uncommon' | 'Rare' | 'Boss' | 'Shop' | 'Event';
  description: string;
  imageFileName?: string;
}

export interface Potion {
  id: string;
  name: string;
  effect: string;
  imageFileName?: string;
}

export interface PlayerCharacter {
  id: string;
  playerName: string;
  characterType: CharacterType;
  currentHp: number;
  maxHp: number;
  gold: number;
  deck: Card[];
  relics: Relic[];
  potions: (Potion | null)[]; // Max 3 slots
}

export interface MapNode {
  id: string;
  row: number; // 1 to 13 (Act floor rows)
  col: number; // 1 to 4 paths depending on the floor
  type: NodeType;
  revealed: boolean;
  isCurrentNode: boolean;
}

export interface GameInstance {
  id: string;
  userId: string;
  instanceName: string;
  createdAt: string;
  updatedAt: string;
  act: 1 | 2 | 3 | 4;
  ascension: number;
  selectedBoss: string;
  currentNodeId: string | null;
  nodes: MapNode[];
  characters: PlayerCharacter[];
}

export interface User {
  username: string;
  pin: CharacterType[]; // 4 character icons
}
import React, { useState } from 'react';
import relicList from '../../relic-list.json';
import { type GameInstance, type PlayerCharacter, type CharacterType, type MapNode, type Relic } from '../types/sts';
import { ACT_BOSSES, CHARACTER_DETAILS, STARTER_CARDS } from '../data/gameData';
import { BoardMapTracker } from './BoardMapTracker';
import { CharacterSheet } from './CharacterSheet';

const RELIC_CATALOG = (relicList as Array<{ name: string; type: string; copies: number }>).filter(
  (item) => item.type === 'Relic' || item.type === 'Boss Relic',
).map((item, index) => ({
  id: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
  name: item.name,
  rarity: item.type === 'Boss Relic' ? 'Boss' : 'Common',
  description: item.type,
  imageFileName: item.name,
} satisfies Relic));

interface RunEditorProps {
  game: GameInstance;
  onSave: (game: GameInstance) => void;
  onBack: () => void;
}

export const RunEditor: React.FC<RunEditorProps> = ({ game: initialGame, onSave, onBack }) => {
  const [game, setGame] = useState<GameInstance>(initialGame);
  const [addCharType, setAddCharType] = useState<CharacterType>('ironclad');

  const handleSave = () => {
    onSave(game);
  };

  const handleAddCharacter = () => {
    if (game.characters.length >= 4) return;

    const details = CHARACTER_DETAILS[addCharType];
    const starterRelic = RELIC_CATALOG[0] ?? {
      id: `starter-relic-${addCharType}`,
      name: 'Ancient Potion',
      rarity: 'Common',
      description: 'Starter relic',
      imageFileName: 'Ancient Potion',
    };

    const newChar: PlayerCharacter = {
      id: `${addCharType}-${Date.now()}`,
      playerName: `Player ${game.characters.length + 1}`,
      characterType: addCharType,
      currentHp: details.maxHp,
      maxHp: details.maxHp,
      gold: 99,
      deck: [...STARTER_CARDS[addCharType]],
      relics: [starterRelic],
      potions: [null, null, null],
    };

    setGame({ ...game, characters: [...game.characters, newChar] });
  };

  const handleUpdateCharacter = (updated: PlayerCharacter) => {
    const updatedChars = game.characters.map((c) => (c.id === updated.id ? updated : c));
    setGame({ ...game, characters: updatedChars });
  };

  const handleRemoveCharacter = (id: string) => {
    setGame({ ...game, characters: game.characters.filter((c) => c.id !== id) });
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<MapNode>) => {
    const nodeExists = game.nodes.some((n) => n.id === nodeId);
    const updatedNodes = nodeExists
      ? game.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
      : [...game.nodes, { id: nodeId, row: 1, col: 1, type: 'unknown', revealed: true, isCurrentNode: false, ...updates } as MapNode];

    setGame({ ...game, nodes: updatedNodes });
  };

  const handleSetCurrentNode = (nodeId: string) => {
    setGame({ ...game, currentNodeId: nodeId });
  };

  return (
    <div className="run-editor">
      {/* Control Topbar */}
      <div className="editor-topbar">
        <button className="sts-btn secondary" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h2 className="run-title">{game.instanceName}</h2>
        <button className="sts-btn primary" onClick={handleSave}>
          💾 Save Run Progress
        </button>
      </div>

      {/* Meta Bar */}
      <div className="run-meta-panel">
        <div className="meta-group">
          <label>Instance Name:</label>
          <input
            type="text"
            className="sts-input"
            value={game.instanceName}
            onChange={(e) => setGame({ ...game, instanceName: e.target.value })}
          />
        </div>

        <div className="meta-group">
          <label>Act:</label>
          <select
            className="sts-input"
            value={game.act}
            onChange={(e) => {
              const actNum = parseInt(e.target.value) as 1 | 2 | 3 | 4;
              const defaultBoss = ACT_BOSSES[actNum][0];
              setGame({ ...game, act: actNum, selectedBoss: defaultBoss });
            }}
          >
            <option value={1}>Act 1: The Exordium</option>
            <option value={2}>Act 2: The City</option>
            <option value={3}>Act 3: The Beyond</option>
            <option value={4}>Act 4: The Ending</option>
          </select>
        </div>

        <div className="meta-group">
          <label>Act Boss:</label>
          <select
            className="sts-input"
            value={game.selectedBoss}
            onChange={(e) => setGame({ ...game, selectedBoss: e.target.value })}
          >
            {ACT_BOSSES[game.act].map((boss) => (
              <option key={boss} value={boss}>
                {boss}
              </option>
            ))}
          </select>
        </div>

        <div className="meta-group">
          <label>Ascension Level:</label>
          <input
            type="number"
            min={0}
            max={13}
            className="sts-input number-input"
            value={game.ascension}
            onChange={(e) => setGame({ ...game, ascension: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="run-layout">
        <div className="board-column">
          <BoardMapTracker
            nodes={game.nodes}
            currentNodeId={game.currentNodeId}
            onUpdateNode={handleUpdateNode}
            onSetCurrentNode={handleSetCurrentNode}
          />
        </div>

        <div className="characters-column">
          <div className="characters-container">
            <div className="characters-header">
              <h3>Party Characters ({game.characters.length} / 4)</h3>

              {game.characters.length < 4 && (
                <div className="add-character-controls">
                  <select
                    className="sts-input"
                    value={addCharType}
                    onChange={(e) => setAddCharType(e.target.value as CharacterType)}
                  >
                    <option value="ironclad">Ironclad</option>
                    <option value="silent">Silent</option>
                    <option value="defect">Defect</option>
                    <option value="watcher">Watcher</option>
                  </select>
                  <button className="sts-btn primary" style={{ marginTop: '10px' }} onClick={handleAddCharacter}>
                    + Add Hero to Party
                  </button>
                </div>
              )}
            </div>

            <div className="character-sheets-grid">
              {game.characters.map((char) => (
                <CharacterSheet
                  key={char.id}
                  character={char}
                  onUpdate={handleUpdateCharacter}
                  onRemove={() => handleRemoveCharacter(char.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
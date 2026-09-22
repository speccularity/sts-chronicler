import React, { useState } from 'react';
import cardList from '../../card-list.json';
import relicList from '../../relic-list.json';
import { type PlayerCharacter, type Card, type Relic, type Potion } from '../types/sts';
import { CHARACTER_DETAILS } from '../data/gameData';
import { getAssetUrl } from '../utils/assetLoader';

const CARD_CATALOG = (cardList as Array<{ name: string; deck: string; cost: number | null; rarity: string | null; type: string; starter: boolean }>).map((card, index) => ({
  id: `${card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
  name: card.name,
  character: (card.deck === 'Watcher' ? 'watcher' : card.deck === 'Silent' ? 'silent' : card.deck === 'Defect' ? 'defect' : 'ironclad') as Card['character'],
  type: (card.type === 'Attack' || card.type === 'Skill' || card.type === 'Power' ? card.type : 'Skill') as Card['type'],
  cost: card.cost ?? 0,
  upgraded: false,
  imageFileName: card.name,
  description: `${card.rarity ?? 'Common'} ${card.type}`,
} satisfies Card));

const RELIC_CATALOG = (relicList as Array<{ name: string; type: string; copies: number }>).filter(
  (item) => item.type === 'Relic' || item.type === 'Boss Relic',
).map((item, index) => ({
  id: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
  name: item.name,
  rarity: item.type === 'Boss Relic' ? 'Boss' : 'Common',
  description: 'Relic',
  imageFileName: item.name,
} satisfies Relic));

const POTION_CATALOG = (relicList as Array<{ name: string; type: string; copies: number }>).filter(
  (item) => item.type === 'Potion',
).map((item, index) => ({
  id: `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
  name: item.name,
  effect: 'Potion',
  imageFileName: item.name,
} satisfies Potion));

interface CharacterSheetProps {
  character: PlayerCharacter;
  onUpdate: (updated: PlayerCharacter) => void;
  onRemove: () => void;
}

export const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onUpdate, onRemove }) => {
  const [activeTab, setActiveTab] = useState<'deck' | 'relics' | 'potions'>('deck');
  const [cardSearch, setCardSearch] = useState('');
  const [relicSearch, setRelicSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const details = CHARACTER_DETAILS[character.characterType];
  const hpSquares = Array.from({ length: 10 }, (_, index) => index < Math.min(character.currentHp, 10));

  // HP Adjustments
  const handleHpChange = (delta: number) => {
    const newHp = Math.min(Math.max(0, character.currentHp + delta), character.maxHp);
    onUpdate({ ...character, currentHp: newHp });
  };

  // Card Management
  const handleAddCard = (cardTemplate: Card) => {
    const newCard: Card = {
      ...cardTemplate,
      id: `${cardTemplate.id}-${Date.now()}`,
    };
    onUpdate({ ...character, deck: [...character.deck, newCard] });
  };

  const handleToggleCardUpgrade = (cardId: string) => {
    const updatedDeck = character.deck.map((c) => (c.id === cardId ? { ...c, upgraded: !c.upgraded } : c));
    onUpdate({ ...character, deck: updatedDeck });
  };

  const handleRemoveCard = (cardId: string) => {
    const updatedDeck = character.deck.filter((c) => c.id !== cardId);
    onUpdate({ ...character, deck: updatedDeck });
  };

  // Relic Management
  const handleAddRelic = (relic: Relic) => {
    onUpdate({ ...character, relics: [...character.relics, relic] });
  };

  const handleRemoveRelic = (relicId: string) => {
    onUpdate({ ...character, relics: character.relics.filter((r) => r.id !== relicId) });
  };

  // Potion Management
  const handleSetPotion = (slotIndex: number, potion: Potion | null) => {
    const newPotions = [...character.potions];
    newPotions[slotIndex] = potion;
    onUpdate({ ...character, potions: newPotions });
  };

  return (
    <div className="character-sheet" style={{ borderColor: details.color }}>
      <div className="char-header" style={{ backgroundColor: details.color }}>
        <div className="char-identity">
          <input
            type="text"
            className="player-name-input"
            value={character.playerName}
            onChange={(e) => onUpdate({ ...character, playerName: e.target.value })}
            placeholder="Player Name"
          />
          <span className="char-class-badge" style={{paddingLeft: '10px'}}>{'The '+ details.name}</span>
        </div>

        <div className="char-header-actions">
          <button className="sts-btn secondary small view-expanded-btn" onClick={() => setIsExpanded(true)} title="View character details">
            👁 View
          </button>
          <button className="sts-btn danger small" onClick={onRemove} title="Remove character from run">
            ✕
          </button>
        </div>
      </div>

      <div className="char-stats-bar">
        <div className="hp-tracker">
          <span className="stat-label">HP:</span>
          <div className="hp-controls">
            <button className="hp-btn" onClick={() => handleHpChange(-5)}>-5</button>
            <button className="hp-btn" onClick={() => handleHpChange(-1)}>-1</button>
            <span className="hp-text">{character.currentHp} / {character.maxHp}</span>
            <button className="hp-btn" onClick={() => handleHpChange(1)}>+1</button>
            <button className="hp-btn" onClick={() => handleHpChange(5)}>+5</button>
          </div>
        </div>

        <div className="max-hp-edit">
          <label>Max HP:</label>
          <input
            type="number"
            className="sts-input number-input"
            value={character.maxHp}
            onChange={(e) => onUpdate({ ...character, maxHp: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="char-tabs">
        <button className={`tab-btn ${activeTab === 'deck' ? 'active' : ''}`} onClick={() => setActiveTab('deck')}>
          Deck ({character.deck.length})
        </button>
        <button className={`tab-btn ${activeTab === 'relics' ? 'active' : ''}`} onClick={() => setActiveTab('relics')}>
          Relics ({character.relics.length})
        </button>
        <button className={`tab-btn ${activeTab === 'potions' ? 'active' : ''}`} onClick={() => setActiveTab('potions')}>
          Potions
        </button>
      </div>

      {isExpanded && (
        <div className="expanded-character-backdrop" onClick={() => setIsExpanded(false)}>
          <div className="expanded-character-modal" onClick={(event) => event.stopPropagation()}>
            <div className="expanded-modal-header">
              <div>
                <div className="expanded-character-name">{character.playerName || 'Player'} · {details.name}</div>
                <div className="expanded-character-subtitle">{character.currentHp} / {character.maxHp} HP</div>
              </div>
              <button className="sts-btn secondary small" onClick={() => setIsExpanded(false)}>
                Close
              </button>
            </div>

            <div className="expanded-hp-row" aria-label={`Current HP: ${character.currentHp} out of ${character.maxHp}`}>
              {hpSquares.map((filled, index) => (
                <span
                  key={`${character.id}-hp-${index}`}
                  className={`hp-square ${filled ? 'filled' : 'empty'}`}
                  title={filled ? `HP ${index + 1}` : `Empty HP square ${index + 1}`}
                />
              ))}
            </div>

            <div className="expanded-section">
              <h4>Deck</h4>
              <div className="expanded-card-grid" >
                {character.deck.map((card) => {
                  const exactName = card.upgraded ? `${card.name}+` : card.name;
                  const imgUrl = getAssetUrl(card.character, exactName);

                  return (
                    <div key={card.id} className="expanded-card-item">
                      {imgUrl ? (
                        <img src={imgUrl} alt={exactName} />
                      ) : (
                        <div  className="expanded-card-placeholder">{exactName}</div>
                      )}
                      <span style={{fontSize: 15, fontWeight: 'bold'}}>{exactName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="expanded-section">
              <h4>Relics</h4>
              <div className="expanded-list">
                {character.relics.length === 0 ? (
                  <div className="empty-list-state">No relics yet.</div>
                ) : (
                  character.relics.map((relic) => (
                    <div key={relic.id} className="expanded-list-item">
                      <span>{relic.name}</span>
                      <span className="rarity-tag">{relic.rarity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="expanded-section">
              <h4>Potions</h4>
              <div className="expanded-potion-grid">
                {character.potions.map((potion, index) => (
                  <div key={`${character.id}-potion-${index}`} className={`expanded-potion-slot ${potion ? 'filled' : 'empty'}`}>
                    {potion ? (
                      <>
                        <span className="expanded-potion-name">{potion.name}</span>
                        {/* <small>{potion.effect}</small> */}
                      </>
                    ) : (
                      <span>Empty</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="char-tab-content">
        {/* DECK TAB */}
        {activeTab === 'deck' && (
          <div className="deck-section">
            <div className="add-card-bar">
              <input
                type="text"
                className="sts-input"
                placeholder="Search cards to add..."
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
              />
            </div>

            {cardSearch && (
              <div className="card-search-results">
                {CARD_CATALOG.filter((c) => c.name.toLowerCase().includes(cardSearch.toLowerCase())).slice(0, 20).map((card) => (
                  <div key={card.id} className="search-result-item" onClick={() => handleAddCard(card)}>
                    <span>+ {card.name}</span>
                    <span className="card-type-tag">{card.type}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="card-grid">
              {character.deck.map((card) => {
                const exactName = card.upgraded ? `${card.name}+` : card.name;
                const imgUrl = getAssetUrl(card.character, exactName);

                return (
                  <div 
                    key={card.id} 
                    className={`sts-card-wrapper ${card.upgraded ? 'is-upgraded' : ''}`}
                    style={{ width: '130px', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <div className="full-card-display" style={{ width: '100%' }}>
                      {imgUrl ? (
                        <img 
                          src={imgUrl} 
                          alt={exactName} 
                          className="full-card-art" 
                          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }} 
                        />
                      ) : (
                        <div 
                          className="full-card-placeholder" 
                          style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#fff', fontSize: '12px', textAlign: 'center', padding: '4px', borderRadius: '8px' }}
                        >
                          {exactName}
                        </div>
                      )}
                    </div>

                    <div className="card-overlay-actions">
                      <button
                        className={`stylized-btn upgrade-toggle ${card.upgraded ? 'active' : ''}`}
                        onClick={() => handleToggleCardUpgrade(card.id)}
                        title={card.upgraded ? 'Downgrade' : 'Upgrade'}
                      >
                        {card.upgraded ? '✦ Upgraded' : '✧ Upgrade'}
                      </button>

                      <button
                        style={{ marginRight: '0px'}}
                        className="stylized-btn remove-card danger"
                        onClick={() => handleRemoveCard(card.id)}
                        title="Remove from deck"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* RELICS TAB */}
        {activeTab === 'relics' && (
          <div className="relics-section">
            <div className="add-relic-picker">
              <input
                type="text"
                className="sts-input"
                placeholder="Search relics..."
                value={relicSearch}
                onChange={(e) => setRelicSearch(e.target.value)}
              />
              {relicSearch && (
                <div className="card-search-results">
                  {RELIC_CATALOG.filter((r) => r.name.toLowerCase().includes(relicSearch.toLowerCase())).slice(0, 20).map((relic) => (
                    <div key={relic.id} className="search-result-item" onClick={() => handleAddRelic(relic)}>
                      <span style={{ paddingRight: '8px' }}>+ {relic.name}</span>
                      <span className="rarity-tag">{relic.rarity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relics-list">
              {character.relics.map((relic) => {
                const relicImgName = (relic.imageFileName || '0').replace(/\.png$/, '');
                const imgUrl = getAssetUrl('relics', relicImgName);

                return (
                  <div key={relic.id} className="relic-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={relic.name} className="relic-icon" style={{ width: '175px', height: '175px', objectFit: 'contain', paddingTop: '10px'}} />
                    ) : (
                      <div className="relic-badge" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗿</div>
                    )}
                    <div className="relic-info" style={{ flex: 1 }}>
                      <div className="relic-name" style={{ fontWeight: 'bold' }}>{relic.name}</div>
                      <div className="relic-desc" style={{ fontSize: '12px', opacity: 0.8 }}>{relic.description}</div>
                    </div>
                    <button className="sts-btn danger small" onClick={() => handleRemoveRelic(relic.id)}>✕</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* POTIONS TAB */}
        {activeTab === 'potions' && (
          <div className="potions-section">
            <div className="potion-slots" style={{ display: 'flex', gap: '12px' }}>
              {[0, 1, 2].map((slotIdx) => {
                const potion = character.potions[slotIdx];
                const potionImgName = potion ? (potion.imageFileName || '0').replace(/\.png$/, '') : null;
                const imgUrl = potionImgName ? getAssetUrl('potions', potionImgName) : null;

                return (
                  <div key={slotIdx} className="potion-slot" style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px' }}>
                    <div className="slot-header" style={{ fontSize: '12px', marginBottom: '6px', opacity: 0.7 }}>Potion Slot {slotIdx + 1}</div>
                    {potion ? (
                      <div className="potion-filled" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        {imgUrl ? (
                          <img src={imgUrl} alt={potion.name} className="potion-art" style={{ width: '36px', height: '36px', objectFit: 'contain', marginBottom: '6px' }} />
                        ) : (
                          <div className="potion-badge" style={{ fontSize: '24px', marginBottom: '6px' }}>🧪</div>
                        )}
                        <div className="potion-title" style={{ fontWeight: 'bold', fontSize: '13px' }}>{potion.name}</div>
                        {/* <div className="potion-effect" style={{ fontSize: '11px', margin: '4px 0 8px 0', opacity: 0.8 }}>{potion.effect}</div> */}
                        <button className="sts-btn secondary small" onClick={() => handleSetPotion(slotIdx, null)}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="potion-empty" style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{ fontSize: '12px', marginBottom: '8px', opacity: 0.5 }}>Empty Slot</p>
                        <select
                          className="sts-input"
                          onChange={(e) => {
                            const p = POTION_CATALOG.find((p) => p.id === e.target.value);
                            if (p) handleSetPotion(slotIdx, p);
                          }}
                          value=""
                          style={{ width: '100%', fontSize: '11px' }}
                        >
                          <option value="" disabled>+ Add Potion</option>
                          {POTION_CATALOG.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
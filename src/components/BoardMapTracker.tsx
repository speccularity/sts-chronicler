import React, { useState } from 'react';
import { type MapNode, type NodeType } from '../types/sts';

interface BoardMapTrackerProps {
  nodes: MapNode[];
  currentNodeId: string | null;
  onUpdateNode: (nodeId: string, updates: Partial<MapNode>) => void;
  onSetCurrentNode: (nodeId: string) => void;
}

type SlotType = NodeType | 'variable';

interface LayoutNode {
  id: string;
  defaultType: SlotType;
  isFixed: boolean;
}

interface FloorLayout {
  floor: number;
  slots: LayoutNode[];
}

const NODE_TYPES: { type: NodeType | 'variable'; label: string; icon: string; color: string }[] = [
  { type: 'variable', label: 'Empty Slot', icon: '◌', color: '#95a5a6' },
  { type: 'enemy', label: 'Monster', icon: '💀', color: '#e74c3c' },
  { type: 'elite', label: 'Elite', icon: '👹', color: '#9b59b6' },
  { type: 'event', label: 'Event (?)', icon: '❓', color: '#f1c40f' },
  { type: 'rest', label: 'Bonfire', icon: '🔥', color: '#e67e22' },
  { type: 'shop', label: 'Shop', icon: '🛒', color: '#2ecc71' },
  { type: 'treasure', label: 'Treasure', icon: '💎', color: '#3498db' },
  { type: 'boss', label: 'Boss', icon: '👑', color: '#d35400' },
];

// Helper to generate floor layouts quickly
const buildFloor = (actId: string, floor: number, slotTypes: SlotType[]): FloorLayout => ({
  floor,
  slots: slotTypes.map((type, index) => ({
    id: `${actId}-f${floor}-s${index}`,
    defaultType: type,
    isFixed: type !== 'variable',
  })),
});

const BOARD_LAYOUTS: Record<string, FloorLayout[]> = {
  ACT_1: [
    buildFloor('act1', 13, ['boss']),
    buildFloor('act1', 12, ['rest', 'rest', 'rest', 'rest']),
    buildFloor('act1', 11, ['variable', 'shop', 'variable', 'event']),
    buildFloor('act1', 10, ['variable', 'enemy', 'event', 'variable']),
    buildFloor('act1', 9, ['variable', 'variable', 'variable']),
    buildFloor('act1', 8, ['enemy', 'event', 'variable', 'enemy']),
    buildFloor('act1', 7, ['treasure', 'treasure', 'treasure']),
    buildFloor('act1', 6, ['variable', 'variable', 'variable']),
    buildFloor('act1', 5, ['variable', 'enemy', 'variable', 'variable']),
    buildFloor('act1', 4, ['enemy', 'variable', 'event', 'event']),
    buildFloor('act1', 3, ['event', 'enemy', 'enemy']),
    buildFloor('act1', 2, ['event', 'event', 'event']),
    buildFloor('act1', 1, ['enemy']),
  ],
  ACT_1_ALT: [
    buildFloor('act1-alt', 13, ['boss']),
    buildFloor('act1-alt', 12, ['rest', 'rest', 'rest', 'rest']),
    buildFloor('act1-alt', 11, ['event', 'variable', 'variable', 'event']),
    buildFloor('act1-alt', 10, ['elite', 'variable', 'event', 'variable']),
    buildFloor('act1-alt', 9, ['variable', 'event', 'variable', 'variable']),
    buildFloor('act1-alt', 8, ['enemy', 'variable', 'variable']),
    buildFloor('act1-alt', 7, ['treasure', 'treasure', 'treasure', 'treasure']),
    buildFloor('act1-alt', 6, ['event', 'variable', 'enemy', 'variable']),
    buildFloor('act1-alt', 5, ['variable', 'enemy', 'variable', 'variable']),
    buildFloor('act1-alt', 4, ['shop', 'variable', 'event', 'enemy']),
    buildFloor('act1-alt', 3, ['enemy', 'enemy', 'event']),
    buildFloor('act1-alt', 2, ['event', 'event', 'event']),
    buildFloor('act1-alt', 1, ['enemy']),
  ],
  ACT_2: [
    buildFloor('act2', 14, ['boss']),
    buildFloor('act2', 13, ['rest', 'rest', 'rest']),
    buildFloor('act2', 12, ['enemy', 'enemy', 'enemy']),
    buildFloor('act2', 11, ['variable', 'shop', 'variable']),
    buildFloor('act2', 10, ['elite', 'elite']),
    buildFloor('act2', 9, ['variable', 'variable', 'variable']),
    buildFloor('act2', 8, ['treasure', 'treasure']),
    buildFloor('act2', 7, ['variable', 'event', 'variable']),
    buildFloor('act2', 6, ['elite', 'elite']),
    buildFloor('act2', 5, ['variable', 'variable', 'variable']),
    buildFloor('act2', 4, ['event', 'variable', 'event']),
    buildFloor('act2', 3, ['variable', 'enemy', 'variable']),
    buildFloor('act2', 2, ['event', 'event', 'event']),
    buildFloor('act2', 1, ['enemy']),
  ],
  ACT_3: [
    buildFloor('act3', 14, ['boss']),
    buildFloor('act3', 13, ['rest', 'rest', 'rest']),
    buildFloor('act3', 12, ['enemy', 'enemy', 'enemy']),
    buildFloor('act3', 11, ['variable', 'shop', 'variable']),
    buildFloor('act3', 10, ['elite', 'elite']),
    buildFloor('act3', 9, ['variable', 'variable', 'variable']),
    buildFloor('act3', 8, ['treasure', 'treasure']),
    buildFloor('act3', 7, ['event', 'variable', 'event']),
    buildFloor('act3', 6, ['elite', 'elite']),
    buildFloor('act3', 5, ['variable', 'variable', 'variable']),
    buildFloor('act3', 4, ['enemy', 'event', 'variable']),
    buildFloor('act3', 3, ['variable', 'variable', 'event']),
    buildFloor('act3', 2, ['event', 'event', 'event']),
    buildFloor('act3', 1, ['enemy']),
  ],
};

export const BoardMapTracker: React.FC<BoardMapTrackerProps> = ({ nodes, currentNodeId, onUpdateNode, onSetCurrentNode }) => {
  const [activeAct, setActiveAct] = useState<'ACT_1' | 'ACT_1_ALT' | 'ACT_2' | 'ACT_3'>('ACT_1');
  const currentLayout = BOARD_LAYOUTS[activeAct];
  const actOptions: Array<{ key: 'ACT_1' | 'ACT_1_ALT' | 'ACT_2' | 'ACT_3'; label: string }> = [
    { key: 'ACT_1', label: 'Act 1' },
    { key: 'ACT_1_ALT', label: 'Act 1 (Alternate)' },
    { key: 'ACT_2', label: 'Act 2' },
    { key: 'ACT_3', label: 'Act 3' },
  ];

  return (
    <div className="board-map-tracker">
      <div className="map-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3>Act Board & Map Token Tracker</h3>
        <p className="map-instructions">
          Select map tokens for empty slots. Click a node's icon to move the Party Pawn.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
          {actOptions.map((act) => (
            <button
              key={act.key}
              onClick={() => setActiveAct(act.key)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeAct === act.key ? '#3498db' : '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeAct === act.key ? 'bold' : 'normal'
              }}
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-grid" style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', padding: '20px', backgroundColor: '#1a1a2e', borderRadius: '8px' }}>
        {currentLayout.map((floorObj) => (
          <div key={floorObj.floor} className="map-row" style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'center', position: 'relative' }}>
            
            <div className="row-label" style={{ position: 'absolute', left: 0, color: '#95a5a6', fontSize: '0.85rem' }}>
              Floor {floorObj.floor}
            </div>

            <div className="row-nodes" style={{ display: 'flex', gap: '24px' }}>
              {floorObj.slots.map((slot) => {
                const stateNode = nodes.find(n => n.id === slot.id);
                const activeType = stateNode?.type === 'unknown' ? 'variable' : (stateNode?.type || slot.defaultType);
                const selectedType = activeType === 'variable' ? 'variable' : activeType;
                const nodeTypeInfo = NODE_TYPES.find((t) => t.type === selectedType) || NODE_TYPES[0];
                const isCurrent = slot.id === currentNodeId;

                return (
                  <div
                    key={slot.id}
                    className={`map-node-card ${isCurrent ? 'active-pawn' : ''}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      width: '80px',
                      padding: '8px',
                      borderRadius: '8px',
                      backgroundColor: isCurrent ? 'rgba(52, 152, 219, 0.2)' : 'transparent',
                      border: isCurrent ? '2px solid #3498db' : '2px solid transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCurrent && <div className="pawn-badge" style={{ fontSize: '0.75rem', color: '#3498db', fontWeight: 'bold' }}>PARTY</div>}

                    <div 
                      className="node-icon" 
                      onClick={() => onSetCurrentNode(slot.id)}
                      style={{ 
                        backgroundColor: nodeTypeInfo.color, 
                        width: '45px', 
                        height: '45px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        borderRadius: '50%', 
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                        opacity: activeType === 'variable' ? 0.5 : 1
                      }}
                      title="Click to place pawn here"
                    >
                      {nodeTypeInfo.icon}
                    </div>

                    <div className="node-details" style={{ width: '100%' }}>
                      {slot.isFixed ? (
                        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#bdc3c7', padding: '4px 0' }}>
                          {nodeTypeInfo.label}
                        </div>
                      ) : (
                        <select
                          className="node-type-select"
                          value={selectedType}
                          onChange={(e) => {
                            const nextType = e.target.value === 'variable' ? 'unknown' : (e.target.value as NodeType);
                            onUpdateNode(slot.id, { type: nextType });
                          }}
                          style={{ width: '100%', fontSize: '0.75rem', padding: '2px', backgroundColor: '#2c3e50', color: 'white', border: '1px solid #7f8c8d', borderRadius: '4px' }}
                        >
                          {NODE_TYPES.map((t) => (
                            <option key={t.type} value={t.type}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
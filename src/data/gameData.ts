import { type Card, type Relic, type Potion, type CharacterType } from '../types/sts';

export const ACT_BOSSES: Record<number, string[]> = {
  1: ['The Guardian', 'Hexaghost', 'Slime Boss'],
  2: ['Automaton', 'Champ', 'Collector'],
  3: ['Awakened One', 'Donu & Deca', 'Time Eater'],
  4: ['Corrupt Heart'],
};

export const CHARACTER_DETAILS: Record<CharacterType, { name: string; maxHp: number; color: string; portrait: string }> = {
  ironclad: { name: 'Ironclad', maxHp: 10, color: '#aa2a2a', portrait: 'Red' },
  silent: { name: 'Silent', maxHp: 10, color: '#2aaa55', portrait: 'Green' },
  defect: { name: 'Defect', maxHp: 10, color: '#2a7aaa', portrait: 'Blue' },
  watcher: { name: 'Watcher', maxHp: 10, color: '#aa7aaa', portrait: 'Purple' },
};

// Starter Cards Database
export const STARTER_CARDS: Record<CharacterType, Card[]> = {
  ironclad: [
    { id: 'ic-strike-1', name: 'Strike', character: 'ironclad', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'ic-strike-2', name: 'Strike', character: 'ironclad', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'ic-strike-3', name: 'Strike', character: 'ironclad', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'ic-strike-4', name: 'Strike', character: 'ironclad', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'ic-defend-1', name: 'Defend', character: 'ironclad', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'ic-defend-2', name: 'Defend', character: 'ironclad', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'ic-defend-3', name: 'Defend', character: 'ironclad', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'ic-defend-4', name: 'Defend', character: 'ironclad', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'ic-bash', name: 'Bash', character: 'ironclad', type: 'Attack', cost: 2, upgraded: false, imageFileName: '2.png', description: 'Deal 8 damage. Apply 2 Vulnerable.' },
  ],
  silent: [
    { id: 'sil-strike-1', name: 'Strike', character: 'silent', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'sil-strike-2', name: 'Strike', character: 'silent', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'sil-strike-3', name: 'Strike', character: 'silent', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'sil-strike-4', name: 'Strike', character: 'silent', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'sil-defend-1', name: 'Defend', character: 'silent', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'sil-defend-2', name: 'Defend', character: 'silent', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'sil-defend-3', name: 'Defend', character: 'silent', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'sil-defend-4', name: 'Defend', character: 'silent', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'sil-defend-5', name: 'Defend', character: 'silent', type: 'Skill', cost: 1, upgraded: false, imageFileName: '1.png', description: 'Gain 5 Block.' },
    { id: 'sil-neutralize', name: 'Neutralize', character: 'silent', type: 'Attack', cost: 0, upgraded: false, imageFileName: '2.png', description: 'Deal 3 damage. Apply 1 Weak.' },
    { id: 'sil-survivor', name: 'Survivor', character: 'silent', type: 'Skill', cost: 1, upgraded: false, imageFileName: '6.png', description: 'Gain 8 Block. Discard 1 card.' },
  ],
  defect: [
    { id: 'def-strike-1', name: 'Strike', character: 'defect', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'def-strike-2', name: 'Strike', character: 'defect', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'def-strike-3', name: 'Strike', character: 'defect', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'def-strike-4', name: 'Strike', character: 'defect', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'def-defend-1', name: 'Defend', character: 'defect', type: 'Skill', cost: 1, upgraded: false, imageFileName: '2.png', description: 'Gain 5 Block.' },
    { id: 'def-defend-2', name: 'Defend', character: 'defect', type: 'Skill', cost: 1, upgraded: false, imageFileName: '2.png', description: 'Gain 5 Block.' },
    { id: 'def-defend-3', name: 'Defend', character: 'defect', type: 'Skill', cost: 1, upgraded: false, imageFileName: '2.png', description: 'Gain 5 Block.' },
    { id: 'def-defend-4', name: 'Defend', character: 'defect', type: 'Skill', cost: 1, upgraded: false, imageFileName: '2.png', description: 'Gain 5 Block.' },
    { id: 'def-zap', name: 'Zap', character: 'defect', type: 'Skill', cost: 1, upgraded: false, imageFileName: '4.png', description: 'Channel 1 Lightning.' },
    { id: 'def-dual-cast', name: 'Dual Cast', character: 'defect', type: 'Skill', cost: 1, upgraded: false, imageFileName: '6.png', description: 'Evoke your Orb 2 times.' },
  ],
  watcher: [
    { id: 'wat-strike-1', name: 'Strike', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'wat-strike-2', name: 'Strike', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'wat-strike-3', name: 'Strike', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'wat-strike-4', name: 'Strike', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: '0.png', description: 'Deal 6 damage.' },
    { id: 'wat-defend-1', name: 'Defend', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: '4.png', description: 'Gain 5 Block.' },
    { id: 'wat-defend-2', name: 'Defend', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: '4.png', description: 'Gain 5 Block.' },
    { id: 'wat-defend-3', name: 'Defend', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: '4.png', description: 'Gain 5 Block.' },
    { id: 'wat-defend-4', name: 'Defend', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: '4.png', description: 'Gain 5 Block.' },
    { id: 'wat-eruption', name: 'Eruption', character: 'watcher', type: 'Attack', cost: 2, upgraded: false, imageFileName: '8.png', description: 'Deal 9 damage. Enter Wrath.' },
    { id: 'wat-vigilance', name: 'Vigilance', character: 'watcher', type: 'Skill', cost: 2, upgraded: false, imageFileName: '9.png', description: 'Gain 8 Block. Enter Calm.' },
  ],
};

// Named Watcher Cards Reference
export const WATCHER_NAMED_CARDS: Card[] = [
  { id: 'w-battle-hymn', name: 'Battle Hymn', character: 'watcher', type: 'Power', cost: 1, upgraded: false, imageFileName: 'Battle_Hymn.png', description: 'At the start of your turn, add a Smite into your hand.' },
  { id: 'w-carve-reality', name: 'Carve Reality', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Carve Reality.png', description: 'Deal 6 damage. Add a Smite into your hand.' },
  { id: 'w-collect', name: 'Collect', character: 'watcher', type: 'Skill', cost: 'X', upgraded: false, imageFileName: 'Collect.png', description: 'Put a Miracle+ into your hand at the start of your next X turns.' },
  { id: 'w-conclude', name: 'Conclude', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Conclude.png', description: 'Deal 12 damage to ALL enemies. End your turn.' },
  { id: 'w-consecrate', name: 'Consecrate', character: 'watcher', type: 'Attack', cost: 0, upgraded: false, imageFileName: 'Consecrate.png', description: 'Deal 5 damage to ALL enemies.' },
  { id: 'w-crescendo', name: 'Crescendo', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: 'Crescendo.png', description: 'Retain. Enter Wrath.' },
  { id: 'w-crush-joints', name: 'Crush Joints', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Crush_Joints.png', description: 'Deal 8 damage. If previous card was a Skill, apply 1 Vulnerable.' },
  { id: 'w-cut-fate', name: 'Cut Through Fate', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Cut_Through_Fate.png', description: 'Deal 7 damage. Scry 2. Draw 1 card.' },
  { id: 'w-empty-body', name: 'Empty Body', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: 'Empty_Body.png', description: 'Gain 7 Block. Exit your Stance.' },
  { id: 'w-empty-fist', name: 'Empty Fist', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Empty_Fist.png', description: 'Deal 9 damage. Exit your Stance.' },
  { id: 'w-empty-mind', name: 'Empty Mind', character: 'watcher', type: 'Skill', cost: 1, upgraded: false, imageFileName: 'Empty_Mind.png', description: 'Exit your Stance. Draw 2 cards.' },
  { id: 'w-fear-no-evil', name: 'Fear No Evil', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Fear_No_Evil.png', description: 'Deal 8 damage. If enemy intends to Attack, enter Calm.' },
  { id: 'w-flurry', name: 'Flurry of Blows', character: 'watcher', type: 'Attack', cost: 0, upgraded: false, imageFileName: 'Flurry_of_Blows.png', description: 'Deal 4 damage. On Stance change, return to hand.' },
  { id: 'w-flying-sleeves', name: 'Flying Sleeves', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Flying_Sleeves.png', description: 'Retain. Deal 4 damage twice.' },
  { id: 'w-rushdown', name: 'Rushdown', character: 'watcher', type: 'Power', cost: 1, upgraded: false, imageFileName: 'Rushdown.png', description: 'Whenever you enter Wrath, draw 2 cards.' },
  { id: 'w-talk-hand', name: 'Talk to the Hand', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Talk_to_the_Hand.png', description: 'Deal 5 damage. Whenever you attack this enemy, gain 2 Block.' },
  { id: 'w-tantrum', name: 'Tantrum', character: 'watcher', type: 'Attack', cost: 1, upgraded: false, imageFileName: 'Tantrum.png', description: 'Deal 3 damage 3 times. Enter Wrath. Shuffle into draw pile.' },
  { id: 'w-wallop', name: 'Wallop', character: 'watcher', type: 'Attack', cost: 2, upgraded: false, imageFileName: 'Wallop.png', description: 'Deal 9 damage. Gain Block equal to unblocked damage dealt.' },
];

export const SAMPLE_RELICS: Relic[] = [
  { id: 'r-burning-blood', name: 'Burning Blood', rarity: 'Starter', description: 'At the end of combat, heal 6 HP.', imageFileName: 'Burning Blood.png' },
  { id: 'r-ring-snake', name: 'Ring of the Snake', rarity: 'Starter', description: 'At the start of combat, draw 2 additional cards.', imageFileName: 'Ring of the Snake.png' },
  { id: 'r-cracked-core', name: 'Cracked Core', rarity: 'Starter', description: 'At the start of combat, Channel 1 Lightning.', imageFileName: 'Cracked Core.png' },
  { id: 'r-pure-water', name: 'Pure Water', rarity: 'Starter', description: 'At the start of combat, add a Miracle to your hand.', imageFileName: 'Pure Water.png' },
  { id: 'r-akabeko', name: 'Akabeko', rarity: 'Common', description: 'Your first attack each combat deals 8 additional damage.', imageFileName: 'Akabeko.png' },
  { id: 'r-anchor', name: 'Anchor', rarity: 'Common', description: 'Start each combat with 10 Block.', imageFileName: 'Anchor.png' },
  { id: 'r-bag-preparation', name: 'Bag of Preparation', rarity: 'Common', description: 'At the start of combat, gain 1 Block for each card in your deck.', imageFileName: 'Bag of Preparation.png' },
  { id: 'r-black-blood', name: 'Black Blood', rarity: 'Boss', description: 'Replaces Burning Blood. Heal 12 HP at combat end.', imageFileName: 'Black Blood.png' },
];

export const SAMPLE_POTIONS: Potion[] = [
  { id: 'p-blood', name: 'Blood Potion', effect: 'Heal 20% of Max HP.', imageFileName: 'Blood Potion.png' },
  { id: 'p-block', name: 'Block Potion', effect: 'Gain 12 Block.', imageFileName: 'Block Potion.png' },
  { id: 'p-dexterity', name: 'Dexterity Potion', effect: 'Gain 2 Dexterity.', imageFileName: 'Dexterity Potion.png' },
  { id: 'p-strength', name: 'Strength Potion', effect: 'Gain 2 Strength.', imageFileName: 'Strength Potion.png' },
  { id: 'p-fire', name: 'Fire Potion', effect: 'Deal 20 damage to target enemy.', imageFileName: 'Fire Potion.png' },
  { id: 'p-fairy', name: 'Fairy in a Bottle', effect: 'When killed, heal to 30% HP instead.', imageFileName: 'Fairy in a Bottle.png' },
];
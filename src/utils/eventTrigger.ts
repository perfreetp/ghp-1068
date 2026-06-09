import { GameEvent, GameState, CollectionItem, ResearchClue } from '../types';

export const checkHiddenEvent = (
  event: GameEvent,
  state: { collectionScore: number; reputation: number },
  items: CollectionItem[],
  clues: ResearchClue[]
): boolean => {
  const c = event.condition;

  if (c.minScore && state.collectionScore < c.minScore) return false;
  if (c.minReputation && state.reputation < c.minReputation) return false;

  if (c.requiredCollections && c.requiredCollections.length > 0) {
    const ownedIds = items
      .filter(i => i.location !== 'auction')
      .map(i => i.id);
    if (!c.requiredCollections.every(id => ownedIds.includes(id))) return false;
  }

  if (c.requiredClues && c.requiredClues.length > 0) {
    const unlockedClueIds = clues.filter(clue => clue.unlocked).map(clue => clue.id);
    if (!c.requiredClues.every(id => unlockedClueIds.includes(id))) return false;
  }

  if (c.randomChance !== undefined) {
    if (Math.random() > c.randomChance) return false;
  }

  return true;
};

export const processTriggeredEvents = (
  events: GameEvent[],
  state: { collectionScore: number; reputation: number },
  items: CollectionItem[],
  clues: ResearchClue[],
  currentCycle: number
): { updated: GameEvent[]; triggered: GameEvent[] } => {
  const triggered: GameEvent[] = [];
  
  const updated = events.map(event => {
    if (event.triggered) return event;
    
    const shouldTrigger = checkHiddenEvent(event, state, items, clues);
    if (shouldTrigger) {
      const newEvent = {
        ...event,
        triggered: true,
        cycle: currentCycle,
        triggerCycle: currentCycle
      };
      triggered.push(newEvent);
      return newEvent;
    }
    return event;
  });

  return { updated, triggered };
};

export const applyEventReward = (
  event: GameEvent,
  applyBudget: (amount: number) => void,
  applyReputation: (amount: number) => void
): { message: string; type: 'success' | 'info' | 'warning' } => {
  if (!event.reward) {
    return { message: `${event.title}事件已触发！`, type: 'info' };
  }

  const { type, value, label } = event.reward;
  
  switch (type) {
    case 'budget': {
      const amount = typeof value === 'number' ? value : 0;
      applyBudget(amount);
      return {
        message: `${event.title}！${label}`,
        type: amount >= 0 ? 'success' : 'warning'
      };
    }
    case 'reputation': {
      const amount = typeof value === 'number' ? value : 0;
      applyReputation(amount);
      return {
        message: `${event.title}！${label}`,
        type: 'success'
      };
    }
    case 'collection':
      return {
        message: `${event.title}！${label}`,
        type: 'success'
      };
    case 'clue':
      return {
        message: `${event.title}！${label}`,
        type: 'success'
      };
    default:
      return { message: `${event.title}事件已触发！`, type: 'info' };
  }
};

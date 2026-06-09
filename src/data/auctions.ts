import { AuctionOpponent } from '../types';

export const AUCTION_OPPONENTS: AuctionOpponent[] = [
  {
    id: 'opp-001',
    name: '古董张',
    avatar: '🧔',
    style: 'aggressive',
    budget: 300000,
    maxBidMultiplier: 1.5
  },
  {
    id: 'opp-002',
    name: '保守派李教授',
    avatar: '👨‍🏫',
    style: 'conservative',
    budget: 150000,
    maxBidMultiplier: 0.8
  },
  {
    id: 'opp-003',
    name: '神秘买家#42',
    avatar: '🎭',
    style: 'random',
    budget: 200000,
    maxBidMultiplier: 1.2
  },
  {
    id: 'opp-004',
    name: '星河收藏家王总',
    avatar: '👨‍💼',
    style: 'aggressive',
    budget: 500000,
    maxBidMultiplier: 1.6
  },
  {
    id: 'opp-005',
    name: '日本收藏家佐藤',
    avatar: '👨‍🦳',
    style: 'conservative',
    budget: 250000,
    maxBidMultiplier: 0.9
  }
];

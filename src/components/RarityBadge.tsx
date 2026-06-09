import React from 'react';
import { Rarity, RARITY_COLORS, RARITY_NAMES } from '../types';

interface RarityBadgeProps {
  rarity: Rarity;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
}

const sizeMap = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5'
};

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'md',
  showName = true
}) => {
  const color = RARITY_COLORS[rarity];
  const name = RARITY_NAMES[rarity];
  const starCount = {
    common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5
  }[rarity];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${sizeMap[size]}`}
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}55`,
        textShadow: rarity === 'legendary' ? `0 0 8px ${color}66` : 'none'
      }}
    >
      <span className={size === 'sm' ? 'text-[8px]' : ''}>
        {'★'.repeat(starCount)}
      </span>
      {showName && <span>{name}</span>}
    </span>
  );
};

export default RarityBadge;

import React from 'react';
import { CollectionItem, CATEGORY_ICONS } from '../types';
import { RarityBadge } from './RarityBadge';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency } from '../utils/formatters';
import { Search, Wrench, Puzzle } from 'lucide-react';

interface CollectionCardProps {
  item: CollectionItem;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  draggable?: boolean;
  showActions?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  item,
  size = 'md',
  onClick,
  draggable = false,
  showActions = false
}) => {
  const selectedId = useGameStore(s => s.selectedCollectionId);
  const setSelected = useGameStore(s => s.setSelectedCollection);
  const setDragging = useGameStore(s => s.setDragging);
  const isSelected = selectedId === item.id;

  const sizeClasses = {
    sm: 'p-2 text-xs',
    md: 'p-3 text-sm',
    lg: 'p-5 text-base'
  }[size];

  const iconSize = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl'
  }[size];

  const handleClick = () => {
    setSelected(isSelected ? null : item.id);
    onClick?.();
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('collectionId', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragging(true, item.id);
  };

  const handleDragEnd = () => {
    setDragging(false, null);
  };

  return (
    <div
      draggable={draggable && item.location === 'warehouse'}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={`
        card-museum relative cursor-pointer rarity-glow-${item.rarity}
        ${sizeClasses}
        ${isSelected ? 'ring-4 ring-museum-brass ring-offset-2 scale-[1.02]' : ''}
        ${draggable && item.location === 'warehouse' ? 'cursor-grab active:cursor-grabbing' : ''}
        group
      `}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2 gap-2">
          <RarityBadge rarity={item.rarity} size="sm" />
          <span className="font-mono text-xs text-museum-ink/50">{item.score}分</span>
        </div>

        <div
          className={`${iconSize} text-center mb-2 transition-transform group-hover:scale-110`}
          style={{ filter: `drop-shadow(0 2px 6px ${item.color}55)` }}
        >
          {item.image || CATEGORY_ICONS[item.category]}
        </div>

        <div className="font-serif font-bold text-museum-ink mb-1 line-clamp-1 text-center">
          {item.name}
        </div>

        {size !== 'sm' && (
          <>
            <div className="flex items-center justify-center gap-1 text-xs text-museum-darkgreen/70 mb-2">
              <span>{CATEGORY_ICONS[item.category]}</span>
              <span>{item.categoryName}</span>
              <span>·</span>
              <span className="font-mono">
                {item.isAuthenticated ? `${item.actualYear}年` : '未鉴定'}
              </span>
            </div>

            <div className="space-y-1 mb-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-museum-ink/60">
                  <Search className="w-3 h-3" />
                  鉴定
                </span>
                <span className={item.isAuthenticated ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                  {item.isAuthenticated ? '✓ 已完成' : '待处理'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-museum-ink/60">
                  <Wrench className="w-3 h-3" />
                  修复
                </span>
                <span className={item.isRestored ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                  {item.isRestored ? '✓ 已完成' : '待处理'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 text-museum-ink/60">
                  <Puzzle className="w-3 h-3" />
                  配件
                </span>
                <span className="font-mono text-museum-darkgreen">
                  {item.accessoriesMatched}/{item.accessoriesTotal}
                </span>
              </div>
            </div>

            {size === 'lg' && (
              <div className="pt-2 border-t border-museum-brass/20 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-museum-ink/60">估值</span>
                  <span className="font-mono font-bold text-museum-brass">
                    {formatCurrency(item.estimatedValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-museum-ink/60">位置</span>
                  <span className="font-semibold">
                    {item.location === 'warehouse' ? '仓库' : item.location === 'exhibition' ? '展厅' : '拍卖中'}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {showActions && size !== 'sm' && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!item.isAuthenticated && (
              <span className="inline-block px-1.5 py-0.5 rounded bg-blue-500/90 text-white text-[10px] font-medium">
                可鉴定
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionCard;

import React from 'react';
import { Calendar, Wallet, Star, Trophy, Sparkles } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency } from '../utils/formatters';
import { ModuleType, GamePhase } from '../types';

const navItems: { key: ModuleType; label: string }[] = [
  { key: 'hall', label: '展厅地图' },
  { key: 'warehouse', label: '仓库整理' },
  { key: 'visitors', label: '访客反馈' },
  { key: 'research', label: '研究台' },
  { key: 'auction', label: '拍卖会' },
  { key: 'planning', label: '展览策划' },
  { key: 'settlement', label: '结算面板' },
];

const phaseLabels: Record<GamePhase, string> = {
  planning: '规划阶段',
  exhibition: '展览阶段',
  settlement: '结算阶段',
};

const phaseColors: Record<GamePhase, string> = {
  planning: 'bg-museum-slateblue',
  exhibition: 'bg-museum-darkgreen',
  settlement: 'bg-museum-brass',
};

export const Header: React.FC = () => {
  const {
    cycle,
    phase,
    budget,
    reputation,
    collectionScore,
    currentModule,
    setCurrentModule,
    advanceCycle,
  } = useGameStore();

  const isSettlementPhase = phase === 'settlement';
  const reputationStars = Math.min(5, Math.max(1, Math.ceil(reputation / 20)));

  return (
    <header className="bg-museum-darkgreen border-b-4 border-museum-brass shadow-lg relative z-50">
      <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-museum-gold to-museum-brass flex items-center justify-center shadow-glow-brass">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold font-serif text-museum-cream tracking-wider leading-tight">
              产品考古馆
            </h1>
            <p className="text-xs text-museum-brass/80 font-serif tracking-[0.2em] mt-0.5">
              星河科技历史馆
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-1 bg-museum-brown/40 rounded-xl p-1.5 border border-museum-brass/30">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setCurrentModule(item.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                currentModule === item.key
                  ? 'bg-gradient-to-r from-museum-gold to-museum-brass text-museum-ink shadow-glow-brass font-semibold'
                  : 'text-museum-cream/80 hover:text-museum-cream hover:bg-museum-cream/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-museum-brown/50 rounded-lg border border-museum-brass/30">
              <Calendar className="w-4 h-4 text-museum-brass" />
              <span className="text-museum-cream font-semibold text-sm">
                第{cycle}周期
              </span>
              <span
                className={`${phaseColors[phase]} text-white text-xs px-2 py-0.5 rounded-full font-medium`}
              >
                {phaseLabels[phase]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-museum-brown/50 rounded-lg border border-museum-brass/30">
            <Wallet className="w-4 h-4 text-museum-brass" />
            <span className="text-museum-cream font-semibold text-sm tabular-nums">
              {formatCurrency(budget)}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-museum-brown/50 rounded-lg border border-museum-brass/30">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < reputationStars
                      ? 'text-museum-gold fill-museum-gold'
                      : 'text-museum-cream/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-museum-cream font-semibold text-sm tabular-nums w-8 text-right">
              {reputation}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-museum-brown/50 rounded-lg border border-museum-brass/30">
            <Trophy className="w-4 h-4 text-museum-brass" />
            <span className="text-museum-cream font-semibold text-sm tabular-nums">
              {collectionScore}
            </span>
          </div>

          <button
            onClick={advanceCycle}
            disabled={!isSettlementPhase}
            className={`px-5 py-2 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 ${
              isSettlementPhase
                ? 'bg-gradient-to-br from-museum-gold to-museum-brass text-museum-ink shadow-glow-brass hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-museum-brown/60 text-museum-cream/40 cursor-not-allowed border border-museum-brass/20'
            }`}
          >
            <Calendar className="w-5 h-5" />
            进入结算
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

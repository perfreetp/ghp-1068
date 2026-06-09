import React from 'react';
import { X, Gift, Star, Sparkles, Trophy, Target, Zap } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency } from '../utils/formatters';
import { EventType } from '../types';

const typeConfig: Record<EventType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  random: {
    label: '随机事件',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-museum-brass',
    bgColor: 'bg-museum-brass/15 border-museum-brass/50',
  },
  milestone: {
    label: '里程碑',
    icon: <Trophy className="w-6 h-6" />,
    color: 'text-museum-gold',
    bgColor: 'bg-museum-gold/15 border-museum-gold/50',
  },
  hidden: {
    label: '隐藏事件',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-museum-slateblue',
    bgColor: 'bg-museum-slateblue/15 border-museum-slateblue/50',
  },
  achievement: {
    label: '成就达成',
    icon: <Star className="w-6 h-6" />,
    color: 'text-museum-wine',
    bgColor: 'bg-museum-wine/15 border-museum-wine/50',
  },
};

export const EventModal: React.FC = () => {
  const { showEventModal, currentEvent, closeEventModal } = useGameStore();

  if (!showEventModal || !currentEvent) return null;

  const config = typeConfig[currentEvent.type];

  const rewardBudget =
    currentEvent.reward?.type === 'budget' ? (currentEvent.reward.value as number) : 0;
  const rewardReputation =
    currentEvent.reward?.type === 'reputation' ? (currentEvent.reward.value as number) : 0;
  const hasOtherReward =
    currentEvent.reward &&
    currentEvent.reward.type !== 'budget' &&
    currentEvent.reward.type !== 'reputation';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-museum-darkgreen/70 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="relative w-full max-w-lg mx-4 card-museum p-8 overflow-hidden"
        style={{ animation: 'zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={closeEventModal}
            className="w-9 h-9 rounded-full bg-museum-parchment/60 flex items-center justify-center text-museum-ink/50 hover:text-museum-ink hover:bg-museum-parchment transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-museum-gold/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-museum-darkgreen/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${config.bgColor} ${config.color} mb-5`}>
            {config.icon}
            <span className="text-sm font-semibold tracking-wide">{config.label}</span>
          </div>

          <div className="flex items-start gap-5 mb-6">
            <div className={`w-20 h-20 rounded-2xl ${config.bgColor} border-2 flex items-center justify-center shrink-0 text-5xl`}>
              {currentEvent.icon}
            </div>
            <div className="flex-1 pt-1">
              <h2 className="text-2xl font-bold font-serif text-museum-darkgreen mb-2 leading-tight">
                {currentEvent.title}
              </h2>
              <p className="text-museum-ink/80 leading-relaxed text-sm">
                {currentEvent.description}
              </p>
            </div>
          </div>

          {currentEvent.reward && (
            <div className="bg-museum-parchment/70 rounded-xl p-5 border-2 border-museum-brass/30 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-museum-brass" />
                <h3 className="font-bold text-museum-darkgreen font-serif">事件奖励</h3>
              </div>
              <div className="space-y-3">
                {rewardBudget !== 0 && (
                  <div className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg border border-museum-brass/20">
                    <span className="text-museum-ink/70 text-sm">预算变动</span>
                    <span
                      className={`font-bold tabular-nums text-lg ${
                        rewardBudget > 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {rewardBudget > 0 ? '+' : ''}
                      {formatCurrency(rewardBudget)}
                    </span>
                  </div>
                )}
                {rewardReputation !== 0 && (
                  <div className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg border border-museum-brass/20">
                    <span className="text-museum-ink/70 text-sm">口碑变动</span>
                    <span
                      className={`font-bold tabular-nums text-lg ${
                        rewardReputation > 0 ? 'text-green-600' : 'text-red-500'
                      }`}
                    >
                      {rewardReputation > 0 ? '+' : ''}
                      {rewardReputation}
                    </span>
                  </div>
                )}
                {hasOtherReward && (
                  <div className="flex items-center justify-between py-2 px-3 bg-white/50 rounded-lg border border-museum-brass/20">
                    <span className="text-museum-ink/70 text-sm">
                      {currentEvent.reward?.label}
                    </span>
                    <span className="font-bold text-museum-darkgreen">
                      {currentEvent.reward?.value as string}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            onClick={closeEventModal}
            className="w-full btn-gold text-base py-3 flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            接受并继续
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default EventModal;

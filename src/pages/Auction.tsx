import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { CollectionCard } from '../components/CollectionCard';
import { RarityBadge } from '../components/RarityBadge';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import { AUCTION_OPPONENTS } from '../data/auctions';
import { Gavel, Clock, Users, Coins, History, SkipForward, LayoutGrid, Timer } from 'lucide-react';

const styleConfig = {
  aggressive: { label: '激进', bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
  conservative: { label: '保守', bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
  random: { label: '随机', bg: 'bg-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' }
};

export default function Auction() {
  const auctionItems = useGameStore(s => s.auctionItems);
  const budget = useGameStore(s => s.budget);
  const placeBid = useGameStore(s => s.placeBid);
  const setNotification = useGameStore(s => s.setNotification);

  const [selectedAuctionId, setSelectedAuctionId] = useState(auctionItems[0]?.id || '');
  const [bidAmount, setBidAmount] = useState(0);
  const [showAllItems, setShowAllItems] = useState(false);

  const currentAuction = auctionItems.find(a => a.id === selectedAuctionId) || auctionItems[0];

  const myBidCount = useMemo(() => {
    return currentAuction?.bidHistory.filter(b => b.bidder === '你').length || 0;
  }, [currentAuction]);

  const quickIncrements = [500, 1000, 5000, 10000];

  const handleQuickBid = (inc: number) => {
    const newAmount = (currentAuction?.currentPrice || 0) + inc;
    setBidAmount(newAmount);
  };

  const handlePlaceBid = () => {
    if (!currentAuction) return;
    if (bidAmount <= currentAuction.currentPrice) {
      setNotification({ message: '出价必须高于当前价格！', type: 'error' });
      return;
    }
    if (budget < bidAmount) {
      setNotification({ message: '预算不足！', type: 'error' });
      return;
    }
    placeBid(currentAuction.id, bidAmount);
    setBidAmount(0);
  };

  const handleSkip = () => {
    setNotification({ message: '已跳过此轮出价', type: 'info' });
  };

  if (!currentAuction) return null;

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold text-museum-darkgreen mb-2 flex items-center gap-3">
            <Gavel className="w-8 h-8 text-museum-brass" />
            🎩 星河复古拍卖会
            <span className="ml-auto text-sm font-sans font-normal text-museum-ink/60 flex gap-4">
              <span className="flex items-center gap-1">
                <LayoutGrid className="w-4 h-4" />
                当前拍品：<span className="font-mono font-bold text-museum-brass">{auctionItems.length}</span>
              </span>
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                剩余时间：<span className="font-mono font-bold text-museum-wine">{currentAuction.timeLeft}轮</span>
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-4 h-4" />
                当前出价：<span className="font-mono font-bold text-museum-darkgreen">{formatCurrency(currentAuction.currentPrice)}</span>
              </span>
              <span className="flex items-center gap-1">
                <History className="w-4 h-4" />
                我的出价：<span className="font-mono font-bold text-museum-brass">{myBidCount}次</span>
              </span>
            </span>
          </h1>
        </div>

        <div className="card-museum p-4 mb-6 border-l-4 border-l-museum-brass bg-gradient-to-r from-museum-brass/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏛️</div>
              <div>
                <div className="text-lg font-serif font-bold text-museum-darkgreen">第 {currentAuction.timeLeft <= 0 ? '拍卖已结束' : `${3 - currentAuction.timeLeft + 1} 轮竞拍进行中`}</div>
                <div className="text-sm text-museum-ink/60">
                  {currentAuction.status === 'active' ? '🔥 正在进行：实时竞价，把握机会！' : `距离下一场：${Math.ceil(Math.random() * 5)}天`}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-museum-ink/60">可用预算</div>
              <div className="text-2xl font-mono font-bold text-museum-darkgreen">{formatCurrency(budget)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 space-y-6">
            <div className="card-museum p-5">
              <h2 className="section-title">当前拍品</h2>
              <CollectionCard item={currentAuction.collection} size="lg" />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between pb-2 border-b border-museum-brass/20">
                  <span className="text-museum-ink/60">起拍价</span>
                  <span className="font-mono font-semibold">{formatFullCurrency(currentAuction.startPrice)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-museum-brass/20">
                  <span className="text-museum-ink/60">当前价</span>
                  <span className="font-mono font-bold text-museum-wine text-lg">{formatFullCurrency(currentAuction.currentPrice)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-museum-brass/20">
                  <span className="text-museum-ink/60">估值</span>
                  <span className="font-mono font-semibold text-museum-brass">{formatCurrency(currentAuction.collection.estimatedValue)}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-museum-brass/20">
                  <span className="text-museum-ink/60">当前轮次</span>
                  <span className="font-semibold">第 {3 - currentAuction.timeLeft + 1} / 3 轮</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-museum-ink/60">剩余出价次数</span>
                  <span className="font-mono font-bold text-museum-darkgreen">{currentAuction.timeLeft}次</span>
                </div>
              </div>
            </div>

            <div className="card-museum p-5">
              <h2 className="section-title flex items-center gap-2">
                <History className="w-4 h-4 text-museum-brass" />
                出价历史
              </h2>
              <div className="relative">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-museum-brass/30" />
                <div className="space-y-4">
                  {currentAuction.bidHistory.length === 0 ? (
                    <div className="text-center py-6 text-museum-ink/40 text-sm">
                      暂无出价记录，成为第一个出价者！
                    </div>
                  ) : (
                    [...currentAuction.bidHistory].reverse().map((bid, idx) => {
                      const isMe = bid.bidder === '你';
                      const opponent = AUCTION_OPPONENTS.find(o => o.name === bid.bidder);
                      return (
                        <div key={idx} className="relative pl-10">
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-sm ${isMe ? 'bg-museum-darkgreen text-museum-cream' : 'bg-museum-brass/20'}`}>
                            {isMe ? '👤' : opponent?.avatar || '🎭'}
                          </div>
                          <div className={`p-3 rounded-lg ${isMe ? 'bg-museum-darkgreen/10 border border-museum-darkgreen/30' : 'bg-museum-parchment/50 border border-museum-brass/20'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className={`font-semibold text-sm ${isMe ? 'text-museum-darkgreen' : 'text-museum-ink'}`}>
                                {bid.bidder}
                              </span>
                              <span className="text-xs text-museum-ink/40 font-mono">
                                {new Date(bid.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="font-mono font-bold text-museum-wine">
                              {formatFullCurrency(bid.amount)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="card-museum p-5 sticky top-6">
              <h2 className="section-title flex items-center gap-2">
                <Gavel className="w-4 h-4 text-museum-brass" />
                竞价区域
              </h2>

              <div className="mb-6">
                <label className="label-museum block mb-2">快捷加价</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {quickIncrements.map(inc => (
                    <button
                      key={inc}
                      onClick={() => handleQuickBid(inc)}
                      className="btn-secondary text-sm py-2 font-mono font-bold hover:bg-museum-brass/20"
                    >
                      +¥{inc.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="label-museum block mb-2">自定义金额</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-museum-brass font-bold">¥</span>
                    <input
                      type="number"
                      value={bidAmount || ''}
                      onChange={e => setBidAmount(Number(e.target.value))}
                      placeholder={`建议高于 ${formatFullCurrency(currentAuction.currentPrice)}`}
                      className="input-museum w-full pl-8 font-mono text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4 p-4 rounded-xl bg-museum-parchment/60 border border-museum-brass/30">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-museum-ink/60">当前最高价</span>
                  <span className="font-mono font-bold text-museum-wine">{formatFullCurrency(currentAuction.currentPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-museum-ink/60">您的出价</span>
                  <span className={`font-mono font-bold ${bidAmount > currentAuction.currentPrice ? 'text-green-600' : 'text-museum-ink/40'}`}>
                    {bidAmount ? formatFullCurrency(bidAmount) : '——'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-museum-ink/60">领先者</span>
                  <span className={`font-semibold ${currentAuction.isLeading ? 'text-green-600' : 'text-museum-ink'}`}>
                    {currentAuction.highestBidder}
                    {currentAuction.isLeading && ' 👑'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePlaceBid}
                  disabled={!bidAmount || bidAmount <= currentAuction.currentPrice || budget < bidAmount || currentAuction.status !== 'active'}
                  className="w-full btn-gold text-lg py-4 flex items-center justify-center gap-2 font-bold"
                >
                  <Gavel className="w-5 h-5" />
                  出价 ({bidAmount ? formatCurrency(bidAmount) : `¥${currentAuction.currentPrice.toLocaleString()}`})
                </button>
                <button
                  onClick={handleSkip}
                  disabled={currentAuction.status !== 'active'}
                  className="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-museum-ink/60"
                >
                  <SkipForward className="w-4 h-4" />
                  跳过此轮
                </button>
                <button
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="w-full btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                  {showAllItems ? '收起拍品列表' : '查看全部拍品'}
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="card-museum p-5">
              <h2 className="section-title flex items-center gap-2">
                <Users className="w-4 h-4 text-museum-brass" />
                AI 对手
              </h2>
              <div className="space-y-3">
                {AUCTION_OPPONENTS.map(opp => {
                  const style = styleConfig[opp.style];
                  const mentalPrice = Math.floor(currentAuction.collection.estimatedValue * opp.maxBidMultiplier);
                  const budgetPct = Math.min(100, (opp.budget / 500000) * 100);
                  return (
                    <div key={opp.id} className="p-3 rounded-xl border-2 border-museum-brass/20 bg-museum-cream/50 hover:border-museum-brass/40 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-museum-parchment flex items-center justify-center text-xl border-2 border-museum-brass/30">
                          {opp.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-museum-ink truncate">{opp.name}</div>
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium ${style.bg} ${style.text}`}>
                            {style.label}型
                          </span>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-museum-ink/50">剩余预算</span>
                          <span className="font-mono text-museum-ink/70">{formatCurrency(opp.budget)}</span>
                        </div>
                        <div className="h-2 bg-museum-brass/15 rounded-full overflow-hidden">
                          <div className={`h-full ${style.bar} transition-all`} style={{ width: `${budgetPct}%` }} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-museum-parchment/50 rounded-lg px-2.5 py-1.5">
                        <span className="text-museum-ink/50">心理价位</span>
                        <span className="font-mono font-bold text-museum-brass">{formatCurrency(mentalPrice)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {showAllItems && (
          <div className="mt-6 card-museum p-5">
            <h2 className="section-title flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-museum-brass" />
              拍卖池预览
            </h2>
            <div className="grid grid-cols-5 gap-4">
              {auctionItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedAuctionId(item.id);
                    setBidAmount(0);
                  }}
                  className={`cursor-pointer transition-all ${selectedAuctionId === item.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                >
                  <CollectionCard item={item.collection} size="sm" />
                  <div className="mt-2 text-center">
                    <div className="text-xs font-mono font-bold text-museum-wine">
                      {formatCurrency(item.currentPrice)}
                    </div>
                    <div className="text-[10px] text-museum-ink/50">
                      {item.status === 'active' ? `剩余${item.timeLeft}轮` : item.status === 'won' ? '✓ 已拍下' : '已结束'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

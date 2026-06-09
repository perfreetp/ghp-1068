import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, Scale, Users as UsersIcon, Star, BarChart3, Calendar, Sparkles, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Settlement() {
  const cycle = useGameStore(s => s.cycle);
  const income = useGameStore(s => s.income);
  const expenses = useGameStore(s => s.expenses);
  const budget = useGameStore(s => s.budget);
  const reputation = useGameStore(s => s.reputation);
  const collectionScore = useGameStore(s => s.collectionScore);
  const totalVisitors = useGameStore(s => s.totalVisitors);
  const events = useGameStore(s => s.events);
  const settleCycle = useGameStore(s => s.settleCycle);
  const advanceCycle = useGameStore(s => s.advanceCycle);
  const showReport = useGameStore(s => s.showReport);
  const reports = useGameStore(s => s.reports);
  const setNotification = useGameStore(s => s.setNotification);

  const [showConfirm, setShowConfirm] = useState(false);

  const netIncome = income - expenses;

  const triggeredEvents = useMemo(() =>
    events.filter(e => e.triggered).slice(0, 6),
  [events]);

  const newVisitors = useMemo(() =>
    Math.floor(collectionScore * 2.5 + reputation * 15),
  [collectionScore, reputation]);

  const incomeItems = [
    { label: '门票收入', value: Math.floor(income * 0.45), icon: '🎫', color: 'bg-green-500' },
    { label: '周边销售', value: Math.floor(income * 0.25), icon: '🛍️', color: 'bg-emerald-500' },
    { label: '社会捐赠', value: Math.floor(income * 0.2), icon: '💝', color: 'bg-teal-500' },
    { label: '品牌赞助', value: Math.floor(income * 0.1), icon: '🤝', color: 'bg-cyan-500' }
  ];

  const expenseItems = [
    { label: '员工薪资', value: Math.floor(expenses * 0.4), icon: '👔', color: 'bg-red-500' },
    { label: '水电杂费', value: Math.floor(expenses * 0.15), icon: '💡', color: 'bg-orange-500' },
    { label: '藏品维护', value: Math.floor(expenses * 0.3), icon: '🔧', color: 'bg-rose-500' },
    { label: '营销推广', value: Math.floor(expenses * 0.15), icon: '📣', color: 'bg-pink-500' }
  ];

  const totalIncomePct = incomeItems.reduce((s, i) => s + i.value, 0) || 1;
  const totalExpensePct = expenseItems.reduce((s, i) => s + i.value, 0) || 1;

  const reputationStars = Math.min(5, Math.max(1, Math.round(reputation / 20)));

  const handleSettle = () => {
    setShowConfirm(false);
    settleCycle();
    setTimeout(() => {
      advanceCycle();
    }, 800);
  };

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-6">
          <div className="card-museum p-6 mb-4 bg-gradient-to-r from-museum-gold/20 via-museum-brass/15 to-museum-gold/20 border-l-4 border-l-museum-gold">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-museum-brass tracking-widest mb-1">PERIODIC SETTLEMENT</div>
                <h1 className="text-3xl font-serif font-bold text-museum-darkgreen flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-museum-gold" />
                  💰 周期结算中心
                </h1>
              </div>
              <div className="text-right">
                <div className="text-xs text-museum-ink/50 mb-1">当前周期</div>
                <div className="text-4xl font-serif font-bold text-museum-gold">
                  第 {cycle} 周期
                </div>
                <div className="text-xs text-museum-ink/50 mt-1">结算面板</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="card-museum p-5 border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-museum-ink/60 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-green-600" />本期收入
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-green-600">
                +{formatCurrency(income)}
              </div>
            </div>
            <div className="card-museum p-5 border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-museum-ink/60 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-red-600" />本期支出
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-red-600">
                -{formatCurrency(expenses)}
              </div>
            </div>
            <div className="card-museum p-5 border-l-4 border-l-museum-gold bg-gradient-to-r from-museum-gold/10 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-museum-ink/60 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-museum-gold" />净收益
                </span>
              </div>
              <div className={`text-2xl font-mono font-bold ${netIncome >= 0 ? 'text-museum-gold' : 'text-museum-wine'}`}>
                {netIncome >= 0 ? '+' : ''}{formatCurrency(netIncome)}
              </div>
            </div>
            <div className="card-museum p-5 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-museum-ink/60 flex items-center gap-1.5">
                  <UsersIcon className="w-4 h-4 text-blue-600" />新访客数
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-blue-600">
                +{newVisitors.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className="col-span-4">
            <div className="card-museum p-5 h-full">
              <h2 className="section-title flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                收入账单
              </h2>
              <div className="space-y-4">
                {incomeItems.map(item => {
                  const pct = Math.round((item.value / totalIncomePct) * 100);
                  return (
                    <div key={item.label} className="p-3 rounded-xl bg-green-50/40 border border-green-200/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold text-museum-ink text-sm">{item.label}</span>
                        </div>
                        <span className="font-mono font-bold text-green-700">
                          +{formatFullCurrency(item.value)}
                        </span>
                      </div>
                      <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all rounded-full`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] text-museum-ink/40 mt-1 font-mono">
                        占比 {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="card-museum p-5 h-full">
              <h2 className="section-title flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                支出账单
              </h2>
              <div className="space-y-4">
                {expenseItems.map(item => {
                  const pct = Math.round((item.value / totalExpensePct) * 100);
                  return (
                    <div key={item.label} className="p-3 rounded-xl bg-red-50/40 border border-red-200/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon}</span>
                          <span className="font-semibold text-museum-ink text-sm">{item.label}</span>
                        </div>
                        <span className="font-mono font-bold text-red-700">
                          -{formatFullCurrency(item.value)}
                        </span>
                      </div>
                      <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} transition-all rounded-full`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] text-museum-ink/40 mt-1 font-mono">
                        占比 {pct}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-6">
            <div className="card-museum p-5">
              <h2 className="section-title flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-museum-brass" />
                经营仪表盘
              </h2>
              <div className="space-y-5">
                <div className="text-center p-4 rounded-xl bg-museum-parchment/50 border border-museum-brass/30">
                  <div className="text-xs text-museum-ink/50 mb-1">预算余量</div>
                  <div className={`text-4xl font-serif font-bold ${budget >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {formatCurrency(budget)}
                  </div>
                  <div className={`text-xs mt-1 ${budget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {budget >= 0 ? '✓ 经营状况良好' : '⚠ 预算告急'}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-museum-ink/60 flex items-center gap-1">
                      <Star className="w-3 h-3 text-museum-brass" />馆藏评分
                    </span>
                    <span className="font-mono font-bold text-museum-darkgreen">
                      {collectionScore} / 1000
                    </span>
                  </div>
                  <div className="h-3 bg-museum-brass/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-museum-brass to-museum-gold transition-all rounded-full"
                      style={{ width: `${Math.min(100, collectionScore / 10)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xs text-museum-ink/60 mb-2">口碑星级</div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${i <= reputationStars ? 'text-museum-gold fill-museum-gold' : 'text-museum-brass/20'}`}
                      />
                    ))}
                    <span className="ml-2 font-mono font-bold text-museum-darkgreen text-sm">
                      {reputation}分
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-museum-brass/20 flex items-center justify-between">
                  <span className="text-xs text-museum-ink/60 flex items-center gap-1">
                    <UsersIcon className="w-3 h-3" />累计访客数
                  </span>
                  <span className="font-mono font-bold text-museum-darkgreen">
                    {totalVisitors.toLocaleString()} 人次
                  </span>
                </div>
              </div>
            </div>

            <div className="card-museum p-5">
              <h2 className="section-title flex items-center gap-2">
                <Calendar className="w-4 h-4 text-museum-brass" />
                事件日志
              </h2>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {triggeredEvents.length === 0 ? (
                  <div className="text-center py-6 text-museum-ink/30 text-sm">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    暂无触发事件
                  </div>
                ) : (
                  triggeredEvents.map(evt => (
                    <div key={evt.id} className="p-2.5 rounded-lg bg-museum-parchment/50 border border-museum-brass/20 flex gap-2">
                      <span className="text-xl shrink-0">{evt.icon}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-museum-ink truncate">{evt.title}</div>
                        <div className="text-[10px] text-museum-ink/50 line-clamp-1">{evt.description}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => {
              if (reports.length > 0) {
                showReport(reports[reports.length - 1]);
              } else {
                setNotification({ type: 'warning', message: '暂无历史报表，请先完成一次周期结算' });
              }
            }}
            className="card-museum p-5 hover:shadow-card-hover transition-all group text-left flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-xl bg-museum-darkgreen/10 flex items-center justify-center group-hover:bg-museum-darkgreen/20 transition-colors">
              <BarChart3 className="w-7 h-7 text-museum-darkgreen" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-serif font-bold text-museum-darkgreen mb-0.5">查看详细报表</div>
              <div className="text-sm text-museum-ink/60">查看完整的财务分析、访客统计和评分明细</div>
            </div>
            <ChevronRight className="w-6 h-6 text-museum-brass group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-gold p-5 text-left flex items-center gap-4 hover:shadow-glow-brass transition-all group"
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-serif font-bold mb-0.5">结算并进入下一周期 →</div>
              <div className="text-sm text-white/80">确认结算将生成报表并触发新周期事件</div>
            </div>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-museum-ink/50 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative card-museum p-6 w-[480px] shadow-2xl animate-fade-in-up">
            <div className="text-center mb-5">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-museum-gold/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-museum-gold" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-museum-darkgreen mb-2">确认周期结算？</h3>
              <p className="text-sm text-museum-ink/60 leading-relaxed">
                结算将生成本期详细财务报表，触发随机事件，<br />
                并进入第 <span className="font-bold text-museum-gold">{cycle + 1}</span> 周期。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-museum-parchment/50 border border-museum-brass/20">
              <div className="text-center">
                <div className="text-xs text-museum-ink/50 mb-1">本期净收益</div>
                <div className={`text-xl font-mono font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netIncome >= 0 ? '+' : ''}{formatCurrency(netIncome)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-museum-ink/50 mb-1">新访客</div>
                <div className="text-xl font-mono font-bold text-blue-600">
                  +{newVisitors.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary py-3 font-semibold"
              >
                再想想
              </button>
              <button
                onClick={handleSettle}
                className="btn-gold py-3 font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                确认结算
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

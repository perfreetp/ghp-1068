import React, { useState, useMemo } from 'react';
import { X, TrendingUp, TrendingDown, Users, Calendar, BarChart3, FileText, Wallet, Star, Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency } from '../utils/formatters';

type TrendKey = 'budgetSnapshot' | 'reputationSnapshot' | 'scoreSnapshot' | 'visitorSnapshot';

interface TrendConfig {
  key: TrendKey;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  formatValue: (v: number) => string;
}

export const ReportModal: React.FC = () => {
  const { showReportModal, reports, lastReport, closeReportModal, showReport } = useGameStore();
  const [activeTab, setActiveTab] = useState<'current' | 'trend'>('current');
  const [selectedCycleIdx, setSelectedCycleIdx] = useState<number | null>(null);

  if (!showReportModal) return null;

  const report = selectedCycleIdx !== null && reports[selectedCycleIdx]
    ? reports[selectedCycleIdx]
    : lastReport || (reports.length > 0 ? reports[reports.length - 1] : null);

  if (!report) return null;

  const incomeItems = [
    { label: '门票收入', value: report.income.ticketSales, color: 'bg-museum-darkgreen' },
    { label: '周边销售', value: report.income.merchandise, color: 'bg-museum-brass' },
    { label: '社会捐赠', value: report.income.donations, color: 'bg-museum-slateblue' },
    { label: '品牌赞助', value: report.income.sponsorship, color: 'bg-museum-wine' },
  ];

  const expenseItems = [
    { label: '员工薪资', value: report.expenses.restoration, color: 'bg-museum-brown' },
    { label: '水电杂费', value: report.expenses.maintenance, color: 'bg-museum-bronze' },
    { label: '藏品收购', value: report.expenses.auctionPurchases, color: 'bg-museum-alert' },
    { label: '营销推广', value: report.expenses.marketing, color: 'bg-museum-slateblue' },
  ];

  const totalIncome = incomeItems.reduce((s, i) => s + i.value, 0);
  const totalExpense = expenseItems.reduce((s, i) => s + i.value, 0);
  const netIncome = totalIncome - totalExpense;

  const triggeredEvents = report.cycle;

  const incomePercent = totalIncome > 0 ? (totalIncome / Math.max(totalIncome, totalExpense)) * 100 : 0;
  const expensePercent = totalExpense > 0 ? (totalExpense / Math.max(totalIncome, totalExpense)) * 100 : 0;

  const trendReports = useMemo(() => reports.slice(-12), [reports]);

  const trendConfigs: TrendConfig[] = [
    {
      key: 'budgetSnapshot',
      name: '预算趋势',
      icon: <Wallet className="w-5 h-5" />,
      color: 'from-museum-darkgreen to-green-500',
      bgColor: 'bg-green-500',
      formatValue: (v) => formatCurrency(v)
    },
    {
      key: 'reputationSnapshot',
      name: '口碑趋势',
      icon: <Star className="w-5 h-5" />,
      color: 'from-museum-brass to-yellow-500',
      bgColor: 'bg-museum-brass',
      formatValue: (v) => `${v}`
    },
    {
      key: 'scoreSnapshot',
      name: '馆藏评分趋势',
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-museum-slateblue to-purple-500',
      bgColor: 'bg-museum-slateblue',
      formatValue: (v) => `${v}`
    },
    {
      key: 'visitorSnapshot',
      name: '访客数趋势',
      icon: <Users className="w-5 h-5" />,
      color: 'from-museum-wine to-red-500',
      bgColor: 'bg-museum-wine',
      formatValue: (v) => v.toLocaleString()
    }
  ];

  const renderTrendBlock = (config: TrendConfig) => {
    const values = trendReports.map(r => r.cycleMetrics[config.key]);
    const maxVal = Math.max(...values, 1);
    const latest = values[values.length - 1] ?? 0;
    const prev = values.length >= 2 ? values[values.length - 2] : 0;
    const diff = prev > 0 ? ((latest - prev) / prev) * 100 : 0;
    const isUp = diff >= 0;

    const handleBarClick = (idx: number) => {
      const globalIdx = reports.length - trendReports.length + idx;
      setSelectedCycleIdx(globalIdx);
      setActiveTab('current');
      showReport(reports[globalIdx]);
    };

    return (
      <div
        key={config.key}
        className="bg-museum-parchment/30 rounded-xl p-4 border-2 border-museum-brass/20 min-w-[260px] flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color} text-white`}>
              {config.icon}
            </div>
            <span className="font-bold font-serif text-museum-darkgreen">{config.name}</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-serif text-museum-darkgreen tabular-nums">
              {config.formatValue(latest)}
            </div>
            {prev > 0 && (
              <div className={`text-xs flex items-center justify-end gap-0.5 ${
                isUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{isUp ? '+' : ''}{diff.toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end gap-1 h-24 mt-2">
          {trendReports.map((r, idx) => {
            const val = r.cycleMetrics[config.key];
            const heightPct = (val / maxVal) * 100;
            return (
              <div
                key={r.cycle}
                className="flex-1 group relative flex items-end"
              >
                <div
                  className={`w-full rounded-t-md bg-gradient-to-t ${config.color} cursor-pointer transition-all hover:brightness-110`}
                  style={{ height: `${Math.max(heightPct, 3)}%` }}
                  onClick={() => handleBarClick(idx)}
                />
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <div className="bg-museum-darkgreen text-white text-xs px-2 py-1 rounded shadow-lg">
                    周期{r.cycle}：{config.formatValue(val)}
                  </div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-museum-darkgreen mx-auto" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-2 text-xs text-museum-ink/40">
          <span>周期{trendReports[0]?.cycle ?? '-'}</span>
          <span>周期{trendReports[trendReports.length - 1]?.cycle ?? '-'}</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-museum-darkgreen/70 backdrop-blur-sm p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="relative w-full max-w-3xl card-museum p-7 overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin"
        style={{ animation: 'zoomIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={closeReportModal}
            className="w-9 h-9 rounded-full bg-museum-parchment/60 flex items-center justify-center text-museum-ink/50 hover:text-museum-ink hover:bg-museum-parchment transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-museum-brass/30">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-museum-darkgreen to-museum-brown flex items-center justify-center">
              <FileText className="w-6 h-6 text-museum-brass" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-museum-darkgreen">周期财务报表</h2>
              <div className="flex items-center gap-2 mt-0.5 text-museum-ink/60 text-sm">
                <Calendar className="w-4 h-4" />
                <span>第 {report.cycle} 周期结算报告</span>
                {selectedCycleIdx !== null && (
                  <span className="text-museum-brass ml-1">（查看历史）</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-6 bg-museum-parchment/50 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'current'
                  ? 'bg-museum-darkgreen text-white shadow-md'
                  : 'text-museum-ink/60 hover:text-museum-darkgreen hover:bg-white/50'
              }`}
            >
              📊 当期报表
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'trend'
                  ? 'bg-museum-darkgreen text-white shadow-md'
                  : 'text-museum-ink/60 hover:text-museum-darkgreen hover:bg-white/50'
              }`}
            >
              📈 历史趋势
            </button>
          </div>

          {activeTab === 'current' ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-museum-cream rounded-xl p-5 border-2 border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-green-700 font-semibold">总收入</span>
                  </div>
                  <div className="text-3xl font-bold text-green-700 tabular-nums font-serif">
                    {formatCurrency(totalIncome)}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-museum-cream rounded-xl p-5 border-2 border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="text-sm text-red-700 font-semibold">总支出</span>
                  </div>
                  <div className="text-3xl font-bold text-red-700 tabular-nums font-serif">
                    {formatCurrency(totalExpense)}
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-5 mb-6 border-2 ${
                netIncome >= 0
                  ? 'bg-museum-darkgreen/5 border-museum-darkgreen/30'
                  : 'bg-museum-wine/5 border-museum-wine/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className={`w-5 h-5 ${netIncome >= 0 ? 'text-museum-darkgreen' : 'text-museum-wine'}`} />
                    <span className={`font-bold font-serif text-lg ${netIncome >= 0 ? 'text-museum-darkgreen' : 'text-museum-wine'}`}>
                      本周期净收益
                    </span>
                  </div>
                  <div className={`text-3xl font-bold tabular-nums font-serif ${netIncome >= 0 ? 'text-museum-darkgreen' : 'text-museum-wine'}`}>
                    {netIncome >= 0 ? '+' : ''}
                    {formatCurrency(netIncome)}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold font-serif text-museum-darkgreen mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    收入明细
                  </h3>
                  <div className="space-y-3">
                    {incomeItems.map((item) => {
                      const pct = totalIncome > 0 ? (item.value / totalIncome) * 100 : 0;
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-museum-ink/80">{item.label}</span>
                            <span className="text-sm font-semibold text-museum-ink tabular-nums">
                              {formatCurrency(item.value)}
                              <span className="text-museum-ink/50 ml-2 text-xs">
                                {pct.toFixed(0)}%
                              </span>
                            </span>
                          </div>
                          <div className="h-2.5 bg-museum-parchment rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold font-serif text-museum-darkgreen mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    支出明细
                  </h3>
                  <div className="space-y-3">
                    {expenseItems.map((item) => {
                      const pct = totalExpense > 0 ? (item.value / totalExpense) * 100 : 0;
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-museum-ink/80">{item.label}</span>
                            <span className="text-sm font-semibold text-museum-ink tabular-nums">
                              {formatCurrency(item.value)}
                              <span className="text-museum-ink/50 ml-2 text-xs">
                                {pct.toFixed(0)}%
                              </span>
                            </span>
                          </div>
                          <div className="h-2.5 bg-museum-parchment rounded-full overflow-hidden">
                            <div
                              className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-museum-brass/30">
                  <div className="text-center p-4 bg-museum-parchment/50 rounded-xl">
                    <Users className="w-6 h-6 mx-auto mb-2 text-museum-slateblue" />
                    <div className="text-2xl font-bold font-serif text-museum-darkgreen tabular-nums">
                      {report.visitorStats.total.toLocaleString()}
                    </div>
                    <div className="text-xs text-museum-ink/60 mt-1">新访客数</div>
                  </div>
                  <div className="text-center p-4 bg-museum-parchment/50 rounded-xl">
                    <div className="w-6 h-6 mx-auto mb-2 flex items-center justify-center text-museum-brass text-xl">
                      ★
                    </div>
                    <div className="text-2xl font-bold font-serif text-museum-darkgreen tabular-nums">
                      {report.visitorStats.satisfaction}%
                    </div>
                    <div className="text-xs text-museum-ink/60 mt-1">访客满意度</div>
                  </div>
                  <div className="text-center p-4 bg-museum-parchment/50 rounded-xl">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-museum-wine" />
                    <div className="text-2xl font-bold font-serif text-museum-darkgreen tabular-nums">
                      {triggeredEvents}
                    </div>
                    <div className="text-xs text-museum-ink/60 mt-1">触发事件数</div>
                  </div>
                </div>

                <div className="pt-2">
                  <h3 className="font-bold font-serif text-museum-darkgreen mb-3">收支对比</h3>
                  <div className="h-8 bg-museum-parchment rounded-xl overflow-hidden flex">
                    <div
                      className="h-full bg-gradient-to-r from-museum-darkgreen to-green-600 flex items-center justify-end pr-3 text-white text-xs font-semibold transition-all duration-700"
                      style={{ width: `${incomePercent}%` }}
                    >
                      {incomePercent > 15 ? `收入 ${incomePercent.toFixed(0)}%` : ''}
                    </div>
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-museum-wine flex items-center pl-3 text-white text-xs font-semibold transition-all duration-700"
                      style={{ width: `${expensePercent}%` }}
                    >
                      {expensePercent > 15 ? `支出 ${expensePercent.toFixed(0)}%` : ''}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              {trendReports.length === 0 ? (
                <div className="text-center py-16 text-museum-ink/50">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <div className="font-serif">暂无历史数据</div>
                  <div className="text-sm mt-1">完成至少1个周期后可查看趋势</div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-museum-ink/60 mb-4 flex items-center gap-2">
                    <InfoIcon />
                    <span>共 {trendReports.length} 份历史报表（最多显示12份），点击柱子可查看当期详情</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trendConfigs.map(config => renderTrendBlock(config))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={closeReportModal}
            className="w-full mt-7 btn-gold text-base py-3 flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            关闭报表
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

const InfoIcon = () => (
  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default ReportModal;

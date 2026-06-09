import React from 'react';
import { X, TrendingUp, TrendingDown, Users, Calendar, BarChart3, FileText } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { formatCurrency } from '../utils/formatters';

export const ReportModal: React.FC = () => {
  const { showReportModal, reports, lastReport, closeReportModal } = useGameStore();

  if (!showReportModal) return null;

  const report = lastReport || (reports.length > 0 ? reports[reports.length - 1] : null);

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
          <div className="flex items-center gap-3 mb-6 pb-5 border-b-2 border-museum-brass/30">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-museum-darkgreen to-museum-brown flex items-center justify-center">
              <FileText className="w-7 h-7 text-museum-brass" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif text-museum-darkgreen">周期财务报表</h2>
              <div className="flex items-center gap-2 mt-1 text-museum-ink/60 text-sm">
                <Calendar className="w-4 h-4" />
                <span>第 {report.cycle} 周期结算报告</span>
              </div>
            </div>
          </div>

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

export default ReportModal;

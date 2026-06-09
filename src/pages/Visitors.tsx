import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { getSentimentEmoji, getSentimentColor } from '../utils/formatters';
import { Users, MessageCircle, HelpCircle, TrendingUp, Award, Check, X } from 'lucide-react';

const stickyColors = [
  { bg: '#FFF9E6', border: '#F5E6A8' }, { bg: '#E6F3FF', border: '#A8D4F5' },
  { bg: '#FFEEF5', border: '#F5A8C8' }, { bg: '#E8FFE6', border: '#A8F5B0' },
  { bg: '#FFF5E6', border: '#F5D4A8' }, { bg: '#F0E6FF', border: '#C8A8F5' }
];
const sentimentBorderColors: Record<string, string> = { positive: '#22c55e', neutral: '#9ca3af', negative: '#ef4444' };

export default function Visitors() {
  const feedbacks = useGameStore(s => s.feedbacks);
  const totalVisitors = useGameStore(s => s.totalVisitors);
  const answerQuestion = useGameStore(s => s.answerQuestion);
  const [activeTab, setActiveTab] = useState<'wall' | 'qa' | 'stats'>('wall');
  const [qaResults, setQaResults] = useState<Record<string, { selected: number | null; result: 'correct' | 'wrong' | null }>>({});

  const stats = useMemo(() => {
    const positive = feedbacks.filter(f => f.sentiment === 'positive').length;
    const total = feedbacks.length || 1;
    return {
      positive, neutral: feedbacks.filter(f => f.sentiment === 'neutral').length,
      negative: feedbacks.filter(f => f.sentiment === 'negative').length,
      avgSatisfaction: Math.round(feedbacks.reduce((s, f) => s + f.satisfaction, 0) / total),
      positiveRate: Math.round(positive / total * 100),
      unanswered: feedbacks.filter(f => f.type === 'question' && !f.answered).length
    };
  }, [feedbacks]);

  const answeredFeedbacks = useMemo(() => feedbacks.filter(f => f.type === 'comment' || (f.type === 'question' && f.answered)), [feedbacks]);
  const questionFeedbacks = useMemo(() => feedbacks.filter(f => f.type === 'question' && !f.answered && f.options), [feedbacks]);
  const audienceStats = useMemo(() => {
    const b = totalVisitors || 500;
    return [
      { name: '学生群体', count: Math.floor(b * 0.35), color: '#3b82f6', icon: '🎒' },
      { name: '上班族', count: Math.floor(b * 0.4), color: '#8b3a3a', icon: '💼' },
      { name: '退休老人', count: Math.floor(b * 0.15), color: '#c9a85c', icon: '👴' },
      { name: '科技爱好者', count: Math.floor(b * 0.1), color: '#1a3c34', icon: '🔬' }
    ];
  }, [totalVisitors]);
  const satisfactionTrend = useMemo(() => {
    const pts = []; let v = 60;
    for (let i = 0; i < 12; i++) { v = Math.max(30, Math.min(95, v + (Math.random() - 0.4) * 10)); pts.push(Math.round(v)); }
    return pts;
  }, [stats.avgSatisfaction]);

  const handleAnswerClick = (fbId: string, optionIdx: number) => {
    if (qaResults[fbId]) return;
    const fb = feedbacks.find(f => f.id === fbId); if (!fb) return;
    const isCorrect = optionIdx === fb.correctOption;
    setQaResults(p => ({ ...p, [fbId]: { selected: optionIdx, result: isCorrect ? 'correct' : 'wrong' } }));
    setTimeout(() => answerQuestion(fbId, optionIdx), 1000);
  };
  const fmtTime = (ts: number) => { const d = new Date(ts); return `${d.getMonth() + 1}月${d.getDate()}日`; };
  const getSticky = (id: string, idx: number) => ({
    ...stickyColors[(idx * 7 + id.charCodeAt(id.length - 1)) % stickyColors.length],
    rotate: ((idx * 13 + id.charCodeAt(0)) % 7) - 3
  });
  const totalS = stats.positive + stats.neutral + stats.negative || 1;
  const pPct = stats.positive / totalS * 100, nPct = stats.neutral / totalS * 100;
  const donutStyle = { background: `conic-gradient(#22c55e 0% ${pPct}%, #eab308 ${pPct}% ${pPct + nPct}%, #ef4444 ${pPct + nPct}% 100%)` };
  const qCatMap: Record<string, string> = { history: '历史', tech: '技术', price: '价格', other: '其他' };

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-serif font-bold text-museum-darkgreen mb-5 flex items-center gap-3 flex-wrap">
          <span>👥</span>访客之声
          <span className="ml-auto flex items-center gap-4 text-sm font-normal">
            <span className="flex items-center gap-1.5 text-museum-ink/60"><Users className="w-4 h-4" />总访客：<b className="font-mono text-museum-darkgreen">{totalVisitors.toLocaleString()}</b></span>
            <span className="flex items-center gap-1.5 text-museum-ink/60"><TrendingUp className="w-4 h-4" />满意度：<b className="font-mono text-museum-brass">{stats.avgSatisfaction}%</b></span>
            <span className="flex items-center gap-1.5 text-museum-ink/60"><Award className="w-4 h-4" />好评率：<b className="font-mono text-green-600">{stats.positiveRate}%</b></span>
            <span className="flex items-center gap-1.5 text-museum-ink/60"><HelpCircle className="w-4 h-4" />待答：<b className="font-mono text-museum-wine">{stats.unanswered}</b></span>
          </span>
        </h1>
        <div className="flex gap-2 mb-5 border-b-2 border-museum-brass/30">
          {[{ id: 'wall' as const, label: '反馈墙', icon: MessageCircle, cnt: answeredFeedbacks.length },
            { id: 'qa' as const, label: '问答台', icon: HelpCircle, cnt: questionFeedbacks.length },
            { id: 'stats' as const, label: '口碑统计', icon: TrendingUp, cnt: null }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-5 py-3 font-serif font-semibold flex items-center gap-2 border-b-4 -mb-0.5 transition-all ${activeTab === t.id ? 'border-museum-brass text-museum-darkgreen' : 'border-transparent text-museum-ink/40 hover:text-museum-ink/70 hover:border-museum-brass/30'}`}>
              <t.icon className="w-4 h-4" />{t.label}
              {t.cnt !== null && <span className={`px-2 py-0.5 rounded-full text-xs font-mono ${t.id === 'qa' && t.cnt > 0 ? 'bg-museum-wine text-white animate-pulse' : 'bg-museum-brass/20 text-museum-darkgreen'}`}>{t.cnt}</span>}
            </button>
          ))}
        </div>

        {activeTab === 'wall' && (
          <div className="relative min-h-[450px] p-6 rounded-2xl border-4 border-dashed border-museum-brass/40" style={{ backgroundColor: '#FDF8EE' }}>
            <div className="absolute top-3 left-4 text-xs font-serif text-museum-ink/40">— 访客留言板 —</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-6">
              {answeredFeedbacks.map((fb, idx) => {
                const s = getSticky(fb.id, idx);
                return (
                  <div key={fb.id} className="relative p-4 rounded-lg shadow-lg hover:scale-105 hover:z-10 cursor-pointer border-2 transition-all"
                    style={{ backgroundColor: s.bg, borderColor: sentimentBorderColors[fb.sentiment], transform: `rotate(${s.rotate}deg)`, boxShadow: `3px 5px 12px rgba(0,0,0,0.12), 0 0 0 1px ${s.border}` }}>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 rounded-full opacity-60" style={{ backgroundColor: sentimentBorderColors[fb.sentiment] }} />
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-2xl">{fb.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{fb.visitorName}</div>
                        <div className="text-[10px] text-museum-ink/50 font-mono">{fmtTime(fb.timestamp)}</div>
                      </div>
                      <span className="text-lg">{getSentimentEmoji(fb.sentiment)}</span>
                    </div>
                    <p className="text-sm text-museum-ink/80 leading-relaxed mb-2 line-clamp-4">{fb.content}</p>
                    {fb.type === 'question' && fb.answer && <div className="mt-2 pt-2 border-t border-museum-brass/30 text-xs text-green-700 flex items-center gap-1"><Check className="w-3 h-3" />{fb.answer}</div>}
                    <div className="mt-2 text-right"><span className="px-2 py-0.5 rounded-full text-[10px] font-mono" style={{ backgroundColor: `${getSentimentColor(fb.sentiment)}22`, color: getSentimentColor(fb.sentiment) }}>满意度 {fb.satisfaction}</span></div>
                  </div>
                );
              })}
              {!answeredFeedbacks.length && <div className="col-span-full text-center py-16 text-museum-ink/40"><MessageCircle className="w-14 h-14 mx-auto mb-3 opacity-30" /><p className="font-serif">暂无反馈</p></div>}
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {questionFeedbacks.map(fb => {
              const qr = qaResults[fb.id];
              return (
                <div key={fb.id} className="card-museum p-5 border-l-4 border-l-museum-brass">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl shrink-0 bg-museum-parchment w-12 h-12 rounded-full flex items-center justify-center">{fb.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-serif font-bold text-museum-darkgreen">{fb.visitorName}</span>
                        <span className="tag bg-blue-100 text-blue-700 text-[10px]">{qCatMap[fb.questionCategory || 'other']}</span>
                      </div>
                      <div className="text-[11px] text-museum-ink/50 font-mono">{fmtTime(fb.timestamp)}</div>
                    </div>
                  </div>
                  <div className="mb-4 p-3 rounded-lg bg-museum-parchment/50 border border-museum-brass/20"><p className="text-museum-ink font-medium">❓ {fb.content}</p></div>
                  <div className="grid grid-cols-2 gap-2">
                    {fb.options?.map((opt, idx) => {
                      const sel = qr?.selected === idx, correct = idx === fb.correctOption, show = qr !== undefined;
                      let cls = 'btn-secondary text-left text-sm';
                      if (show) cls = correct ? 'px-4 py-2 rounded-lg border-2 bg-green-50 border-green-500 text-green-800 text-sm text-left font-medium'
                        : sel && qr.result === 'wrong' ? 'px-4 py-2 rounded-lg border-2 bg-red-50 border-red-500 text-red-800 text-sm text-left font-medium'
                          : 'px-4 py-2 rounded-lg border-2 bg-museum-cream/50 border-museum-brass/20 text-museum-ink/40 text-sm text-left';
                      return (
                        <button key={idx} disabled={show} onClick={() => handleAnswerClick(fb.id, idx)} className={`${cls} relative transition-all`}>
                          <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + idx)}.</span>{opt}
                          {show && correct && <Check className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-green-600" />}
                          {show && sel && qr.result === 'wrong' && <X className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-red-600" />}
                        </button>
                      );
                    })}
                  </div>
                  {qr && <div className={`mt-3 p-2.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-fade-in-up ${qr.result === 'correct' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {qr.result === 'correct' ? <><Check className="w-4 h-4" />回答正确！口碑 +2</> : <><X className="w-4 h-4" />回答有误，正确答案 {String.fromCharCode(65 + (fb.correctOption || 0))}</>}
                  </div>}
                </div>
              );
            })}
            {!questionFeedbacks.length && <div className="col-span-2 text-center py-16 card-museum"><HelpCircle className="w-14 h-14 mx-auto mb-3 opacity-30 text-museum-brass" /><p className="text-lg font-serif text-museum-darkgreen">太棒了！</p><p className="text-sm text-museum-ink/50 mt-1">暂无待回答问题</p></div>}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="card-museum p-6">
              <h3 className="section-title">情感分布</h3>
              <div className="flex justify-center my-5"><div className="relative w-40 h-40">
                <div className="w-full h-full rounded-full" style={donutStyle} />
                <div className="absolute inset-5 rounded-full bg-museum-cream flex flex-col items-center justify-center shadow-inner">
                  <div className="text-2xl font-mono font-bold text-museum-darkgreen">{totalS}</div>
                  <div className="text-xs text-museum-ink/50">条评论</div>
                </div>
              </div></div>
              <div className="space-y-2">
                {[{ l: '正面', v: stats.positive, c: '#22c55e', e: '😊' }, { l: '中性', v: stats.neutral, c: '#eab308', e: '😐' }, { l: '负面', v: stats.negative, c: '#ef4444', e: '😟' }].map(it => (
                  <div key={it.l}>
                    <div className="flex justify-between text-sm mb-1"><span className="flex items-center gap-1.5 text-museum-ink/70"><span>{it.e}</span>{it.l}</span><b className="font-mono" style={{ color: it.c }}>{it.v} ({Math.round(it.v / totalS * 100)}%)</b></div>
                    <div className="h-2 rounded-full bg-museum-parchment overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${it.v / totalS * 100}%`, backgroundColor: it.c }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-museum p-6">
              <h3 className="section-title">满意度趋势</h3>
              <div className="flex items-end justify-between gap-1 h-36 px-2 my-4">
                {satisfactionTrend.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-end justify-end gap-1">
                    <div className="w-full rounded-t transition-all" style={{ height: `${v}%`, background: `linear-gradient(to top, ${v >= 80 ? '#22c55e' : v >= 50 ? '#c9a85c' : '#ef4444'}, ${v >= 80 ? '#86efac' : v >= 50 ? '#fcd34d' : '#fca5a5'})` }} />
                    {i % 3 === 0 && <div className="text-[9px] font-mono text-museum-ink/40">{`C${12 - i}`}</div>}
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-museum-brass/20">
                <div className="flex justify-between items-center"><span className="text-sm text-museum-ink/60">当前</span><b className={`text-2xl font-mono ${stats.avgSatisfaction >= 80 ? 'text-green-600' : stats.avgSatisfaction >= 50 ? 'text-museum-brass' : 'text-museum-wine'}`}>{stats.avgSatisfaction}%</b></div>
                <div className="mt-2 flex justify-between text-xs">{['很差', '较差', '一般', '良好', '优秀'].map(l => <span key={l} className="text-museum-ink/40 w-1/5 text-center">{l}</span>)}</div>
              </div>
            </div>
            <div className="card-museum p-6">
              <h3 className="section-title">访客分类</h3>
              <div className="space-y-3 mt-4">
                {audienceStats.map(g => {
                  const t = audienceStats.reduce((s, x) => s + x.count, 0) || 1, p = g.count / t * 100;
                  return (
                    <div key={g.name}>
                      <div className="flex items-center gap-3 mb-1.5">
                        <div className="text-xl w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: `${g.color}18` }}>{g.icon}</div>
                        <div className="flex-1 flex justify-between items-baseline"><span className="font-semibold text-sm">{g.name}</span><span className="font-mono text-xs text-museum-ink/60">{g.count.toLocaleString()} · {Math.round(p)}%</span></div>
                      </div>
                      <div className="ml-12 h-2.5 rounded-full bg-museum-parchment overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: g.color }} /></div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-3 border-t border-museum-brass/20 grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-museum-parchment/50 text-center"><div className="text-[11px] text-museum-ink/50 mb-0.5">平均年龄</div><b className="font-mono text-museum-darkgreen">38.5<small>岁</small></b></div>
                <div className="p-2.5 rounded-lg bg-museum-parchment/50 text-center"><div className="text-[11px] text-museum-ink/50 mb-0.5">男女比例</div><b className="font-mono text-museum-wine">52<small>:</small>48</b></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

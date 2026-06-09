import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RarityBadge } from '../components/RarityBadge';
import { formatCurrency } from '../utils/formatters';
import { COMPETITORS } from '../data/competitors';
import { INITIAL_COLLECTIONS } from '../data/collections';
import { Lock, FileText, CheckCircle, Gift, Target, Award, ChevronDown, ChevronRight, X, Sparkles, Plus, Search, Lightbulb } from 'lucide-react';
import { CATEGORY_ICONS, CATEGORY_NAMES } from '../types';

export default function Research() {
  const clues = useGameStore(s => s.clues);
  const tasks = useGameStore(s => s.tasks);
  const collections = useGameStore(s => s.collections);
  const budget = useGameStore(s => s.budget);
  const unlockClue = useGameStore(s => s.unlockClue);
  const claimTaskReward = useGameStore(s => s.claimTaskReward);

  const [expandedClue, setExpandedClue] = useState<string | null>(null);
  const [expandedInt, setExpandedInt] = useState<string | null>(null);
  const [readInts, setReadInts] = useState<Set<string>>(new Set());
  const [selComp, setSelComp] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const cs = useMemo(() => ({
    uc: clues.filter(c => c.unlocked).length,
    ui: clues.reduce((s, c) => s + c.interviews.filter(i => i.unlocked).length, 0),
    ip: tasks.filter(t => !t.completed).length,
    ucc: COMPETITORS.filter((_, i) => budget >= 50000 || i < 4).length
  }), [clues, tasks, budget]);

  const allInts = useMemo(() => clues.flatMap(c => c.interviews.map(i => ({ i, cid: c.id, ct: c.title }))), [clues]);
  const curComp = COMPETITORS.find(c => c.id === selComp);
  const srProds = useMemo(() => curComp
    ? collections.filter(c => c.category === curComp.category || INITIAL_COLLECTIONS.some(ic => ic.id === c.id && ic.category === curComp.category))
    : [], [curComp, collections]);

  const pinColors = ['#ef4444', '#3b82f6', '#22c55e', '#c9a85c', '#8b3a3a', '#6b8a9e'];
  const catLabels: Record<string, string> = { collection: '收藏', exhibition: '展览', research: '研究', reputation: '口碑' };
  const catColors: Record<string, string> = { collection: 'bg-blue-100 text-blue-700', exhibition: 'bg-purple-100 text-purple-700', research: 'bg-museum-brass/20 text-museum-darkgreen', reputation: 'bg-museum-wine/10 text-museum-wine' };

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-serif font-bold text-museum-darkgreen mb-5 flex items-center gap-3 flex-wrap">
          <span>🔬</span>研究台
          <span className="ml-auto flex items-center gap-4 text-sm font-normal">
            <span className="flex items-center gap-1.5 text-museum-ink/60"><Search className="w-4 h-4" />线索：<b className="font-mono text-museum-darkgreen">{cs.uc}/{clues.length}</b></span>
            <span className="flex items-center gap-1.5 text-museum-ink/60"><FileText className="w-4 h-4" />访谈：<b className="font-mono text-museum-brass">{cs.ui}</b></span>
            <span className="flex items-center gap-1.5 text-museum-ink/60"><Target className="w-4 h-4" />进行中：<b className="font-mono text-museum-wine">{cs.ip}</b></span>
            <span className="flex items-center gap-1.5 text-museum-ink/60"><Award className="w-4 h-4" />竞品：<b className="font-mono text-green-600">{cs.ucc}/{COMPETITORS.length}</b></span>
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card-museum overflow-hidden">
            <div className="p-4 border-b-2 border-museum-brass/30 flex items-center justify-between bg-museum-parchment/30">
              <h3 className="section-title mb-0">📌 线索墙</h3>
              <span className="text-xs text-museum-ink/50">点击查看</span>
            </div>
            <div className="cork-board p-5 min-h-[400px]">
              <div className="grid grid-cols-2 gap-4">
                {clues.map((cl, idx) => {
                  const exp = expandedClue === cl.id;
                  const relCols = collections.filter(c => cl.relatedCollectionIds?.includes(c.id) || INITIAL_COLLECTIONS.find(ic => ic.id === c.id));
                  return (
                    <div key={cl.id} onClick={() => cl.unlocked && setExpandedClue(exp ? null : cl.id)}
                      className={`relative rounded-md transition-all cursor-pointer ${cl.unlocked ? 'bg-museum-cream shadow-lg hover:shadow-xl hover:-translate-y-1' : 'bg-gray-300/80 opacity-70 cursor-not-allowed'} ${exp ? 'col-span-2 ring-2 ring-museum-brass' : ''}`}
                      style={{ transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * (1 + idx % 3)}deg)` }}>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 shadow-md" style={{ backgroundColor: pinColors[idx % pinColors.length] }} />
                      <div className="p-4 pt-5">
                        {cl.unlocked ? (
                          <>
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-2xl">{cl.icon}</span>
                              <h4 className="flex-1 font-serif font-bold text-museum-darkgreen text-sm">{cl.title}</h4>
                            </div>
                            <p className={`text-xs text-museum-ink/70 leading-relaxed ${exp ? '' : 'line-clamp-3'}`}>{cl.content}</p>
                            {exp && (
                              <div className="mt-3 pt-3 border-t border-museum-brass/20 animate-fade-in-up">
                                {relCols.length > 0 && (
                                  <div className="mb-2 flex gap-1.5 flex-wrap">
                                    {relCols.slice(0, 3).map(col => (
                                      <span key={col.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-museum-brass/15 text-[10px] text-museum-darkgreen">
                                        {col.image || CATEGORY_ICONS[col.category]} {col.name.slice(0, 6)}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                <button onClick={e => { e.stopPropagation(); unlockClue(cl.id); }}
                                  disabled={cl.interviews[0]?.unlocked}
                                  className="w-full btn-primary text-xs py-1.5 flex items-center justify-center gap-1">
                                  <Sparkles className="w-3 h-3" />{cl.interviews[0]?.unlocked ? '访谈已解锁' : '解锁访谈 (¥2,000)'}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4 text-center">
                            <Lock className="w-8 h-8 text-gray-500 mb-2" />
                            <div className="font-mono font-bold text-gray-500 text-lg mb-1">???</div>
                            <div className="text-[10px] text-gray-500 leading-relaxed">{cl.unlockCondition}{cl.requiredReputation && <div>口碑 {cl.requiredReputation}+</div>}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card-museum flex flex-col max-h-[580px]">
            <div className="p-4 border-b-2 border-museum-brass/30 flex items-center justify-between bg-museum-parchment/30">
              <h3 className="section-title mb-0">📝 访谈记录</h3>
              <span className="text-xs text-museum-brass font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {allInts.filter(x => x.i.unlocked && !readInts.has(`${x.cid}-${x.i.id}`)).length} 未读
              </span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {allInts.map(({ i: iv, cid, ct }) => {
                const k = `${cid}-${iv.id}`;
                const exp = expandedInt === k;
                const isNew = iv.unlocked && !readInts.has(k);
                return (
                  <div key={k} className={`rounded-xl border-2 transition-all ${iv.unlocked ? 'bg-museum-cream border-museum-brass/30 hover:border-museum-brass/60' : 'bg-gray-100 border-gray-200 opacity-70'}`}>
                    <div className="p-4 cursor-pointer" onClick={() => iv.unlocked && (setExpandedInt(exp ? null : k), !exp && setReadInts(p => new Set([...p, k])))}>
                      <div className="flex items-start gap-3">
                        <div className={`text-3xl w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${iv.unlocked ? 'bg-gradient-to-br from-museum-brass/20 to-museum-parchment border-2 border-museum-brass/30' : 'bg-gray-200'}`}>
                          {iv.unlocked ? iv.avatar : <Lock className="w-5 h-5 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`font-serif font-bold ${iv.unlocked ? 'text-museum-darkgreen' : 'text-gray-400'}`}>{iv.unlocked ? iv.person : '匿名人士'}</span>
                            {isNew && <span className="tag bg-red-500 text-white text-[9px] animate-pulse">新</span>}
                          </div>
                          {iv.unlocked ? (
                            <>
                              <div className="text-xs text-museum-brass font-medium mb-1.5">{iv.role}</div>
                              <p className={`text-xs text-museum-ink/70 leading-relaxed ${exp ? '' : 'line-clamp-2'}`}>"{iv.content}"</p>
                              {exp && <div className="mt-3 pt-3 border-t border-museum-brass/20 flex items-center gap-2 text-[10px] text-museum-ink/50"><Lightbulb className="w-3 h-3" />来源：{ct}</div>}
                            </>
                          ) : <div className="text-xs text-gray-400 flex items-center gap-1"><Lock className="w-3 h-3" />需先解锁对应线索</div>}
                        </div>
                        {iv.unlocked && <ChevronDown className={`w-4 h-4 text-museum-brass transition-transform ${exp ? 'rotate-180' : ''}`} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-museum flex flex-col max-h-[580px]">
            <div className="p-4 border-b-2 border-museum-brass/30 flex items-center justify-between bg-museum-parchment/30">
              <h3 className="section-title mb-0">🎯 专题任务</h3>
              <span className="text-xs text-museum-ink/50">完成 {tasks.filter(t => t.claimed).length}/{tasks.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
              {tasks.map(t => {
                const prog = Math.min(t.progress / t.target * 100, 100);
                const cc = t.completed && !t.claimed;
                return (
                  <div key={t.id} className={`rounded-xl border-2 p-4 transition-all ${t.claimed ? 'bg-green-50/50 border-green-200' : cc ? 'bg-museum-cream border-museum-gold shadow-glow-brass animate-pulse-slow' : 'bg-museum-cream border-museum-brass/30'}`}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`text-3xl w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${t.claimed ? 'bg-green-100' : cc ? 'bg-museum-gold/20' : 'bg-museum-parchment/70'}`}>{t.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-serif font-bold ${t.claimed ? 'text-green-700' : 'text-museum-darkgreen'}`}>{t.title}</span>
                          <span className={`tag text-[10px] ${catColors[t.category]}`}>{catLabels[t.category]}</span>
                        </div>
                        <p className="text-xs text-museum-ink/60">{t.description}</p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-museum-ink/50">进度</span>
                        <b className="font-mono text-museum-darkgreen">{t.progress}/{t.target} ({Math.round(prog)}%)</b>
                      </div>
                      <div className="h-2.5 rounded-full bg-museum-parchment overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${t.claimed ? 'bg-gradient-to-r from-green-400 to-green-600' : cc ? 'bg-gradient-to-r from-museum-gold to-museum-brass' : 'bg-gradient-to-r from-museum-brass/70 to-museum-brass'}`} style={{ width: `${prog}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Gift className="w-3.5 h-3.5 text-museum-gold" />
                        <span className={`font-medium ${t.reward.type === 'budget' ? 'text-green-700' : 'text-museum-wine'}`}>{t.reward.label}</span>
                      </div>
                      {t.claimed ? <span className="flex items-center gap-1 text-xs text-green-700 font-medium"><CheckCircle className="w-4 h-4" />✓ 已完成</span>
                        : cc ? <button onClick={() => claimTaskReward(t.id)} className="btn-gold text-xs py-1.5 px-4 flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" />领取奖励</button>
                          : <span className="text-xs text-museum-ink/40">进行中...</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-museum flex flex-col max-h-[580px]">
            <div className="p-4 border-b-2 border-museum-brass/30 flex items-center justify-between bg-museum-parchment/30">
              <h3 className="section-title mb-0">⚔️ 竞品对比</h3>
              <span className="text-xs text-museum-ink/50">共 {COMPETITORS.length} 款</span>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-museum-parchment/95">
                  <tr className="text-xs text-museum-ink/60">
                    <th className="text-left p-3 font-semibold">产品</th>
                    <th className="text-left p-3 font-semibold hidden md:table-cell">品牌</th>
                    <th className="text-left p-3 font-semibold hidden lg:table-cell">年代</th>
                    <th className="text-left p-3 font-semibold hidden xl:table-cell">份额</th>
                    <th className="text-center p-3 font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map(c => (
                    <tr key={c.id} className="border-b border-museum-brass/10 hover:bg-museum-parchment/30">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{c.image}</span>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs truncate">{c.name}</div>
                            <div className="text-[10px] text-museum-ink/50">{CATEGORY_ICONS[c.category]} {CATEGORY_NAMES[c.category]}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-xs text-museum-ink/70 hidden md:table-cell">{c.company}</td>
                      <td className="p-3 text-xs font-mono hidden lg:table-cell">{c.year}年</td>
                      <td className="p-3 hidden xl:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-2 rounded-full bg-museum-parchment overflow-hidden"><div className="h-full bg-gradient-to-r from-museum-wine to-museum-alert" style={{ width: `${c.marketShare}%` }} /></div>
                          <span className="text-[10px] font-mono text-museum-wine">{c.marketShare}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-center"><button onClick={() => { setSelComp(c.id); setShowPanel(true); }} className="btn-secondary text-[11px] py-1 px-3 inline-flex items-center gap-1"><ChevronRight className="w-3 h-3" />对比</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showPanel && curComp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-museum-ink/40" onClick={() => setShowPanel(false)} />
          <div className="relative w-[480px] h-full bg-museum-cream border-l-4 border-museum-brass shadow-2xl animate-slide-in-right overflow-y-auto scrollbar-thin">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div><div className="text-xs font-mono text-museum-brass mb-1">竞品分析</div><h2 className="text-xl font-serif font-bold">产品对比</h2></div>
                <button onClick={() => setShowPanel(false)} className="p-2 rounded-lg hover:bg-museum-brass/20"><X className="w-5 h-5 text-museum-ink/60" /></button>
              </div>
              <div className="card-museum p-4 mb-4 border-l-4 border-l-museum-wine">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{curComp.image}</span>
                  <div><h3 className="font-serif font-bold text-lg text-museum-wine">{curComp.name}</h3><div className="text-xs text-museum-ink/60">{curComp.company} · {curComp.year}年</div></div>
                </div>
                <div className="space-y-1">
                  {curComp.specs.map((s, i) => (
                    <div key={i} className="flex justify-between text-xs py-1 border-b border-museum-brass/10 last:border-0">
                      <span className="text-museum-ink/60">{s.label}</span>
                      <span className={`font-medium flex items-center gap-1 ${s.advantage ? 'text-green-700' : ''}`}>{s.value}{s.advantage && <span className="text-[9px] px-1 rounded bg-green-100">优</span>}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-museum-brass/20 flex justify-between text-xs"><span className="text-museum-ink/60">市场占有率</span><b className="font-mono text-museum-wine">{curComp.marketShare}% · {formatCurrency(curComp.price)}</b></div>
              </div>
              <div className="mb-3 flex items-center gap-2"><div className="h-px flex-1 bg-museum-brass/30" /><span className="text-xs text-museum-brass font-serif px-3">VS 星河同款</span><div className="h-px flex-1 bg-museum-brass/30" /></div>
              {srProds.length > 0 ? (
                <div className="space-y-3">
                  {srProds.slice(0, 3).map(p => (
                    <div key={p.id} className="card-museum p-4 border-l-4 border-l-museum-darkgreen">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl" style={{ filter: `drop-shadow(0 2px 6px ${p.color}55)` }}>{p.image || CATEGORY_ICONS[p.category]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5"><h4 className="font-serif font-bold text-museum-darkgreen text-sm truncate">{p.name}</h4><RarityBadge rarity={p.rarity} size="sm" showName={false} /></div>
                          <div className="text-[11px] text-museum-ink/60">{p.actualYear}年 · 评分 {p.score}</div>
                        </div>
                      </div>
                      <div className="bg-museum-parchment/40 rounded-lg p-2.5 border border-museum-brass/20 mb-2">
                        <div className="text-[11px] text-museum-ink/50 mb-1 flex items-center gap-1"><Sparkles className="w-3 h-3" />技术差异分析</div>
                        <p className="text-xs text-museum-ink/75 leading-relaxed">{p.description.slice(0, 70)}...</p>
                      </div>
                      <div className="flex justify-between text-[11px]"><span className="text-museum-ink/60">估值</span><b className="font-mono text-museum-darkgreen">{formatCurrency(p.estimatedValue)}</b></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-museum p-6 text-center border-2 border-dashed border-museum-brass/40">
                  <Search className="w-10 h-10 mx-auto mb-2 opacity-30 text-museum-brass" />
                  <p className="text-sm text-museum-ink/50">暂未收藏同类产品</p>
                  <p className="text-xs text-museum-ink/30 mt-1">查找{CATEGORY_NAMES[curComp.category]}藏品</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

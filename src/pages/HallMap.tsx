import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/useGameStore';
import { RarityBadge } from '../components/RarityBadge';
import { HALLS } from '../data/halls';
import {
  Lock, Lightbulb, Image as ImageIcon, Trash2, X, Package, Award,
  ChevronUp, ChevronDown, GripVertical, Search, LayoutGrid
} from 'lucide-react';
import {
  LIGHTING_NAMES, BACKGROUND_NAMES, CATEGORY_ICONS,
  RARITY_NAMES
} from '../types';
import { formatCurrency } from '../utils/formatters';

export default function HallMap() {
  const cases = useGameStore(s => s.cases);
  const collections = useGameStore(s => s.collections);
  const plan = useGameStore(s => s.plan);
  const collectionScore = useGameStore(s => s.collectionScore);
  const selectedCaseId = useGameStore(s => s.selectedCaseId);
  const setSelectedCase = useGameStore(s => s.setSelectedCase);
  const deployToCase = useGameStore(s => s.deployToCase);
  const removeFromCase = useGameStore(s => s.removeFromCase);
  const updateCaseLighting = useGameStore(s => s.updateCaseLighting);
  const updateCaseBackground = useGameStore(s => s.updateCaseBackground);
  const updatePlanRoute = useGameStore(s => s.updatePlanRoute);
  const isDragging = useGameStore(s => s.isDragging);

  const [activeHall, setActiveHall] = useState('hall-A');
  const [dragOverCase, setDragOverCase] = useState<string | null>(null);
  const [draggedRouteIdx, setDraggedRouteIdx] = useState<number | null>(null);

  const stats = useMemo(() => {
    const deployed = cases.filter(c => c.collectionId).length;
    const unlocked = cases.filter(c => c.unlocked).length;
    return { deployed, empty: unlocked - deployed, score: collectionScore };
  }, [cases, collectionScore]);

  const currentHall = HALLS.find(h => h.id === activeHall)!;
  const hallCases = cases.filter(c => c.hallId === activeHall);
  const selectedCase = cases.find(c => c.id === selectedCaseId);
  const selectedCollection = selectedCase?.collectionId
    ? collections.find(c => c.id === selectedCase.collectionId) : null;
  const warehouseItems = collections.filter(c => c.location === 'warehouse');

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault(); setDragOverCase(id);
  };
  const handleDrop = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    const cid = e.dataTransfer.getData('collectionId');
    if (cid) deployToCase(cid, id);
    setDragOverCase(null);
  };

  const lightingClass = (l: string) => ({
    warm: 'before:from-orange-300/20', cool: 'before:from-blue-300/20',
    spotlight: 'before:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.35)_0%,_transparent_60%)]',
    neon: 'before:from-purple-400/25'
  }[l] || '');

  const bgClass = (b: string) => ({
    plain: 'bg-museum-brown',
    gradient: 'bg-gradient-to-br from-museum-brown via-[#6b4423] to-museum-brown',
    vintage: 'bg-[repeating-linear-gradient(45deg,#4a3728_0,#4a3728_2px,#5a4028_2px,#5a4028_4px)]',
    futuristic: 'bg-gradient-to-br from-[#1a2a3c] via-[#2a3a4c] to-[#1a3c34]'
  }[b] || 'bg-museum-brown');

  const moveRoute = (idx: number, dir: -1 | 1) => {
    const r = [...plan.route], ni = idx + dir;
    if (ni < 0 || ni >= r.length) return;
    [r[idx], r[ni]] = [r[ni], r[idx]];
    updatePlanRoute(r);
  };

  const onRouteDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedRouteIdx === null || draggedRouteIdx === idx) return;
    const r = [...plan.route];
    const [m] = r.splice(draggedRouteIdx, 1);
    r.splice(idx, 0, m);
    updatePlanRoute(r);
    setDraggedRouteIdx(idx);
  };

  return (
    <div className="min-h-screen museum-bg parchment-texture p-6">
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-3xl font-serif font-bold text-museum-darkgreen mb-5 flex items-center gap-3">
          <span>🏛️</span>展厅布置
          <span className="ml-auto flex items-center gap-6 text-sm font-normal">
            <span className="flex items-center gap-2 text-museum-ink/60">
              <Package className="w-4 h-4" />已展出：<span className="font-mono font-bold text-museum-darkgreen">{stats.deployed}</span>
            </span>
            <span className="flex items-center gap-2 text-museum-ink/60">
              <LayoutGrid className="w-4 h-4" />空余：<span className="font-mono font-bold text-museum-brass">{stats.empty}</span>
            </span>
            <span className="flex items-center gap-2 text-museum-ink/60">
              <Award className="w-4 h-4" />评分：<span className="font-mono font-bold text-museum-wine">{stats.score}</span>
            </span>
          </span>
        </h1>

        <div className="flex gap-2 mb-5">
          {HALLS.map(h => (
            <button key={h.id} onClick={() => setActiveHall(h.id)}
              className={`px-5 py-2.5 rounded-t-xl font-serif font-semibold flex items-center gap-2 border-2 border-b-0 transition-all ${
                activeHall === h.id
                  ? 'bg-museum-cream border-museum-brass text-museum-darkgreen -mb-px shadow-lg'
                  : 'bg-museum-parchment/60 border-transparent text-museum-ink/50 hover:bg-museum-parchment'
              }`}>
              <span className="text-lg">{h.icon}</span>{h.name}
            </button>
          ))}
        </div>

        <div className="card-museum p-6 mb-6" style={{ borderTopLeftRadius: 0 }}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-serif font-bold" style={{ color: currentHall.color }}>
                {currentHall.icon} {currentHall.name}
              </h2>
              <p className="text-sm text-museum-ink/50 mt-1">{currentHall.description}</p>
            </div>
            {isDragging && <div className="tag bg-museum-brass/20 text-museum-darkgreen animate-pulse-slow">正在拖拽藏品，请放置到展柜</div>}
          </div>
          <div className="grid grid-cols-5 gap-4">
            {hallCases.map(ec => {
              const col = ec.collectionId ? collections.find(c => c.id === ec.collectionId) : null;
              const isOver = dragOverCase === ec.id;
              return (
                <div key={ec.id}
                  onClick={() => ec.unlocked && setSelectedCase(ec.id)}
                  onDragOver={(e) => ec.unlocked && handleDragOver(e, ec.id)}
                  onDragLeave={() => setDragOverCase(null)}
                  onDrop={(e) => ec.unlocked && handleDrop(e, ec.id)}
                  className={`relative aspect-[4/5] rounded-xl border-2 transition-all overflow-hidden
                    ${ec.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'} ${bgClass(ec.background)}
                    border-museum-gold/50 shadow-exhibit ${isOver ? 'dragging-over' : ''}
                    ${!ec.unlocked ? 'opacity-50 grayscale' : ''}
                    ${ec.collectionId ? 'hover:scale-[1.02] hover:shadow-glow-brass' : 'hover:border-museum-gold'}`}>
                  <div className={`absolute inset-0 pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-t ${lightingClass(ec.lighting)}`} />
                  {!ec.unlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-museum-cream/60">
                      <Lock className="w-10 h-10 mb-2" /><span className="text-xs">未解锁</span>
                    </div>
                  ) : col ? (
                    <div className="relative h-full flex flex-col items-center justify-between p-3">
                      <div className="self-start"><RarityBadge rarity={col.rarity} size="sm" showName={false} /></div>
                      <div className="text-5xl mb-1 animate-float" style={{ filter: `drop-shadow(0 4px 10px ${col.color}66)` }}>
                        {col.image || CATEGORY_ICONS[col.category]}
                      </div>
                      <div className="w-full text-center">
                        <div className="font-serif font-bold text-museum-cream text-sm line-clamp-1">{col.name}</div>
                        <div className="text-[10px] text-museum-cream/70 font-mono">{ec.name}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-museum-cream/50 gap-2 p-3 text-center border-2 border-dashed border-museum-gold/30 m-2 rounded-lg">
                      <Package className="w-8 h-8 opacity-60" />
                      <div className="text-sm">空置</div>
                      <div className="text-[11px] opacity-70">点击布置</div>
                      <div className="text-[10px] font-mono opacity-60">{ec.name}</div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      ec.level === 3 ? 'bg-yellow-400' : ec.level === 2 ? 'bg-gray-300' : 'bg-orange-700'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card-museum p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">🛤️ 参观路线设计
              <span className="ml-3 text-xs font-sans font-normal text-museum-ink/50">
                路线评分：<span className="font-mono text-museum-brass font-bold">{plan.routeDesignScore}</span>
              </span>
            </h3>
            <span className="text-xs text-museum-ink/50">拖拽重排 · {plan.route.length} 个展柜</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {plan.route.map((caseId, idx) => {
              const c = cases.find(x => x.id === caseId);
              const col = c?.collectionId ? collections.find(x => x.id === c.collectionId) : null;
              const hall = HALLS.find(h => h.id === c?.hallId);
              return (
                <div key={`${caseId}-${idx}`} draggable
                  onDragStart={(e) => { setDraggedRouteIdx(idx); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={(e) => onRouteDragOver(e, idx)}
                  onDragEnd={() => setDraggedRouteIdx(null)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg border-2 bg-museum-cream
                    border-museum-brass/40 cursor-grab active:cursor-grabbing transition-all
                    ${draggedRouteIdx === idx ? 'opacity-50 scale-95' : 'hover:border-museum-brass'}`}>
                  <GripVertical className="w-3.5 h-3.5 text-museum-brass/60" />
                  <span className="font-mono text-xs bg-museum-brass/20 text-museum-darkgreen px-1.5 py-0.5 rounded">{idx + 1}</span>
                  <span>{hall?.icon}</span>
                  <span className="text-sm font-medium min-w-[80px]">{col ? col.name : c?.name || '空置'}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); moveRoute(idx, -1); }}
                      className="p-1 rounded hover:bg-museum-brass/20 text-museum-ink/60">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); moveRoute(idx, 1); }}
                      className="p-1 rounded hover:bg-museum-brass/20 text-museum-ink/60">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-museum-ink/40" onClick={() => setSelectedCase(null)} />
          <div className="relative w-[440px] h-full bg-museum-cream border-l-4 border-museum-brass shadow-2xl animate-slide-in-right overflow-y-auto scrollbar-thin">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-xs font-mono text-museum-brass mb-1">{selectedCase.name}</div>
                  <h2 className="text-xl font-serif font-bold text-museum-ink">展柜配置</h2>
                  <div className="text-xs text-museum-ink/50 mt-1">等级：{'⭐'.repeat(selectedCase.level)} · {HALLS.find(h => h.id === selectedCase.hallId)?.name}</div>
                </div>
                <button onClick={() => setSelectedCase(null)} className="p-2 rounded-lg hover:bg-museum-brass/20">
                  <X className="w-5 h-5 text-museum-ink/60" />
                </button>
              </div>

              {selectedCollection ? (
                <>
                  <div className={`rounded-xl border-2 border-museum-gold/50 shadow-exhibit p-6 mb-5 ${bgClass(selectedCase.background)} relative overflow-hidden`}>
                    <div className={`absolute inset-0 before:absolute before:inset-0 before:bg-gradient-to-t ${lightingClass(selectedCase.lighting)}`} />
                    <div className="relative text-center">
                      <div className="text-7xl mb-3 animate-float" style={{ filter: `drop-shadow(0 6px 16px ${selectedCollection.color}77)` }}>
                        {selectedCollection.image || CATEGORY_ICONS[selectedCollection.category]}
                      </div>
                      <div className="inline-block mb-2"><RarityBadge rarity={selectedCollection.rarity} /></div>
                      <h3 className="text-xl font-serif font-bold text-museum-cream">{selectedCollection.name}</h3>
                      <p className="text-sm text-museum-cream/70 mt-1">{selectedCollection.categoryName} · {selectedCollection.actualYear}年</p>
                    </div>
                  </div>

                  <div className="card-museum p-4 mb-3">
                    <h4 className="label-museum flex items-center gap-2"><Lightbulb className="w-4 h-4" />灯光模式</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.keys(LIGHTING_NAMES) as string[]).map(l => (
                        <button key={l} onClick={() => updateCaseLighting(selectedCase.id, l as any)}
                          className={`py-2 rounded-lg border-2 text-xs font-medium transition-all ${
                            selectedCase.lighting === l
                              ? 'border-museum-brass bg-museum-brass/10 text-museum-darkgreen'
                              : 'border-museum-brass/30 hover:border-museum-brass/60 text-museum-ink/70'}`}>
                          {LIGHTING_NAMES[l]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="card-museum p-4 mb-3">
                    <h4 className="label-museum flex items-center gap-2"><ImageIcon className="w-4 h-4" />背景模式</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(BACKGROUND_NAMES) as string[]).map(b => (
                        <button key={b} onClick={() => updateCaseBackground(selectedCase.id, b as any)}
                          className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedCase.background === b
                              ? 'border-museum-brass bg-museum-brass/10 text-museum-darkgreen'
                              : 'border-museum-brass/30 hover:border-museum-brass/60 text-museum-ink/70'}`}>
                          {BACKGROUND_NAMES[b]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="card-museum p-4 mb-4">
                    {[['稀有度', RARITY_NAMES[selectedCollection.rarity]], ['估值', formatCurrency(selectedCollection.estimatedValue)],
                      ['评分', `${selectedCollection.score} 分`], ['来源', selectedCollection.source]].map(([k, v], i) => (
                      <div key={i} className="flex justify-between pb-2 border-b border-museum-brass/15 last:border-0 text-sm">
                        <span className="text-museum-ink/60">{k}</span>
                        <span className="font-semibold text-museum-ink">{v}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => { removeFromCase(selectedCase.id); setSelectedCase(null); }}
                    className="w-full btn-danger flex items-center justify-center gap-2">
                    <Trash2 className="w-4 h-4" />移除展品
                  </button>
                </>
              ) : (
                <>
                  <div className="card-museum p-6 mb-4 text-center border-2 border-dashed border-museum-brass/40">
                    <Package className="w-12 h-12 mx-auto mb-3 text-museum-brass opacity-50" />
                    <h3 className="font-serif font-bold text-museum-darkgreen mb-1">空置展柜</h3>
                    <p className="text-sm text-museum-ink/50">从下方选择藏品布置，或直接从仓库拖拽到展柜</p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-museum-brass" />
                    <span className="label-museum mb-0">选择藏品布置（仓库中：{warehouseItems.length}件）</span>
                  </div>
                  <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
                    {warehouseItems.length === 0 ? (
                      <div className="text-center py-8 text-museum-ink/40 text-sm">仓库中暂无可布置的藏品</div>
                    ) : warehouseItems.map(item => (
                      <button key={item.id}
                        onClick={() => { deployToCase(item.id, selectedCase.id); setSelectedCase(null); }}
                        className="w-full card-museum p-3 flex items-center gap-3 hover:border-museum-brass hover:shadow-md transition-all text-left">
                        <span className="text-3xl shrink-0" style={{ filter: `drop-shadow(0 2px 6px ${item.color}55)` }}>
                          {item.image || CATEGORY_ICONS[item.category]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <RarityBadge rarity={item.rarity} size="sm" />
                            <span className="font-mono text-xs text-museum-brass">{item.score}分</span>
                          </div>
                          <div className="font-serif font-semibold text-sm line-clamp-1">{item.name}</div>
                          <div className="text-xs text-museum-ink/50 mt-0.5">
                            {item.categoryName} · {item.isAuthenticated ? `${item.actualYear}年` : '未鉴定'}
                          </div>
                        </div>
                        <span className="text-museum-brass shrink-0">布置 →</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
